import React from 'react';
import { Eye, Edit, Mail, Phone } from 'lucide-react';
import type { Contact } from '../../pages/ContactsList';

interface ContactRowProps {
  contact: Contact;
  currentUserId: string;
  onViewContact: (contactId: string) => void;
  onEditContact: (contactId: string) => void;
}

const ContactRow = ({ contact, currentUserId, onViewContact, onEditContact }: ContactRowProps) => {
  const isOwner = contact.agent_id === currentUserId;
  
  const getDisplayName = (firstName: string, lastName: string) => {
    const name = `${firstName} ${lastName}`.trim();
    return name || 'Nom non renseigné';
  };

  const getAgentName = () => {
    if (contact.agent?.first_name || contact.agent?.last_name) {
      return `${contact.agent.first_name} ${contact.agent.last_name}`.trim();
    }
    return 'Agent inconnu';
  };

  const formatChildrenCount = (count: number) => {
    if (count === 0) return '0';
    if (count >= 3) return '3+';
    return count.toString();
  };

  // Fonction pour afficher le type de personne de manière lisible
  const getPersonTypeDisplay = (typeId: string) => {
    if (!typeId) return 'Non défini';
    
    // Mapping des valeurs stockées vers des libellés lisibles
    const typeMapping: { [key: string]: string } = {
      'Personne Physique Décisionnaire': 'Personne Physique',
      'Personne Physique sous protection': 'Sous Protection',
      'Personne Morale': 'Personne Morale'
    };
    
    return typeMapping[typeId] || typeId;
  };

  // Fonction pour afficher le statut marital de manière lisible
  const getMaritalStatusDisplay = (statusId: string) => {
    if (!statusId) return 'Non défini';
    
    // Les valeurs sont déjà stockées en texte lisible
    return statusId;
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {contact.last_name ? contact.last_name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {contact.last_name || 'Non renseigné'}
            </div>
            {contact.email && (
              <div className="text-sm text-gray-500 flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {contact.email}
              </div>
            )}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {contact.first_name || 'Non renseigné'}
        </div>
        {contact.phone && (
          <div className="text-sm text-gray-500 flex items-center">
            <Phone className="h-3 w-3 mr-1" />
            {contact.phone}
          </div>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {contact.city || 'Non renseignée'}
        </div>
        {contact.postal_code && (
          <div className="text-sm text-gray-500">
            {contact.postal_code}
          </div>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {getPersonTypeDisplay(contact.type_personne_id)}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {getMaritalStatusDisplay(contact.marital_status_id)}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-xs font-medium text-gray-800">
          {formatChildrenCount(contact.children_count || 0)}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full mr-2 ${isOwner ? 'bg-green-400' : 'bg-gray-400'}`}></div>
          <div className="text-sm text-gray-900">
            {getAgentName()}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {contact.source && `Source: ${contact.source}`}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onViewContact(contact.id)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
            title="Voir le contact"
          >
            <Eye className="h-4 w-4" />
          </button>
          
          {isOwner && (
            <button
              onClick={() => onEditContact(contact.id)}
              className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-colors"
              title="Modifier le contact"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ContactRow;