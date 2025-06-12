import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface DealBasicInfoProps {
  name: string;
  setName: (name: string) => void;
  status: string;
  setStatus: (status: string) => void;
  reason: string;
  setReason: (reason: string) => void;
  comments?: string;
  setComments: (comments: string) => void;
}

const DealBasicInfo = ({
  name,
  setName,
  status,
  setStatus,
  reason,
  setReason,
  comments = '',
  setComments
}: DealBasicInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statutOptions = [
    'Veille sur Bien non en vente',
    'Veille sur Bien en vente',
    '1er Rdv',
    'Mandat',
    "Offre d'achat",
    'Compromis',
    'Signée - Affaire terminée'
  ];

  const motifOptions = [
    'Déplacement',
    'Divorce',
    'Décès',
    'Dette',
    'Passoire énergétique',
    'Autres'
  ];

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Informations de base
            {name && <span className="ml-2 text-sm text-gray-500">- {name}</span>}
          </h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <label htmlFor="dealName" className="block text-sm font-medium text-gray-700">
                Nom de l'affaire <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="dealName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entrez le nom de l'affaire"
                required
              />
            </div>

            <div>
              <label htmlFor="dealStatus" className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <select
                id="dealStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un statut</option>
                {statutOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dealReason" className="block text-sm font-medium text-gray-700">
                Motif
              </label>
              <select
                id="dealReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un motif</option>
                {motifOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dealComments" className="block text-sm font-medium text-gray-700">
                Commentaires
              </label>
              <textarea
                id="dealComments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ajoutez vos commentaires ici..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealBasicInfo;
