import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, CheckCircle, Calendar, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RequiredDocument {
  id?: string;
  document_name: string;
  status: 'buyer' | 'seller';
  received: boolean;
  reception_date: string;
  date_doc: string;
  comments: string;
}

interface OtherDocGenProps {
  dealId: string;
}

const OtherDocGen = ({ dealId }: OtherDocGenProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requiredDocuments, setRequiredDocuments] = useState<RequiredDocument[]>([]);

  // Charger les documents requis existants
  useEffect(() => {
    const loadRequiredDocuments = async () => {
      if (!dealId) return;

      try {
        const { data, error: loadError } = await supabase
          .from('other_required_doc')
          .select('*')
          .eq('deal_id', dealId)
          .order('created_at', { ascending: true });

        if (loadError) throw loadError;

        setRequiredDocuments(data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des autres documents requis:', err);
      }
    };

    loadRequiredDocuments();
  }, [dealId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Ajouter un nouveau document
  const addDocument = async () => {
    if (!dealId) {
      setError('Aucune affaire sélectionnée');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const newDocument = {
        deal_id: dealId,
        document_name: '',
        status: 'seller' as const,
        received: false,
        reception_date: null,
        date_doc: null,
        comments: ''
      };

      const { data, error: insertError } = await supabase
        .from('other_required_doc')
        .insert(newDocument)
        .select()
        .single();

      if (insertError) throw insertError;

      // Ajouter le nouveau document à la liste
      setRequiredDocuments(prev => [...prev, {
        id: data.id,
        document_name: '',
        status: 'seller',
        received: false,
        reception_date: '',
        date_doc: '',
        comments: ''
      }]);

      setSuccess('Nouveau document ajouté !');
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setError('Erreur lors de l\'ajout du document');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un document
  const removeDocument = async (documentId: string, index: number) => {
    setError('');
    setSuccess('');

    try {
      const { error: deleteError } = await supabase
        .from('other_required_doc')
        .delete()
        .eq('id', documentId);

      if (deleteError) throw deleteError;

      // Supprimer de l'état local
      setRequiredDocuments(prev => prev.filter((_, i) => i !== index));
      setSuccess('Document supprimé !');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression du document');
    }
  };

  // Mettre à jour un document
  const updateDocument = async (documentId: string, field: string, value: string | boolean) => {
    try {
      const updateData: any = { [field]: value };
      
      // Si on décoche "reçu", vider la date de réception
      if (field === 'received' && !value) {
        updateData.reception_date = null;
      }

      const { error } = await supabase
        .from('other_required_doc')
        .update(updateData)
        .eq('id', documentId);

      if (error) throw error;

      // Mettre à jour l'état local
      setRequiredDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { 
                ...doc, 
                [field]: value,
                ...(field === 'received' && !value ? { reception_date: '' } : {})
              }
            : doc
        )
      );

      // Afficher un message de succès seulement pour les champs importants
      if (field === 'document_name' && value) {
        setSuccess('Nom du document mis à jour !');
      } else if (field === 'received') {
        setSuccess(value ? 'Document marqué comme reçu !' : 'Document marqué comme non reçu !');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour du document');
    }
  };

  const getStatusLabel = (status: string) => {
    return status === 'buyer' ? 'Acquéreur' : 'Vendeur';
  };

  const getStatusColor = (status: string) => {
    return status === 'buyer' ? 'text-green-700 bg-green-50 border-green-200' : 'text-blue-700 bg-blue-50 border-blue-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Autres Documents
            {requiredDocuments.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                - {requiredDocuments.length} document{requiredDocuments.length > 1 ? 's' : ''}
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
            {/* Bouton d'ajout */}
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Ajoutez manuellement des documents spécifiques qui ne sont pas couverts par les règles automatiques.
              </p>
              <button
                type="button"
                onClick={addDocument}
                disabled={loading}
                className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <Plus className="h-4 w-4 mr-2" />
                {loading ? 'Ajout...' : 'Ajouter un Document'}
              </button>
            </div>

            {/* Messages d'erreur et de succès */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Liste des documents */}
            {requiredDocuments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-900">
                  Documents Ajoutés Manuellement ({requiredDocuments.length})
                </h3>
                
                <div className="space-y-4">
                  {requiredDocuments.map((doc, index) => (
                    <div key={doc.id} className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <div className="space-y-4">
                        {/* En-tête avec bouton de suppression */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Document #{index + 1}
                              {doc.document_name && (
                                <span className="ml-2 text-indigo-600">- {doc.document_name}</span>
                              )}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => doc.id && removeDocument(doc.id, index)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                            title="Supprimer le document"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Champs de saisie */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Nom du document */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nom du document <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={doc.document_name}
                              onChange={(e) => doc.id && updateDocument(doc.id, 'document_name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Ex: Attestation d'assurance, Relevé bancaire..."
                            />
                          </div>

                          {/* Statut */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Statut
                            </label>
                            <select
                              value={doc.status}
                              onChange={(e) => doc.id && updateDocument(doc.id, 'status', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="seller">Vendeur</option>
                              <option value="buyer">Acquéreur</option>
                            </select>
                          </div>

                          {/* Badge de statut */}
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                              {getStatusLabel(doc.status)}
                            </span>
                          </div>
                        </div>

                        {/* Document reçu et date de réception */}
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={doc.received}
                              onChange={(e) => doc.id && updateDocument(doc.id, 'received', e.target.checked)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Document reçu</span>
                          </label>
                          
                          {doc.received && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              <input
                                type="date"
                                value={doc.reception_date || ''}
                                onChange={(e) => doc.id && updateDocument(doc.id, 'reception_date', e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              />
                            </div>
                          )}

                          {doc.received && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>

                        {/* Date du document et commentaires */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-indigo-100">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date du document
                            </label>
                            <input
                              type="date"
                              value={doc.date_doc || ''}
                              onChange={(e) => doc.id && updateDocument(doc.id, 'date_doc', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Commentaires
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={doc.comments || ''}
                                onChange={(e) => doc.id && updateDocument(doc.id, 'comments', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 pr-8"
                                placeholder="Ajouter un commentaire..."
                              />
                              <MessageSquare className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message si aucun document */}
            {requiredDocuments.length === 0 && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Aucun document supplémentaire ajouté pour cette affaire.
                </p>
                <p className="text-sm text-gray-500">
                  Utilisez le bouton "Ajouter un Document" pour ajouter des documents spécifiques qui ne sont pas couverts par les règles automatiques.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherDocGen;