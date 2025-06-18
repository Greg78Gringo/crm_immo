/*
  # Configuration du Storage pour les photos des biens

  1. Création du bucket
    - `property-photos` pour stocker les photos des biens immobiliers
    - Public pour permettre l'affichage des images
    - Taille limitée par fichier

  2. Politiques de sécurité
    - Les agents peuvent uploader des photos pour leurs affaires
    - Les agents peuvent voir toutes les photos
    - Les agents peuvent supprimer/modifier les photos de leurs affaires
    - Structure: deals/{deal_id}/{filename}

  3. Configuration
    - Bucket public pour l'affichage
    - Limite de taille par fichier (10MB)
    - Types de fichiers autorisés (images)
*/

-- Insérer le bucket dans la table storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-photos',
  'property-photos',
  true,
  10485760, -- 10MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre la lecture publique des photos
CREATE POLICY "Public read access for property photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-photos');

-- Politique pour permettre aux agents d'uploader des photos pour leurs affaires
CREATE POLICY "Agents can upload photos for their deals"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-photos' 
  AND (storage.foldername(name))[1] = 'deals'
  AND EXISTS (
    SELECT 1 FROM public.deals 
    WHERE deals.id::text = (storage.foldername(name))[2]
    AND deals.agent_id = auth.uid()
  )
);

-- Politique pour permettre aux agents de voir les photos de toutes les affaires
CREATE POLICY "Agents can view all property photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'property-photos'
  AND (storage.foldername(name))[1] = 'deals'
);

-- Politique pour permettre aux agents de supprimer/modifier les photos de leurs affaires
CREATE POLICY "Agents can delete photos from their deals"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-photos'
  AND (storage.foldername(name))[1] = 'deals'
  AND EXISTS (
    SELECT 1 FROM public.deals 
    WHERE deals.id::text = (storage.foldername(name))[2]
    AND deals.agent_id = auth.uid()
  )
);

-- Politique pour permettre aux agents de mettre à jour (renommer) les photos de leurs affaires
CREATE POLICY "Agents can update photos from their deals"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-photos'
  AND (storage.foldername(name))[1] = 'deals'
  AND EXISTS (
    SELECT 1 FROM public.deals 
    WHERE deals.id::text = (storage.foldername(name))[2]
    AND deals.agent_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'property-photos'
  AND (storage.foldername(name))[1] = 'deals'
  AND EXISTS (
    SELECT 1 FROM public.deals 
    WHERE deals.id::text = (storage.foldername(name))[2]
    AND deals.agent_id = auth.uid()
  )
);

-- Ajouter des commentaires
COMMENT ON POLICY "Public read access for property photos" ON storage.objects IS 
'Permet la lecture publique des photos pour l''affichage sur le site';

COMMENT ON POLICY "Agents can upload photos for their deals" ON storage.objects IS 
'Permet aux agents d''uploader des photos uniquement pour leurs propres affaires';

COMMENT ON POLICY "Agents can view all property photos" ON storage.objects IS 
'Permet aux agents de voir toutes les photos des biens pour consultation';

COMMENT ON POLICY "Agents can delete photos from their deals" ON storage.objects IS 
'Permet aux agents de supprimer les photos de leurs propres affaires uniquement';

COMMENT ON POLICY "Agents can update photos from their deals" ON storage.objects IS 
'Permet aux agents de renommer/modifier les photos de leurs propres affaires (pour la gestion des photos de référence)';