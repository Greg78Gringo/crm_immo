import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Seller {
  id?: string;
  lastName: string;
  firstName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  profession: string;
  workplace: string;
  personTypeId: string;
  maritalStatusId: string;
  childrenCount: number;
  childrenComments: string;
  
  // Champs entreprise
  companyLegalForm: string;
  siretNumber: string;
  companyAddress: string;
  companyPostalCode: string;
  companyCity: string;
  
  // Champs mariage
  marriageDate: string;
  marriageCity: string;
  marriagePostalCode: string;
  hasMarriageContract: boolean;
  marriageContractNotary: string;
  marriageContractDate: string;
  matrimonialRegime: string;
  hasRegimeModification: boolean;
  modificationNotary: string;
  regimeModificationDate: string;
  newRegime: string;
  
  // Champs divorce
  divorceJudgmentDate: string;
  divorceCourt: string;
  
  // Champs PACS
  pacsDate: string;
  pacsCourt: string;
  pacsCityHall: string;
  hasPacsNotary: boolean;
  pacsNotaryAddress: string;
  pacsRegime: string;
  
  // Champs veuvage
  spouseDeathDate: string;
  spouseDeathPlace: string;
}

interface SellerInfoV3Props {
  dealId: string | null;
  sellers: Seller[];
  setSellers: (sellers: Seller[]) => void;
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

// Fonction utilitaire pour mapper un objet Seller vers la structure attendue par Supabase
const mapSellerToDb = (seller: Seller) => ({
  last_name: seller.lastName || null,
  first_name: seller.firstName || null,
  address: seller.address || null,
  city: seller.city || null,
  postal_code: seller.postalCode || null,
  phone: seller.phone || null,
  email: seller.email || null,
  profession: seller.profession || null,
  workplace: seller.workplace || null,
  person_type_id: seller.personTypeId || null,
  marital_status_id: seller.maritalStatusId || null,
  children_count: seller.childrenCount ?? null,
  children_comments: seller.childrenComments || null,
  company_legal_form: seller.companyLegalForm || null,
  siret_number: seller.siretNumber || null,
  company_address: seller.companyAddress || null,
  company_postal_code: seller.companyPostalCode || null,
  company_city: seller.companyCity || null,
  marriage_date: seller.marriageDate || null,
  marriage_city: seller.marriageCity || null,
  marriage_postal_code: seller.marriagePostalCode || null,
  marriage_contract: seller.hasMarriageContract,
  marriage_contract_notary: seller.marriageContractNotary || null,
  marriage_contract_date: seller.marriageContractDate || null,
  matrimonial_regime: seller.matrimonialRegime || null,
  regime_modification: seller.hasRegimeModification,
  modification_notary: seller.modificationNotary || null,
  regime_modification_date: seller.regimeModificationDate || null,
  new_regime: seller.newRegime || null,
  divorce_judgment_date: seller.divorceJudgmentDate || null,
  divorce_court: seller.divorceCourt || null,
  pacs_date: seller.pacsDate || null,
  pacs_court: seller.pacsCourt || null,
  pacs_city_hall: seller.pacsCityHall || null,
  pacs_notary: seller.hasPacsNotary,
  pacs_notary_address: seller.pacsNotaryAddress || null,
  pacs_regime: seller.pacsRegime || null,
  spouse_death_date: seller.spouseDeathDate || null,
  spouse_death_place: seller.spouseDeathPlace || null
});

const SellerInfoV3 = ({ dealId, sellers, setSellers }: SellerInfoV3Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  // Load sellers on dealId change
  useEffect(() => {
    if (dealId) {
      setError('');
      loadSellers();
    }
    // eslint-disable-next-line
  }, [dealId]);

  const loadSellers = async () => {
    if (!dealId) return;

    try {
      const { data, error: loadError } = await supabase
        .from('sellers')
        .select('*')
        .eq('deal_id', dealId);

      if (loadError) throw loadError;

      if (data && data.length > 0) {
        const loadedSellers = data.map(seller => ({
          id: seller.id,
          lastName: seller.last_name || '',
          firstName: seller.first_name || '',
          address: seller.address || '',
          city: seller.city || '',
          postalCode: seller.postal_code || '',
          phone: seller.phone || '',
          email: seller.email || '',
          profession: seller.profession || '',
          workplace: seller.workplace || '',
          personTypeId: seller.person_type_id || '',
          maritalStatusId: seller.marital_status_id || '',
          childrenCount: seller.children_count || 0,
          childrenComments: seller.children_comments || '',
          companyLegalForm: seller.company_legal_form || '',
          siretNumber: seller.siret_number || '',
          companyAddress: seller.company_address || '',
          companyPostalCode: seller.company_postal_code || '',
          companyCity: seller.company_city || '',
          marriageDate: seller.marriage_date || '',
          marriageCity: seller.marriage_city || '',
          marriagePostalCode: seller.marriage_postal_code || '',
          hasMarriageContract: !!seller.marriage_contract,
          marriageContractNotary: seller.marriage_contract_notary || '',
          marriageContractDate: seller.marriage_contract_date || '',
          matrimonialRegime: seller.matrimonial_regime || '',
          hasRegimeModification: !!seller.regime_modification,
          modificationNotary: seller.modification_notary || '',
          regimeModificationDate: seller.regime_modification_date || '',
          newRegime: seller.new_regime || '',
          divorceJudgmentDate: seller.divorce_judgment_date || '',
          divorceCourt: seller.divorce_court || '',
          pacsDate: seller.pacs_date || '',
          pacsCourt: seller.pacs_court || '',
          pacsCityHall: seller.pacs_city_hall || '',
          hasPacsNotary: !!seller.pacs_notary,
          pacsNotaryAddress: seller.pacs_notary_address || '',
          pacsRegime: seller.pacs_regime || '',
          spouseDeathDate: seller.spouse_death_date || '',
          spouseDeathPlace: seller.spouse_death_place || ''
        }));
        setSellers(loadedSellers);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des vendeurs:', err);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const addSeller = async () => {
    if (!dealId) {
      setError('Veuillez d\'abord sauvegarder l\'affaire');
      return;
    }
    setError('');
    try {
      const newSeller: Seller = {
        lastName: '',
        firstName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        email: '',
        profession: '',
        workplace: '',
        personTypeId: '',
        maritalStatusId: '',
        childrenCount: 0,
        childrenComments: '',
        companyLegalForm: '',
        siretNumber: '',
        companyAddress: '',
        companyPostalCode: '',
        companyCity: '',
        marriageDate: '',
        marriageCity: '',
        marriagePostalCode: '',
        hasMarriageContract: false,
        marriageContractNotary: '',
        marriageContractDate: '',
        matrimonialRegime: '',
        hasRegimeModification: false,
        modificationNotary: '',
        regimeModificationDate: '',
        newRegime: '',
        divorceJudgmentDate: '',
        divorceCourt: '',
        pacsDate: '',
        pacsCourt: '',
        pacsCityHall: '',
        hasPacsNotary: false,
        pacsNotaryAddress: '',
        pacsRegime: '',
        spouseDeathDate: '',
        spouseDeathPlace: ''
      };

      const { data, error: insertError } = await supabase
        .from('sellers')
        .insert({
          deal_id: dealId,
          last_name: '',
          first_name: '',
          address: '',
          city: '',
          postal_code: '',
          phone: '',
          email: '',
          profession: '',
          workplace: '',
          person_type_id: null,
          marital_status_id: null
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setSellers([...sellers, { ...newSeller, id: data.id }]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setError('Erreur lors de l\'ajout du vendeur');
    }
  };

  const removeSeller = async (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    const sellerToRemove = sellers[index];

    if (sellerToRemove.id && dealId) {
      try {
        const { error } = await supabase
          .from('sellers')
          .delete()
          .eq('id', sellerToRemove.id);
        if (error) throw error;
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression du vendeur');
        return;
      }
    }
    const newSellers = [...sellers];
    newSellers.splice(index, 1);
    setSellers(newSellers);
  };

  const updateSeller = async (index: number, field: keyof Seller, value: any) => {
    setError('');
    const seller = sellers[index];

    // Mise à jour locale
    const newSellers = [...sellers];
    newSellers[index] = { ...newSellers[index], [field]: value };
    setSellers(newSellers);

    if (!seller.id || !dealId) return;

    try {
      const updateData: any = {};
      // ... mapping (identique à avant, inchangé pour un seul champ)
      switch (field) {
        case 'lastName':
          updateData.last_name = value || null;
          break;
        case 'firstName':
          updateData.first_name = value || null;
          break;
        case 'address':
          updateData.address = value || null;
          break;
        case 'city':
          updateData.city = value || null;
          break;
        case 'postalCode':
          updateData.postal_code = value || null;
          break;
        case 'phone':
          updateData.phone = value || null;
          break;
        case 'email':
          updateData.email = value || null;
          break;
        case 'profession':
          updateData.profession = value || null;
          break;
        case 'workplace':
          updateData.workplace = value || null;
          break;
        case 'personTypeId':
          updateData.person_type_id = value || null;
          break;
        case 'maritalStatusId':
          updateData.marital_status_id = value || null;
          break;
        case 'childrenCount':
          updateData.children_count = value ?? null;
          break;
        case 'childrenComments':
          updateData.children_comments = value || null;
          break;
        case 'companyLegalForm':
          updateData.company_legal_form = value || null;
          break;
        case 'siretNumber':
          updateData.siret_number = value || null;
          break;
        case 'companyAddress':
          updateData.company_address = value || null;
          break;
        case 'companyPostalCode':
          updateData.company_postal_code = value || null;
          break;
        case 'companyCity':
          updateData.company_city = value || null;
          break;
        case 'marriageDate':
          updateData.marriage_date = value || null;
          break;
        case 'marriageCity':
          updateData.marriage_city = value || null;
          break;
        case 'marriagePostalCode':
          updateData.marriage_postal_code = value || null;
          break;
        case 'hasMarriageContract':
          updateData.marriage_contract = value;
          break;
        case 'marriageContractNotary':
          updateData.marriage_contract_notary = value || null;
          break;
        case 'marriageContractDate':
          updateData.marriage_contract_date = value || null;
          break;
        case 'matrimonialRegime':
          updateData.matrimonial_regime = value || null;
          break;
        case 'hasRegimeModification':
          updateData.regime_modification = value;
          break;
        case 'modificationNotary':
          updateData.modification_notary = value || null;
          break;
        case 'regimeModificationDate':
          updateData.regime_modification_date = value || null;
          break;
        case 'newRegime':
          updateData.new_regime = value || null;
          break;
        case 'divorceJudgmentDate':
          updateData.divorce_judgment_date = value || null;
          break;
        case 'divorceCourt':
          updateData.divorce_court = value || null;
          break;
        case 'pacsDate':
          updateData.pacs_date = value || null;
          break;
        case 'pacsCourt':
          updateData.pacs_court = value || null;
          break;
        case 'pacsCityHall':
          updateData.pacs_city_hall = value || null;
          break;
        case 'hasPacsNotary':
          updateData.pacs_notary = value;
          break;
        case 'pacsNotaryAddress':
          updateData.pacs_notary_address = value || null;
          break;
        case 'pacsRegime':
          updateData.pacs_regime = value || null;
          break;
        case 'spouseDeathDate':
          updateData.spouse_death_date = value || null;
          break;
        case 'spouseDeathPlace':
          updateData.spouse_death_place = value || null;
          break;
        default:
          updateData[field] = value || null;
      }

      const { error: updateError } = await supabase
        .from('sellers')
        .update(updateData)
        .eq('id', seller.id);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour du vendeur');
    }
  };

  // NOUVELLE FONCTION: MAJ DE TOUT L'OBJET SELLER EN BDD (après un reset multiple)
  const updateSellerAllFields = async (index: number, seller: Seller) => {
    setError('');
    if (!seller.id || !dealId) return;
    try {
      const updateData = mapSellerToDb(seller);
      const { error: updateError } = await supabase
        .from('sellers')
        .update(updateData)
        .eq('id', seller.id);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Erreur lors du reset vendeur:', err);
      setError('Erreur lors de la mise à jour du vendeur');
    }
  };

  // NOUVELLE VERSION: RESET IDENTIQUE A FAMILY STATUS AVEC MAJ TOTALE EN BDD
  const handlePersonTypeChange = (index: number, value: string) => {
    const oldSeller = sellers[index];
    const newSeller = { ...oldSeller, personTypeId: value };

    // Si Personne Morale, reset du statut marital et des champs famille
    if (value === "Personne Morale") {
      newSeller.maritalStatusId = '';
      newSeller.childrenCount = 0;
      newSeller.childrenComments = '';
      // Reset des champs mariage, divorce, PACS, veuvage
      newSeller.marriageDate = '';
      newSeller.marriageCity = '';
      newSeller.marriagePostalCode = '';
      newSeller.hasMarriageContract = false;
      newSeller.marriageContractNotary = '';
      newSeller.marriageContractDate = '';
      newSeller.matrimonialRegime = '';
      newSeller.hasRegimeModification = false;
      newSeller.modificationNotary = '';
      newSeller.regimeModificationDate = '';
      newSeller.newRegime = '';
      newSeller.divorceJudgmentDate = '';
      newSeller.divorceCourt = '';
      newSeller.pacsDate = '';
      newSeller.pacsCourt = '';
      newSeller.pacsCityHall = '';
      newSeller.hasPacsNotary = false;
      newSeller.pacsNotaryAddress = '';
      newSeller.pacsRegime = '';
      newSeller.spouseDeathDate = '';
      newSeller.spouseDeathPlace = '';
    }

 // Si Personne sous protectop,, reset du statut marital et des champs famille
    if (value === "Personne Physique sous protection") {
      newSeller.maritalStatusId = '';
      newSeller.childrenCount = 0;
      newSeller.childrenComments = '';
      // Reset des champs mariage, divorce, PACS, veuvage
      newSeller.marriageDate = '';
      newSeller.marriageCity = '';
      newSeller.marriagePostalCode = '';
      newSeller.hasMarriageContract = false;
      newSeller.marriageContractNotary = '';
      newSeller.marriageContractDate = '';
      newSeller.matrimonialRegime = '';
      newSeller.hasRegimeModification = false;
      newSeller.modificationNotary = '';
      newSeller.regimeModificationDate = '';
      newSeller.newRegime = '';
      newSeller.divorceJudgmentDate = '';
      newSeller.divorceCourt = '';
      newSeller.pacsDate = '';
      newSeller.pacsCourt = '';
      newSeller.pacsCityHall = '';
      newSeller.hasPacsNotary = false;
      newSeller.pacsNotaryAddress = '';
      newSeller.pacsRegime = '';
      newSeller.spouseDeathDate = '';
      newSeller.spouseDeathPlace = '';
      newSeller.companyLegalForm = '';
      newSeller.siretNumber = '';
      newSeller.companyAddress = '';
      newSeller.companyPostalCode = '';
      newSeller.companyCity = '';
    }
    
    // Si Personne Physique Décisionnaire, reset des champs entreprise
    if (value === "Personne Physique Décisionnaire") {
      newSeller.companyLegalForm = '';
      newSeller.siretNumber = '';
      newSeller.companyAddress = '';
      newSeller.companyPostalCode = '';
      newSeller.companyCity = '';
    }

    // Mettre à jour le state
    const newSellers = [...sellers];
    newSellers[index] = newSeller;
    setSellers(newSellers);

    // MAJ BDD AVEC TOUS LES CHAMPS RESET
    updateSellerAllFields(index, newSeller);
  };

  // RESET EN CAS DE CHANGEMENT DE STATUT MARITAL
  const handleMaritalStatusChange = (index: number, value: string) => {
    const oldSeller = sellers[index];
    const newSeller = { ...oldSeller, maritalStatusId: value };

    // Reset des champs selon le statut marital
    if (value === "Célibataire" || value === "Union Libre") {
      // Reset tous les champs de mariage, divorce, PACS, veuvage
      newSeller.marriageDate = '';
      newSeller.marriageCity = '';
      newSeller.marriagePostalCode = '';
      newSeller.hasMarriageContract = false;
      newSeller.marriageContractNotary = '';
      newSeller.marriageContractDate = '';
      newSeller.matrimonialRegime = '';
      newSeller.hasRegimeModification = false;
      newSeller.modificationNotary = '';
      newSeller.regimeModificationDate = '';
      newSeller.newRegime = '';
      newSeller.divorceJudgmentDate = '';
      newSeller.divorceCourt = '';
      newSeller.pacsDate = '';
      newSeller.pacsCourt = '';
      newSeller.pacsCityHall = '';
      newSeller.hasPacsNotary = false;
      newSeller.pacsNotaryAddress = '';
      newSeller.pacsRegime = '';
      newSeller.spouseDeathDate = '';
      newSeller.spouseDeathPlace = '';
    } else if (value === "Marié(e)") {
      // Reset divorce, PACS, veuvage
      newSeller.divorceJudgmentDate = '';
      newSeller.divorceCourt = '';
      newSeller.pacsDate = '';
      newSeller.pacsCourt = '';
      newSeller.pacsCityHall = '';
      newSeller.hasPacsNotary = false;
      newSeller.pacsNotaryAddress = '';
      newSeller.pacsRegime = '';
      newSeller.spouseDeathDate = '';
      newSeller.spouseDeathPlace = '';
    } else if (value === "Divorcé(e)" || value === "Séparé de corps") {
      // Reset mariage, PACS, veuvage
      newSeller.marriageDate = '';
      newSeller.marriageCity = '';
      newSeller.marriagePostalCode = '';
      newSeller.hasMarriageContract = false;
      newSeller.marriageContractNotary = '';
      newSeller.marriageContractDate = '';
      newSeller.matrimonialRegime = '';
      newSeller.hasRegimeModification = false;
      newSeller.modificationNotary = '';
      newSeller.regimeModificationDate = '';
      newSeller.newRegime = '';
      newSeller.pacsDate = '';
      newSeller.pacsCourt = '';
      newSeller.pacsCityHall = '';
      newSeller.hasPacsNotary = false;
      newSeller.pacsNotaryAddress = '';
      newSeller.pacsRegime = '';
      newSeller.spouseDeathDate = '';
      newSeller.spouseDeathPlace = '';
    } else if (value === "Pacsé(e)") {
      // Reset mariage, divorce, veuvage
      newSeller.marriageDate = '';
      newSeller.marriageCity = '';
      newSeller.marriagePostalCode = '';
      newSeller.hasMarriageContract = false;
      newSeller.marriageContractNotary = '';
      newSeller.marriageContractDate = '';
      newSeller.matrimonialRegime = '';
      newSeller.hasRegimeModification = false;
      newSeller.modificationNotary = '';
      newSeller.regimeModificationDate = '';
      newSeller.newRegime = '';
      newSeller.divorceJudgmentDate = '';
      newSeller.divorceCourt = '';
      newSeller.spouseDeathDate = '';
      newSeller.spouseDeathPlace = '';
    } else if (value === "Veuf(ve)") {
      // Reset mariage, divorce, PACS
      newSeller.marriageDate = '';
      newSeller.marriageCity = '';
      newSeller.marriagePostalCode = '';
      newSeller.hasMarriageContract = false;
      newSeller.marriageContractNotary = '';
      newSeller.marriageContractDate = '';
      newSeller.matrimonialRegime = '';
      newSeller.hasRegimeModification = false;
      newSeller.modificationNotary = '';
      newSeller.regimeModificationDate = '';
      newSeller.newRegime = '';
      newSeller.divorceJudgmentDate = '';
      newSeller.divorceCourt = '';
      newSeller.pacsDate = '';
      newSeller.pacsCourt = '';
      newSeller.pacsCityHall = '';
      newSeller.hasPacsNotary = false;
      newSeller.pacsNotaryAddress = '';
      newSeller.pacsRegime = '';
    }

    // Mettre à jour le state
    const newSellers = [...sellers];
    newSellers[index] = newSeller;
    setSellers(newSellers);

    // MAJ BDD AVEC TOUS LES CHAMPS RESET
    updateSellerAllFields(index, newSeller);
  };

  // --- UI inchangée ---
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Description Vendeur
            {sellers.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                - {sellers.length} vendeur{sellers.length > 1 ? 's' : ''}
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
            {sellers.map((seller, index) => {
              const isProtectedPerson = seller.personTypeId === "Personne Physique sous protection";
              const isLegalEntity = seller.personTypeId === "Personne Morale";
              const isDecisionMaker = seller.personTypeId === "Personne Physique Décisionnaire";

              const isSingle = seller.maritalStatusId === "Célibataire";
              const isMarried = seller.maritalStatusId === "Marié(e)";
              const isDivorced = seller.maritalStatusId === "Divorcé(e)";
              const isSeparated = seller.maritalStatusId === "Séparé de corps";
              const isPacsed = seller.maritalStatusId === "Pacsé(e)";
              const isWidowed = seller.maritalStatusId === "Veuf(ve)";

              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Vendeur {index + 1}
                      {seller.firstName && seller.lastName && (
                        <span className="ml-2 text-sm text-gray-500">
                          - {seller.firstName} {seller.lastName}
                        </span>
                      )}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => removeSeller(e, index)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                      title="Supprimer le vendeur"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Informations personnelles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={seller.lastName}
                          onChange={(e) => updateSeller(index, 'lastName', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Prénom
                        </label>
                        <input
                          type="text"
                          value={seller.firstName}
                          onChange={(e) => updateSeller(index, 'firstName', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Adresse
                        </label>
                        <input
                          type="text"
                          value={seller.address}
                          onChange={(e) => updateSeller(index, 'address', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ville
                        </label>
                        <input
                          type="text"
                          value={seller.city}
                          onChange={(e) => updateSeller(index, 'city', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Code postal
                        </label>
                        <input
                          type="text"
                          value={seller.postalCode}
                          onChange={(e) => updateSeller(index, 'postalCode', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={seller.phone}
                          onChange={(e) => updateSeller(index, 'phone', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          value={seller.email}
                          onChange={(e) => updateSeller(index, 'email', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Profession
                        </label>
                        <input
                          type="text"
                          value={seller.profession}
                          onChange={(e) => updateSeller(index, 'profession', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Lieu de travail
                        </label>
                        <input
                          type="text"
                          value={seller.workplace}
                          onChange={(e) => updateSeller(index, 'workplace', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Situation familiale */}
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Situation Familiale</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Type de personne
                          </label>
                          <select
                            value={seller.personTypeId || ''}
                            onChange={e => handlePersonTypeChange(index, e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Sélectionnez un type</option>
                            {PERSON_TYPE_OPTIONS.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                      
                        {isLegalEntity && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Forme juridique
                              </label>
                              <input
                                type="text"
                                value={seller.companyLegalForm}
                                onChange={(e) => updateSeller(index, 'companyLegalForm', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Numéro SIRET
                              </label>
                              <input
                                type="text"
                                value={seller.siretNumber}
                                onChange={(e) => updateSeller(index, 'siretNumber', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Adresse de l'entreprise
                              </label>
                              <input
                                type="text"
                                value={seller.companyAddress}
                                onChange={(e) => updateSeller(index, 'companyAddress', e.target.value)}
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
                                  value={seller.companyPostalCode}
                                  onChange={(e) => updateSeller(index, 'companyPostalCode', e.target.value)}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Ville
                                </label>
                                <input
                                  type="text"
                                  value={seller.companyCity}
                                  onChange={(e) => updateSeller(index, 'companyCity', e.target.value)}
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
                                value={seller.childrenCount || ''}
                                onChange={e => updateSeller(index, 'childrenCount', parseInt(e.target.value) || 0)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Commentaires
                              </label>
                              <textarea
                                value={seller.childrenComments}
                                onChange={e => updateSeller(index, 'childrenComments', e.target.value)}
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
                                value={seller.maritalStatusId || ''}
                                onChange={e => handleMaritalStatusChange(index, e.target.value)}
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
                                      value={seller.marriageDate}
                                      onChange={e => updateSeller(index, 'marriageDate', e.target.value)}
                                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Commune
                                    </label>
                                    <input
                                      type="text"
                                      value={seller.marriageCity}
                                      onChange={e => updateSeller(index, 'marriageCity', e.target.value)}
                                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Code postal
                                    </label>
                                    <input
                                      type="text"
                                      value={seller.marriagePostalCode}
                                      onChange={e => updateSeller(index, 'marriagePostalCode', e.target.value)}
                                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={`hasMarriageContract-${index}`}
                                      checked={seller.hasMarriageContract}
                                      onChange={e => updateSeller(index, 'hasMarriageContract', e.target.checked)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`hasMarriageContract-${index}`} className="ml-2 block text-sm text-gray-700">
                                      Contrat de mariage
                                    </label>
                                  </div>
                                  {seller.hasMarriageContract && (
                                    <div className="space-y-4 ml-6">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Ville du notaire
                                        </label>
                                        <input
                                          type="text"
                                          value={seller.marriageContractNotary}
                                          onChange={e => updateSeller(index, 'marriageContractNotary', e.target.value)}
                                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Date
                                        </label>
                                        <input
                                          type="date"
                                          value={seller.marriageContractDate}
                                          onChange={e => updateSeller(index, 'marriageContractDate', e.target.value)}
                                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Régime adopté
                                        </label>
                                        <input
                                          type="text"
                                          value={seller.matrimonialRegime}
                                          onChange={e => updateSeller(index, 'matrimonialRegime', e.target.value)}
                                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                      <div className="flex items-center">
                                        <input
                                          type="checkbox"
                                          id={`hasRegimeModification-${index}`}
                                          checked={seller.hasRegimeModification}
                                          onChange={e => updateSeller(index, 'hasRegimeModification', e.target.checked)}
                                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`hasRegimeModification-${index}`} className="ml-2 block text-sm text-gray-700">
                                          Modification du régime
                                        </label>
                                      </div>
                                      {seller.hasRegimeModification && (
                                        <div className="space-y-4 ml-6">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                              Nouveau régime
                                            </label>
                                            <input
                                              type="text"
                                              value={seller.newRegime}
                                              onChange={e => updateSeller(index, 'newRegime', e.target.value)}
                                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                              Date d'homologation
                                            </label>
                                            <input
                                              type="date"
                                              value={seller.regimeModificationDate}
                                              onChange={e => updateSeller(index, 'regimeModificationDate', e.target.value)}
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
                                    value={seller.divorceJudgmentDate}
                                    onChange={e => updateSeller(index, 'divorceJudgmentDate', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Tribunal
                                  </label>
                                  <input
                                    type="text"
                                    value={seller.divorceCourt}
                                    onChange={e => updateSeller(index, 'divorceCourt', e.target.value)}
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
                                    value={seller.pacsDate}
                                    onChange={e => updateSeller(index, 'pacsDate', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Tribunal de
                                  </label>
                                  <input
                                    type="text"
                                    value={seller.pacsCourt}
                                    onChange={e => updateSeller(index, 'pacsCourt', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Mairie
                                  </label>
                                  <input
                                    type="text"
                                    value={seller.pacsCityHall}
                                    onChange={e => updateSeller(index, 'pacsCityHall', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`hasPacsNotary-${index}`}
                                    checked={seller.hasPacsNotary}
                                    onChange={e => updateSeller(index, 'hasPacsNotary', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label htmlFor={`hasPacsNotary-${index}`} className="ml-2 block text-sm text-gray-700">
                                    PACS chez un notaire
                                  </label>
                                </div>
                                {seller.hasPacsNotary && (
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Adresse du notaire
                                    </label>
                                    <input
                                      type="text"
                                      value={seller.pacsNotaryAddress}
                                      onChange={e => updateSeller(index, 'pacsNotaryAddress', e.target.value)}
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
                                    value={seller.pacsRegime}
                                    onChange={e => updateSeller(index, 'pacsRegime', e.target.value)}
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
                                    value={seller.spouseDeathDate}
                                    onChange={e => updateSeller(index, 'spouseDeathDate', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Lieu de décès du conjoint
                                  </label>
                                  <input
                                    type="text"
                                    value={seller.spouseDeathPlace}
                                    onChange={e => updateSeller(index, 'spouseDeathPlace', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <button
              type="button"
              onClick={addSeller}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un vendeur
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerInfoV3;
