import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp, Users, Mail, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import PersonalDocGen from './PersonalDocGen';
import PropertyDocGen from './PropertyDocGen';
import WorkClaimDocGen from './WorkClaimDocGen';
import DiagDocGen from './DiagDocGen';
import OtherDocGen from './OtherDocGen';

interface Deal {
  id: string;
  name: string;
  created_at: string;
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string>('');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les affaires de l'agent
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (user) {
          const { data: dealsData, error: dealsError } = await supabase
            .from('deals')
            .select('id, name, created_at')
            .eq('agent_id', user.id)
            .order('created_at', { ascending: false });

          if (dealsError) throw dealsError;
          setDeals(dealsData || []);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des affaires:', err);
        setError('Erreur lors du chargement des affaires');
      }
    };

    fetchDeals();
  }, []);

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
                    </option>
                  ))}
                </select>
              </div>

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

      {/* Composants de génération de documents */}
      {selectedDealId && !loading && (
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
    </div>
  );
};

export default DealSelector;