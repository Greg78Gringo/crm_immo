import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Eye, EyeOff } from 'lucide-react';
import GeneralInfo from '../components/contact/GeneralInfo';
import PersonalInfo from '../components/contact/PersonalInfo';
import FamilyStatus from '../components/contact/FamilyStatus';
import CurrentHousing from '../components/contact/CurrentHousing';
import ProjectDiscovery from '../components/contact/ProjectDiscovery';
import { supabase } from '../lib/supabase';

const ContactView = () => {
  const { contactId, mode } = useParams<{ contactId: string; mode?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isOwner, setIsOwner] = useState(false);
  const [isEditMode, setIsEditMode] = useState(mode === 'edit');

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

  // États pour FamilyStatus
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

  // Charger les données du contact
  useEffect(() => {
    const loadContact = async () => {
      if (!contactId) return;

      setLoading(true);
      setError('');

      try {
        // Récupérer l'utilisateur actuel
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (user) {
          setCurrentUserId(user.id);
        }

        // Charger le contact
        const { data: contact, error: contactError } = await supabase
          .from('contact')
          .select('*')
          .eq('id', contactId)
          .single();

        if (contactError) throw contactError;
        if (!contact) throw new Error('Contact non trouvé');

        // Vérifier si l'utilisateur est propriétaire du contact
        setIsOwner(contact.agent_id === user?.id);

        // Remplir tous les champs
        setSource(contact.source || '');
        setLastName(contact.last_name || '');
        setFirstName(contact.first_name || '');
        setAddress(contact.address || '');
        setCity(contact.city || '');
        setPostalCode(contact.postal_code || '');
        setPhone(contact.phone || '');
        setEmail(contact.email || '');
        setProfession(contact.profession || '');
        setWorkplace(contact.workplace || '');
        setTransportMeans(contact.transport_means || '');
        setPersonTypeId(contact.type_personne_id || '');
        setMaritalStatusId(contact.marital_status_id || '');
        setChildrenCount(contact.children_count || 0);
        setChildrenComments(contact.children_comments || '');
        setCompanyLegalForm(contact.company_legal_form || '');
        setSiretNumber(contact.siret_number || '');
        setCompanyAddress(contact.company_address || '');
        setCompanyPostalCode(contact.company_postal_code || '');
        setCompanyCity(contact.company_city || '');
        setMarriageDate(contact.marriage_date || '');
        setMarriageCity(contact.marriage_city || '');
        setMarriagePostalCode(contact.marriage_postal_code || '');
        setHasMarriageContract(contact.marriage_contract || false);
        setMarriageContractNotary(contact.marriage_contract_notary || '');
        setMarriageContractDate(contact.marriage_contract_date || '');
        setMatrimonialRegime(contact.matrimonial_regime || '');
        setHasRegimeModification(contact.regime_modification || false);
        setModificationNotary(contact.modification_notary || '');
        setRegimeModificationDate(contact.regime_modification_date || '');
        setNewRegime(contact.new_regime || '');
        setDivorceJudgmentDate(contact.divorce_judgment_date || '');
        setDivorceCourt(contact.divorce_court || '');
        setPacsDate(contact.pacs_date || '');
        setPacsCourt(contact.pacs_court || '');
        setPacsCityHall(contact.pacs_city_hall || '');
        setHasPacsNotary(contact.pacs_notary || false);
        setPacsNotaryAddress(contact.pacs_notary_address || '');
        setPacsRegime(contact.pacs_regime || '');
        setSpouseDeathDate(contact.spouse_death_date || '');
        setSpouseDeathPlace(contact.spouse_death_place || '');
        setAgencyDiscoverySource(contact.agency_discovery_source || '');
        setCurrentHousingType(contact.current_housing_type || '');
        setSurfaceArea(contact.surface_area || 0);
        setStrengths(contact.strengths || '');
        setWeaknesses(contact.weaknesses || '');
        setHousingStatus(contact.housing_status || '');
        setPropertySince(contact.property_since || '');
        setSellingForBuying(contact.selling_for_buying || false);
        setPlannedAction(contact.planned_action || '');
        setRentingSince(contact.renting_since || '');
        setRentAmount(contact.rent_amount || 0);
        setFirstTimeBuyer(contact.first_time_buyer || false);
        setProjectContext(contact.project_context || '');
        setNeedsAndMotivations(contact.needs_and_motivations || '');
        setPossibleCompromises(contact.possible_compromises || '');
        setFinancing(contact.financing || '');

      } catch (err: any) {
        console.error('Erreur lors du chargement du contact:', err);
        setError(err.message || 'Erreur lors du chargement du contact');
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [contactId]);

  const handleSave = async () => {
    if (!contactId || !isOwner) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const contactData = {
        source,
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

      const { error: updateError } = await supabase
        .from('contact')
        .update(contactData)
        .eq('id', contactId);

      if (updateError) throw updateError;

      setSuccess('Contact mis à jour avec succès !');
      setIsEditMode(false);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    if (isOwner) {
      setIsEditMode(!isEditMode);
      setError('');
      setSuccess('');
    }
  };

  const getDisplayName = () => {
    const name = `${firstName} ${lastName}`.trim();
    return name || 'Contact sans nom';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête fixe */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/contacts')}
                className="mr-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {isEditMode ? 'Modification du contact' : 'Fiche contact'}
                </h1>
                <p className="text-sm text-gray-600">
                  {getDisplayName()}
                  {!isOwner && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Lecture seule
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              {isOwner && (
                <>
                  {isEditMode ? (
                    <>
                      <button
                        onClick={() => setIsEditMode(false)}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        <EyeOff className="h-5 w-5 mr-2" />
                        Annuler
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={toggleEditMode}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="h-5 w-5 mr-2" />
                      Modifier
                    </button>
                  )}
                </>
              )}
              
              {!isOwner && (
                <div className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-md">
                  <Eye className="h-5 w-5 mr-2" />
                  Consultation
                </div>
              )}
            </div>
          </div>

          {/* Messages d'erreur et de succès */}
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

      {/* Contenu principal */}
      <div className="px-6 py-6">
        <div className="space-y-6">
          <GeneralInfo
            source={source}
            setSource={isEditMode && isOwner ? setSource : () => {}}
            readOnly={!isEditMode || !isOwner}
          />

          <PersonalInfo
            lastName={lastName}
            setLastName={isEditMode && isOwner ? setLastName : () => {}}
            firstName={firstName}
            setFirstName={isEditMode && isOwner ? setFirstName : () => {}}
            address={address}
            setAddress={isEditMode && isOwner ? setAddress : () => {}}
            city={city}
            setCity={isEditMode && isOwner ? setCity : () => {}}
            postalCode={postalCode}
            setPostalCode={isEditMode && isOwner ? setPostalCode : () => {}}
            phone={phone}
            setPhone={isEditMode && isOwner ? setPhone : () => {}}
            email={email}
            setEmail={isEditMode && isOwner ? setEmail : () => {}}
            profession={profession}
            setProfession={isEditMode && isOwner ? setProfession : () => {}}
            workplace={workplace}
            setWorkplace={isEditMode && isOwner ? setWorkplace : () => {}}
            transportMeans={transportMeans}
            setTransportMeans={isEditMode && isOwner ? setTransportMeans : () => {}}
            readOnly={!isEditMode || !isOwner}
          />

          <FamilyStatus
            personTypeId={personTypeId}
            setPersonTypeId={isEditMode && isOwner ? setPersonTypeId : () => {}}
            maritalStatusId={maritalStatusId}
            setMaritalStatusId={isEditMode && isOwner ? setMaritalStatusId : () => {}}
            childrenCount={childrenCount}
            setChildrenCount={isEditMode && isOwner ? setChildrenCount : () => {}}
            childrenComments={childrenComments}
            setChildrenComments={isEditMode && isOwner ? setChildrenComments : () => {}}
            companyLegalForm={companyLegalForm}
            setCompanyLegalForm={isEditMode && isOwner ? setCompanyLegalForm : () => {}}
            siretNumber={siretNumber}
            setSiretNumber={isEditMode && isOwner ? setSiretNumber : () => {}}
            companyAddress={companyAddress}
            setCompanyAddress={isEditMode && isOwner ? setCompanyAddress : () => {}}
            companyPostalCode={companyPostalCode}
            setCompanyPostalCode={isEditMode && isOwner ? setCompanyPostalCode : () => {}}
            companyCity={companyCity}
            setCompanyCity={isEditMode && isOwner ? setCompanyCity : () => {}}
            marriageDate={marriageDate}
            setMarriageDate={isEditMode && isOwner ? setMarriageDate : () => {}}
            marriageCity={marriageCity}
            setMarriageCity={isEditMode && isOwner ? setMarriageCity : () => {}}
            marriagePostalCode={marriagePostalCode}
            setMarriagePostalCode={isEditMode && isOwner ? setMarriagePostalCode : () => {}}
            hasMarriageContract={hasMarriageContract}
            setHasMarriageContract={isEditMode && isOwner ? setHasMarriageContract : () => {}}
            marriageContractNotary={marriageContractNotary}
            setMarriageContractNotary={isEditMode && isOwner ? setMarriageContractNotary : () => {}}
            marriageContractDate={marriageContractDate}
            setMarriageContractDate={isEditMode && isOwner ? setMarriageContractDate : () => {}}
            matrimonialRegime={matrimonialRegime}
            setMatrimonialRegime={isEditMode && isOwner ? setMatrimonialRegime : () => {}}
            hasRegimeModification={hasRegimeModification}
            setHasRegimeModification={isEditMode && isOwner ? setHasRegimeModification : () => {}}
            modificationNotary={modificationNotary}
            setModificationNotary={isEditMode && isOwner ? setModificationNotary : () => {}}
            regimeModificationDate={regimeModificationDate}
            setRegimeModificationDate={isEditMode && isOwner ? setRegimeModificationDate : () => {}}
            newRegime={newRegime}
            setNewRegime={isEditMode && isOwner ? setNewRegime : () => {}}
            divorceJudgmentDate={divorceJudgmentDate}
            setDivorceJudgmentDate={isEditMode && isOwner ? setDivorceJudgmentDate : () => {}}
            divorceCourt={divorceCourt}
            setDivorceCourt={isEditMode && isOwner ? setDivorceCourt : () => {}}
            pacsDate={pacsDate}
            setPacsDate={isEditMode && isOwner ? setPacsDate : () => {}}
            pacsCourt={pacsCourt}
            setPacsCourt={isEditMode && isOwner ? setPacsCourt : () => {}}
            pacsCityHall={pacsCityHall}
            setPacsCityHall={isEditMode && isOwner ? setPacsCityHall : () => {}}
            hasPacsNotary={hasPacsNotary}
            setHasPacsNotary={isEditMode && isOwner ? setHasPacsNotary : () => {}}
            pacsNotaryAddress={pacsNotaryAddress}
            setPacsNotaryAddress={isEditMode && isOwner ? setPacsNotaryAddress : () => {}}
            pacsRegime={pacsRegime}
            setPacsRegime={isEditMode && isOwner ? setPacsRegime : () => {}}
            spouseDeathDate={spouseDeathDate}
            setSpouseDeathDate={isEditMode && isOwner ? setSpouseDeathDate : () => {}}
            spouseDeathPlace={spouseDeathPlace}
            setSpouseDeathPlace={isEditMode && isOwner ? setSpouseDeathPlace : () => {}}
            readOnly={!isEditMode || !isOwner}
          />

          <CurrentHousing
            agencyDiscoverySource={agencyDiscoverySource}
            setAgencyDiscoverySource={isEditMode && isOwner ? setAgencyDiscoverySource : () => {}}
            currentHousingType={currentHousingType}
            setCurrentHousingType={isEditMode && isOwner ? setCurrentHousingType : () => {}}
            surfaceArea={surfaceArea}
            setSurfaceArea={isEditMode && isOwner ? setSurfaceArea : () => {}}
            strengths={strengths}
            setStrengths={isEditMode && isOwner ? setStrengths : () => {}}
            weaknesses={weaknesses}
            setWeaknesses={isEditMode && isOwner ? setWeaknesses : () => {}}
            housingStatus={housingStatus}
            setHousingStatus={isEditMode && isOwner ? setHousingStatus : () => {}}
            propertySince={propertySince}
            setPropertySince={isEditMode && isOwner ? setPropertySince : () => {}}
            sellingForBuying={sellingForBuying}
            setSellingForBuying={isEditMode && isOwner ? setSellingForBuying : () => {}}
            plannedAction={plannedAction}
            setPlannedAction={isEditMode && isOwner ? setPlannedAction : () => {}}
            rentingSince={rentingSince}
            setRentingSince={isEditMode && isOwner ? setRentingSince : () => {}}
            rentAmount={rentAmount}
            setRentAmount={isEditMode && isOwner ? setRentAmount : () => {}}
            firstTimeBuyer={firstTimeBuyer}
            setFirstTimeBuyer={isEditMode && isOwner ? setFirstTimeBuyer : () => {}}
            readOnly={!isEditMode || !isOwner}
          />

          <ProjectDiscovery
            projectContext={projectContext}
            setProjectContext={isEditMode && isOwner ? setProjectContext : () => {}}
            needsAndMotivations={needsAndMotivations}
            setNeedsAndMotivations={isEditMode && isOwner ? setNeedsAndMotivations : () => {}}
            possibleCompromises={possibleCompromises}
            setPossibleCompromises={isEditMode && isOwner ? setPossibleCompromises : () => {}}
            financing={financing}
            setFinancing={isEditMode && isOwner ? setFinancing : () => {}}
            readOnly={!isEditMode || !isOwner}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactView;