import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import GeneralInfo from '../components/contact/GeneralInfo';
import PersonalInfo from '../components/contact/PersonalInfo';
import FamilyStatus from '../components/contact/FamilyStatus';
import CurrentHousing from '../components/contact/CurrentHousing';
import ProjectDiscovery from '../components/contact/ProjectDiscovery';
import { supabase } from '../lib/supabase';

const NewContact = () => {
  // États pour GeneralInfo
  const [source, setSource] = useState('');

  // États pour PersonalInfo
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [transportMeans, setTransportMeans] = useState<string>('');

  // États pour FamilyStatus - STOCKAGE EN TEXTE
  const [personTypeId, setPersonTypeId] = useState<string>('');
  const [maritalStatusId, setMaritalStatusId] = useState<string>('');
  const [childrenCount, setChildrenCount] = useState(0);
  const [childrenComments, setChildrenComments] = useState('');
  
  // États pour l'entreprise
  const [companyLegalForm, setCompanyLegalForm] = useState('');
  const [siretNumber, setSiretNumber] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPostalCode, setCompanyPostalCode] = useState('');
  const [companyCity, setCompanyCity] = useState('');
  
  // États pour le mariage
  const [marriageDate, setMarriageDate] = useState('');
  const [marriageCity, setMarriageCity] = useState('');
  const [marriagePostalCode, setMarriagePostalCode] = useState('');
  const [hasMarriageContract, setHasMarriageContract] = useState(false);
  const [marriageContractNotary, setMarriageContractNotary] = useState('');
  const [marriageContractDate, setMarriageContractDate] = useState('');
  const [matrimonialRegime, setMatrimonialRegime] = useState('');
  const [hasRegimeModification, setHasRegimeModification] = useState(false);
  const [modificationNotary, setModificationNotary] = useState('');
  const [regimeModificationDate, setRegimeModificationDate] = useState('');
  const [newRegime, setNewRegime] = useState('');
  
  // États pour le divorce
  const [divorceJudgmentDate, setDivorceJudgmentDate] = useState('');
  const [divorceCourt, setDivorceCourt] = useState('');
  
  // États pour le PACS
  const [pacsDate, setPacsDate] = useState('');
  const [pacsCourt, setPacsCourt] = useState('');
  const [pacsCityHall, setPacsCityHall] = useState('');
  const [hasPacsNotary, setHasPacsNotary] = useState(false);
  const [pacsNotaryAddress, setPacsNotaryAddress] = useState('');
  const [pacsRegime, setPacsRegime] = useState('');
  
  // États pour le veuvage
  const [spouseDeathDate, setSpouseDeathDate] = useState('');
  const [spouseDeathPlace, setSpouseDeathPlace] = useState('');

  // États pour CurrentHousing
  const [agencyDiscoverySource, setAgencyDiscoverySource] = useState('');
  const [currentHousingType, setCurrentHousingType] = useState('');
  const [surfaceArea, setSurfaceArea] = useState(0);
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [housingStatus, setHousingStatus] = useState('');
  
  // Champs propriétaire
  const [propertySince, setPropertySince] = useState('');
  const [sellingForBuying, setSellingForBuying] = useState(false);
  const [plannedAction, setPlannedAction] = useState('');
  
  // Champs locataire
  const [rentingSince, setRentingSince] = useState('');
  const [rentAmount, setRentAmount] = useState(0);
  const [firstTimeBuyer, setFirstTimeBuyer] = useState(false);

  // États pour ProjectDiscovery
  const [projectContext, setProjectContext] = useState('');
  const [needsAndMotivations, setNeedsAndMotivations] = useState('');
  const [possibleCompromises, setPossibleCompromises] = useState('');
  const [financing, setFinancing] = useState('');

  // États pour la gestion du formulaire
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentContactId, setCurrentContactId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Effet pour détecter les changements
  useEffect(() => {
    setHasChanges(true);
  }, [
    source,
    lastName,
    firstName,
    address,
    city,
    postalCode,
    phone,
    email,
    profession,
    workplace,
    transportMeans,
    personTypeId,
    maritalStatusId,
    childrenCount,
    childrenComments,
    companyLegalForm,
    siretNumber,
    companyAddress,
    companyPostalCode,
    companyCity,
    marriageDate,
    marriageCity,
    marriagePostalCode,
    hasMarriageContract,
    marriageContractNotary,
    marriageContractDate,
    matrimonialRegime,
    hasRegimeModification,
    modificationNotary,
    regimeModificationDate,
    newRegime,
    divorceJudgmentDate,
    divorceCourt,
    pacsDate,
    pacsCourt,
    pacsCityHall,
    hasPacsNotary,
    pacsNotaryAddress,
    pacsRegime,
    spouseDeathDate,
    spouseDeathPlace,
    agencyDiscoverySource,
    currentHousingType,
    surfaceArea,
    strengths,
    weaknesses,
    housingStatus,
    propertySince,
    sellingForBuying,
    plannedAction,
    rentingSince,
    rentAmount,
    firstTimeBuyer,
    projectContext,
    needsAndMotivations,
    possibleCompromises,
    financing
  ]);

  // Effet pour sauvegarder lors de la fermeture de la page
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (hasChanges && source) {
        e.preventDefault();
        e.returnValue = '';
        await saveContact();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges, source]);

  const resetForm = () => {
    setSource('');
    setLastName('');
    setFirstName('');
    setAddress('');
    setCity('');
    setPostalCode('');
    setPhone('');
    setEmail('');
    setProfession('');
    setWorkplace('');
    setTransportMeans('');
    setPersonTypeId('');
    setMaritalStatusId('');
    setChildrenCount(0);
    setChildrenComments('');
    setCompanyLegalForm('');
    setSiretNumber('');
    setCompanyAddress('');
    setCompanyPostalCode('');
    setCompanyCity('');
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
    setAgencyDiscoverySource('');
    setCurrentHousingType('');
    setSurfaceArea(0);
    setStrengths('');
    setWeaknesses('');
    setHousingStatus('');
    setPropertySince('');
    setSellingForBuying(false);
    setPlannedAction('');
    setRentingSince('');
    setRentAmount(0);
    setFirstTimeBuyer(false);
    setProjectContext('');
    setNeedsAndMotivations('');
    setPossibleCompromises('');
    setFinancing('');
    setCurrentContactId(null);
    setError('');
    setSuccess('');
    setHasChanges(false);
  };

  const saveContact = async (): Promise<boolean> => {
    if (!source) return false;

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Utilisateur non connecté');

      const contactData = {
        source,
        agent_id: user.id,
        last_name: lastName,
        first_name: firstName,
        address,
        city,
        postal_code: postalCode,
        phone,
        email,
        profession,
        workplace,
        transport_means: transportMeans,
        // STOCKAGE DIRECT EN TEXTE - pas de parseInt()
        type_personne_id: personTypeId || null,
        marital_status_id: maritalStatusId || null,
        children_count: childrenCount,
        children_comments: childrenComments,
        company_legal_form: companyLegalForm,
        siret_number: siretNumber,
        company_address: companyAddress,
        company_postal_code: companyPostalCode,
        company_city: companyCity,
        marriage_date: marriageDate || null,
        marriage_city: marriageCity,
        marriage_postal_code: marriagePostalCode,
        marriage_contract: hasMarriageContract,
        marriage_contract_notary: marriageContractNotary,
        marriage_contract_date: marriageContractDate || null,
        matrimonial_regime: matrimonialRegime,
        regime_modification: hasRegimeModification,
        modification_notary: modificationNotary,
        regime_modification_date: regimeModificationDate || null,
        new_regime: newRegime,
        divorce_judgment_date: divorceJudgmentDate || null,
        divorce_court: divorceCourt,
        pacs_date: pacsDate || null,
        pacs_court: pacsCourt,
        pacs_city_hall: pacsCityHall,
        pacs_notary: hasPacsNotary,
        pacs_notary_address: pacsNotaryAddress,
        pacs_regime: pacsRegime,
        spouse_death_date: spouseDeathDate || null,
        spouse_death_place: spouseDeathPlace,
        agency_discovery_source: agencyDiscoverySource,
        current_housing_type: currentHousingType,
        surface_area: surfaceArea || null,
        strengths,
        weaknesses,
        housing_status: housingStatus,
        property_since: propertySince || null,
        selling_for_buying: sellingForBuying,
        planned_action: plannedAction,
        renting_since: rentingSince || null,
        rent_amount: rentAmount || null,
        first_time_buyer: firstTimeBuyer,
        project_context: projectContext,
        needs_and_motivations: needsAndMotivations,
        possible_compromises: possibleCompromises,
        financing: financing
      };

      let contactResult;
      if (currentContactId) {
        contactResult = await supabase
          .from('contact')
          .update(contactData)
          .eq('id', currentContactId)
          .select()
          .single();
      } else {
        contactResult = await supabase
          .from('contact')
          .insert(contactData)
          .select()
          .single();
      }

      if (contactResult.error) throw contactResult.error;

      const contactId = contactResult.data.id;
      setCurrentContactId(contactId);
      setSuccess('Contact sauvegardé avec succès !');
      setHasChanges(false);
      return true;
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    await saveContact();
    setLoading(false);
  };

  const handleNewContact = async () => {
    setLoading(true);
    if (hasChanges && source) {
      const saveSuccess = await saveContact();
      if (saveSuccess) {
        resetForm();
      }
    } else {
      resetForm();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête fixe */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {currentContactId ? 'Modification du contact' : 'Nouveau Contact'}
            </h1>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleNewContact}
                disabled={loading}
                className={`flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Nouveau contact
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>

          {/* Messages d'erreur et de succès dans l'en-tête */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {success}
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal avec padding pour compenser l'en-tête fixe */}
      <div className="px-6 py-6">
        <form className="space-y-6">
          <GeneralInfo
            source={source}
            setSource={setSource}
          />

          <PersonalInfo
            lastName={lastName}
            setLastName={setLastName}
            firstName={firstName}
            setFirstName={setFirstName}
            address={address}
            setAddress={setAddress}
            city={city}
            setCity={setCity}
            postalCode={postalCode}
            setPostalCode={setPostalCode}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            profession={profession}
            setProfession={setProfession}
            workplace={workplace}
            setWorkplace={setWorkplace}
            transportMeans={transportMeans}
            setTransportMeans={setTransportMeans}
          />

          <FamilyStatus
            personTypeId={personTypeId}
            setPersonTypeId={setPersonTypeId}
            maritalStatusId={maritalStatusId}
            setMaritalStatusId={setMaritalStatusId}
            childrenCount={childrenCount}
            setChildrenCount={setChildrenCount}
            childrenComments={childrenComments}
            setChildrenComments={setChildrenComments}
            companyLegalForm={companyLegalForm}
            setCompanyLegalForm={setCompanyLegalForm}
            siretNumber={siretNumber}
            setSiretNumber={setSiretNumber}
            companyAddress={companyAddress}
            setCompanyAddress={setCompanyAddress}
            companyPostalCode={companyPostalCode}
            setCompanyPostalCode={setCompanyPostalCode}
            companyCity={companyCity}
            setCompanyCity={setCompanyCity}
            marriageDate={marriageDate}
            setMarriageDate={setMarriageDate}
            marriageCity={marriageCity}
            setMarriageCity={setMarriageCity}
            marriagePostalCode={marriagePostalCode}
            setMarriagePostalCode={setMarriagePostalCode}
            hasMarriageContract={hasMarriageContract}
            setHasMarriageContract={setHasMarriageContract}
            marriageContractNotary={marriageContractNotary}
            setMarriageContractNotary={setMarriageContractNotary}
            marriageContractDate={marriageContractDate}
            setMarriageContractDate={setMarriageContractDate}
            matrimonialRegime={matrimonialRegime}
            setMatrimonialRegime={setMatrimonialRegime}
            hasRegimeModification={hasRegimeModification}
            setHasRegimeModification={setHasRegimeModification}
            modificationNotary={modificationNotary}
            setModificationNotary={setModificationNotary}
            regimeModificationDate={regimeModificationDate}
            setRegimeModificationDate={setRegimeModificationDate}
            newRegime={newRegime}
            setNewRegime={setNewRegime}
            divorceJudgmentDate={divorceJudgmentDate}
            setDivorceJudgmentDate={setDivorceJudgmentDate}
            divorceCourt={divorceCourt}
            setDivorceCourt={setDivorceCourt}
            pacsDate={pacsDate}
            setPacsDate={setPacsDate}
            pacsCourt={pacsCourt}
            setPacsCourt={setPacsCourt}
            pacsCityHall={pacsCityHall}
            setPacsCityHall={setPacsCityHall}
            hasPacsNotary={hasPacsNotary}
            setHasPacsNotary={setHasPacsNotary}
            pacsNotaryAddress={pacsNotaryAddress}
            setPacsNotaryAddress={setPacsNotaryAddress}
            pacsRegime={pacsRegime}
            setPacsRegime={setPacsRegime}
            spouseDeathDate={spouseDeathDate}
            setSpouseDeathDate={setSpouseDeathDate}
            spouseDeathPlace={spouseDeathPlace}
            setSpouseDeathPlace={setSpouseDeathPlace}
          />

          <CurrentHousing
            agencyDiscoverySource={agencyDiscoverySource}
            setAgencyDiscoverySource={setAgencyDiscoverySource}
            currentHousingType={currentHousingType}
            setCurrentHousingType={setCurrentHousingType}
            surfaceArea={surfaceArea}
            setSurfaceArea={setSurfaceArea}
            strengths={strengths}
            setStrengths={setStrengths}
            weaknesses={weaknesses}
            setWeaknesses={setWeaknesses}
            housingStatus={housingStatus}
            setHousingStatus={setHousingStatus}
            propertySince={propertySince}
            setPropertySince={setPropertySince}
            sellingForBuying={sellingForBuying}
            setSellingForBuying={setSellingForBuying}
            plannedAction={plannedAction}
            setPlannedAction={setPlannedAction}
            rentingSince={rentingSince}
            setRentingSince={setRentingSince}
            rentAmount={rentAmount}
            setRentAmount={setRentAmount}
            firstTimeBuyer={firstTimeBuyer}
            setFirstTimeBuyer={setFirstTimeBuyer}
          />

          <ProjectDiscovery
            projectContext={projectContext}
            setProjectContext={setProjectContext}
            needsAndMotivations={needsAndMotivations}
            setNeedsAndMotivations={setNeedsAndMotivations}
            possibleCompromises={possibleCompromises}
            setPossibleCompromises={setPossibleCompromises}
            financing={financing}
            setFinancing={setFinancing}
          />
        </form>
      </div>
    </div>
  );
};

export default NewContact;