import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GeneralInfoProps {
  source: string;
  setSource: (source: string) => void;
  dealId: string | null;
  setDealId: (id: string | null) => void;
}

interface Deal {
  id: string;
  name: string;
}

const GeneralInfo = ({
  source,
  setSource,
  dealId,
  setDealId
}: GeneralInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agentName, setAgentName] = useState('');
  const [linkToDeal, setLinkToDeal] = useState(false);

  useEffect(() => {
    const fetchAgentName = async () => {
      if (source === 'agent') {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          if (user) {
            const metadata = user.user_metadata || {};
            setAgentName(`${metadata.first_name || ''} ${metadata.last_name || ''}`);
          }
        } catch (err) {
          console.error('Erreur lors de la récupération du nom de l\'agent:', err);
        }
      }
    };

    fetchAgentName();
  }, [source]);

  useEffect(() => {
    const fetchDeals = async () => {
      if (linkToDeal) {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          if (user) {
            const { data: dealsData, error: dealsError } = await supabase
              .from('deals')
              .select('id, name')
              .eq('agent_id', user.id)
              .order('created_at', { ascending: false });

            if (dealsError) throw dealsError;
            setDeals(dealsData || []);
          }
        } catch (err) {
          console.error('Erreur lors du chargement des affaires:', err);
          setError('Erreur lors du chargement des affaires');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDeals();
  }, [linkToDeal]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleLinkToDealChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkToDeal(e.target.checked);
    if (!e.target.checked) {
      setDealId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Informations Générales
            {source && <span className="ml-2 text-sm text-gray-500">- {source}</span>}
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez une source</option>
                <option value="agent">Agent</option>
                <option value="internet">Internet</option>
              </select>
            </div>

            {source === 'agent' && agentName && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom de l'agent
                </label>
                <input
                  type="text"
                  value={agentName}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="linkToDeal"
                  checked={linkToDeal}
                  onChange={handleLinkToDealChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="linkToDeal" className="ml-2 block text-sm text-gray-700">
                  Rattacher à une affaire
                </label>
              </div>

              {linkToDeal && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Liste de mes affaires
                  </label>
                  <select
                    value={dealId || ''}
                    onChange={(e) => setDealId(e.target.value || null)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez une affaire</option>
                    {deals.map((deal) => (
                      <option key={deal.id} value={deal.id}>
                        {deal.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralInfo;