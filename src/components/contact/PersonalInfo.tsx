import React, { useState } from 'react';
import { UserCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface PersonalInfoProps {
  lastName: string;
  setLastName: (name: string) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  address: string;
  setAddress: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  postalCode: string;
  setPostalCode: (code: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  email: string;
  setEmail: (email: string) => void;
  profession: string;
  setProfession: (profession: string) => void;
  workplace: string;
  setWorkplace: (workplace: string) => void;
  transportMeans: string;
  setTransportMeans: (means: string) => void;
  readOnly?: boolean;
}

const TRANSPORT_OPTIONS = [
  "Voiture",
  "Transports en commun",
  "À pied",
  "Vélo",
];

const PersonalInfo = ({
  lastName,
  setLastName,
  firstName,
  setFirstName,
  address,
  setAddress,
  city,
  setCity,
  postalCode,
  setPostalCode,
  phone,
  setPhone,
  email,
  setEmail,
  profession,
  setProfession,
  workplace,
  setWorkplace,
  transportMeans,
  setTransportMeans,
  readOnly = false
}: PersonalInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const renderField = (value: string, onChange: (value: string) => void, placeholder?: string, type: string = 'text') => {
    if (readOnly) {
      return (
        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
          {value || 'Non renseigné'}
        </div>
      );
    }

    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
    );
  };

  const renderSelect = (value: string, onChange: (value: string) => void, options: string[]) => {
    if (readOnly) {
      return (
        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
          {value || 'Non renseigné'}
        </div>
      );
    }

    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Sélectionnez un moyen de transport</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <UserCircle className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Informations Personnelles
            {lastName && firstName && (
              <span className="ml-2 text-sm text-gray-500">
                - {firstName} {lastName}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              {renderField(lastName, setLastName)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              {renderField(firstName, setFirstName)}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              {renderField(address, setAddress)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ville
              </label>
              {renderField(city, setCity)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Code postal
              </label>
              {renderField(postalCode, setPostalCode)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              {renderField(phone, setPhone, undefined, 'tel')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              {renderField(email, setEmail, undefined, 'email')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profession
              </label>
              {renderField(profession, setProfession)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lieu de travail
              </label>
              {renderField(workplace, setWorkplace)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Moyen de transport
              </label>
              {renderSelect(transportMeans, setTransportMeans, TRANSPORT_OPTIONS)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;