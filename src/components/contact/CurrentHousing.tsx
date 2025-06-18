import React, { useState } from 'react';
import { Home, ChevronDown, ChevronUp } from 'lucide-react';

interface CurrentHousingProps {
  agencyDiscoverySource: string;
  setAgencyDiscoverySource: (source: string) => void;
  currentHousingType: string;
  setCurrentHousingType: (type: string) => void;
  surfaceArea: number;
  setSurfaceArea: (area: number) => void;
  strengths: string;
  setStrengths: (strengths: string) => void;
  weaknesses: string;
  setWeaknesses: (weaknesses: string) => void;
  housingStatus: string;
  setHousingStatus: (status: string) => void;
  
  // Champs propriétaire
  propertySince: string;
  setPropertySince: (date: string) => void;
  sellingForBuying: boolean;
  setSellingForBuying: (selling: boolean) => void;
  plannedAction: string;
  setPlannedAction: (action: string) => void;
  
  // Champs locataire
  rentingSince: string;
  setRentingSince: (date: string) => void;
  rentAmount: number;
  setRentAmount: (amount: number) => void;
  firstTimeBuyer: boolean;
  setFirstTimeBuyer: (firstTime: boolean) => void;
}

const AGENCY_DISCOVERY_OPTIONS = [
  "Notoriété",
  "Recommandation",
  "Pige",
  "Ancien client",
  "Contact direct",
  "Mailing",
  "Internet (annonces)",
  "Autres"
];

const CURRENT_HOUSING_TYPE_OPTIONS = [
  "Appartement",
  "Maison",
  "Terrain",
  "Autres"
];

const HOUSING_STATUS_OPTIONS = [
  "Locataire",
  "Propriétaire"
];

const PLANNED_ACTION_OPTIONS = [
  "Prêt relais",
  "Estimation",
  "Mise en vente"
];

const CurrentHousing = ({
  agencyDiscoverySource,
  setAgencyDiscoverySource,
  currentHousingType,
  setCurrentHousingType,
  surfaceArea,
  setSurfaceArea,
  strengths,
  setStrengths,
  weaknesses,
  setWeaknesses,
  housingStatus,
  setHousingStatus,
  propertySince,
  setPropertySince,
  sellingForBuying,
  setSellingForBuying,
  plannedAction,
  setPlannedAction,
  rentingSince,
  setRentingSince,
  rentAmount,
  setRentAmount,
  firstTimeBuyer,
  setFirstTimeBuyer
}: CurrentHousingProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isOwner = housingStatus === "Propriétaire";
  const isTenant = housingStatus === "Locataire";

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleHousingStatusChange = (status: string) => {
    setHousingStatus(status);
    
    // Reset des champs selon le statut
    if (status === "Propriétaire") {
      // Reset des champs locataire
      setRentingSince('');
      setRentAmount(0);
      setFirstTimeBuyer(false);
    } else if (status === "Locataire") {
      // Reset des champs propriétaire
      setPropertySince('');
      setSellingForBuying(false);
      setPlannedAction('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <Home className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Logement Actuel
            {housingStatus && (
              <span className="ml-2 text-sm text-gray-500">
                - {housingStatus}
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Source découverte de l'agence
              </label>
              <select
                value={agencyDiscoverySource}
                onChange={(e) => setAgencyDiscoverySource(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez une source</option>
                {AGENCY_DISCOVERY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* MODIF: Champ type logement actuel en menu déroulant */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type logement actuel
              </label>
              <select
                value={currentHousingType}
                onChange={(e) => setCurrentHousingType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un type de logement</option>
                {CURRENT_HOUSING_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {/* FIN MODIF */}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Superficie (m²)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={surfaceArea || ''}
                onChange={(e) => setSurfaceArea(parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Points forts
              </label>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez les points forts du logement actuel..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Points faibles
              </label>
              <textarea
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez les points faibles du logement actuel..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statut du logement
              </label>
              <select
                value={housingStatus}
                onChange={(e) => handleHousingStatusChange(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un statut</option>
                {HOUSING_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {isOwner && (
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Informations Propriétaire</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date d'achat
                  </label>
                  <input
                    type="date"
                    value={propertySince}
                    onChange={(e) => setPropertySince(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sellingForBuying"
                    checked={sellingForBuying}
                    onChange={(e) => setSellingForBuying(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sellingForBuying" className="ml-2 block text-sm text-gray-700">
                    Vendre pour achat
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Actions à envisager
                  </label>
                  <select
                    value={plannedAction}
                    onChange={(e) => setPlannedAction(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez une action</option>
                    {PLANNED_ACTION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {isTenant && (
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Informations Locataire</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de première location
                  </label>
                  <input
                    type="date"
                    value={rentingSince}
                    onChange={(e) => setRentingSince(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Montant du loyer (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={rentAmount || ''}
                    onChange={(e) => setRentAmount(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="firstTimeBuyer"
                    checked={firstTimeBuyer}
                    onChange={(e) => setFirstTimeBuyer(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="firstTimeBuyer" className="ml-2 block text-sm text-gray-700">
                    Primo-accédant
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentHousing;