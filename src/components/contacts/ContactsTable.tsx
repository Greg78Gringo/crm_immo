import React from 'react';
import { ChevronUp, ChevronDown, Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import ContactRow from './ContactRow';
import type { Contact } from '../../pages/ContactsList';

interface ContactsTableProps {
  contacts: Contact[];
  loading: boolean;
  currentUserId: string;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  onViewContact: (contactId: string) => void;
  onEditContact: (contactId: string) => void;
  currentPage: number;
  totalPages: number;
  totalContacts: number;
  contactsPerPage: number;
  onPageChange: (page: number) => void;
}

const ContactsTable = ({
  contacts,
  loading,
  currentUserId,
  sortField,
  sortDirection,
  onSort,
  onViewContact,
  onEditContact,
  currentPage,
  totalPages,
  totalContacts,
  contactsPerPage,
  onPageChange
}: ContactsTableProps) => {
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-blue-600" />
      : <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {getSortIcon(field)}
      </div>
    </th>
  );

  const startIndex = (currentPage - 1) * contactsPerPage + 1;
  const endIndex = Math.min(currentPage * contactsPerPage, totalContacts);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Chargement des contacts...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* En-tête du tableau avec pagination */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Contacts ({totalContacts})
            </h3>
            {totalContacts > 0 && (
              <span className="text-sm text-gray-600">
                Affichage de {startIndex} à {endIndex} sur {totalContacts}
              </span>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </span>
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tableau */}
      {contacts.length === 0 ? (
        <div className="p-12 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun contact trouvé</h3>
          <p className="text-gray-600">
            Aucun contact ne correspond aux critères de recherche sélectionnés.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader field="last_name">Nom</SortableHeader>
                <SortableHeader field="first_name">Prénom</SortableHeader>
                <SortableHeader field="city">Ville</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut Marital
                </th>
                <SortableHeader field="children_count">Enfants</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  currentUserId={currentUserId}
                  onViewContact={onViewContact}
                  onEditContact={onEditContact}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination en bas */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Affichage de {startIndex} à {endIndex} sur {totalContacts} contacts
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Premier
              </button>
              
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="px-3 py-1 text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span>
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Dernier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsTable;