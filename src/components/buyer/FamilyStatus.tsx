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
  };

  const handleMaritalStatusChange = (value: string) => {
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
              <select
                value={personTypeId || ''}
                onChange={e => handlePersonTypeChange(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un type</option>
                {PERSON_TYPE_OPTIONS.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
                  <input
                    type="text"
                    value={companyLegalForm}
                    onChange={(e) => setCompanyLegalForm(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Numéro SIRET
                  </label>
                  <input
                    type="text"
                    value={siretNumber}
                    onChange={(e) => setSiretNumber(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={companyPostalCode}
                      onChange={(e) => setCompanyPostalCode(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={companyCity}
                      onChange={(e) => setCompanyCity(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
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
                  <input
                    type="number"
                    min="0"
                    value={childrenCount || ''}
                    onChange={e => setChildrenCount(parseInt(e.target.value) || 0)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Commentaires
                  </label>
                  <textarea
                    value={childrenComments}
                    onChange={e => setChildrenComments(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ajoutez vos commentaires ici (âges des enfants, écoles...)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Statut marital
                  </label>
                  <select
                    value={maritalStatusId || ''}
                    onChange={e => handleMaritalStatusChange(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez un statut</option>
                    {MARITAL_STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {isMarried && (
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date du mariage
                        </label>
                        <input
                          type="date"
                          value={marriageDate}
                          onChange={e => setMarriageDate(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Commune
                        </label>
                        <input
                          type="text"
                          value={marriageCity}
                          onChange={e => setMarriageCity(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Code postal
                        </label>
                        <input
                          type="text"
                          value={marriagePostalCode}
                          onChange={e => setMarriagePostalCode(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="hasMarriageContract"
                          checked={hasMarriageContract}
                          onChange={e => setHasMarriageContract(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="hasMarriageContract" className="ml-2 block text-sm text-gray-700">
                          Contrat de mariage
                        </label>
                      </div>

                      {hasMarriageContract && (
                        <div className="space-y-4 ml-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Ville du notaire
                            </label>
                            <input
                              type="text"
                              value={marriageContractNotary}
                              onChange={e => setMarriageContractNotary(e.target.value)}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Date
                            </label>
                            <input
                              type="date"
                              value={marriageContractDate}
                              onChange={e => setMarriageContractDate(e.target.value)}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Régime adopté
                            </label>
                            <input
                              type="text"
                              value={matrimonialRegime}
                              onChange={e => setMatrimonialRegime(e.target.value)}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="hasRegimeModification"
                              checked={hasRegimeModification}
                              onChange={e => setHasRegimeModification(e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="hasRegimeModification" className="ml-2 block text-sm text-gray-700">
                              Modification du régime
                            </label>
                          </div>

                          {hasRegimeModification && (
                            <div className="space-y-4 ml-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Nouveau régime
                                </label>
                                <input
                                  type="text"
                                  value={newRegime}
                                  onChange={e => setNewRegime(e.target.value)}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Date d'homologation
                                </label>
                                <input
                                  type="date"
                                  value={regimeModificationDate}
                                  onChange={e => setRegimeModificationDate(e.target.value)}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
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
                      <input
                        type="date"
                        value={divorceJudgmentDate}
                        onChange={e => setDivorceJudgmentDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tribunal
                      </label>
                      <input
                        type="text"
                        value={divorceCourt}
                        onChange={e => setDivorceCourt(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {isPacsed && (
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        value={pacsDate}
                        onChange={e => setPacsDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tribunal de
                      </label>
                      <input
                        type="text"
                        value={pacsCourt}
                        onChange={e => setPacsCourt(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mairie
                      </label>
                      <input
                        type="text"
                        value={pacsCityHall}
                        onChange={e => setPacsCityHall(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="hasPacsNotary"
                        checked={hasPacsNotary}
                        onChange={e => setHasPacsNotary(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="hasPacsNotary" className="ml-2 block text-sm text-gray-700">
                        PACS chez un notaire
                      </label>
                    </div>

                    {hasPacsNotary && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Adresse du notaire
                        </label>
                        <input
                          type="text"
                          value={pacsNotaryAddress}
                          onChange={e => setPacsNotaryAddress(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Régime
                      </label>
                      <input
                        type="text"
                        value={pacsRegime}
                        onChange={e => setPacsRegime(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {isWidowed && (
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date de décès du conjoint
                      </label>
                      <input
                        type="date"
                        value={spouseDeathDate}
                        onChange={e => setSpouseDeathDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Lieu de décès du conjoint
                      </label>
                      <input
                        type="text"
                        value={spouseDeathPlace}
                        onChange={e => setSpouseDeathPlace(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
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