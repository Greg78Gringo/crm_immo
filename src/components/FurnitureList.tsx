import React, { useState, useEffect } from 'react';
import { Sofa, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FurnitureItem {
  id?: string;
  nom_mobilier: string;
  prix_mobilier: number;
}

interface FurnitureListProps {
  dealId: string | null;
  furnitureItems: FurnitureItem[];
  setFurnitureItems: (items: FurnitureItem[]) => void;
}

const FurnitureList = ({ dealId, furnitureItems, setFurnitureItems }: FurnitureListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  // Clear error when dealId changes (after save)
  useEffect(() => {
    if (dealId) {
      setError('');
      loadFurnitureItems();
    }
  }, [dealId]);

  const loadFurnitureItems = async () => {
    if (!dealId) return;

    try {
      const { data, error: loadError } = await supabase
        .from('liste_mobilier_restant')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: true });

      if (loadError) throw loadError;

      if (data && data.length > 0) {
        const loadedItems = data.map(item => ({
          id: item.id,
          nom_mobilier: item.nom_mobilier || '',
          prix_mobilier: item.prix_mobilier || 0
        }));
        setFurnitureItems(loadedItems);
      }
    } catch (err) {
      console.error('Erreur lors du chargement du mobilier:', err);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const addFurnitureItem = async () => {
    if (!dealId) {
      setError('Veuillez d\'abord sauvegarder l\'affaire');
      return;
    }

    setError(''); // Clear any previous error
    try {
      const { data, error: insertError } = await supabase
        .from('liste_mobilier_restant')
        .insert({
          deal_id: dealId,
          nom_mobilier: '',
          prix_mobilier: 0
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setFurnitureItems([...furnitureItems, {
        id: data.id,
        nom_mobilier: '',
        prix_mobilier: 0
      }]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setError('Erreur lors de l\'ajout du mobilier');
    }
  };

  const removeFurnitureItem = async (e: React.MouseEvent, index: number) => {
    // Empêcher la propagation de l'événement pour éviter de fermer le composant
    e.preventDefault();
    e.stopPropagation();
    
    setError(''); // Clear any previous error
    const itemToRemove = furnitureItems[index];
    
    // Si l'élément a un ID, le supprimer de la base de données
    if (itemToRemove.id && dealId) {
      try {
        const { error } = await supabase
          .from('liste_mobilier_restant')
          .delete()
          .eq('id', itemToRemove.id);

        if (error) throw error;
        
        console.log(`Mobilier supprimé de la base de données: ${itemToRemove.id}`);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression du mobilier');
        return; // Ne pas continuer si la suppression en base a échoué
      }
    }

    // Supprimer l'élément de l'état local
    const newItems = [...furnitureItems];
    newItems.splice(index, 1);
    setFurnitureItems(newItems);
    
    console.log(`Mobilier supprimé de l'interface: index ${index}`);
  };

  const updateFurnitureItem = async (index: number, field: keyof FurnitureItem, value: string | number) => {
    setError(''); // Clear any previous error
    const item = furnitureItems[index];
    
    // Mettre à jour l'état local immédiatement
    const newItems = [...furnitureItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFurnitureItems(newItems);

    // Si l'élément a un ID, mettre à jour la base de données
    if (item.id && dealId) {
      try {
        const updateData: any = {};
        if (field === 'nom_mobilier') {
          updateData.nom_mobilier = value || null;
        } else if (field === 'prix_mobilier') {
          updateData.prix_mobilier = value || null;
        }

        const { error: updateError } = await supabase
          .from('liste_mobilier_restant')
          .update(updateData)
          .eq('id', item.id);

        if (updateError) throw updateError;
      } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
        setError('Erreur lors de la mise à jour du mobilier');
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
          <Sofa className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Liste du Mobilier restant
            {furnitureItems.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                - {furnitureItems.length} élément{furnitureItems.length > 1 ? 's' : ''}
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
            {furnitureItems.map((item, index) => (
              <div key={item.id || index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Mobilier {index + 1}
                    {item.nom_mobilier && (
                      <span className="ml-2 text-sm text-gray-500">
                        - {item.nom_mobilier}
                      </span>
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => removeFurnitureItem(e, index)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                    title="Supprimer le mobilier"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nom du mobilier
                    </label>
                    <input
                      type="text"
                      value={item.nom_mobilier}
                      onChange={(e) => updateFurnitureItem(index, 'nom_mobilier', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Canapé, Table, Armoire..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Valeur estimée
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.prix_mobilier || ''}
                        onChange={(e) => updateFurnitureItem(index, 'prix_mobilier', parseFloat(e.target.value) || 0)}
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
              onClick={addFurnitureItem}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter Mobilier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FurnitureList;