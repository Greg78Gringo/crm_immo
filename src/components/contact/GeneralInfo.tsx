import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GeneralInfoProps {
  source: string;
  setSource: (source: string) => void;
  readOnly?: boolean;
}

const GeneralInfo = ({
  source,
  setSource,
  readOnly = false
}: GeneralInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [agentName, setAgentName] = useState('');

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

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
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
              {readOnly ? (
                <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                  {source || 'Non renseigné'}
                </div>
              ) : (
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez une source</option>
                  <option value="agent">Agent</option>
                  <option value="internet">Internet</option>
                </select>
              )}
            </div>

            {source === 'agent' && agentName && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom de l'agent
                </label>
                <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900">
                  {agentName}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralInfo;