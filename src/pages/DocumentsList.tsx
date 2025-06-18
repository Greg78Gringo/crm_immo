import React from 'react';
import DealSelector from '../components/documents/DealSelector';

const DocumentsList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Liste des Documents
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600 mb-6">
          Générez les listes de documents nécessaires à demander aux vendeurs et acquéreurs 
          selon les informations personnelles et les caractéristiques du bien immobilier.
        </p>
        
        <DealSelector />
      </div>
    </div>
  );
};

export default DocumentsList;