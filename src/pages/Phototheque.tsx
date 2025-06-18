import React, { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Eye, Star, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Deal {
  id: string;
  name: string;
  created_at: string;
}

interface PhotoMetadata {
  id: string;
  deal_id: string;
  file_name: string;
  file_path: string;
  is_reference: boolean;
  original_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  updated_at: string;
}

interface Photo {
  id: string;
  name: string;
  url: string;
  isMain: boolean;
  size: number;
  uploadedAt: string;
  lastModified: string;
  metadata: PhotoMetadata;
}

const Phototheque = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string>('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [updatingReference, setUpdatingReference] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Photo | null>(null);

  // Charger les affaires de l'agent
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (user) {
          const { data: dealsData, error: dealsError } = await supabase
            .from('deals')
            .select('id, name, created_at')
            .eq('agent_id', user.id)
            .order('created_at', { ascending: false });

          if (dealsError) throw dealsError;
          setDeals(dealsData || []);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des affaires:', err);
        setError('Erreur lors du chargement des affaires');
      }
    };

    fetchDeals();
  }, []);

  // Charger les photos quand une affaire est sélectionnée
  useEffect(() => {
    if (selectedDealId) {
      loadPhotos();
    } else {
      setPhotos([]);
    }
  }, [selectedDealId]);

  const loadPhotos = async () => {
    if (!selectedDealId) return;

    setLoading(true);
    try {
      console.log('🔄 Chargement des photos pour l\'affaire:', selectedDealId);

      // Charger les métadonnées depuis la base de données
      const { data: photoMetadata, error: metadataError } = await supabase
        .from('photo_metadata')
        .select('*')
        .eq('deal_id', selectedDealId)
        .order('is_reference', { ascending: false })
        .order('uploaded_at', { ascending: true });

      if (metadataError) throw metadataError;

      console.log('📊 Métadonnées chargées:', photoMetadata);

      // Créer les objets Photo avec les URLs
      const photosWithUrls = photoMetadata?.map((metadata) => {
        const { data: urlData } = supabase.storage
          .from('property-photos')
          .getPublicUrl(metadata.file_path);

        // Ajouter un timestamp pour éviter le cache
        const url = new URL(urlData.publicUrl);
        url.searchParams.set('t', new Date(metadata.updated_at).getTime().toString());

        return {
          id: metadata.id,
          name: metadata.file_name,
          url: url.toString(),
          isMain: metadata.is_reference,
          size: metadata.file_size || 0,
          uploadedAt: metadata.uploaded_at,
          lastModified: metadata.updated_at,
          metadata: metadata
        };
      }) || [];

      console.log('✅ Photos avec URLs:', photosWithUrls);
      setPhotos(photosWithUrls);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des photos:', err);
      setError('Erreur lors du chargement des photos');
    } finally {
      setLoading(false);
    }
  };

  const getNextPhotoIndex = () => {
    const existingIndexes = photos
      .map(photo => {
        const match = photo.name.match(/_(\d+)\./);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(index => index > 0);

    return existingIndexes.length > 0 ? Math.max(...existingIndexes) + 1 : 1;
  };

  const handleFileUpload = async (files: FileList) => {
    if (!selectedDealId) {
      setError('Veuillez sélectionner une affaire');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      let nextIndex = getNextPhotoIndex();
      
      const uploadPromises = Array.from(files).map(async (file) => {
        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} n'est pas une image valide`);
        }

        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} est trop volumineux (max 10MB)`);
        }

        const fileExtension = file.name.split('.').pop();
        const newFileName = `${selectedDealId}_${nextIndex}.${fileExtension}`;
        const filePath = `deals/${selectedDealId}/${newFileName}`;

        console.log(`📤 Upload de ${file.name} vers ${filePath}`);

        // Upload du fichier dans Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('property-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Sauvegarder les métadonnées dans la base de données
        const { error: metadataError } = await supabase
          .from('photo_metadata')
          .insert({
            deal_id: selectedDealId,
            file_name: newFileName,
            file_path: filePath,
            is_reference: false,
            original_name: file.name,
            file_size: file.size,
            mime_type: file.type
          });

        if (metadataError) throw metadataError;

        console.log(`✅ Photo ${newFileName} uploadée et métadonnées sauvegardées`);
        nextIndex++;
        return newFileName;
      });

      await Promise.all(uploadPromises);
      setSuccess(`${files.length} photo(s) uploadée(s) avec succès !`);
      await loadPhotos();
    } catch (err: any) {
      console.error('❌ Erreur lors de l\'upload:', err);
      setError(err.message || 'Erreur lors de l\'upload des photos');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const confirmDeletePhoto = (photo: Photo) => {
    setShowDeleteConfirm(photo);
  };

  const deletePhoto = async (photo: Photo) => {
    try {
      console.log(`🗑️ Suppression de la photo: ${photo.name}`);

      // Supprimer le fichier du storage
      const { error: storageError } = await supabase.storage
        .from('property-photos')
        .remove([photo.metadata.file_path]);

      if (storageError) throw storageError;

      // Supprimer les métadonnées de la base de données
      const { error: metadataError } = await supabase
        .from('photo_metadata')
        .delete()
        .eq('id', photo.metadata.id);

      if (metadataError) throw metadataError;

      console.log(`✅ Photo ${photo.name} supprimée avec succès`);
      setSuccess('Photo supprimée avec succès !');
      setShowDeleteConfirm(null);
      await loadPhotos();
    } catch (err: any) {
      console.error('❌ Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de la photo');
      setShowDeleteConfirm(null);
    }
  };

  const setMainPhoto = async (photo: Photo) => {
    if (updatingReference) return;
    
    setUpdatingReference(true);
    setError('');
    setSuccess('');

    try {
      console.log(`⭐ Mise à jour de la photo de référence: ${photo.name}`);
      console.log(`État actuel isMain: ${photo.isMain}`);

      const newReferenceStatus = !photo.isMain;

      // Mettre à jour dans la base de données
      const { error: updateError } = await supabase
        .from('photo_metadata')
        .update({ 
          is_reference: newReferenceStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', photo.metadata.id);

      if (updateError) throw updateError;

      console.log(`✅ Statut de référence mis à jour: ${newReferenceStatus}`);

      if (newReferenceStatus) {
        setSuccess('Photo définie comme référence !');
      } else {
        setSuccess('Photo de référence retirée !');
      }

      // Recharger les photos pour voir les changements
      await loadPhotos();
    } catch (err: any) {
      console.error('❌ Erreur lors de la mise à jour:', err);
      setError(`Erreur lors de la mise à jour de la photo de référence: ${err.message}`);
    } finally {
      setUpdatingReference(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <Camera className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Photothèque</h1>
              <p className="text-sm text-gray-600">
                Gérez les photos de vos biens immobiliers
              </p>
            </div>
          </div>

          {/* Messages d'erreur et de succès */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          {/* Indicateur de mise à jour */}
          {updatingReference && (
            <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-md flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Mise à jour de la photo de référence en cours...
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-6 py-6 space-y-6">
        {/* Sélection de l'affaire */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sélection de l'affaire
          </h2>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choisissez une affaire
            </label>
            <select
              value={selectedDealId}
              onChange={(e) => setSelectedDealId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez une affaire</option>
              {deals.map((deal) => (
                <option key={deal.id} value={deal.id}>
                  {deal.name} - {formatDate(deal.created_at)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Zone d'upload */}
        {selectedDealId && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ajouter des photos
            </h2>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Glissez-déposez vos photos ici
              </p>
              <p className="text-sm text-gray-600 mb-4">
                ou cliquez pour sélectionner des fichiers
              </p>
              
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="photo-upload"
                disabled={uploading}
              />
              
              <label
                htmlFor="photo-upload"
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                }`}
              >
                {uploading ? 'Upload en cours...' : 'Sélectionner des photos'}
              </label>
              
              <p className="text-xs text-gray-500 mt-2">
                Formats acceptés: JPG, PNG, GIF (max 10MB par fichier)
              </p>
            </div>
          </div>
        )}

        {/* Galerie de photos */}
        {selectedDealId && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Photos de l'affaire ({photos.length})
                {photos.some(p => p.isMain) && (
                  <span className="ml-2 text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    1 photo de référence
                  </span>
                )}
              </h2>
              {loading && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Chargement...
                </div>
              )}
            </div>

            {photos.length === 0 && !loading ? (
              <div className="text-center py-12">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune photo pour cette affaire</p>
                <p className="text-sm text-gray-500">
                  Ajoutez des photos en utilisant la zone d'upload ci-dessus
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`relative group bg-gray-100 rounded-lg overflow-hidden aspect-square ${
                      photo.isMain ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
                    }`}
                  >
                    {/* Image */}
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedPhoto(photo)}
                      loading="lazy"
                    />

                    {/* Badge photo principale */}
                    {photo.isMain && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-lg">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Référence
                      </div>
                    )}

                    {/* Overlay avec actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        {/* Bouton voir */}
                        <button
                          type="button"
                          onClick={() => setSelectedPhoto(photo)}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                          title="Voir en grand"
                        >
                          <Eye className="h-4 w-4 text-gray-700" />
                        </button>

                        {/* Bouton photo principale */}
                        <button
                          type="button"
                          onClick={() => setMainPhoto(photo)}
                          disabled={updatingReference}
                          className={`p-2 rounded-full transition-colors shadow-lg ${
                            updatingReference
                              ? 'bg-gray-300 cursor-not-allowed'
                              : photo.isMain
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                              : 'bg-white hover:bg-gray-100 text-gray-700'
                          }`}
                          title={
                            updatingReference
                              ? 'Mise à jour en cours...'
                              : photo.isMain 
                              ? 'Retirer comme référence' 
                              : 'Définir comme référence'
                          }
                        >
                          {updatingReference ? (
                            <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full"></div>
                          ) : (
                            <Star className={`h-4 w-4 ${photo.isMain ? 'fill-current' : ''}`} />
                          )}
                        </button>

                        {/* Bouton supprimer */}
                        <button
                          type="button"
                          onClick={() => confirmDeletePhoto(photo)}
                          disabled={updatingReference}
                          className={`p-2 rounded-full transition-colors shadow-lg ${
                            updatingReference
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                      <p className="text-white text-xs truncate">{photo.name}</p>
                      <p className="text-white text-xs opacity-75">
                        {formatFileSize(photo.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-3 mr-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Supprimer la photo
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cette action est irréversible
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Êtes-vous sûr de vouloir supprimer cette photo ?
                </p>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Fichier :</strong> {showDeleteConfirm.name}
                </p>
                {showDeleteConfirm.isMain && (
                  <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-md text-sm">
                    <strong>⚠️ Attention :</strong> Cette photo est actuellement définie comme photo de référence.
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => deletePhoto(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10 shadow-lg"
              title="Fermer"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
            
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
              <p className="font-medium">{selectedPhoto.name}</p>
              <p className="text-sm opacity-75">
                {formatFileSize(selectedPhoto.size)} • {formatDate(selectedPhoto.uploadedAt)}
              </p>
              {selectedPhoto.isMain && (
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                  <span className="text-sm">Photo de référence</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Phototheque;