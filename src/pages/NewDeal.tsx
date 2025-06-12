import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import DealBasicInfo from '../components/DealBasicInfo';
import PropertyDetails from '../components/PropertyDetails';
import PropertyPrice from '../components/PropertyPrice';
import PropertyTitle from '../components/PropertyTitle';
import FurnitureList from '../components/FurnitureList';
import OtherSalesMode from '../components/OtherSalesMode';
import SinistreEnCours from '../components/SinistreEnCours';
import ListeTravauxRealises from '../components/ListeTravauxRealises';
import SellerInfoV3 from '../components/SellerInfoV3';
import { PlusCircle } from 'lucide-react';

const NewDeal = () => {
  // États pour DealBasicInfo
  const [dealName, setDealName] = useState('');
  const [dealStatus, setDealStatus] = useState('');
  const [dealReason, setDealReason] = useState('');
  const [dealComments, setDealComments] = useState('');

  // États pour PropertyPrice
  const [mandateType, setMandateType] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [agencyCommission, setAgencyCommission] = useState(0);
  const [propertyPriceId, setPropertyPriceId] = useState<string | null>(null);

  // États pour PropertyDetails
  const [propertyType, setPropertyType] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [dpe, setDpe] = useState('');
  const [ges, setGes] = useState('');
  const [roomsCount, setRoomsCount] = useState(0);
  const [bedroomsCount, setBedroomsCount] = useState(0);
  const [livingRoomArea, setLivingRoomArea] = useState(0);
  const [diningRoomArea, setDiningRoomArea] = useState(0);
  const [bathroomsCount, setBathroomsCount] = useState(0);
  const [showerRoomsCount, setShowerRoomsCount] = useState(0);
  const [wcCount, setWcCount] = useState(0);
  const [hasCellar, setHasCellar] = useState(false);
  const [hasPartialBasement, setHasPartialBasement] = useState(false);
  const [hasFullBasement, setHasFullBasement] = useState(false);
  const [hasTerrace, setHasTerrace] = useState(false);
  const [terraceCount, setTerraceCount] = useState(0);
  const [terraceArea, setTerraceArea] = useState(0);
  const [hasGarden, setHasGarden] = useState(false);
  const [gardenArea, setGardenArea] = useState(0);
  const [hasParking, setHasParking] = useState(false);
  const [parkingCount, setParkingCount] = useState(0);
  const [hasBox, setHasBox] = useState(false);
  const [boxCount, setBoxCount] = useState(0);
  const [hasPool, setHasPool] = useState(false);
  const [isPoolPossible, setIsPoolPossible] = useState(false);
  const [hasFireplace, setHasFireplace] = useState(false);
  const [hasAlarm, setHasAlarm] = useState(false);
  const [heatingType, setHeatingType] = useState('');
  const [hasSmokeDetector, setHasSmokeDetector] = useState(false);
  const [hasBuriedFuelTank, setHasBuriedFuelTank] = useState(false);
  const [hasNonBuriedFuelTank, setHasNonBuriedFuelTank] = useState(false);
  const [isSubdivision, setIsSubdivision] = useState(false);
  const [hasExistingAsl, setHasExistingAsl] = useState(false);
  const [hasDissolvedAsl, setHasDissolvedAsl] = useState(false);
  const [hasEasements, setHasEasements] = useState(false);
  const [hasSolarPanels, setHasSolarPanels] = useState(false);
  const [hasFiberOptic, setHasFiberOptic] = useState(false);

  // États pour PropertyTitle
  const [propertyTitle, setPropertyTitle] = useState('');
  const [titleDesignationIdentical, setTitleDesignationIdentical] = useState(false);
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [titleDetails, setTitleDetails] = useState('');

  // État pour les vendeurs - Structure compatible avec SellerInfoV3
  const [sellers, setSellers] = useState<{
    id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    personTypeId: string;
    maritalStatusId: string;
    childrenCount: number;
    childrenComments: string;
    companyLegalForm: string;
    siretNumber: string;
    companyAddress: string;
    companyPostalCode: string;
    companyCity: string;
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
    divorceJudgmentDate: string;
    divorceCourt: string;
    pacsDate: string;
    pacsCourt: string;
    pacsCityHall: string;
    hasPacsNotary: boolean;
    pacsNotaryAddress: string;
    pacsRegime: string;
    spouseDeathDate: string;
    spouseDeathPlace: string;
  }[]>([]);

  // État pour les autres modes de vente
  const [salesModes, setSalesModes] = useState<{
    id?: string;
    mode: string;
    mandateType?: string;
    name: string;
    url: string;
    price: number;
    agencyCommission?: number;
    listingDate: string;
  }[]>([]);

  // État pour la liste du mobilier
  const [furnitureItems, setFurnitureItems] = useState<{
    id?: string;
    nom_mobilier: string;
    prix_mobilier: number;
  }[]>([]);

  // État pour les sinistres en cours
  const [sinistres, setSinistres] = useState<{
    id?: string;
    designation_sinistre: string;
    description_sinistre: string;
    date_declaration: string;
    montant_des_travaux: number;
  }[]>([]);

  // État pour les travaux réalisés
  const [travaux, setTravaux] = useState<{
    id?: string;
    description_travaux: string;
    date_travaux: string;
    sinistre_catastrophe_naturelle: boolean;
    declaration_prealable: boolean;
    permis_construire: boolean;
    nom_entreprise: string;
    adresse_entreprise: string;
    code_postal_entreprise: string;
    ville_entreprise: string;
    nom_assureur: string;
    adresse_assureur: string;
    code_postal_assureur: string;
    ville_assureur: string;
  }[]>([]);

  // États pour la gestion du formulaire
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentDealId, setCurrentDealId] = useState<string | null>(null);
  const [propertyDetailsId, setPropertyDetailsId] = useState<string | null>(null);

  const resetForm = () => {
    setDealName('');
    setDealStatus('');
    setDealReason('');
    setDealComments('');
    setMandateType('');
    setEstimatedPrice(0);
    setDisplayPrice(0);
    setAgencyCommission(0);
    setPropertyPriceId(null);
    setPropertyType('');
    setAddress('');
    setCity('');
    setPostalCode('');
    setDpe('');
    setGes('');
    setRoomsCount(0);
    setBedroomsCount(0);
    setLivingRoomArea(0);
    setDiningRoomArea(0);
    setBathroomsCount(0);
    setShowerRoomsCount(0);
    setWcCount(0);
    setHasCellar(false);
    setHasPartialBasement(false);
    setHasFullBasement(false);
    setHasTerrace(false);
    setTerraceCount(0);
    setTerraceArea(0);
    setHasGarden(false);
    setGardenArea(0);
    setHasParking(false);
    setParkingCount(0);
    setHasBox(false);
    setBoxCount(0);
    setHasPool(false);
    setIsPoolPossible(false);
    setHasFireplace(false);
    setHasAlarm(false);
    setHeatingType('');
    setHasSmokeDetector(false);
    setHasBuriedFuelTank(false);
    setHasNonBuriedFuelTank(false);
    setIsSubdivision(false);
    setHasExistingAsl(false);
    setHasDissolvedAsl(false);
    setHasEasements(false);
    setHasSolarPanels(false);
    setHasFiberOptic(false);
    setPropertyTitle('');
    setTitleDesignationIdentical(false);
    setCurrentDesignation('');
    setTitleDetails('');
    setCurrentDealId(null);
    setPropertyDetailsId(null);
    setSellers([]);
    setSalesModes([]);
    setFurnitureItems([]);
    setSinistres([]);
    setTravaux([]);
    setError('');
    setSuccess('');
  };

  const saveDeal = async (): Promise<boolean> => {
    if (!dealName) {
      setError('Le nom de l\'affaire est obligatoire');
      return false;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Utilisateur non connecté');

      const dealData = {
        name: dealName,
        agent_id: user.id,
        status_id: dealStatus || null,
        reason_id: dealReason || null,
        comments: dealComments || null
      };

      let dealResult;
      if (currentDealId) {
        dealResult = await supabase
          .from('deals')
          .update(dealData)
          .eq('id', currentDealId)
          .select()
          .single();
      } else {
        dealResult = await supabase
          .from('deals')
          .insert(dealData)
          .select()
          .single();
      }

      if (dealResult.error) throw dealResult.error;

      const dealId = dealResult.data.id;
      setCurrentDealId(dealId);

      // Sauvegarder les détails de la propriété seulement s'il y a des données
      if (propertyType || address || city || postalCode || roomsCount > 0 || bedroomsCount > 0 || dpe || ges || propertyTitle) {
        const propertyDetailsData = {
          id: propertyDetailsId || undefined,
          deal_id: dealId,
          property_type_id: propertyType || null,
          address: address || null,
          city: city || null,
          postal_code: postalCode || null,
          dpe: dpe || null,
          ges: ges || null,
          rooms_count: roomsCount || null,
          bedrooms_count: bedroomsCount || null,
          living_room_area: livingRoomArea || null,
          dining_room_area: diningRoomArea || null,
          bathrooms_count: bathroomsCount || null,
          shower_rooms_count: showerRoomsCount || null,
          wc_count: wcCount || null,
          has_cellar: hasCellar,
          has_partial_basement: hasPartialBasement,
          has_full_basement: hasFullBasement,
          has_terrace: hasTerrace,
          terrace_count: terraceCount || null,
          terrace_area: terraceArea || null,
          has_garden: hasGarden,
          garden_area: gardenArea || null,
          has_parking: hasParking,
          parking_count: parkingCount || null,
          has_box: hasBox,
          box_count: boxCount || null,
          has_pool: hasPool,
          is_pool_possible: isPoolPossible,
          has_fireplace: hasFireplace,
          has_alarm: hasAlarm,
          heating_type_id: heatingType || null,
          has_smoke_detector: hasSmokeDetector,
          has_buried_fuel_tank: hasBuriedFuelTank,
          has_non_buried_fuel_tank: hasNonBuriedFuelTank,
          is_subdivision: isSubdivision,
          has_existing_asl: hasExistingAsl,
          has_dissolved_asl: hasDissolvedAsl,
          has_easements: hasEasements,
          has_solar_panels: hasSolarPanels,
          has_fiber_optic: hasFiberOptic,
          property_title: propertyTitle || null,
          title_designation_identical: titleDesignationIdentical,
          current_designation: currentDesignation || null,
          title_details: titleDetails || null
        };

        // Récupérer l'ID existant si on n'en a pas encore
        if (!propertyDetailsId) {
          const { data: existingDetails } = await supabase
            .from('description_bien_principale')
            .select('id')
            .eq('deal_id', dealId)
            .single();

          if (existingDetails) {
            setPropertyDetailsId(existingDetails.id);
            propertyDetailsData.id = existingDetails.id;
          }
        }

        const { data: propertyResult, error: propertyError } = await supabase
          .from('description_bien_principale')
          .upsert(propertyDetailsData)
          .select()
          .single();

        if (propertyError) throw propertyError;
        if (propertyResult) {
          setPropertyDetailsId(propertyResult.id);
        }
      }

      // Sauvegarder les prix du bien
      if (mandateType || estimatedPrice > 0 || displayPrice > 0 || agencyCommission > 0) {
        const priceData = {
          id: propertyPriceId || undefined,
          deal_id: dealId,
          mandate_type: mandateType || null,
          estimated_price: estimatedPrice || null,
          display_price: displayPrice || null,
          agency_commission: agencyCommission || null
        };

        // Récupérer l'ID existant si on n'en a pas encore
        if (!propertyPriceId) {
          const { data: existingPrice } = await supabase
            .from('prix_bien')
            .select('id')
            .eq('deal_id', dealId)
            .single();

          if (existingPrice) {
            setPropertyPriceId(existingPrice.id);
            priceData.id = existingPrice.id;
          }
        }

        const { data: priceResult, error: priceError } = await supabase
          .from('prix_bien')
          .upsert(priceData)
          .select()
          .single();

        if (priceError) throw priceError;
        if (priceResult) {
          setPropertyPriceId(priceResult.id);
        }
      }

      // Sauvegarder les autres modes de vente
      if (salesModes.length > 0) {
        const salesModesData = salesModes.map(mode => ({
          id: mode.id,
          deal_id: dealId,
          mode: mode.mode,
          mandate_type: mode.mandateType,
          name: mode.name,
          url: mode.url,
          price: mode.price,
          agency_commission: mode.agencyCommission,
          listing_date: mode.listingDate
        }));

        const { error: salesModesError } = await supabase
          .from('autre_mode_vente')
          .upsert(salesModesData);

        if (salesModesError) throw salesModesError;
      }

      setSuccess('Affaire sauvegardée avec succès !');
      return true;
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde de l\'affaire');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    await saveDeal();
    setLoading(false);
  };

  const handleNewDeal = async () => {
    setLoading(true);
    if (dealName) {
      const saveSuccess = await saveDeal();
      if (saveSuccess) {
        resetForm();
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {currentDealId ? 'Modification de l\'affaire' : 'Nouvelle Affaire'}
        </h1>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleNewDeal}
            disabled={loading}
            className={`flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Nouvelle affaire
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !dealName}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              (loading || !dealName) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      <form className="space-y-6">
        <DealBasicInfo
          name={dealName}
          setName={setDealName}
          status={dealStatus}
          setStatus={setDealStatus}
          reason={dealReason}
          setReason={setDealReason}
          comments={dealComments}
          setComments={setDealComments}
        />

        <PropertyPrice
          mandateType={mandateType}
          setMandateType={setMandateType}
          estimatedPrice={estimatedPrice}
          setEstimatedPrice={setEstimatedPrice}
          displayPrice={displayPrice}
          setDisplayPrice={setDisplayPrice}
          agencyCommission={agencyCommission}
          setAgencyCommission={setAgencyCommission}
        />

        <OtherSalesMode
          dealId={currentDealId}
          salesModes={salesModes}
          setSalesModes={setSalesModes}
        />

        <PropertyDetails
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          address={address}
          setAddress={setAddress}
          city={city}
          setCity={setCity}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          dpe={dpe}
          setDpe={setDpe}
          ges={ges}
          setGes={setGes}
          roomsCount={roomsCount}
          setRoomsCount={setRoomsCount}
          bedroomsCount={bedroomsCount}
          setBedroomsCount={setBedroomsCount}
          livingRoomArea={livingRoomArea}
          setLivingRoomArea={setLivingRoomArea}
          diningRoomArea={diningRoomArea}
          setDiningRoomArea={setDiningRoomArea}
          bathroomsCount={bathroomsCount}
          setBathroomsCount={setBathroomsCount}
          showerRoomsCount={showerRoomsCount}
          setShowerRoomsCount={setShowerRoomsCount}
          wcCount={wcCount}
          setWcCount={setWcCount}
          hasCellar={hasCellar}
          setHasCellar={setHasCellar}
          hasPartialBasement={hasPartialBasement}
          setHasPartialBasement={setHasPartialBasement}
          hasFullBasement={hasFullBasement}
          setHasFullBasement={setHasFullBasement}
          hasTerrace={hasTerrace}
          setHasTerrace={setHasTerrace}
          terraceCount={terraceCount}
          setTerraceCount={setTerraceCount}
          terraceArea={terraceArea}
          setTerraceArea={setTerraceArea}
          hasGarden={hasGarden}
          setHasGarden={setHasGarden}
          gardenArea={gardenArea}
          setGardenArea={setGardenArea}
          hasParking={hasParking}
          setHasParking={setHasParking}
          parkingCount={parkingCount}
          setParkingCount={setParkingCount}
          hasBox={hasBox}
          setHasBox={setHasBox}
          boxCount={boxCount}
          setBoxCount={setBoxCount}
          hasPool={hasPool}
          setHasPool={setHasPool}
          isPoolPossible={isPoolPossible}
          setIsPoolPossible={setIsPoolPossible}
          hasFireplace={hasFireplace}
          setHasFireplace={setHasFireplace}
          hasAlarm={hasAlarm}
          setHasAlarm={setHasAlarm}
          heatingType={heatingType}
          setHeatingType={setHeatingType}
          hasSmokeDetector={hasSmokeDetector}
          setHasSmokeDetector={setHasSmokeDetector}
          hasBuriedFuelTank={hasBuriedFuelTank}
          setHasBuriedFuelTank={setHasBuriedFuelTank}
          hasNonBuriedFuelTank={hasNonBuriedFuelTank}
          setHasNonBuriedFuelTank={setHasNonBuriedFuelTank}
          isSubdivision={isSubdivision}
          setIsSubdivision={setIsSubdivision}
          hasExistingAsl={hasExistingAsl}
          setHasExistingAsl={setHasExistingAsl}
          hasDissolvedAsl={hasDissolvedAsl}
          setHasDissolvedAsl={setHasDissolvedAsl}
          hasEasements={hasEasements}
          setHasEasements={setHasEasements}
          hasSolarPanels={hasSolarPanels}
          setHasSolarPanels={setHasSolarPanels}
          hasFiberOptic={hasFiberOptic}
          setHasFiberOptic={setHasFiberOptic}
        />

        <PropertyTitle
          propertyTitle={propertyTitle}
          setPropertyTitle={setPropertyTitle}
          titleDesignationIdentical={titleDesignationIdentical}
          setTitleDesignationIdentical={setTitleDesignationIdentical}
          currentDesignation={currentDesignation}
          setCurrentDesignation={setCurrentDesignation}
          titleDetails={titleDetails}
          setTitleDetails={setTitleDetails}
        />

        <FurnitureList
          dealId={currentDealId}
          furnitureItems={furnitureItems}
          setFurnitureItems={setFurnitureItems}
        />

        <SinistreEnCours
          dealId={currentDealId}
          sinistres={sinistres}
          setSinistres={setSinistres}
        />

        <ListeTravauxRealises
          dealId={currentDealId}
          travaux={travaux}
          setTravaux={setTravaux}
        />

        <SellerInfoV3
          dealId={currentDealId}
          sellers={sellers}
          setSellers={setSellers}
        />
      </form>
    </div>
  );
};

export default NewDeal;