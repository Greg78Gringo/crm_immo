import React, { useState } from 'react';
import { Target, ChevronDown, ChevronUp } from 'lucide-react';

interface ProjectDiscoveryProps {
  projectContext: string;
  setProjectContext: (context: string) => void;
  needsAndMotivations: string;
  setNeedsAndMotivations: (needs: string) => void;
  possibleCompromises: string;
  setPossibleCompromises: (compromises: string) => void;
  financing: string;
  setFinancing: (financing: string) => void;
}

const ProjectDiscovery = ({
  projectContext,
  setProjectContext,
  needsAndMotivations,
  setNeedsAndMotivations,
  possibleCompromises,
  setPossibleCompromises,
  financing,
  setFinancing
}: ProjectDiscoveryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
          <Target className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Découverte du Projet Immobilier
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
                Contexte du projet
              </label>
              <textarea
                value={projectContext}
                onChange={(e) => setProjectContext(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez le contexte et les circonstances du projet immobilier..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Les besoins et les motivations
              </label>
              <textarea
                value={needsAndMotivations}
                onChange={(e) => setNeedsAndMotivations(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Quels sont les besoins spécifiques et les motivations pour ce projet ?..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Les compromis possibles
              </label>
              <textarea
                value={possibleCompromises}
                onChange={(e) => setPossibleCompromises(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Sur quels aspects seriez-vous prêt(e) à faire des compromis ?..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Le financement
              </label>
              <textarea
                value={financing}
                onChange={(e) => setFinancing(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez votre situation financière et vos modalités de financement..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDiscovery;