import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SinistreItem {
  id?: string;
  designation_sinistre: string;
  description_sinistre: string;
  date_declaration: string;
  montant_des_travaux: number;
}

interface SinistreEnCoursProps {
  dealId: string | null;
  sinistres: SinistreItem[];
  setSinistres: (sinistres: SinistreItem[]) => void;
}

const SinistreEnCours = ({ dealId, sinistres, setSinistres }: SinistreEnCoursProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  // Clear error when dealId changes (after save)
  useEffect(() => {
    if (dealId) {
      setError('');
      loadSinistres();
    }
  }, [dealId]);

  const loadSinistres = async () => {
    if (!dealId) return;

    try {
      const { data, error: loadError } = await supabase
        .from('sinistre_en_cours')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: true });

      if (loadError) throw loadError;

      if (data && data.length > 0) {
        const loadedSinistres = data.map(item => ({
          id: item.id,
          designation_sinistre: item.designation_sinistre || '',
          description_sinistre: item.description_sinistre || '',
          date_declaration: item.date_declaration || '',
          montant_des_travaux: item.montant_des_travaux || 0
        }));
        setSinistres(loadedSinistres);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des sinistres:', err);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const addSinistre = async () => {
    if (!dealId) {
      setError('Veuillez d\'abord sauvegarder l\'affaire');
      return;
    }

    setError(''); // Clear any previous error
    try {
      const { data, error: insertError } = await supabase
        .from('sinistre_en_cours')
        .insert({
          deal_id: dealId,
          designation_sinistre: '',
          description_sinistre: '',
          date_declaration: null,
          montant_des_travaux: 0
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setSinistres([...sinistres, {
        id: data.id,
        designation_sinistre: '',
        description_sinistre: '',
        date_declaration: '',
        montant_des_travaux: 0
      }]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setError('Erreur lors de l\'ajout du sinistre');
    }
  };

  const removeSinistre = async (e: React.MouseEvent, index: number) => {
    // Empêcher la propagation de l'événement pour éviter de fermer le composant
    e.preventDefault();
    e.stopPropagation();
    
    setError(''); // Clear any previous error
    const sinistreToRemove = sinistres[index];
    
    // Si l'élément a un ID, le supprimer de la base de données
    if (sinistreToRemove.id && dealId) {
      try {
        const { error } = await supabase
          .from('sinistre_en_cours')
          .delete()
          .eq('id', sinistreToRemove.id);

        if (error) throw error;
        
        console.log(`Sinistre supprimé de la base de données: ${sinistreToRemove.id}`);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression du sinistre');
        return; // Ne pas continuer si la suppression en base a échoué
      }
    }

    // Supprimer l'élément de l'état local
    const newSinistres = [...sinistres];
    newSinistres.splice(index, 1);
    setSinistres(newSinistres);
    
    console.log(`Sinistre supprimé de l'interface: index ${index}`);
  };

  const updateSinistre = async (index: number, field: keyof SinistreItem, value: string | number) => {
    setError(''); // Clear any previous error
    const sinistre = sinistres[index];
    
    // Mettre à jour l'état local immédiatement
    const newSinistres = [...sinistres];
    newSinistres[index] = { ...newSinistres[index], [field]: value };
    setSinistres(newSinistres);

    // Si l'élément a un ID, mettre à jour la base de données
    if (sinistre.id && dealId) {
      try {
        const updateData: any = {};
        if (field === 'designation_sinistre') {
          updateData.designation_sinistre = value || null;
        } else if (field === 'description_sinistre') {
          updateData.description_sinistre = value || null;
        } else if (field === 'date_declaration') {
          updateData.date_declaration = value || null;
        } else if (field === 'montant_des_travaux') {
          updateData.montant_des_travaux = value || null;
        }

        const { error: updateError } = await supabase
          .from('sinistre_en_cours')
          .update(updateData)
          .eq('id', sinistre.id);

        if (updateError) throw updateError;
      } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
        setError('Erreur lors de la mise à jour du sinistre');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Sinistres en cours
            {sinistres.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                - {sinistres.length} sinistre{sinistres.length > 1 ? 's' : ''}
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
            {sinistres.map((sinistre, index) => (
              <div key={sinistre.id || index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Sinistre {index + 1}
                    {sinistre.designation_sinistre && (
                      <span className="ml-2 text-sm text-gray-500">
                        - {sinistre.designation_sinistre}
                      </span>
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => removeSinistre(e, index)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                    title="Supprimer le sinistre"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Désignation du sinistre
                    </label>
                    <input
                      type="text"
                      value={sinistre.designation_sinistre}
                      onChange={(e) => updateSinistre(index, 'designation_sinistre', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Dégât des eaux, Incendie..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date de déclaration
                    </label>
                    <input
                      type="date"
                      value={sinistre.date_declaration}
                      onChange={(e) => updateSinistre(index, 'date_declaration', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description du sinistre
                    </label>
                    <textarea
                      value={sinistre.description_sinistre}
                      onChange={(e) => updateSinistre(index, 'description_sinistre', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Décrivez les détails du sinistre..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Montant des travaux
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={sinistre.montant_des_travaux || ''}
                        onChange={(e) => updateSinistre(index, 'montant_des_travaux', parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={addSinistre}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter Sinistre
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinistreEnCours;