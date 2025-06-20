import React, { useState, useEffect } from 'react';
import { FileCheck, Play, CheckCircle, Calendar, ChevronDown, ChevronUp, RefreshCw, Shield } from 'lucide-react';
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

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  type_personne_id: string;
  marital_status_id: string;
  marriage_contract: boolean;
  // Ajoutez d'autres champs selon vos besoins
}

interface RequiredDocument {
  id?: string;
  document_name: string;
  contact_id: string;
  status: 'buyer' | 'seller';
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  received: boolean;
  reception_date: string;
}

interface PersonalDocGenProps {
  dealId: string;
  sellers: Array<{ id: string; contact_id: string; contact: Contact }>;
  buyers: Array<{ id: string; contact_id: string; contact: Contact }>;
}

const PersonalDocGen = ({ dealId, sellers, buyers }: PersonalDocGenProps) => {
  const { isAdmin } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [documentRules, setDocumentRules] = useState<DocumentRule[]>([]);
  const [requiredDocuments, setRequiredDocuments] = useState<RequiredDocument[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
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

  // Charger les règles de documents
  useEffect(() => {
    const fetchDocumentRules = async () => {
      try {
        const { data, error: rulesError } = await supabase
          .from('documents_rules')
          .select('*');

        if (rulesError) throw rulesError;
        setDocumentRules(data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des règles:', err);
      }
    };

    fetchDocumentRules();
  }, []);

  // Charger les documents requis existants
  useEffect(() => {
    const loadRequiredDocuments = async () => {
      if (!dealId) return;

      try {
        const { data, error: loadError } = await supabase
          .from('personal_required_doc')
          .select('*')
          .eq('deal_id', dealId)
          .order('status', { ascending: true })
          .order('last_name', { ascending: true });

        if (loadError) throw loadError;

        if (data && data.length > 0) {
          setRequiredDocuments(data);
          setHasGenerated(true);
        } else {
          // Aucun document trouvé, réinitialiser l'état
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
  const checkCondition = (contact: Contact, rule: DocumentRule): boolean => {
    const { champ_condition, valeur_condition } = rule;
    
    // Récupérer la valeur du champ dans le contact
    const fieldValue = (contact as any)[champ_condition];
    
    // Vérifications spéciales
    if (valeur_condition === 'NOT NULL') {
      return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
    }
    
    if (valeur_condition === 'true') {
      return fieldValue === true;
    }
    
    if (valeur_condition === 'false') {
      return fieldValue === false;
    }
    
    // Comparaison directe
    return String(fieldValue) === valeur_condition;
  };

  // Fonction pour identifier les nouveaux documents à ajouter
  const getNewDocumentsToAdd = () => {
    const newDocuments: Omit<RequiredDocument, 'id'>[] = [];
    const existingDocuments = requiredDocuments.map(doc => 
      `${doc.document_name}-${doc.contact_id}-${doc.status}`
    );

    // Traiter les vendeurs
    for (const seller of sellers) {
      const contact = seller.contact;
      
      // Vérifier chaque règle pour les vendeurs
      for (const rule of documentRules) {
        if (rule.type_partie === 'vendeur' || rule.type_partie === 'tous') {
          if (checkCondition(contact, rule)) {
            const documentKey = `${rule.document_requis}-${contact.id}-seller`;
            
            // Vérifier si ce document n'existe pas déjà
            if (!existingDocuments.includes(documentKey)) {
              newDocuments.push({
                document_name: rule.document_requis,
                contact_id: contact.id,
                status: 'seller',
                first_name: contact.first_name || '',
                last_name: contact.last_name || '',
                phone: contact.phone || '',
                email: contact.email || '',
                received: false,
                reception_date: ''
              });
            }
          }
        }
      }
    }

    // Traiter les acheteurs
    for (const buyer of buyers) {
      const contact = buyer.contact;
      
      // Vérifier chaque règle pour les acheteurs
      for (const rule of documentRules) {
        if (rule.type_partie === 'acquéreur' || rule.type_partie === 'tous') {
          if (checkCondition(contact, rule)) {
            const documentKey = `${rule.document_requis}-${contact.id}-buyer`;
            
            // Vérifier si ce document n'existe pas déjà
            if (!existingDocuments.includes(documentKey)) {
              newDocuments.push({
                document_name: rule.document_requis,
                contact_id: contact.id,
                status: 'buyer',
                first_name: contact.first_name || '',
                last_name: contact.last_name || '',
                phone: contact.phone || '',
                email: contact.email || '',
                received: false,
                reception_date: ''
              });
            }
          }
        }
      }
    }

    return newDocuments;
  };

  // Générer la liste des documents (première fois)
  const generateDocuments = async () => {
    if (!dealId) {
      setError('Aucune affaire sélectionnée');
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
        .from('personal_required_doc')
        .delete()
        .eq('deal_id', dealId);

      const documentsToInsert: Omit<RequiredDocument, 'id'>[] = [];

      // Traiter les vendeurs
      for (const seller of sellers) {
        const contact = seller.contact;
        
        // Vérifier chaque règle pour les vendeurs
        for (const rule of documentRules) {
          if (rule.type_partie === 'vendeur' || rule.type_partie === 'tous') {
            if (checkCondition(contact, rule)) {
              documentsToInsert.push({
                document_name: rule.document_requis,
                contact_id: contact.id,
                status: 'seller',
                first_name: contact.first_name || '',
                last_name: contact.last_name || '',
                phone: contact.phone || '',
                email: contact.email || '',
                received: false,
                reception_date: ''
              });
            }
          }
        }
      }

      // Traiter les acheteurs
      for (const buyer of buyers) {
        const contact = buyer.contact;
        
        // Vérifier chaque règle pour les acheteurs
        for (const rule of documentRules) {
          if (rule.type_partie === 'acquéreur' || rule.type_partie === 'tous') {
            if (checkCondition(contact, rule)) {
              documentsToInsert.push({
                document_name: rule.document_requis,
                contact_id: contact.id,
                status: 'buyer',
                first_name: contact.first_name || '',
                last_name: contact.last_name || '',
                phone: contact.phone || '',
                email: contact.email || '',
                received: false,
                reception_date: ''
              });
            }
          }
        }
      }

      // Insérer les documents en base
      if (documentsToInsert.length > 0) {
        const { data, error: insertError } = await supabase
          .from('personal_required_doc')
          .insert(documentsToInsert.map(doc => ({
            ...doc,
            deal_id: dealId,
            reception_date: null // Explicitement null au lieu de chaîne vide
          })))
          .select();

        if (insertError) throw insertError;

        setRequiredDocuments(data || []);
        setHasGenerated(true);
        setSuccess(`${documentsToInsert.length} documents personnels générés avec succès !`);
      } else {
        setSuccess('Aucun document personnel requis selon les règles définies.');
        setRequiredDocuments([]);
        setHasGenerated(true);
      }
    } catch (err) {
      console.error('Erreur lors de la génération:', err);
      setError('Erreur lors de la génération des documents personnels');
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
          .from('personal_required_doc')
          .insert(newDocuments.map(doc => ({
            ...doc,
            deal_id: dealId,
            reception_date: null
          })))
          .select();

        if (insertError) throw insertError;

        // Ajouter les nouveaux documents à la liste existante
        setRequiredDocuments(prev => [...prev, ...(data || [])]);
        setSuccess(`${newDocuments.length} nouveau${newDocuments.length > 1 ? 'x' : ''} document${newDocuments.length > 1 ? 's' : ''} ajouté${newDocuments.length > 1 ? 's' : ''} !`);
      } else {
        setSuccess('Aucun nouveau document à ajouter.');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour des documents personnels');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le statut d'un document
  const updateDocumentStatus = async (documentId: string, received: boolean, receptionDate?: string) => {
    if (!canModify) {
      setError('Vous n\'avez pas les permissions pour modifier les documents de cette affaire');
      return;
    }

    try {
      const updateData: any = { received };
      
      if (received && receptionDate) {
        updateData.reception_date = receptionDate;
      } else {
        updateData.reception_date = null; // Explicitement null
      }

      const { error } = await supabase
        .from('personal_required_doc')
        .update(updateData)
        .eq('id', documentId);

      if (error) throw error;

      // Mettre à jour l'état local
      setRequiredDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, received, reception_date: receptionDate || '' }
            : doc
        )
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour du document');
    }
  };

  const getContactDisplayName = (doc: RequiredDocument) => {
    return `${doc.first_name} ${doc.last_name}`.trim() || doc.email || 'Contact sans nom';
  };

  const sellerDocuments = requiredDocuments.filter(doc => doc.status === 'seller');
  const buyerDocuments = requiredDocuments.filter(doc => doc.status === 'buyer');

  // Calculer le nombre de nouveaux documents potentiels
  const newDocumentsCount = hasGenerated ? getNewDocumentsToAdd().length : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <FileCheck className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Documents Personnels
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
                  Générez automatiquement la liste des documents personnels requis selon les informations des contacts.
                </p>
                <button
                  type="button"
                  onClick={generateDocuments}
                  disabled={loading || sellers.length === 0 && buyers.length === 0}
                  className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
                    loading || (sellers.length === 0 && buyers.length === 0)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {loading ? 'Génération...' : 'Générer Documents Personnels'}
                </button>
              </div>
            )}

            {/* Bouton de mise à jour - Affiché si déjà généré et permissions */}
            {hasGenerated && canModify && (
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Vérifiez s'il y a de nouveaux documents à ajouter suite aux modifications des contacts.
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
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <span>
                    Liste des documents personnels à jour. 
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
                {/* Documents Vendeurs */}
                {sellerDocuments.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      Documents Vendeurs ({sellerDocuments.length})
                    </h3>
                    <div className="space-y-3">
                      {sellerDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-md p-4 border border-blue-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {doc.document_name} ({getContactDisplayName(doc)})
                              </h4>
                              <div className="mt-2 flex items-center space-x-4">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={doc.received}
                                    onChange={(e) => updateDocumentStatus(doc.id!, e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                                      onChange={(e) => updateDocumentStatus(doc.id!, true, e.target.value)}
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents Acheteurs */}
                {buyerDocuments.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">
                      Documents Acheteurs ({buyerDocuments.length})
                    </h3>
                    <div className="space-y-3">
                      {buyerDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-md p-4 border border-green-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {doc.document_name} ({getContactDisplayName(doc)})
                              </h4>
                              <div className="mt-2 flex items-center space-x-4">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={doc.received}
                                    onChange={(e) => updateDocumentStatus(doc.id!, e.target.checked)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
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
                                      onChange={(e) => updateDocumentStatus(doc.id!, true, e.target.value)}
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message si aucun document */}
                {requiredDocuments.length === 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-600">
                      Aucun document personnel requis selon les règles définies et les informations des contacts.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Message si pas de contacts */}
            {sellers.length === 0 && buyers.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
                Aucun vendeur ou acheteur associé à cette affaire. Veuillez d'abord ajouter des contacts à l'affaire.
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDocGen;