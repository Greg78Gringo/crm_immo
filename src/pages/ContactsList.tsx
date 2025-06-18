import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactsTable from '../components/contacts/ContactsTable';
import ContactsFilters from '../components/contacts/ContactsFilters';
import ContactsStats from '../components/contacts/ContactsStats';
import { supabase } from '../lib/supabase';
import { Users } from 'lucide-react';

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  postal_code: string;
  type_personne_id: string;
  marital_status_id: string;
  children_count: number;
  agent_id: string;
  source: string;
  created_at: string;
  // Relations
  agent?: {
    first_name: string;
    last_name: string;
  };
}

export interface FilterState {
  myContacts: boolean;
  city: string;
  personType: string;
  maritalStatus: string;
  childrenCount: string;
  agent: string;
}

const ContactsList = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [agentsCache, setAgentsCache] = useState<Map<string, { first_name: string; last_name: string }>>(new Map());
  
  // États pour les filtres - par défaut on affiche TOUS les contacts
  const [filters, setFilters] = useState<FilterState>({
    myContacts: false,
    city: '',
    personType: '',
    maritalStatus: '',
    childrenCount: '',
    agent: ''
  });

  // États pour le tri et la pagination
  const [sortField, setSortField] = useState<string>('last_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const contactsPerPage = 50;

  // Charger l'utilisateur actuel et le cache des agents
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Charger l'utilisateur actuel
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          console.log('Utilisateur actuel chargé:', user.id);
          setCurrentUserId(user.id);
        }

        // Charger tous les agents depuis la vue
        console.log('Chargement du cache des agents...');
        const { data: agentsData, error: agentsError } = await supabase
          .from('agents_view')
          .select('id, first_name, last_name');

        if (agentsError) {
          console.warn('Erreur lors du chargement des agents:', agentsError);
          // Fallback : utiliser les métadonnées de l'utilisateur actuel
          if (user) {
            const metadata = user.user_metadata || {};
            setAgentsCache(new Map([[user.id, {
              first_name: metadata.first_name || 'Mon',
              last_name: metadata.last_name || 'Compte'
            }]]));
          }
        } else {
          console.log('Agents chargés:', agentsData?.length || 0);
          const agentsMap = new Map();
          agentsData?.forEach(agent => {
            agentsMap.set(agent.id, {
              first_name: agent.first_name || 'Agent',
              last_name: agent.last_name || agent.id.substring(0, 8)
            });
          });
          setAgentsCache(agentsMap);
        }

      } catch (err) {
        console.error('Erreur lors de l\'initialisation:', err);
        setError('Erreur lors de l\'initialisation des données');
      }
    };

    initializeData();
  }, []);

  // Fonction pour charger les contacts (mémorisée pour éviter les re-créations)
  const fetchContacts = useCallback(async () => {
    if (!currentUserId || agentsCache.size === 0) return;

    console.log('🔄 Début du chargement des contacts...');
    console.log('📊 Filtres actifs:', filters);
    console.log('👥 Cache des agents:', agentsCache.size, 'agents');
    setLoading(true);
    setError('');

    try {
      // Requête de base pour récupérer TOUS les contacts
      let query = supabase
        .from('contact')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          city,
          postal_code,
          type_personne_id,
          marital_status_id,
          children_count,
          agent_id,
          source,
          created_at
        `)
        .order(sortField, { ascending: sortDirection === 'asc' });

      // Appliquer les filtres SEULEMENT si ils sont activés
      if (filters.myContacts) {
        console.log('🔍 Filtrage par mes contacts:', currentUserId);
        query = query.eq('agent_id', currentUserId);
      }

      if (filters.city) {
        console.log('🏙️ Filtrage par ville:', filters.city);
        query = query.ilike('city', `%${filters.city}%`);
      }

      if (filters.personType) {
        console.log('👤 Filtrage par type de personne:', filters.personType);
        query = query.eq('type_personne_id', filters.personType);
      }

      if (filters.maritalStatus) {
        console.log('💍 Filtrage par statut marital:', filters.maritalStatus);
        query = query.eq('marital_status_id', filters.maritalStatus);
      }

      if (filters.childrenCount) {
        console.log('👶 Filtrage par nombre d\'enfants:', filters.childrenCount);
        if (filters.childrenCount === '3+') {
          query = query.gte('children_count', 3);
        } else {
          query = query.eq('children_count', parseInt(filters.childrenCount));
        }
      }

      if (filters.agent) {
        console.log('🧑‍💼 Filtrage par agent:', filters.agent);
        query = query.eq('agent_id', filters.agent);
      }

      // Augmenter la limite pour voir plus de contacts
      query = query.limit(1000);

      console.log('📡 Exécution de la requête...');
      const { data: contactsData, error: contactsError } = await query;

      if (contactsError) {
        console.error('❌ Erreur de requête:', contactsError);
        throw contactsError;
      }

      console.log('✅ Contacts récupérés:', contactsData?.length || 0);

      if (!contactsData || contactsData.length === 0) {
        console.log('⚠️ Aucun contact trouvé avec les filtres actuels');
        setContacts([]);
        setFilteredContacts([]);
        setTotalContacts(0);
        setCurrentPage(1);
        setLoading(false);
        return;
      }

      // Associer les agents aux contacts avec les vrais noms
      const contactsWithAgents = contactsData.map(contact => {
        const agentInfo = agentsCache.get(contact.agent_id);
        return {
          ...contact,
          agent: agentInfo || {
            first_name: 'Agent',
            last_name: contact.agent_id.substring(0, 8)
          }
        };
      });

      setContacts(contactsWithAgents);
      setFilteredContacts(contactsWithAgents);
      setTotalContacts(contactsWithAgents.length);
      
      // Réinitialiser à la première page si on a changé les filtres
      setCurrentPage(1);

      console.log('🎉 Chargement terminé avec succès:', contactsWithAgents.length, 'contacts');

    } catch (err) {
      console.error('💥 Erreur lors du chargement des contacts:', err);
      setError(`Erreur lors du chargement des contacts: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, filters, sortField, sortDirection, agentsCache]);

  // Charger les contacts quand les dépendances changent
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Gérer les changements de filtres
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    console.log('🔧 Changement de filtres:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Gérer les changements de tri
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Naviguer vers la vue détaillée d'un contact
  const handleViewContact = (contactId: string) => {
    navigate(`/contact/${contactId}`);
  };

  // Naviguer vers l'édition d'un contact (seulement si propriétaire)
  const handleEditContact = (contactId: string) => {
    navigate(`/contact/${contactId}/edit`);
  };

  // Calculer les contacts pour la page actuelle
  const startIndex = (currentPage - 1) * contactsPerPage;
  const endIndex = startIndex + contactsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête fixe */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Liste des Contacts</h1>
                <p className="text-sm text-gray-600">
                  {totalContacts} contact{totalContacts > 1 ? 's' : ''} 
                  {filters.myContacts ? ' (mes contacts)' : filters.agent ? ` (agent sélectionné)` : ' (tous les agents)'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/new-contact')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              Nouveau Contact
            </button>
          </div>

          {/* Messages d'erreur */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Message de débogage */}
          {!loading && (
            <div className="mt-2 text-xs text-gray-500">
              Debug: {contacts.length} contacts chargés, {filteredContacts.length} après filtrage, {agentsCache.size} agents en cache
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-6 py-6 space-y-6">
        {/* Statistiques */}
        <ContactsStats 
          contacts={contacts}
          currentUserId={currentUserId}
        />

        {/* Filtres */}
        <ContactsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          currentUserId={currentUserId}
          agentsCache={agentsCache}
        />

        {/* Tableau des contacts */}
        <ContactsTable
          contacts={currentContacts}
          loading={loading}
          currentUserId={currentUserId}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onViewContact={handleViewContact}
          onEditContact={handleEditContact}
          currentPage={currentPage}
          totalPages={totalPages}
          totalContacts={filteredContacts.length}
          contactsPerPage={contactsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ContactsList;