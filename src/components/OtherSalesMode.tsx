import React, { useState, useEffect } from 'react';
import { Store, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SalesMode {
  id?: string;
  mode: string;
  mandateType?: string;
  name: string;
  url: string;
  price: number;
  agencyCommission?: number;
  listingDate: string;
}

interface OtherSalesModeProps {
  dealId: string | null;
  salesModes: SalesMode[];
  setSalesModes: (modes: SalesMode[]) => void;
}

const OtherSalesMode = ({ dealId, salesModes, setSalesModes }: OtherSalesModeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  // Clear error when dealId changes (after save)
  useEffect(() => {
    if (dealId) {
      setError('');
    }
  }, [dealId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const addSalesMode = async () => {
    if (!dealId) {
      setError('Veuillez d\'abord sauvegarder l\'affaire');
      return;
    }

    setError(''); // Clear any previous error
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error: insertError } = await supabase
        .from('autre_mode_vente')
        .insert({
          deal_id: dealId,
          mode: '',
          name: '',
          url: '',
          price: 0,
          listing_date: today
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setSalesModes([...salesModes, {
        id: data.id,
        mode: '',
        name: '',
        url: '',
        price: 0,
        listingDate: today
      }]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setError('Erreur lors de l\'ajout du mode de vente');
    }
  };

  const removeSalesMode = async (index: number) => {
    setError(''); // Clear any previous error
    const modeToRemove = salesModes[index];
    if (modeToRemove.id && dealId) {
      try {
        const { error } = await supabase
          .from('autre_mode_vente')
          .delete()
          .eq('id', modeToRemove.id);

        if (error) throw error;
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression du mode de vente');
        return;
      }
    }

    const newModes = [...salesModes];
    newModes.splice(index, 1);
    setSalesModes(newModes);
  };

  const updateSalesMode = async (index: number, field: keyof SalesMode, value: string | number) => {
    setError(''); // Clear any previous error
    const mode = salesModes[index];
    if (!mode.id || !dealId) return;

    const newModes = [...salesModes];
    newModes[index] = { ...newModes[index], [field]: value };

    try {
      const updateData: any = {};

      // Gérer les champs spéciaux
      if (field === 'listingDate') {
        updateData.listing_date = value || null;
      } else if (field === 'mandateType') {
        updateData.mandate_type = value || null;
      } else if (field === 'agencyCommission') {
        updateData.agency_commission = value || null;
      } else {
        updateData[field] = value || null;
      }

      // Si le mode est PAP, on supprime les champs spécifiques à l'agence
      if (field === 'mode') {
        if (value === 'pap') {
          updateData.mandate_type = null;
          updateData.agency_commission = null;
          newModes[index].mandateType = undefined;
          newModes[index].agencyCommission = undefined;
        }
      }

      const { error: updateError } = await supabase
        .from('autre_mode_vente')
        .update(updateData)
        .eq('id', mode.id);

      if (updateError) throw updateError;
      setSalesModes(newModes);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour du mode de vente');
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
          <Store className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Autres Modes de Vente
            {salesModes.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                - {salesModes.length} mode{salesModes.length > 1 ? 's' : ''}
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
            {salesModes.map((mode, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Mode de Vente {index + 1}
                  </h3>
                  <button
                    onClick={() => removeSalesMode(index)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer le mode de vente"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mode de vente
                    </label>
                    <select
                      value={mode.mode}
                      onChange={(e) => updateSalesMode(index, 'mode', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionnez un mode</option>
                      <option value="pap">PAP</option>
                      <option value="agence">Agence</option>
                    </select>
                  </div>

                  {mode.mode === 'agence' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type de mandat
                      </label>
                      <select
                        value={mode.mandateType || ''}
                        onChange={(e) => updateSalesMode(index, 'mandateType', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionnez un type</option>
                        <option value="simple">Simple</option>
                        <option value="exclusif">Exclusif</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {mode.mode === 'pap' ? 'Nom du site' : 'Nom de l\'agence'}
                    </label>
                    <input
                      type="text"
                      value={mode.name}
                      onChange={(e) => updateSalesMode(index, 'name', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      URL de l'annonce
                    </label>
                    <input
                      type="url"
                      value={mode.url}
                      onChange={(e) => updateSalesMode(index, 'url', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Prix affiché
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        value={mode.price || ''}
                        onChange={(e) => updateSalesMode(index, 'price', parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                    </div>
                  </div>

                  {mode.mode === 'agence' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Commission d'agence
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          value={mode.agencyCommission || ''}
                          onChange={(e) => updateSalesMode(index, 'agencyCommission', parseFloat(e.target.value) || 0)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date de mise en vente
                    </label>
                    <input
                      type="date"
                      value={mode.listingDate || ''}
                      onChange={(e) => updateSalesMode(index, 'listingDate', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="button"
              onClick={addSalesMode}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un mode de vente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherSalesMode;