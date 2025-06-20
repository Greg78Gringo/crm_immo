import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp, Users, Mail, Phone, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import PersonalDocGen from './PersonalDocGen';
import PropertyDocGen from './PropertyDocGen';
import WorkClaimDocGen from './WorkClaimDocGen';
import DiagDocGen from './DiagDocGen';
import OtherDocGen from './OtherDocGen';

interface Deal {
  id: string;
  name: string;
  created_at: string;
  agent_id: string;
  agent_name?: string;
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
}

interface Seller {
  id: string;
  contact_id: string;
  contact: Contact;
}

interface Buyer {
  id: string;
  contact_id: string;
  contact: Contact;
}

const DealSelector = () => {
  const { isAdmin } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string>('');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Charger l'utilisateur actuel
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          setCurrentUserId(user.id);
          console.log('👤 Utilisateur actuel chargé:', user.id);
          console.log('🔑 Mode Admin:', isAdmin);
        }
      } catch (err) {
        console.error('Erreur lors du chargement de l\'utilisateur:', err);
      }
    };

    getCurrentUser();
  }, [isAdmin]);

  // Charger les affaires selon le rôle
  useEffect(() => {
    const fetchDeals = async () => {
      if (!currentUserId) {
        console.log('⏳ En attente de l\'utilisateur actuel...');
        return;
      }

      try {
        console.log('🔄 Début du chargement des affaires...');
        console.log('👤 Utilisateur actuel:', currentUserId);
        console.log('🔑 Mode Admin:', isAdmin);
        
        if (isAdmin) {
          // Admin : charger TOUTES les affaires avec les noms des agents
          console.log('🔑 Mode Admin : Chargement de TOUTES les affaires');
          
          // Première étape : charger toutes les affaires
          const { data: dealsData, error: dealsError } = await supabase
            .from('deals')
            .select('id, name, created_at, agent_id')
            .order('created_at', { ascending: false });

          if (dealsError) {
            console.error('❌ Erreur lors du chargement des affaires:', dealsError);
            throw dealsError;
          }

          console.log('📊 Affaires brutes chargées:', dealsData?.length || 0);
          console.log('📋 Première affaire:', dealsData?.[0]);

          if (!dealsData || dealsData.length === 0) {
            console.log('⚠️ Aucune affaire trouvée dans la base de données');
            setDeals([]);
            return;
          }

          // Deuxième étape : enrichir avec les noms des agents
          console.log('🔄 Enrichissement avec les noms des agents...');
          const dealsWithAgentNames = await Promise.all(
            dealsData.map(async (deal) => {
              try {
                const { data: agentData, error: agentError } = await supabase
                  .from('agents_view')
                  .select('first_name, last_name')
                  .eq('id', deal.agent_id)
                  .single();

                if (agentError) {
                  console.warn(`⚠️ Erreur lors du chargement de l'agent ${deal.agent_id}:`, agentError);
                }

                const agentName = agentData 
                  ? `${agentData.first_name} ${agentData.last_name}`.trim()
                  : 'Agent inconnu';

                return {
                  ...deal,
                  agent_name: agentName
                };
              } catch (err) {
                console.warn(`⚠️ Erreur lors du chargement de l'agent ${deal.agent_id}:`, err);
                return {
                  ...deal,
                  agent_name: 'Agent inconnu'
                };
              }
            })
          );

          console.log('✅ Affaires enrichies:', dealsWithAgentNames.length);
          console.log('📋 Première affaire enrichie:', dealsWithAgentNames[0]);
          setDeals(dealsWithAgentNames);
          
        } else {
          // Agent normal : charger seulement ses affaires
          console.log('👤 Mode Agent : Chargement des affaires personnelles');
          
          const { data: dealsData, error: dealsError } = await supabase
            .from('deals')
            .select('id, name, created_at, agent_id')
            .eq('agent_id', currentUserId)
            .order('created_at', { ascending: false });

          if (dealsError) {
            console.error('❌ Erreur lors du chargement des affaires:', dealsError);
            throw dealsError;
          }
          
          console.log('📊 Affaires personnelles chargées:', dealsData?.length || 0);
          setDeals(dealsData || []);
        }
      } catch (err) {
        console.error('💥 Erreur lors du chargement des affaires:', err);
        setError('Erreur lors du chargement des affaires');
      }
    };

    fetchDeals();
  }, [currentUserId, isAdmin]);

  // Charger les vendeurs et acheteurs quand une affaire est sélectionnée
  useEffect(() => {
    const fetchDealParticipants = async () => {
      if (!selectedDealId) {
        setSellers([]);
        setBuyers([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Charger les vendeurs avec toutes les informations du contact
        const { data: sellersData, error: sellersError } = await supabase
          .from('sellers')
          .select(`
            id,
            contact_id,
            contact:contact_id (
              id,
              first_name,
              last_name,
              email,
              phone,
              type_personne_id,
              marital_status_id,
              marriage_contract
            )
          `)
          .eq('deal_id', selectedDealId);

        if (sellersError) throw sellersError;

        // Charger les acheteurs avec toutes les informations du contact
        const { data: buyersData, error: buyersError } = await supabase
          .from('buyers')
          .select(`
            id,
            contact_id,
            contact:contact_id (
              id,
              first_name,
              last_name,
              email,
              phone,
              type_personne_id,
              marital_status_id,
              marriage_contract
            )
          `)
          .eq('deal_id', selectedDealId);

        if (buyersError) throw buyersError;

        setSellers(sellersData || []);
        setBuyers(buyersData || []);

        console.log('Vendeurs chargés:', sellersData);
        console.log('Acheteurs chargés:', buyersData);

      } catch (err) {
        console.error('Erreur lors du chargement des participants:', err);
        setError('Erreur lors du chargement des participants de l\'affaire');
      } finally {
        setLoading(false);
      }
    };

    fetchDealParticipants();
  }, [selectedDealId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const getContactDisplayName = (contact: Contact) => {
    return `${contact.first_name} ${contact.last_name}`.trim() || contact.email || 'Contact sans nom';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Vérifier si l'utilisateur peut modifier cette affaire
  const canModifyDeal = (dealAgentId: string) => {
    return isAdmin || dealAgentId === currentUserId;
  };

  // Obtenir les permissions pour l'affaire sélectionnée
  const selectedDeal = deals.find(d => d.id === selectedDealId);
  const canModifySelectedDeal = selectedDeal ? canModifyDeal(selectedDeal.agent_id) : false;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg">
        <button
          type="button"
          onClick={handleToggle}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Sélection de l'Affaire
              {isAdmin && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </span>
              )}
              {selectedDealId && (
                <span className="ml-2 text-sm text-gray-500">
                  - {deals.find(d => d.id === selectedDealId)?.name}
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
              {/* Sélection de l'affaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choisissez une affaire
                  {isAdmin && (
                    <span className="ml-2 text-sm text-blue-600">
                      ({deals.length} affaires disponibles - toutes les affaires)
                    </span>
                  )}
                </label>
                <select
                  value={selectedDealId}
                  onChange={(e) => setSelectedDealId(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez une affaire</option>
                  {deals.map((deal) => (
                    <option key={deal.id} value={deal.id}>
                      {deal.name} - {formatDate(deal.created_at)}
                      {isAdmin && deal.agent_name && ` (Agent: ${deal.agent_name})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Indicateur de permissions */}
              {selectedDeal && (
                <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Affaire sélectionnée : {selectedDeal.name}
                      </p>
                      {isAdmin && selectedDeal.agent_name && (
                        <p className="text-xs text-gray-600">
                          Agent responsable : {selectedDeal.agent_name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      {canModifySelectedDeal ? (
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
                </div>
              )}

              {/* Affichage des erreurs */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Indicateur de chargement */}
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Chargement des participants...</span>
                </div>
              )}

              {/* Debug info pour les admins */}
              {isAdmin && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md text-sm">
                  <strong>Debug Admin:</strong> {deals.length} affaires chargées, Utilisateur: {currentUserId.substring(0, 8)}...
                </div>
              )}

              {/* Affichage des vendeurs et acheteurs */}
              {selectedDealId && !loading && (
                <div className="space-y-6">
                  {/* Section Vendeurs */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <Users className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="text-lg font-semibold text-blue-900">
                        Vendeurs ({sellers.length})
                      </h3>
                    </div>
                    
                    {sellers.length === 0 ? (
                      <p className="text-blue-700 italic">Aucun vendeur associé à cette affaire</p>
                    ) : (
                      <div className="space-y-3">
                        {sellers.map((seller, index) => (
                          <div key={seller.id} className="bg-white rounded-md p-3 border border-blue-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Vendeur {index + 1}: {getContactDisplayName(seller.contact)}
                                </h4>
                                <div className="mt-2 space-y-1">
                                  {seller.contact.email && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Mail className="h-4 w-4 mr-2" />
                                      {seller.contact.email}
                                    </div>
                                  )}
                                  {seller.contact.phone && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Phone className="h-4 w-4 mr-2" />
                                      {seller.contact.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section Acheteurs */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <Users className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-green-900">
                        Acheteurs ({buyers.length})
                      </h3>
                    </div>
                    
                    {buyers.length === 0 ? (
                      <p className="text-green-700 italic">Aucun acheteur associé à cette affaire</p>
                    ) : (
                      <div className="space-y-3">
                        {buyers.map((buyer, index) => (
                          <div key={buyer.id} className="bg-white rounded-md p-3 border border-green-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Acheteur {index + 1}: {getContactDisplayName(buyer.contact)}
                                </h4>
                                <div className="mt-2 space-y-1">
                                  {buyer.contact.email && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Mail className="h-4 w-4 mr-2" />
                                      {buyer.contact.email}
                                    </div>
                                  )}
                                  {buyer.contact.phone && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Phone className="h-4 w-4 mr-2" />
                                      {buyer.contact.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Composants de génération de documents - seulement si permissions */}
      {selectedDealId && !loading && canModifySelectedDeal && (
        <div className="space-y-6">
          {/* Composant de génération de documents personnels */}
          {(sellers.length > 0 || buyers.length > 0) && (
            <PersonalDocGen
              dealId={selectedDealId}
              sellers={sellers}
              buyers={buyers}
            />
          )}

          {/* Composant de génération de documents du bien */}
          <PropertyDocGen
            dealId={selectedDealId}
          />

          {/* Composant de génération de documents travaux/sinistres */}
          <WorkClaimDocGen
            dealId={selectedDealId}
          />

          {/* Composant de génération de documents diagnostics */}
          <DiagDocGen
            dealId={selectedDealId}
          />

          {/* Composant de génération d'autres documents */}
          <OtherDocGen
            dealId={selectedDealId}
          />
        </div>
      )}

      {/* Message si pas de permissions de génération */}
      {selectedDealId && !loading && !canModifySelectedDeal && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Mode consultation</p>
              <p className="text-xs text-yellow-700 mt-1">
                Vous pouvez consulter les informations de cette affaire mais pas générer de nouveaux documents car elle appartient à un autre agent.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealSelector;