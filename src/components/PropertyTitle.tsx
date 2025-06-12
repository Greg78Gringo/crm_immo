import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface PropertyTitleProps {
  propertyTitle: string;
  setPropertyTitle: (title: string) => void;
  titleDesignationIdentical: boolean;
  setTitleDesignationIdentical: (identical: boolean) => void;
  currentDesignation: string;
  setCurrentDesignation: (designation: string) => void;
  titleDetails: string;
  setTitleDetails: (details: string) => void;
}

const PROPERTY_TITLE_OPTIONS = [
  "Acquisition",
  "Héritage", 
  "Donation",
  "Autres"
];

const PropertyTitle = ({
  propertyTitle,
  setPropertyTitle,
  titleDesignationIdentical,
  setTitleDesignationIdentical,
  currentDesignation,
  setCurrentDesignation,
  titleDetails,
  setTitleDetails
}: PropertyTitleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
            Titre de Propriété
            {propertyTitle && (
              <span className="ml-2 text-sm text-gray-500">
                - {propertyTitle}
              </span>
            )}
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
          <div className="space-y-6">
            {/* Menu déroulant Titre de propriété */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Titre de propriété
              </label>
              <select
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un titre</option>
                {PROPERTY_TITLE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Case à cocher Désignation du titre identique */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="titleDesignationIdentical"
                checked={titleDesignationIdentical}
                onChange={(e) => setTitleDesignationIdentical(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="titleDesignationIdentical" className="ml-2 block text-sm text-gray-700">
                Désignation du titre identique
              </label>
            </div>

            {/* Champ texte Désignation actuelle */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Désignation actuelle
              </label>
              <textarea
                value={currentDesignation}
                onChange={(e) => setCurrentDesignation(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Saisissez la désignation actuelle..."
              />
            </div>

            {/* Champ texte Détails */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Détails
              </label>
              <textarea
                value={titleDetails}
                onChange={(e) => setTitleDetails(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ajoutez des détails sur le titre de propriété..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyTitle;