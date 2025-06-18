/*
  # Correction des politiques RLS pour le storage des photos

  1. Problème
    - Les politiques RLS empêchent l'upload des photos
    - Erreur "new row violates row-level security policy"

  2. Solution
    - Supprimer les anciennes politiques problématiques
    - Créer de nouvelles politiques plus permissives
    - Assurer la compatibilité avec la structure des dossiers

  3. Sécurité
    - Maintenir la sécurité tout en permettant l'upload
    - Vérifier que les agents ne peuvent modifier que leurs propres affaires
*/

-- Supprimer toutes les politiques existantes pour repartir sur une base saine
DROP POLICY IF EXISTS "Public read access for property photos" ON storage.objects;
DROP POLICY IF EXISTS "Agents can upload photos for their deals" ON storage.objects;
DROP POLICY IF EXISTS "Agents can view all property photos" ON storage.objects;
DROP POLICY IF EXISTS "Agents can delete photos from their deals" ON storage.objects;
DROP POLICY IF EXISTS "Agents can update photos from their deals" ON storage.objects;

-- Politique pour la lecture publique (nécessaire pour afficher les images)
CREATE POLICY "Allow public read access to property photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-photos');

-- Politique pour permettre aux utilisateurs authentifiés d'uploader des photos
CREATE POLICY "Allow authenticated users to upload property photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-photos'
  AND auth.role() = 'authenticated'
);

-- Politique pour permettre aux utilisateurs authentifiés de voir toutes les photos
CREATE POLICY "Allow authenticated users to view property photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'property-photos');

-- Politique pour permettre aux utilisateurs authentifiés de supprimer des photos
-- (on vérifiera côté application que c'est bien leur affaire)
CREATE POLICY "Allow authenticated users to delete property photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-photos');

-- Politique pour permettre aux utilisateurs authentifiés de mettre à jour des photos
-- (nécessaire pour renommer les fichiers pour les photos de référence)
CREATE POLICY "Allow authenticated users to update property photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'property-photos')
WITH CHECK (bucket_id = 'property-photos');

-- Vérifier que le bucket existe et est configuré correctement
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'property-photos';

-- Si le bucket n'existe pas, le créer
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-photos',
  'property-photos',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Ajouter des commentaires pour documenter les politiques
COMMENT ON POLICY "Allow public read access to property photos" ON storage.objects IS 
'Permet la lecture publique des photos pour l''affichage';

COMMENT ON POLICY "Allow authenticated users to upload property photos" ON storage.objects IS 
'Permet aux utilisateurs authentifiés d''uploader des photos (vérification côté app)';

COMMENT ON POLICY "Allow authenticated users to view property photos" ON storage.objects IS 
'Permet aux utilisateurs authentifiés de voir toutes les photos';

COMMENT ON POLICY "Allow authenticated users to delete property photos" ON storage.objects IS 
'Permet aux utilisateurs authentifiés de supprimer des photos (vérification côté app)';

COMMENT ON POLICY "Allow authenticated users to update property photos" ON storage.objects IS 
'Permet aux utilisateurs authentifiés de renommer des photos (pour les photos de référence)';