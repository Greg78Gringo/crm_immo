import React, { useState } from 'react';
import { Home, ChevronDown, ChevronUp } from 'lucide-react';

interface PropertyDetailsProps {
  propertyType: string;
  setPropertyType: (type: string) => void;
  address: string;
  setAddress: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  postalCode: string;
  setPostalCode: (code: string) => void;
  coordinates: string;
  setCoordinates: (coordinates: string) => void;
  dpe: string;
  setDpe: (dpe: string) => void;
  ges: string;
  setGes: (ges: string) => void;
  roomsCount: number;
  setRoomsCount: (count: number) => void;
  bedroomsCount: number;
  setBedroomsCount: (count: number) => void;
  livingRoomArea: number;
  setLivingRoomArea: (area: number) => void;
  diningRoomArea: number;
  setDiningRoomArea: (area: number) => void;
  bathroomsCount: number;
  setBathroomsCount: (count: number) => void;
  showerRoomsCount: number;
  setShowerRoomsCount: (count: number) => void;
  wcCount: number;
  setWcCount: (count: number) => void;
  hasCellar: boolean;
  setHasCellar: (has: boolean) => void;
  hasPartialBasement: boolean;
  setHasPartialBasement: (has: boolean) => void;
  hasFullBasement: boolean;
  setHasFullBasement: (has: boolean) => void;
  hasTerrace: boolean;
  setHasTerrace: (has: boolean) => void;
  terraceCount: number;
  setTerraceCount: (count: number) => void;
  terraceArea: number;
  setTerraceArea: (area: number) => void;
  hasGarden: boolean;
  setHasGarden: (has: boolean) => void;
  gardenArea: number;
  setGardenArea: (area: number) => void;
  hasParking: boolean;
  setHasParking: (has: boolean) => void;
  parkingCount: number;
  setParkingCount: (count: number) => void;
  hasBox: boolean;
  setHasBox: (has: boolean) => void;
  boxCount: number;
  setBoxCount: (count: number) => void;
  hasPool: boolean;
  setHasPool: (has: boolean) => void;
  isPoolPossible: boolean;
  setIsPoolPossible: (possible: boolean) => void;
  hasFireplace: boolean;
  setHasFireplace: (has: boolean) => void;
  hasAlarm: boolean;
  setHasAlarm: (has: boolean) => void;
  heatingType: string;
  setHeatingType: (type: string) => void;
  hasSmokeDetector: boolean;
  setHasSmokeDetector: (has: boolean) => void;
  hasBuriedFuelTank: boolean;
  setHasBuriedFuelTank: (has: boolean) => void;
  hasNonBuriedFuelTank: boolean;
  setHasNonBuriedFuelTank: (has: boolean) => void;
  isSubdivision: boolean;
  setIsSubdivision: (is: boolean) => void;
  hasExistingAsl: boolean;
  setHasExistingAsl: (has: boolean) => void;
  hasDissolvedAsl: boolean;
  setHasDissolvedAsl: (has: boolean) => void;
  hasEasements: boolean;
  setHasEasements: (has: boolean) => void;
  hasSolarPanels: boolean;
  setHasSolarPanels: (has: boolean) => void;
  hasFiberOptic: boolean;
  setHasFiberOptic: (has: boolean) => void;
}

const PROPERTY_TYPES = [
  "maison",
  "maison_architecte",
  "appartement",
  "loft",
  "terrain",
  "chateau",
  "immeuble"
];

const HEATING_TYPES = [
  "electrique",
  "gaz",
  "fioul",
  "bois",
  "pompe_chaleur",
  "climatisation_reversible",
  "autre"
];

const DPE_GES_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const PropertyDetails = ({
  propertyType,
  setPropertyType,
  address,
  setAddress,
  city,
  setCity,
  postalCode,
  setPostalCode,
  coordinates,
  setCoordinates,
  dpe,
  setDpe,
  ges,
  setGes,
  roomsCount,
  setRoomsCount,
  bedroomsCount,
  setBedroomsCount,
  livingRoomArea,
  setLivingRoomArea,
  diningRoomArea,
  setDiningRoomArea,
  bathroomsCount,
  setBathroomsCount,
  showerRoomsCount,
  setShowerRoomsCount,
  wcCount,
  setWcCount,
  hasCellar,
  setHasCellar,
  hasPartialBasement,
  setHasPartialBasement,
  hasFullBasement,
  setHasFullBasement,
  hasTerrace,
  setHasTerrace,
  terraceCount,
  setTerraceCount,
  terraceArea,
  setTerraceArea,
  hasGarden,
  setHasGarden,
  gardenArea,
  setGardenArea,
  hasParking,
  setHasParking,
  parkingCount,
  setParkingCount,
  hasBox,
  setHasBox,
  boxCount,
  setBoxCount,
  hasPool,
  setHasPool,
  isPoolPossible,
  setIsPoolPossible,
  hasFireplace,
  setHasFireplace,
  hasAlarm,
  setHasAlarm,
  heatingType,
  setHeatingType,
  hasSmokeDetector,
  setHasSmokeDetector,
  hasBuriedFuelTank,
  setHasBuriedFuelTank,
  hasNonBuriedFuelTank,
  setHasNonBuriedFuelTank,
  isSubdivision,
  setIsSubdivision,
  hasExistingAsl,
  setHasExistingAsl,
  hasDissolvedAsl,
  setHasDissolvedAsl,
  hasEasements,
  setHasEasements,
  hasSolarPanels,
  setHasSolarPanels,
  hasFiberOptic,
  setHasFiberOptic,
}: PropertyDetailsProps) => {
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
          <Home className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Description principale du Bien
            {propertyType && <span className="ml-2 text-sm text-gray-500">- {propertyType}</span>}
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
            {/* Type de bien */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de Bien
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un type</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ville
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code postal
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coordonnées (Latitude, Longitude)
                </label>
                <input
                  type="text"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 48.879463, 2.081903"
                />
                <p className="mt-1 text-xs text-gray-500">Format: latitude, longitude</p>
              </div>
            </div>

            {/* DPE et GES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  DPE (Diagnostic de Performance Énergétique)
                </label>
                <select
                  value={dpe}
                  onChange={(e) => setDpe(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez une classe</option>
                  {DPE_GES_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GES (Gaz à Effet de Serre)
                </label>
                <select
                  value={ges}
                  onChange={(e) => setGes(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez une classe</option>
                  {DPE_GES_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pièces et surfaces */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de Pièces
                </label>
                <input
                  type="number"
                  min="0"
                  value={roomsCount || ''}
                  onChange={(e) => setRoomsCount(parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de Chambres
                </label>
                <input
                  type="number"
                  min="0"
                  value={bedroomsCount || ''}
                  onChange={(e) => setBedroomsCount(parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Surfaces des pièces principales */}
            {bedroomsCount > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Surface du Salon (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={livingRoomArea || ''}
                    onChange={(e) => setLivingRoomArea(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Surface Salle à Manger (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={diningRoomArea || ''}
                    onChange={(e) => setDiningRoomArea(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Salles de bain et WC */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de Salles de Bain
                </label>
                <input
                  type="number"
                  min="0"
                  value={bathroomsCount || ''}
                  onChange={(e) => setBathroomsCount(parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de Salles d'Eau
                </label>
                <input
                  type="number"
                  min="0"
                  value={showerRoomsCount || ''}
                  onChange={(e) => setShowerRoomsCount(parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de WC
                </label>
                <input
                  type="number"
                  min="0"
                  value={wcCount || ''}
                  onChange={(e) => setWcCount(parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Équipements et caractéristiques */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasCellar"
                    checked={hasCellar}
                    onChange={(e) => setHasCellar(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasCellar" className="ml-2 block text-sm text-gray-700">
                    Cave
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasPartialBasement"
                    checked={hasPartialBasement}
                    onChange={(e) => setHasPartialBasement(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasPartialBasement" className="ml-2 block text-sm text-gray-700">
                    Sous-sol partiel
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasFullBasement"
                    checked={hasFullBasement}
                    onChange={(e) => setHasFullBasement(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasFullBasement" className="ml-2 block text-sm text-gray-700">
                    Sous-sol complet
                  </label>
                </div>
              </div>

              {/* Terrasse */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasTerrace"
                    checked={hasTerrace}
                    onChange={(e) => setHasTerrace(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasTerrace" className="ml-2 block text-sm text-gray-700">
                    Terrasse
                  </label>
                </div>
                {hasTerrace && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre de Terrasses
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={terraceCount || ''}
                        onChange={(e) => setTerraceCount(parseInt(e.target.value) || 0)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Surface Totale (m²)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={terraceArea || ''}
                        onChange={(e) => setTerraceArea(parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Jardin */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasGarden"
                    checked={hasGarden}
                    onChange={(e) => setHasGarden(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasGarden" className="ml-2 block text-sm text-gray-700">
                    Jardin
                  </label>
                </div>
                {hasGarden && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Surface (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={gardenArea || ''}
                      onChange={(e) => setGardenArea(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Parking */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasParking"
                    checked={hasParking}
                    onChange={(e) => setHasParking(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasParking" className="ml-2 block text-sm text-gray-700">
                    Parking
                  </label>
                </div>
                {hasParking && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre de Places
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={parkingCount || ''}
                      onChange={(e) => setParkingCount(parseInt(e.target.value) || 0)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Box */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasBox"
                    checked={hasBox}
                    onChange={(e) => setHasBox(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasBox" className="ml-2 block text-sm text-gray-700">
                    Box
                  </label>
                </div>
                {hasBox && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre de Box
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={boxCount || ''}
                      onChange={(e) => setBoxCount(parseInt(e.target.value) || 0)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Autres équipements */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasPool"
                    checked={hasPool}
                    onChange={(e) => setHasPool(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasPool" className="ml-2 block text-sm text-gray-700">
                    Piscine
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPoolPossible"
                    checked={isPoolPossible}
                    onChange={(e) => setIsPoolPossible(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPoolPossible" className="ml-2 block text-sm text-gray-700">
                    Terrain piscinable
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasFireplace"
                    checked={hasFireplace}
                    onChange={(e) => setHasFireplace(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasFireplace" className="ml-2 block text-sm text-gray-700">
                    Cheminée
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasAlarm"
                    checked={hasAlarm}
                    onChange={(e) => setHasAlarm(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasAlarm" className="ml-2 block text-sm text-gray-700">
                    Alarme
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasSmokeDetector"
                    checked={hasSmokeDetector}
                    onChange={(e) => setHasSmokeDetector(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasSmokeDetector" className="ml-2 block text-sm text-gray-700">
                    Détecteur de fumée
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasBuriedFuelTank"
                    checked={hasBuriedFuelTank}
                    onChange={(e) => setHasBuriedFuelTank(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasBuriedFuelTank" className="ml-2 block text-sm text-gray-700">
                    Cuve à fioul enterrée
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasNonBuriedFuelTank"
                    checked={hasNonBuriedFuelTank}
                    onChange={(e) => setHasNonBuriedFuelTank(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasNonBuriedFuelTank" className="ml-2 block text-sm text-gray-700">
                    Cuve à fioul non enterrée
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSubdivision"
                    checked={isSubdivision}
                    onChange={(e) => setIsSubdivision(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isSubdivision" className="ml-2 block text-sm text-gray-700">
                    Lotissement
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasExistingAsl"
                    checked={hasExistingAsl}
                    onChange={(e) => setHasExistingAsl(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasExistingAsl" className="ml-2 block text-sm text-gray-700">
                    ASL existante
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasDissolvedAsl"
                    checked={hasDissolvedAsl}
                    onChange={(e) => setHasDissolvedAsl(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasDissolvedAsl" className="ml-2 block text-sm text-gray-700">
                    ASL dissoute
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasEasements"
                    checked={hasEasements}
                    onChange={(e) => setHasEasements(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasEasements" className="ml-2 block text-sm text-gray-700">
                    Servitudes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasSolarPanels"
                    checked={hasSolarPanels}
                    onChange={(e) => setHasSolarPanels(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasSolarPanels" className="ml-2 block text-sm text-gray-700">
                    Panneaux photovoltaïques
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasFiberOptic"
                    checked={hasFiberOptic}
                    onChange={(e) => setHasFiberOptic(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasFiberOptic" className="ml-2 block text-sm text-gray-700">
                    Fibre optique
                  </label>
                </div>
              </div>

              {/* Type de chauffage */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type de Chauffage
                </label>
                <select
                  value={heatingType}
                  onChange={(e) => setHeatingType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez un type</option>
                  {HEATING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;