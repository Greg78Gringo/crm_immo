import React, { useState } from 'react';
import { Users2, ChevronDown, ChevronUp } from 'lucide-react';

interface FamilyStatusProps {
  personTypeId: string;
  setPersonTypeId: (id: string) => void;
  maritalStatusId: string;
  setMaritalStatusId: (id: string) => void;
  childrenCount: number;
  setChildrenCount: (count: number) => void;
  childrenComments: string;
  setChildrenComments: (comments: string) => void;
  
  // Champs entreprise
  companyLegalForm: string;
  setCompanyLegalForm: (form: string) => void;
  siretNumber: string;
  setSiretNumber: (siret: string) => void;
  companyAddress: string;
  setCompanyAddress: (address: string) => void;
  companyPostalCode: string;
  setCompanyPostalCode: (code: string) => void;
  companyCity: string;
  setCompanyCity: (city: string) => void;
  
  // Champs mariage
  marriageDate: string;
  setMarriageDate: (date: string) => void;
  marriageCity: string;
  setMarriageCity: (city: string) => void;
  marriagePostalCode: string;
  setMarriagePostalCode: (code: string) => void;
  hasMarriageContract: boolean;
  setHasMarriageContract: (has: boolean) => void;
  marriageContractNotary: string;
  setMarriageContractNotary: (notary: string) => void;
  marriageContractDate: string;
  setMarriageContractDate: (date: string) => void;
  matrimonialRegime: string;
  setMatrimonialRegime: (regime: string) => void;
  hasRegimeModification: boolean;
  setHasRegimeModification: (has: boolean) => void;
  modificationNotary: string;
  setModificationNotary: (notary: string) => void;
  regimeModificationDate: string;
  setRegimeModificationDate: (date: string) => void;
  newRegime: string;
  setNewRegime: (regime: string) => void;
  
  // Champs divorce
  divorceJudgmentDate: string;
  setDivorceJudgmentDate: (date: string) => void;
  divorceCourt: string;
  setDivorceCourt: (court: string) => void;
  
  // Champs PACS
  pacsDate: string;
  setPacsDate: (date: string) => void;
  pacsCourt: string;
  setPacsCourt: (court: string) => void;
  pacsCityHall: string;
  setPacsCityHall: (cityHall: string) => void;
  hasPacsNotary: boolean;
  setHasPacsNotary: (has: boolean) => void;
  pacsNotaryAddress: string;
  setPacsNotaryAddress: (address: string) => void;
  pacsRegime: string;
  setPacsRegime: (regime: string) => void;
  
  // Champs veuvage
  spouseDeathDate: string;
  setSpouseDeathDate: (date: string) => void;
  spouseDeathPlace: string;
  setSpouseDeathPlace: (place: string) => void;
  
  readOnly?: boolean;
}

const MARITAL_STATUS_OPTIONS = [
  "Célibataire",
  "Marié(e)",
  "Pacsé(e)",
  "Divorcé(e)",
  "Veuf(ve)",
  "Séparé de corps",
  "Union Libre"
];

const PERSON_TYPE_OPTIONS = [
  "Personne Physique Décisionnaire",
  "Personne Physique sous protection",
  "Personne Morale"
];

