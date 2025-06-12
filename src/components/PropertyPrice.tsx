import React, { useState } from 'react';
import { Wallet, ChevronDown, ChevronUp } from 'lucide-react';

interface PropertyPriceProps {
  mandateType: string;
  setMandateType: (type: string) => void;
  estimatedPrice: number;
  setEstimatedPrice: (price: number) => void;
  displayPrice: number;
  setDisplayPrice: (price: number) => void;
  agencyCommission: number;
  setAgencyCommission: (commission: number) => void;
}

const PropertyPrice = ({
  mandateType,
  setMandateType,
  estimatedPrice,
  setEstimatedPrice,
  displayPrice,
  setDisplayPrice,
  agencyCommission,
  setAgencyCommission
}: PropertyPriceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <Wallet className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Prix du Bien
            {estimatedPrice > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                - {formatPrice(estimatedPrice)}
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
                Type de Mandat
              </label>
              <select
                value={mandateType}
                onChange={(e) => setMandateType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un type</option>
                <option value="simple">Simple</option>
                <option value="exclusif">Exclusif</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estimation du bien
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  value={estimatedPrice || ''}
                  onChange={(e) => setEstimatedPrice(parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prix affiché
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  value={displayPrice || ''}
                  onChange={(e) => setDisplayPrice(parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Commission d'agence
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  value={agencyCommission || ''}
                  onChange={(e) => setAgencyCommission(parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPrice;