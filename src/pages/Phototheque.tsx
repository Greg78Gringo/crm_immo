import React, { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Eye, Star, StarOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Deal {
  id: string;
  name: string;
  created_at: string;
}

interface Photo {
  id: string;
  name: string;
  url: string;
  isMain: boolean;
  size: number;
  uploadedAt: string;
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

      const photosWithUrls = await Promise.all(
        (files || []).map(async (file) => {
          const { data: urlData } = supabase.storage
            .from('property-photos')
            .getPublicUrl(`deals/${selectedDealId}/${file.name}`);

          return {
            id: file.id || file.name,
            name: file.name,
            url: urlData.publicUrl,
            isMain: file.name.includes('_main.'),
            size: file.metadata?.size || 0,
            // Utilisé pour casser le cache navigateur si la photo est modifiée
            cacheKey: file.updated_at || file.last_modified || file.created_at || new Date().toISOString()
          };
        })
      );

      setPhotos(photosWithUrls);

    } catch (err) {
      console.error('Erreur lors du chargement des photos:', err);
      setError('Erreur lors du chargement des photos');
    } finally {
      setLoading(false);
    }
  };

  const getNextPhotoIndex = () => {
    const existingIndexes = photos
      .map(photo => {
        const match = photo.name.match(/_(\d+)(_main)?\./);
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
      const uploadPromises = Array.from(files).map(async (file) => {
        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} n'est pas une image valide`);
        }

        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} est trop volumineux (max 10MB)`);
        }

        const nextIndex = getNextPhotoIndex();
        const fileExtension = file.name.split('.').pop();
        const newFileName = `${selectedDealId}_${nextIndex}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from('property-photos')
          .upload(`deals/${selectedDealId}/${newFileName}`, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        return newFileName;
      });

      await Promise.all(uploadPromises);
      setSuccess(`${files.length} photo(s) uploadée(s) avec succès !`);
      await loadPhotos();
    } catch (err: any) {
      console.error('Erreur lors de l\'upload:', err);
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
      const { error } = await supabase.storage
        .from('property-photos')
        .remove([`deals/${selectedDealId}/${photo.name}`]);

      if (error) throw error;

      setSuccess('Photo supprimée avec succès !');
      setShowDeleteConfirm(null);
      await loadPhotos();
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de la photo');
      setShowDeleteConfirm(null);
    }
  };

  const downloadFile = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement du fichier');
    }
    return response.blob();
  };

  const setMainPhoto = async (photo: Photo) => {
    if (updatingReference) return;
    
    setUpdatingReference(true);
    setError('');
    setSuccess('');

    try {
      // Si c'est déjà la photo principale, la décocher
      if (photo.isMain) {
        // Télécharger le fichier actuel
        const fileBlob = await downloadFile(photo.url);
        
        // Créer le nouveau nom (retirer "_main")
        const newName = photo.name.replace('_main.', '_1.');
        
        // Uploader avec le nouveau nom
        const { error: uploadError } = await supabase.storage
          .from('property-photos')
          .upload(`deals/${selectedDealId}/${newName}`, fileBlob, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Supprimer l'ancien fichier
        const { error: deleteError } = await supabase.storage
          .from('property-photos')
          .remove([`deals/${selectedDealId}/${photo.name}`]);

        if (deleteError) throw deleteError;

        setSuccess('Photo de référence retirée !');
      } else {
        // Décocher l'ancienne photo principale s'il y en a une
        const currentMainPhoto = photos.find(p => p.isMain);
        if (currentMainPhoto) {
          // Télécharger l'ancienne photo principale
          const oldMainBlob = await downloadFile(currentMainPhoto.url);
          
          // Créer le nouveau nom pour l'ancienne photo principale
          const oldMainNewName = currentMainPhoto.name.replace('_main.', '_1.');
          
          // Uploader l'ancienne photo avec le nouveau nom
          const { error: uploadOldError } = await supabase.storage
            .from('property-photos')
            .upload(`deals/${selectedDealId}/${oldMainNewName}`, oldMainBlob, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadOldError) throw uploadOldError;

          // Supprimer l'ancien fichier de l'ancienne photo principale
          const { error: deleteOldError } = await supabase.storage
            .from('property-photos')
            .remove([`deals/${selectedDealId}/${currentMainPhoto.name}`]);

          if (deleteOldError) throw deleteOldError;
        }

        // Télécharger la nouvelle photo principale
        const newMainBlob = await downloadFile(photo.url);
        
        // Créer le nouveau nom pour la nouvelle photo principale
        const newMainName = photo.name.replace(/(_\d+)\./, '_main.');
        
        // Uploader la nouvelle photo avec le nom "_main"
        const { error: uploadNewError } = await supabase.storage
          .from('property-photos')
          .upload(`deals/${selectedDealId}/${newMainName}`, newMainBlob, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadNewError) throw uploadNewError;

        // Supprimer l'ancien fichier de la nouvelle photo principale
        const { error: deleteNewError } = await supabase.storage
          .from('property-photos')
          .remove([`deals/${selectedDealId}/${photo.name}`]);

        if (deleteNewError) throw deleteNewError;

        setSuccess('Photo de référence mise à jour !');
      }

      // Recharger les photos
      await loadPhotos();
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
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
                    className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
                  >
                    {/* Image */}
                    <img
                      src={photo.url + '?v=' + photo.cacheKey}
                      alt={photo.name}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedPhoto(photo)}
                    />


                    {/* Badge photo principale */}
                    {photo.isMain && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="h-3 w-3 mr-1" />
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
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                          title="Voir en grand"
                        >
                          <Eye className="h-4 w-4 text-gray-700" />
                        </button>

                        {/* Bouton photo principale */}
                        <button
                          type="button"
                          onClick={() => setMainPhoto(photo)}
                          disabled={updatingReference}
                          className={`p-2 rounded-full transition-colors ${
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
                          ) : photo.isMain ? (
                            <StarOff className="h-4 w-4" />
                          ) : (
                            <Star className="h-4 w-4" />
                          )}
                        </button>

                        {/* Bouton supprimer */}
                        <button
                          type="button"
                          onClick={() => confirmDeletePhoto(photo)}
                          disabled={updatingReference}
                          className={`p-2 rounded-full transition-colors ${
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
      {s