const FamilyStatus = ({
  personTypeId,
  setPersonTypeId,
  maritalStatusId,
  setMaritalStatusId,
  childrenCount,
  setChildrenCount,
  childrenComments,
  setChildrenComments,
  companyLegalForm,
  setCompanyLegalForm,
  siretNumber,
  setSiretNumber,
  companyAddress,
  setCompanyAddress,
  companyPostalCode,
  setCompanyPostalCode,
  companyCity,
  setCompanyCity,
  marriageDate,
  setMarriageDate,
  marriageCity,
  setMarriageCity,
  marriagePostalCode,
  setMarriagePostalCode,
  hasMarriageContract,
  setHasMarriageContract,
  marriageContractNotary,
  setMarriageContractNotary,
  marriageContractDate,
  setMarriageContractDate,
  matrimonialRegime,
  setMatrimonialRegime,
  hasRegimeModification,
  setHasRegimeModification,
  modificationNotary,
  setModificationNotary,
  regimeModificationDate,
  setRegimeModificationDate,
  newRegime,
  setNewRegime,
  divorceJudgmentDate,
  setDivorceJudgmentDate,
  divorceCourt,
  setDivorceCourt,
  pacsDate,
  setPacsDate,
  pacsCourt,
  setPacsCourt,
  pacsCityHall,
  setPacsCityHall,
  hasPacsNotary,
  setHasPacsNotary,
  pacsNotaryAddress,
  setPacsNotaryAddress,
  pacsRegime,
  setPacsRegime,
  spouseDeathDate,
  setSpouseDeathDate,
  spouseDeathPlace,
  setSpouseDeathPlace,
  readOnly = false
}: FamilyStatusProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isProtectedPerson = personTypeId === "Personne Physique sous protection";
  const isLegalEntity = personTypeId === "Personne Morale";
  const isDecisionMaker = personTypeId === "Personne Physique Décisionnaire";

  const isSingle = maritalStatusId === "Célibataire";
  const isMarried = maritalStatusId === "Marié(e)";
  const isDivorced = maritalStatusId === "Divorcé(e)";
  const isSeparated = maritalStatusId === "Séparé de corps";
  const isPacsed = maritalStatusId === "Pacsé(e)";
  const isWidowed = maritalStatusId === "Veuf(ve)";

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handlePersonTypeChange = (value: string) => {
    if (!readOnly) {
      setPersonTypeId(value);
      
      // Si Personne Morale, reset du statut marital et des champs famille
      if (value === "Personne Morale") {
        setMaritalStatusId('');
        setChildrenCount(0);
        setChildrenComments('');
        // Reset des champs mariage, divorce, PACS, veuvage
        setMarriageDate('');
        setMarriageCity('');
        setMarriagePostalCode('');
        setHasMarriageContract(false);
        setMarriageContractNotary('');
        setMarriageContractDate('');
        setMatrimonialRegime('');
        setHasRegimeModification(false);
        setModificationNotary('');
        setRegimeModificationDate('');
        setNewRegime('');
        setDivorceJudgmentDate('');
        setDivorceCourt('');
        setPacsDate('');
        setPacsCourt('');
        setPacsCityHall('');
        setHasPacsNotary(false);
        setPacsNotaryAddress('');
        setPacsRegime('');
        setSpouseDeathDate('');
        setSpouseDeathPlace('');
      }
      
      // Si Personne Physique Décisionnaire, reset des champs entreprise
      if (value === "Personne Physique Décisionnaire") {
        setCompanyLegalForm('');
        setSiretNumber('');
        setCompanyAddress('');
        setCompanyPostalCode('');
        setCompanyCity('');
      }
    }
  };

  const handleMaritalStatusChange = (value: string) => {
    if (!readOnly) {
      setMaritalStatusId(value);
      
      // Reset des champs selon le statut marital
      if (value === "Célibataire" || value === "Union Libre") {
        // Reset tous les champs de mariage, divorce, PACS, veuvage
        setMarriageDate('');
        setMarriageCity('');
        setMarriagePostalCode('');
        setHasMarriageContract(false);
        setMarriageContractNotary('');
        setMarriageContractDate('');
        setMatrimonialRegime('');
        setHasRegimeModification(false);
        setModificationNotary('');
        setRegimeModificationDate('');
        setNewRegime('');
        setDivorceJudgmentDate('');
        setDivorceCourt('');
        setPacsDate('');
        setPacsCourt('');
        setPacsCityHall('');
        setHasPacsNotary(false);
        setPacsNotaryAddress('');
        setPacsRegime('');
        setSpouseDeathDate('');
        setSpouseDeathPlace('');
      } else if (value === "Marié(e)") {
        // Reset divorce, PACS, veuvage
        setDivorceJudgmentDate('');
        setDivorceCourt('');
        setPacsDate('');
        setPacsCourt('');
        setPacsCityHall('');
        setHasPacsNotary(false);
        setPacsNotaryAddress('');
        setPacsRegime('');
        setSpouseDeathDate('');
        setSpouseDeathPlace('');
      } else if (value === "Divorcé(e)" || value === "Séparé de corps") {
        // Reset mariage, PACS, veuvage
        setMarriageDate('');
        setMarriageCity('');
        setMarriagePostalCode('');
        setHasMarriageContract(false);
        setMarriageContractNotary('');
        setMarriageContractDate('');
        setMatrimonialRegime('');
        setHasRegimeModification(false);
        setModificationNotary('');
        setRegimeModificationDate('');
        setNewRegime('');
        setPacsDate('');
        setPacsCourt('');
        setPacsCityHall('');
        setHasPacsNotary(false);
        setPacsNotaryAddress('');
        setPacsRegime('');
        setSpouseDeathDate('');
        setSpouseDeathPlace('');
      } else if (value === "Pacsé(e)") {
        // Reset mariage, divorce, veuvage
        setMarriageDate('');
        setMarriageCity('');
        setMarriagePostalCode('');
        setHasMarriageContract(false);
        setMarriageContractNotary('');
        setMarriageContractDate('');
        setMatrimonialRegime('');
        setHasRegimeModification(false);
        setModificationNotary('');
        setRegimeModificationDate('');
        setNewRegime('');
        setDivorceJudgmentDate('');
        setDivorceCourt('');
        setSpouseDeathDate('');
        setSpouseDeathPlace('');
      } else if (value === "Veuf(ve)") {
        // Reset mariage, divorce, PACS
        setMarriageDate('');
        setMarriageCity('');
        setMarriagePostalCode('');
        setHasMarriageContract(false);
        setMarriageContractNotary('');
        setMarriageContractDate('');
        setMatrimonialRegime('');
        setHasRegimeModification(false);
        setModificationNotary('');
        setRegimeModificationDate('');
        setNewRegime('');
        setDivorceJudgmentDate('');
        setDivorceCourt('');
        setPacsDate('');
        setPacsCourt('');
        setPacsCityHall('');
        setHasPacsNotary(false);
        setPacsNotaryAddress('');
        setPacsRegime('');
      }
    }
  };

  const renderField = (value: string, onChange: (value: string) => void, placeholder?: string, type: string = 'text') => {
    if (readOnly) {
      return (
        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
          {value || 'Non renseigné'}
        </div>
      );
    }

    if (type === 'date') {
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
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

  const renderTextarea = (value: string, onChange: (value: string) => void, rows: number = 3, placeholder?: string) => {
    if (readOnly) {
      return (
        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 min-h-[80px]">
          {value || 'Non renseigné'}
        </div>
      );
    }

    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
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
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Sélectionnez un type</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  };

  const renderCheckbox = (checked: boolean, onChange: (checked: boolean) => void, id: string, label: string) => {
    if (readOnly) {
      return (
        <div className="flex items-center">
          <div className={`h-4 w-4 rounded border-2 ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'} mr-2`}>
            {checked && (
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-700">{label}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      </div>
    );
  };

  const renderNumberField = (value: number, onChange: (value: number) => void, min: string = "0") => {
    if (readOnly) {
      return (
        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
          {value || 'Non renseigné'}
        </div>
      );
    }

    return (
      <input
        type="number"
        min={min}
        value={value || ''}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
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
          <Users2 className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Situation Familiale
            {personTypeId && (
              <span className="ml-2 text-sm text-gray-500">
                - {personTypeId}
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
                Type de personne
              </label>
              {renderSelect(personTypeId, handlePersonTypeChange, PERSON_TYPE_OPTIONS)}
            </div>

            {isProtectedPerson && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                Ce choix n'est pas possible
              </div>
            )}

            {isLegalEntity && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Forme juridique
                  </label>
                  {renderField(companyLegalForm, setCompanyLegalForm)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Numéro SIRET
                  </label>
                  {renderField(siretNumber, setSiretNumber)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse de l'entreprise
                  </label>
                  {renderField(companyAddress, setCompanyAddress)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Code postal
                    </label>
                    {renderField(companyPostalCode, setCompanyPostalCode)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ville
                    </label>
                    {renderField(companyCity, setCompanyCity)}
                  </div>
                </div>
              </div>
            )}

            {isDecisionMaker && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre d'enfants
                  </label>
                  {renderNumberField(childrenCount, setChildrenCount)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Commentaires
                  </label>
                  {renderTextarea(childrenComments, setChildrenComments, 3, "Ajoutez vos commentaires ici (âges des enfants, écoles...)")}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Statut marital
                  </label>
                  {renderSelect(maritalStatusId, handleMaritalStatusChange, MARITAL_STATUS_OPTIONS)}
                </div>

                {isMarried && (
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date du mariage
                        </label>
                        {renderField(marriageDate, setMarriageDate, undefined, 'date')}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Commune
                        </label>
                        {renderField(marriageCity, setMarriageCity)}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Code postal
                        </label>
                        {renderField(marriagePostalCode, setMarriagePostalCode)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {renderCheckbox(hasMarriageContract, setHasMarriageContract, "hasMarriageContract", "Contrat de mariage")}

                      {hasMarriageContract && (
                        <div className="space-y-4 ml-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Ville du notaire
                            </label>
                            {renderField(marriageContractNotary, setMarriageContractNotary)}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Date
                            </label>
                            {renderField(marriageContractDate, setMarriageContractDate, undefined, 'date')}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Régime adopté
                            </label>
                            {renderField(matrimonialRegime, setMatrimonialRegime)}
                          </div>

                          {renderCheckbox(hasRegimeModification, setHasRegimeModification, "hasRegimeModification", "Modification du régime")}

                          {hasRegimeModification && (
                            <div className="space-y-4 ml-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Nouveau régime
                                </label>
                                {renderField(newRegime, setNewRegime)}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Date d'homologation
                                </label>
                                {renderField(regimeModificationDate, setRegimeModificationDate, undefined, 'date')}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(isDivorced || isSeparated) && (
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date du jugement
                      </label>
                      {renderField(divorceJudgmentDate, setDivorceJudgmentDate, undefined, 'date')}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tribunal
                      </label>
                      {renderField(divorceCourt, setDivorceCourt)}
                    </div>
                  </div>
                )}

                {isPacsed && (
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      {renderField(pacsDate, setPacsDate, undefined, 'date')}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tribunal de
                      </label>
                      {renderField(pacsCourt, setPacsCourt)}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mairie
                      </label>
                      {renderField(pacsCityHall, setPacsCityHall)}
                    </div>

                    {renderCheckbox(hasPacsNotary, setHasPacsNotary, "hasPacsNotary", "PACS chez un notaire")}

                    {hasPacsNotary && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Adresse du notaire
                        </label>
                        {renderField(pacsNotaryAddress, setPacsNotaryAddress)}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Régime
                      </label>
                      {renderField(pacsRegime, setPacsRegime)}
                    </div>
                  </div>
                )}

                {isWidowed && (
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date de décès du conjoint
                      </label>
                      {renderField(spouseDeathDate, setSpouseDeathDate, undefined, 'date')}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Lieu de décès du conjoint
                      </label>
                      {renderField(spouseDeathPlace, setSpouseDeathPlace)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyStatus;