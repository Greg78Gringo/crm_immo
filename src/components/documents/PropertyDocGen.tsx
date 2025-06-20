import React, { useState, useEffect } from 'react';
import { Home, Play, CheckCircle, Calendar, ChevronDown, ChevronUp, MessageSquare, RefreshCw, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface DocumentRule {
  id: string;
  document_requis: string;
  type_partie: string;
  table_cible: string;
  champ_condition: string;
  valeur_condition: string;
  commentaires: string;
}

interface PropertyInfo {
  id: string;
  property_type_id: string;
  address: string;
  city: string;
  postal_code: string;
  rooms_count: number;
  bedrooms_count: number;
  living_room_area: number;
  dining_room_area: number;
  bathrooms_count: number;
  shower_rooms_count: number;
  wc_count: number;
  has_cellar: boolean;
  has_partial_basement: boolean;
  has_full_basement: boolean;
  has_terrace: boolean;
  terrace_count: number;
  terrace_area: number;
  has_garden: boolean;
  garden_area: number;
  has_parking: boolean;
  parking_count: number;
  has_box: boolean;
  box_count: number;
  has_pool: boolean;
  is_pool_possible: boolean;
  has_fireplace: boolean;
  has_alarm: boolean;
  heating_type_id: string;
  dpe: string;
  ges: string;
  has_smoke_detector: boolean;
  has_buried_fuel_tank: boolean;
  has_non_buried_fuel_tank: boolean;
  is_subdivision: boolean;
  has_existing_asl: boolean;
  has_dissolved_asl: boolean;
  has_easements: boolean;
  has_solar_panels: boolean;
  has_fiber_optic: boolean;
  property_title: string;
  title_designation_identical: boolean;
  current_designation: string;
  title_details: string;
}

interface RequiredDocument {
  id?: string;
  document_name: string;
  status: 'buyer' | 'seller';
  received: boolean;
  reception_date: string;
  date_doc: string;
  comments: string;
}

interface PropertyDocGenProps {
  dealId: string;
}

const PropertyDocGen = ({ dealId }: PropertyDocGenProps) => {
  const { isAdmin } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [documentRules, setDocumentRules] = useState<DocumentRule[]>([]);
  const [requiredDocuments, setRequiredDocuments] = useState<RequiredDocument[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [dealAgentId, setDealAgentId] = useState<string>('');
  const [canModify, setCanModify] = useState(false);

  // Charger l'utilisateur actuel et vérifier les permissions
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          setCurrentUserId(user.id);
          
          // Vérifier si l'utilisateur est propriétaire de l'affaire
          if (dealId) {
            const { data: dealData, error: dealError } = await supabase
              .from('deals')
              .select('agent_id')
              .eq('id', dealId)
              .single();
              
            if (dealError && dealError.code !== 'PGRST116') {
              throw dealError;
            }
            
            if (dealData) {
              setDealAgentId(dealData.agent_id);
              setCanModify(isAdmin || dealData.agent_id === user.id);
            }
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement de l\'utilisateur:', err);
      }
    };

    getCurrentUser();
  }, [dealId, isAdmin]);

  // Charger les règles de documents (exclure les diagnostics)
  useEffect(() => {
    const fetchDocumentRules = async () => {
      try {
        const { data, error: rulesError } = await supabase
          .from('documents_rules')
          .select('*')
          .eq('table_cible', 'description_bien_principale')
          .not('document_requis', 'like', 'Diagnostic Audit%');

        if (rulesError) throw rulesError;
        setDocumentRules(data || []);
        console.log('Règles de documents chargées:', data);
      } catch (err) {
        console.error('Erreur lors du chargement des règles:', err);
      }
    };

    fetchDocumentRules();
  }, []);

  // Charger les informations du bien
  useEffect(() => {
    const fetchPropertyInfo = async () => {
      if (!dealId) return;

      try {
        const { data, error: propertyError } = await supabase
          .from('description_bien_principale')
          .select('*')
          .eq('deal_id', dealId)
          .single();

        if (propertyError && propertyError.code !== 'PGRST116') {
          throw propertyError;
        }

        setPropertyInfo(data);
        console.log('Informations du bien chargées:', data);
      } catch (err) {
        console.error('Erreur lors du chargement des informations du bien:', err);
      }
    };

    fetchPropertyInfo();
  }, [dealId]);

  // Charger les documents requis existants
  useEffect(() => {
    const loadRequiredDocuments = async () => {
      if (!dealId) return;

      try {
        const { data, error: loadError } = await supabase
          .from('property_required_doc')
          .select('*')
          .eq('deal_id', dealId)
          .order('document_name', { ascending: true });

        if (loadError) throw loadError;

        if (data && data.length > 0) {
          setRequiredDocuments(data);
          setHasGenerated(true);
        } else {
          setRequiredDocuments([]);
          setHasGenerated(false);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des documents requis:', err);
      }
    };

    loadRequiredDocuments();
  }, [dealId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Fonction pour vérifier si une condition est remplie
  const checkCondition = (propertyInfo: PropertyInfo, rule: DocumentRule): boolean => {
    const { champ_condition, valeur_condition } = rule;
    
    // Récupérer la valeur du champ dans les informations du bien
    const fieldValue = (propertyInfo as any)[champ_condition];
    
    console.log(`Vérification condition pour ${rule.document_requis}:`, {
      champ: champ_condition,
      valeur_actuelle: fieldValue,
      valeur_attendue: valeur_condition,
      type_valeur_actuelle: typeof fieldValue
    });
    
    // Vérifications spéciales
    if (valeur_condition === 'NOT NULL') {
      const result = fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
      console.log(`Condition NOT NULL: ${result}`);
      return result;
    }
    
    if (valeur_condition === '__NOT_EMPTY__') {
      const result = fieldValue !== null && fieldValue !== undefined && fieldValue !== '' && fieldValue !== 0;
      console.log(`Condition __NOT_EMPTY__: ${result}`);
      return result;
    }
    
    if (valeur_condition === 'TRUE' || valeur_condition === 'true') {
      const result = fieldValue === true;
      console.log(`Condition TRUE: ${result}`);
      return result;
    }
    
    if (valeur_condition === 'FALSE' || valeur_condition === 'false') {
      const result = fieldValue === false;
      console.log(`Condition FALSE: ${result}`);
      return result;
    }
    
    // Comparaison directe (pour les IDs, énumérations, etc.)
    const result = String(fieldValue) === valeur_condition;
    console.log(`Condition directe: ${result}`);
    return result;
  };

  // Fonction pour identifier les nouveaux documents à ajouter
  const getNewDocumentsToAdd = () => {
    if (!propertyInfo) return [];

    const newDocuments: Omit<RequiredDocument, 'id'>[] = [];
    const existingDocuments = requiredDocuments.map(doc => doc.document_name);

    console.log('Début de la vérification des nouveaux documents...');
    console.log('Documents existants:', existingDocuments);

    // Vérifier chaque règle pour le bien
    for (const rule of documentRules) {
      console.log(`\n--- Vérification de la règle: ${rule.document_requis} ---`);
      
      // Vérifier si ce document n'existe pas déjà
      if (!existingDocuments.includes(rule.document_requis)) {
        if (checkCondition(propertyInfo, rule)) {
          console.log(`✅ Nouveau document requis: ${rule.document_requis}`);
          newDocuments.push({
            document_name: rule.document_requis,
            status: 'seller', // Les documents du bien concernent toujours les vendeurs
            received: false,
            reception_date: '',
            date_doc: '',
            comments: ''
          });
        } else {
          console.log(`❌ Document non requis: ${rule.document_requis}`);
        }
      } else {
        console.log(`⏭️ Document déjà existant: ${rule.document_requis}`);
      }
    }

    console.log('Nouveaux documents à ajouter:', newDocuments);
    return newDocuments;
  };

  // Générer la liste des documents (première fois)
  const generateDocuments = async () => {
    if (!dealId) {
      setError('Aucune affaire sélectionnée');
      return;
    }

    if (!propertyInfo) {
      setError('Aucune information sur le bien trouvée');
      return;
    }

    if (!canModify) {
      setError('Vous n\'avez pas les permissions pour générer des documents pour cette affaire');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Supprimer les documents existants pour cette affaire
      await supabase
        .from('property_required_doc')
        .delete()
        .eq('deal_id', dealId);

      const documentsToInsert: Omit<RequiredDocument, 'id'>[] = [];

      console.log('Début de la vérification des règles...');
      console.log('Nombre de règles à vérifier:', documentRules.length);

      // Vérifier chaque règle pour le bien
      for (const rule of documentRules) {
        console.log(`\n--- Vérification de la règle: ${rule.document_requis} ---`);
        
        if (checkCondition(propertyInfo, rule)) {
          console.log(`✅ Document requis: ${rule.document_requis}`);
          documentsToInsert.push({
            document_name: rule.document_requis,
            status: 'seller', // Les documents du bien concernent toujours les vendeurs
            received: false,
            reception_date: '',
            date_doc: '',
            comments: ''
          });
        } else {
          console.log(`❌ Document non requis: ${rule.document_requis}`);
        }
      }

      console.log('Documents à insérer:', documentsToInsert);

      // Insérer les documents en base
      if (documentsToInsert.length > 0) {
        const { data, error: insertError } = await supabase
          .from('property_required_doc')
          .insert(documentsToInsert.map(doc => ({
            ...doc,
            deal_id: dealId,
            reception_date: null,
            date_doc: null
          })))
          .select();

        if (insertError) throw insertError;

        setRequiredDocuments(data || []);
        setHasGenerated(true);
        setSuccess(`${documentsToInsert.length} documents du bien générés avec succès !`);
      } else {
        setSuccess('Aucun document du bien requis selon les règles définies.');
        setRequiredDocuments([]);
        setHasGenerated(true);
      }
    } catch (err) {
      console.error('Erreur lors de la génération:', err);
      setError('Erreur lors de la génération des documents du bien');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour la liste (ajouter de nouveaux documents)
  const updateDocuments = async () => {
    if (!dealId) {
      setError('Aucune affaire sélectionnée');
      return;
    }

    if (!propertyInfo) {
      setError('Aucune information sur le bien trouvée');
      return;
    }

    if (!canModify) {
      setError('Vous n\'avez pas les permissions pour mettre à jour les documents de cette affaire');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const newDocuments = getNewDocumentsToAdd();

      if (newDocuments.length > 0) {
        const { data, error: insertError } = await supabase
          .from('property_required_doc')
          .insert(newDocuments.map(doc => ({
            ...doc,
            deal_id: dealId,
            reception_date: null,
            date_doc: null
          })))
          .select();

        if (insertError) throw insertError;

        // Ajouter les nouveaux documents à la liste existante
        setRequiredDocuments(prev => [...prev, ...(data || [])]);
        setSuccess(`${newDocuments.length} nouveau${newDocuments.length > 1 ? 'x' : ''} document${newDocuments.length > 1 ? 's' : ''} du bien ajouté${newDocuments.length > 1 ? 's' : ''} !`);
      } else {
        setSuccess('Aucun nouveau document du bien à ajouter.');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour des documents du bien');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le statut d'un document
  const updateDocumentStatus = async (documentId: string, field: string, value: boolean | string) => {
    if (!canModify) {
      setError('Vous n\'avez pas les permissions pour modifier les documents de cette affaire');
      return;
    }

    try {
      const updateData: any = { [field]: value };
      
      // Si on décoche "reçu", vider la date de réception
      if (field === 'received' && !value) {
        updateData.reception_date = null;
      }

      const { error } = await supabase
        .from('property_required_doc')
        .update(updateData)
        .eq('id', documentId);

      if (error) throw error;

      // Mettre à jour l'état local
      setRequiredDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, [field]: value, ...(field === 'received' && !value ? { reception_date: '' } : {}) }
            : doc
        )
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour du document');
    }
  };

  // Calculer le nombre de nouveaux documents potentiels
  const newDocumentsCount = hasGenerated && propertyInfo ? getNewDocumentsToAdd().length : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <Home className="h-6 w-6 text-orange-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Documents du Bien
            {isAdmin && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </span>
            )}
            {hasGenerated && (
              <span className="ml-2 text-sm text-gray-500">
                - {requiredDocuments.length} document{requiredDocuments.length > 1 ? 's' : ''}
              </span>
            )}
            {newDocumentsCount > 0 && (
              <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                {newDocumentsCount} nouveau{newDocumentsCount > 1 ? 'x' : ''}
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
            {/* Indicateur de permissions */}
            {dealAgentId && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {isAdmin && dealAgentId !== currentUserId && (
                    <span className="text-blue-600">
                      Affaire gérée par un autre agent (ID: {dealAgentId.substring(0, 8)}...)
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {canModify ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      Génération autorisée
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Consultation seule
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Bouton de génération - Affiché seulement si pas encore généré et permissions */}
            {!hasGenerated && canModify && (
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Générez automatiquement la liste des documents requis selon les caractéristiques du bien immobilier.
                </p>
                <button
                  type="button"
                  onClick={generateDocuments}
                  disabled={loading || !propertyInfo}
                  className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
                    loading || !propertyInfo
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {loading ? 'Génération...' : 'Générer Documents du Bien'}
                </button>
              </div>
            )}

            {/* Bouton de mise à jour - Affiché si déjà généré et permissions */}
            {hasGenerated && propertyInfo && canModify && (
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Vérifiez s'il y a de nouveaux documents à ajouter suite aux modifications du bien.
                  {newDocumentsCount > 0 && (
                    <span className="ml-2 text-orange-600 font-medium">
                      {newDocumentsCount} nouveau{newDocumentsCount > 1 ? 'x' : ''} document{newDocumentsCount > 1 ? 's' : ''} détecté{newDocumentsCount > 1 ? 's' : ''} !
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={updateDocuments}
                  disabled={loading}
                  className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : newDocumentsCount > 0
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {loading ? 'Vérification...' : 'Mettre à jour'}
                </button>
              </div>
            )}

            {/* Message informatif si déjà généré */}
            {hasGenerated && newDocumentsCount === 0 && (
              <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-600 mr-2" />
                  <span>
                    Liste des documents du bien à jour. 
                    {requiredDocuments.length > 0 && (
                      <span className="ml-1">
                        Vous pouvez suivre la réception des {requiredDocuments.length} document{requiredDocuments.length > 1 ? 's' : ''}.
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Messages d'erreur et de succès */}
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

            {/* Affichage des documents générés */}
            {hasGenerated && (
              <div className="space-y-6">
                {/* Documents du Bien */}
                {requiredDocuments.length > 0 && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-900 mb-4">
                      Documents du Bien ({requiredDocuments.length})
                    </h3>
                    <div className="space-y-3">
                      {requiredDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-md p-4 border border-orange-200">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {doc.document_name}
                                </h4>
                                <div className="mt-2 flex items-center space-x-4">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={doc.received}
                                      onChange={(e) => updateDocumentStatus(doc.id!, 'received', e.target.checked)}
                                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                      disabled={!canModify}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Document reçu</span>
                                  </label>
                                  {doc.received && (
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                      <input
                                        type="date"
                                        value={doc.reception_date || ''}
                                        onChange={(e) => updateDocumentStatus(doc.id!, 'reception_date', e.target.value)}
                                        className="text-sm border border-gray-300 rounded px-2 py-1"
                                        disabled={!canModify}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              {doc.received && (
                                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                              )}
                            </div>
                            
                            {/* Champs supplémentaires */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Date du document
                                </label>
                                <input
                                  type="date"
                                  value={doc.date_doc || ''}
                                  onChange={(e) => updateDocumentStatus(doc.id!, 'date_doc', e.target.value)}
                                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                  disabled={!canModify}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Commentaires
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={doc.comments || ''}
                                    onChange={(e) => updateDocumentStatus(doc.id!, 'comments', e.target.value)}
                                    className="w-full text-sm border border-gray-300 rounded px-2 py-1 pr-8"
                                    placeholder="Ajouter un commentaire..."
                                    disabled={!canModify}
                                  />
                                  <MessageSquare className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message si aucun document */}
                {requiredDocuments.length === 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-600">
                      Aucun document du bien requis selon les règles définies et les caractéristiques du bien.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Message si pas d'informations sur le bien */}
            {!propertyInfo && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
                Aucune information sur le bien trouvée pour cette affaire. Veuillez d'abord renseigner les détails du bien.
              </div>
            )}

            {/* Message si pas de permissions */}
            {!canModify && !hasGenerated && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="font-medium">Mode consultation uniquement</p>
                    <p className="text-sm mt-1">
                      Vous pouvez consulter les informations mais pas générer de documents pour cette affaire.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Informations sur les données disponibles */}
            {propertyInfo && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium">Données disponibles pour cette affaire :</p>
                    <p className="text-sm mt-1">
                      Type : {propertyInfo.property_type_id ? '✅ Renseigné' : '❌ Non renseigné'}
                      {propertyInfo.address && (
                        <span> • Adresse : {propertyInfo.address}</span>
                      )}
                      {propertyInfo.dpe && (
                        <span> • DPE : {propertyInfo.dpe}</span>
                      )}
                      {propertyInfo.ges && (
                        <span> • GES : {propertyInfo.ges}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDocGen;