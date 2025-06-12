import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TravauxItem {
  id?: string;
  description_travaux: string;
  date_travaux: string;
  sinistre_catastrophe_naturelle: boolean;
  declaration_prealable: boolean;
  permis_construire: boolean;
  nom_entreprise: string;
  adresse_entreprise: string;
  code_postal_entreprise: string;
  ville_entreprise: string;
  nom_assureur: string;
  adresse_assureur: string;
  code_postal_assureur: string;
  ville_assureur: string;
}

interface ListeTravauxRealisesProps {
  dealId: string | null;
  travaux: TravauxItem[];
  setTravaux: (travaux: TravauxItem[]) => void;
}

const ListeTravauxRealises = ({ dealId, travaux, setTravaux }: ListeTravauxRealisesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  // Clear error when dealId changes (after save)
  useEffect(() => {
    if (dealId) {
      setError('');
      loadTravaux();
    }
  }, [dealId]);

  const loadTravaux = async () => {
    if (!dealId) return;

    try {
      const { data, error: loadError } = await supabase
        .from('liste_travaux')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: true });

      if (loadError) throw loadError;

      if (data && data.length > 0) {
        const loadedTravaux = data.map(item => ({
          id: item.id,
          description_travaux: item.description_travaux || '',
          date_travaux: item.date_travaux || '',
          sinistre_catastrophe_naturelle: item.sinistre_catastrophe_naturelle || false,
          declaration_prealable: item.declaration_prealable || false,
          permis_construire: item.permis_construire || false,
          nom_entreprise: item.nom_entreprise || '',
          adresse_entreprise: item.adresse_entreprise || '',
          code_postal_entreprise: item.code_postal_entreprise || '',
          ville_entreprise: item.ville_entreprise || '',
          nom_assureur: item.nom_assureur || '',
          adresse_assureur: item.adresse_assureur || '',
          code_postal_assureur: item.code_postal_assureur || '',
          ville_assureur: item.ville_assureur || ''
        }));
        setTravaux(loadedTravaux);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des travaux:', err);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const addTravaux = async () => {
    if (!dealId) {
      setError('Veuillez d\'abord sauvegarder l\'affaire');
      return;
    }

    setError(''); // Clear any previous error
    try {
      const { data, error: insertError } = await supabase
        .from('liste_travaux')
        .insert({
          deal_id: dealId,
          description_travaux: '',
          date_travaux: null,
          sinistre_catastrophe_naturelle: false,
          declaration_prealable: false,
          permis_construire: false,
          nom_entreprise: '',
          adresse_entreprise: '',
          code_postal_entreprise: '',
          ville_entreprise: '',
          nom_assureur: '',
          adresse_assureur: '',
          code_postal_assureur: '',
          ville_assureur: ''
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setTravaux([...travaux, {
        id: data.id,
        description_travaux: '',
        date_travaux: '',
        sinistre_catastrophe_naturelle: false,
        declaration_prealable: false,
        permis_construire: false,
        nom_entreprise: '',
        adresse_entreprise: '',
        code_postal_entreprise: '',
        ville_entreprise: '',
        nom_assureur: '',
        adresse_assureur: '',
        code_postal_assureur: '',
        ville_assureur: ''
      }]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setError('Erreur lors de l\'ajout des travaux');
    }
  };

  const removeTravaux = async (e: React.MouseEvent, index: number) => {
    // Empêcher la propagation de l'événement pour éviter de fermer le composant
    e.preventDefault();
    e.stopPropagation();
    
    setError(''); // Clear any previous error
    const travauxToRemove = travaux[index];
    
    // Si l'élément a un ID, le supprimer de la base de données
    if (travauxToRemove.id && dealId) {
      try {
        const { error } = await supabase
          .from('liste_travaux')
          .delete()
          .eq('id', travauxToRemove.id);

        if (error) throw error;
        
        console.log(`Travaux supprimé de la base de données: ${travauxToRemove.id}`);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression des travaux');
        return; // Ne pas continuer si la suppression en base a échoué
      }
    }

    // Supprimer l'élément de l'état local
    const newTravaux = [...travaux];
    newTravaux.splice(index, 1);
    setTravaux(newTravaux);
    
    console.log(`Travaux supprimé de l'interface: index ${index}`);
  };

  const updateTravaux = async (index: number, field: keyof TravauxItem, value: string | boolean) => {
    setError(''); // Clear any previous error
    const travauxItem = travaux[index];
    
    // Mettre à jour l'état local immédiatement
    const newTravaux = [...travaux];
    newTravaux[index] = { ...newTravaux[index], [field]: value };
    setTravaux(newTravaux);

    // Si l'élément a un ID, mettre à jour la base de données
    if (travauxItem.id && dealId) {
      try {
        const updateData: any = {};
        updateData[field] = value || null;

        const { error: updateError } = await supabase
          .from('liste_travaux')
          .update(updateData)
          .eq('id', travauxItem.id);

        if (updateError) throw updateError;
      } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
        setError('Erreur lors de la mise à jour des travaux');
      }
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
          <Wrench className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Liste des travaux réalisés
            {travaux.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                - {travaux.length} travaux
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
            {travaux.map((travauxItem, index) => (
              <div key={travauxItem.id || index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Travaux {index + 1}
                    {travauxItem.description_travaux && (
                      <span className="ml-2 text-sm text-gray-500">
                        - {travauxItem.description_travaux.substring(0, 50)}
                        {travauxItem.description_travaux.length > 50 ? '...' : ''}
                      </span>
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => removeTravaux(e, index)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                    title="Supprimer les travaux"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Description et date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description travaux
                      </label>
                      <textarea
                        value={travauxItem.description_travaux}
                        onChange={(e) => updateTravaux(index, 'description_travaux', e.target.value)}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Décrivez les travaux réalisés..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date travaux
                      </label>
                      <input
                        type="date"
                        value={travauxItem.date_travaux}
                        onChange={(e) => updateTravaux(index, 'date_travaux', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Cases à cocher */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`sinistre-${index}`}
                        checked={travauxItem.sinistre_catastrophe_naturelle}
                        onChange={(e) => updateTravaux(index, 'sinistre_catastrophe_naturelle', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`sinistre-${index}`} className="ml-2 block text-sm text-gray-700">
                        Sinistre catastrophe naturelle
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`declaration-${index}`}
                        checked={travauxItem.declaration_prealable}
                        onChange={(e) => updateTravaux(index, 'declaration_prealable', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`declaration-${index}`} className="ml-2 block text-sm text-gray-700">
                        Déclaration préalable
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`permis-${index}`}
                        checked={travauxItem.permis_construire}
                        onChange={(e) => updateTravaux(index, 'permis_construire', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`permis-${index}`} className="ml-2 block text-sm text-gray-700">
                        Permis de Construire
                      </label>
                    </div>
                  </div>

                  {/* Informations entreprise */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Informations Entreprise</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nom Entreprise
                        </label>
                        <input
                          type="text"
                          value={travauxItem.nom_entreprise}
                          onChange={(e) => updateTravaux(index, 'nom_entreprise', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nom de l'entreprise"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Adresse Entreprise
                        </label>
                        <input
                          type="text"
                          value={travauxItem.adresse_entreprise}
                          onChange={(e) => updateTravaux(index, 'adresse_entreprise', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Adresse de l'entreprise"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Code postal Entreprise
                        </label>
                        <input
                          type="text"
                          value={travauxItem.code_postal_entreprise}
                          onChange={(e) => updateTravaux(index, 'code_postal_entreprise', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Code postal"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ville Entreprise
                        </label>
                        <input
                          type="text"
                          value={travauxItem.ville_entreprise}
                          onChange={(e) => updateTravaux(index, 'ville_entreprise', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ville de l'entreprise"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informations assureur (seulement si sinistre coché) */}
                  {travauxItem.sinistre_catastrophe_naturelle && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Informations Assureur</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nom Assureur
                          </label>
                          <input
                            type="text"
                            value={travauxItem.nom_assureur}
                            onChange={(e) => updateTravaux(index, 'nom_assureur', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nom de l'assureur"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Adresse Assureur
                          </label>
                          <input
                            type="text"
                            value={travauxItem.adresse_assureur}
                            onChange={(e) => updateTravaux(index, 'adresse_assureur', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Adresse de l'assureur"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Code postal Assureur
                          </label>
                          <input
                            type="text"
                            value={travauxItem.code_postal_assureur}
                            onChange={(e) => updateTravaux(index, 'code_postal_assureur', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Code postal"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Ville Assureur
                          </label>
                          <input
                            type="text"
                            value={travauxItem.ville_assureur}
                            onChange={(e) => updateTravaux(index, 'ville_assureur', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ville de l'assureur"
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
              onClick={addTravaux}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter Travaux
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeTravauxRealises;