import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { FilterState } from '../../pages/ContactsList';

interface ContactsFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  currentUserId: string;
  agentsCache?: Map<string, { first_name: string; last_name: string }>;
}

const ContactsFilters = ({ filters, onFilterChange, currentUserId, agentsCache = new Map() }: ContactsFiltersProps) => {
  const [cities, setCities] = useState<string[]>([]);
  const [personTypes, setPersonTypes] = useState<string[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<string[]>([]);
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les options de filtres une seule fois
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        console.log('Chargement des options de filtres...');

        // Charger les villes uniques
        const { data: citiesData } = await supabase
          .from('contact')
          .select('city')
          .not('city', 'is', null)
          .not('city', 'eq', '');

        const uniqueCities = [...new Set(citiesData?.map(c => c.city) || [])].sort();
        setCities(uniqueCities);

        // Charger les types de personne uniques (stockés en texte)
        const { data: personTypesData } = await supabase
          .from('contact')
          .select('type_personne_id')
          .not('type_personne_id', 'is', null)
          .not('type_personne_id', 'eq', '');

        const uniquePersonTypes = [...new Set(personTypesData?.map(p => p.type_personne_id) || [])].sort();
        setPersonTypes(uniquePersonTypes);

        // Charger les statuts maritaux uniques (stockés en texte)
        const { data: maritalStatusesData } = await supabase
          .from('contact')
          .select('marital_status_id')
          .not('marital_status_id', 'is', null)
          .not('marital_status_id', 'eq', '');

        const uniqueMaritalStatuses = [...new Set(maritalStatusesData?.map(m => m.marital_status_id) || [])].sort();
        setMaritalStatuses(uniqueMaritalStatuses);

        // Charger les agents depuis le cache (qui contient maintenant les vrais noms)
        const agentsWithNames = Array.from(agentsCache.entries()).map(([id, info]) => ({
          id,
          name: `${info.first_name} ${info.last_name}`.trim()
        })).sort((a, b) => a.name.localeCompare(b.name));

        setAgents(agentsWithNames);

        console.log('Options de filtres chargées:', {
          cities: uniqueCities.length,
          personTypes: uniquePersonTypes.length,
          maritalStatuses: uniqueMaritalStatuses.length,
          agents: agentsWithNames.length
        });

      } catch (err) {
        console.error('Erreur lors du chargement des options de filtres:', err);
      } finally {
        setLoading(false);
      }
    };

    // Attendre que le cache des agents soit chargé
    if (agentsCache.size > 0) {
      fetchFilterOptions();
    }
  }, [agentsCache]);

  const clearAllFilters = () => {
    onFilterChange({
      myContacts: false,
      city: '',
      personType: '',
      maritalStatus: '',
      childrenCount: '',
      agent: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === 'boolean' ? value : value !== ''
  );

  const childrenOptions = [
    { value: '0', label: '0 enfant' },
    { value: '1', label: '1 enfant' },
    { value: '2', label: '2 enfants' },
    { value: '3+', label: '3+ enfants' }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Actifs
              </span>
            )}
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Effacer tout
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Mes contacts */}
          <div className="md:col-span-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.myContacts}
                onChange={(e) => {
                  console.log('Changement myContacts:', e.target.checked);
                  onFilterChange({ 
                    myContacts: e.target.checked,
                    // Si on active "mes contacts", désactiver le filtre agent
                    agent: e.target.checked ? '' : filters.agent
                  });
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Mes contacts</span>
            </label>
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <select
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Type de personne */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de personne
            </label>
            <select
              value={filters.personType}
              onChange={(e) => onFilterChange({ personType: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Tous les types</option>
              {personTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Statut marital */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut marital
            </label>
            <select
              value={filters.maritalStatus}
              onChange={(e) => onFilterChange({ maritalStatus: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Tous les statuts</option>
              {maritalStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre d'enfants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enfants
            </label>
            <select
              value={filters.childrenCount}
              onChange={(e) => onFilterChange({ childrenCount: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Tous</option>
              {childrenOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Agent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent ({agents.length} agents)
            </label>
            <select
              value={filters.agent}
              onChange={(e) => {
                console.log('Changement agent:', e.target.value);
                onFilterChange({ 
                  agent: e.target.value,
                  // Si on sélectionne un agent, désactiver "mes contacts"
                  myContacts: e.target.value ? false : filters.myContacts
                });
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Tous les agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                  {agent.id === currentUserId && ' (Moi)'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsFilters;