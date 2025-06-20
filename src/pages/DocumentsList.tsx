import React from 'react';
import DealSelector from '../components/documents/DealSelector';
import { Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const DocumentsList = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Liste des Documents
          {isAdmin && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </span>
          )}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600 mb-6">
          {isAdmin 
            ? 'Générez les listes de documents nécessaires à demander aux vendeurs et acquéreurs pour toutes les affaires (accès administrateur)'
            : 'Générez les listes de documents nécessaires à demander aux vendeurs et acquéreurs selon les informations personnelles et les caractéristiques du bien immobilier.'
          }
        </p>
        
        <DealSelector />
      </div>
    </div>
  );
};

export default DocumentsList;