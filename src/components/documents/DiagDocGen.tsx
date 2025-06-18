import React, { useState, useEffect } from 'react';
import { Activity, Play, CheckCircle, Calendar, ChevronDown, ChevronUp, MessageSquare, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DocumentRule {
  id: string;
  document_requis: string;
  type_partie: string;
  table_cible: string;
  champ_condition: string;
  valeur_condition: string;
  commentaires: string;
}

interface DealInfo {
  id: string;
  name: string;
}

interface PropertyInfo {
  id: string;
  dpe: string;
  ges: string;
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

interface DiagDocGenProps {
  dealId: string;
}

const DiagDocGen = ({ dealId }: DiagDocGenProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [documentRules, setDocumentRules] = useState<DocumentRule[]>([]);
  const [requiredDocuments, setRequiredDocuments] = useState<RequiredDocument[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [dealInfo, setDealInfo] = useState<DealInfo | null>(null);
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);

  // Charger les règles de documents pour les diagnostics
  useEffect(() => {
    const fetchDocumentRules = async () => {
      try {
        // Charger TOUTES les règles qui concernent les diagnostics
        // Soit celles qui commencent par "Diagnostic" dans le nom du document
        // Soit celles qui sont dans les tables deals ou description_bien_principale avec des conditions spécifiques
        const { data, error: rulesError } = await supabase
          .from('documents_rules')
          .select('*')
          .or(
            'document_requis.ilike.Diagnostic%,' +
            'and(table_cible.eq.deals,champ_condition.eq.name,valeur_condition.eq.__NOT_EMPTY__),' +
            'and(table_cible.eq.description_bien_principale,champ_condition.eq.dpe,valeur_condition.in.(E,F,G))'
          );

        if (rulesError) throw rulesError;
        setDocumentRules(data || []);
        console.log('Règles de documents diagnostics chargées:', data);
      } catch (err) {
        console.error('Erreur lors du chargement des règles:', err);
      }
    };

    fetchDocumentRules();
  }, []);

  // Charger les informations de l'affaire et du bien
  useEffect(() => {
    const fetchDealAndPropertyInfo = async () => {
      if (!dealId) return;

      try {
        // Charger les informations de l'affaire
        const { data: dealData, error: dealError } = await supabase
          .from('deals')
          .select('id, name')
          .eq('id', dealId)
          .single();

        if (dealError) throw dealError;
        setDealInfo(dealData);

        // Charger les informations du bien (DPE/GES)
        const { data: propertyData, error: propertyError } = await supabase
          .from('description_bien_principale')
          .select('id, dpe, ges')
          .eq('deal_id', dealId)
          .single();

        if (propertyError && propertyError.code !== 'PGRST116') {
          throw propertyError;
        }

        setPropertyInfo(propertyData);
        console.log('Informations de l\'affaire chargées:', dealData);
        console.log('Informations du bien (DPE/GES) chargées:', propertyData);
      } catch (err) {
        console.error('Erreur lors du chargement des informations:', err);
      }
    };

    fetchDealAndPropertyInfo();
  }, [dealId]);

  // Charger les documents requis existants
  useEffect(() => {
    const loadRequiredDocuments = async () => {
      if (!dealId) return;

      try {
        const { data, error: loadError } = await supabase
          .from('diag_required_doc')
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
  const checkCondition = (data: DealInfo | PropertyInfo, rule: DocumentRule): boolean => {
    const { champ_condition, valeur_condition } = rule;
    
    // Récupérer la valeur du champ dans les données
    const fieldValue = (data as any)[champ_condition];
    
    console.log(`Vérification condition pour ${rule.document_requis}:`, {
      table: rule.table_cible,
      champ: champ_condition,
      valeur_actuelle: fieldValue,
      valeur_attendue: valeur_condition,
      type_valeur_actuelle: typeof fieldValue
    });
    
    // Vérifications spéciales
    if (valeur_condition === '__NOT_EMPTY__') {
      const result = fieldValue !== null && fieldValue !== undefined && fieldValue !== '' && fieldValue !== 0;
      console.log(`Condition __NOT_EMPTY__: ${result}`);
      return result;
    }
    
    // Vérification pour DPE E, F, G
    if (champ_condition === 'dpe' && ['E', 'F', 'G'].includes(valeur_condition)) {
      const result = fieldValue === valeur_condition;
      console.log(`Condition DPE ${valeur_condition}: ${result}`);
      return result;
    }
    
    // Comparaison directe
    const result = String(fieldValue) === valeur_condition;
    console.log(`Condition directe: ${result}`);
    return result;
  };

  // Fonction pour identifier les nouveaux documents à ajouter
  const getNewDocumentsToAdd = () => {
    const newDocuments: Omit<RequiredDocument, 'id'>[] = [];
    const existingDocuments = requiredDocuments.map(doc => doc.document_name);

    console.log('Début de la vérification des nouveaux documents diagnostics...');
    console.log('Documents existants:', existingDocuments);
    console.log('Nombre de règles à vérifier:', documentRules.length);

    // Vérifier chaque règle pour les diagnostics
    for (const rule of documentRules) {
      console.log(`\n--- Vérification de la règle diagnostic: ${rule.document_requis} ---`);
      console.log(`Table cible: ${rule.table_cible}, Champ: ${rule.champ_condition}, Valeur: ${rule.valeur_condition}`);
      
      // Vérifier si ce document n'existe pas déjà
      if (!existingDocuments.includes(rule.document_requis)) {
        let conditionMet = false;

        // Vérifier selon la table cible
        if (rule.table_cible === 'deals' && dealInfo) {
          console.log('Vérification sur la table deals...');
          conditionMet = checkCondition(dealInfo, rule);
        } else if (rule.table_cible === 'description_bien_principale' && propertyInfo) {
          console.log('Vérification sur la table description_bien_principale...');
          conditionMet = checkCondition(propertyInfo, rule);
        } else {
          console.log(`❌ Données manquantes pour la table ${rule.table_cible}`);
        }

        if (conditionMet) {
          console.log(`✅ Nouveau document requis: ${rule.document_requis}`);
          newDocuments.push({
            document_name: rule.document_requis,
            status: 'seller', // Les documents de diagnostics concernent toujours les vendeurs
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

    if (!dealInfo) {
      setError('Aucune information sur l\'affaire trouvée');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Supprimer les documents existants pour cette affaire
      await supabase
        .from('diag_required_doc')
        .delete()
        .eq('deal_id', dealId);

      const documentsToInsert: Omit<RequiredDocument, 'id'>[] = [];

      console.log('Début de la vérification des règles diagnostics...');
      console.log('Nombre de règles à vérifier:', documentRules.length);
      console.log('Affaire disponible:', !!dealInfo);
      console.log('Bien disponible:', !!propertyInfo);

      // Vérifier chaque règle pour les diagnostics
      for (const rule of documentRules) {
        console.log(`\n--- Vérification de la règle diagnostic: ${rule.document_requis} ---`);
        console.log(`Table cible: ${rule.table_cible}, Champ: ${rule.champ_condition}, Valeur: ${rule.valeur_condition}`);
        
        let conditionMet = false;

        // Vérifier selon la table cible
        if (rule.table_cible === 'deals' && dealInfo) {
          console.log('Vérification sur la table deals...');
          conditionMet = checkCondition(dealInfo, rule);
        } else if (rule.table_cible === 'description_bien_principale' && propertyInfo) {
          console.log('Vérification sur la table description_bien_principale...');
          conditionMet = checkCondition(propertyInfo, rule);
        } else {
          console.log(`❌ Données manquantes pour la table ${rule.table_cible}`);
        }

        if (conditionMet) {
          console.log(`✅ Document requis: ${rule.document_requis}`);
          documentsToInsert.push({
            document_name: rule.document_requis,
            status: 'seller', // Les documents de diagnostics concernent toujours les vendeurs
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
          .from('diag_required_doc')
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
        setSuccess(`${documentsToInsert.length} documents de diagnostics générés avec succès !`);
      } else {
        setSuccess('Aucun document de diagnostics requis selon les règles définies.');
        setRequiredDocuments([]);
        setHasGenerated(true);
      }
    } catch (err) {
      console.error('Erreur lors de la génération:', err);
      setError('Erreur lors de la génération des documents de diagnostics');
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

    if (!dealInfo) {
      setError('Aucune information sur l\'affaire trouvée');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const newDocuments = getNewDocumentsToAdd();

      if (newDocuments.length > 0) {
        const { data, error: insertError } = await supabase
          .from('diag_required_doc')
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
        setSuccess(`${newDocuments.length} nouveau${newDocuments.length > 1 ? 'x' : ''} document${newDocuments.length > 1 ? 's' : ''} de diagnostics ajouté${newDocuments.length > 1 ? 's' : ''} !`);
      } else {
        setSuccess('Aucun nouveau document de diagnostics à ajouter.');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour des documents de diagnostics');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le statut d'un document
  const updateDocumentStatus = async (documentId: string, field: string, value: boolean | string) => {
    try {
      const updateData: any = { [field]: value };
      
      // Si on décoche "reçu", vider la date de réception
      if (field === 'received' && !value) {
        updateData.reception_date = null;
      }

      const { error } = await supabase
        .from('diag_required_doc')
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
  const newDocumentsCount = hasGenerated && dealInfo ? getNewDocumentsToAdd().length : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <Activity className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Documents Diagnostics
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
            {/* Bouton de génération - Affiché seulement si pas encore généré */}
            {!hasGenerated && (
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Générez automatiquement la liste des documents de diagnostics requis selon les caractéristiques de l'affaire et du bien.
                </p>
                <button
                  type="button"
                  onClick={generateDocuments}
                  disabled={loading || !dealInfo}
                  className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
                    loading || !dealInfo
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {loading ? 'Génération...' : 'Générer Documents Diagnostics'}
                </button>
              </div>
            )}

            {/* Bouton de mise à jour - Affiché si déjà généré */}
            {hasGenerated && dealInfo && (
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Vérifiez s'il y a de nouveaux documents à ajouter suite aux modifications de l'affaire ou du bien.
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
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span>
                    Liste des documents de diagnostics à jour. 
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
                {/* Documents Diagnostics */}
                {requiredDocuments.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">
                      Documents Diagnostics ({requiredDocuments.length})
                    </h3>
                    <div className="space-y-3">
                      {requiredDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-md p-4 border border-green-200">
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
                                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
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
                      Aucun document de diagnostics requis selon les règles définies et les caractéristiques de l'affaire.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Message si pas d'informations sur l'affaire */}
            {!dealInfo && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
                Aucune information sur l'affaire trouvée. Veuillez vérifier que l'affaire existe.
              </div>
            )}

            {/* Informations sur les données disponibles */}
            {dealInfo && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium">Données disponibles pour cette affaire :</p>
                    <p className="text-sm mt-1">
                      Affaire : {dealInfo.name ? '✅ Nom renseigné' : '❌ Nom manquant'}
                      {propertyInfo && propertyInfo.dpe && (
                        <span> • DPE : {propertyInfo.dpe}</span>
                      )}
                      {propertyInfo && propertyInfo.ges && (
                        <span> • GES : {propertyInfo.ges}</span>
                      )}
                      {!propertyInfo && (
                        <span> • ❌ Informations du bien manquantes</span>
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

export default DiagDocGen;