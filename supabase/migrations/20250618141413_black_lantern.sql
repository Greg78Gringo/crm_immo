/*
  # Création d'une table pour les métadonnées des photos

  1. Nouvelle Table
    - `photo_metadata`
      - `id` (uuid, clé primaire)
      - `deal_id` (uuid, référence vers deals)
      - `file_name` (text) - Nom du fichier
      - `file_path` (text) - Chemin complet du fichier
      - `is_reference` (boolean) - Photo de référence
      - `original_name` (text) - Nom original du fichier
      - `file_size` (bigint) - Taille du fichier
      - `mime_type` (text) - Type MIME
      - `uploaded_at` (timestamp) - Date d'upload

  2. Sécurité
    - Enable RLS
    - Politiques pour les agents
*/

-- Création de la table photo_metadata
CREATE TABLE IF NOT EXISTS public.photo_metadata (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id uuid REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  is_reference boolean DEFAULT false,
  original_name text,
  file_size bigint,
  mime_type text,
  uploaded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(deal_id, file_name)
);

-- Activer RLS
ALTER TABLE public.photo_metadata ENABLE ROW LEVEL SECURITY;

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_photo_metadata_deal_id ON public.photo_metadata(deal_id);
CREATE INDEX IF NOT EXISTS idx_photo_metadata_is_reference ON public.photo_metadata(is_reference);
CREATE INDEX IF NOT EXISTS idx_photo_metadata_file_path ON public.photo_metadata(file_path);

-- Politiques RLS
CREATE POLICY "Agents can view photo metadata for all deals"
  ON public.photo_metadata
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can insert photo metadata for their deals"
  ON public.photo_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = photo_metadata.deal_id
      AND deals.agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can update photo metadata for their deals"
  ON public.photo_metadata
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = photo_metadata.deal_id
      AND deals.agent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = photo_metadata.deal_id
      AND deals.agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can delete photo metadata for their deals"
  ON public.photo_metadata
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = photo_metadata.deal_id
      AND deals.agent_id = auth.uid()
    )
  );

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION handle_photo_metadata_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_photo_metadata_updated_at
  BEFORE UPDATE ON public.photo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION handle_photo_metadata_updated_at();

-- Fonction pour s'assurer qu'une seule photo de référence par affaire
CREATE OR REPLACE FUNCTION ensure_single_reference_photo()
RETURNS TRIGGER AS $$
BEGIN
  -- Si on définit une photo comme référence
  IF NEW.is_reference = true THEN
    -- Retirer le statut de référence des autres photos de la même affaire
    UPDATE public.photo_metadata 
    SET is_reference = false 
    WHERE deal_id = NEW.deal_id 
    AND id != NEW.id 
    AND is_reference = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_reference_photo_trigger
  BEFORE INSERT OR UPDATE ON public.photo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_reference_photo();

-- Commentaires
COMMENT ON TABLE public.photo_metadata IS 'Métadonnées des photos des biens immobiliers';
COMMENT ON COLUMN public.photo_metadata.deal_id IS 'Identifiant de l''affaire associée';
COMMENT ON COLUMN public.photo_metadata.file_name IS 'Nom du fichier dans le storage';
COMMENT ON COLUMN public.photo_metadata.file_path IS 'Chemin complet du fichier dans le storage';
COMMENT ON COLUMN public.photo_metadata.is_reference IS 'Indique si c''est la photo de référence';
COMMENT ON COLUMN public.photo_metadata.original_name IS 'Nom original du fichier uploadé';
COMMENT ON COLUMN public.photo_metadata.file_size IS 'Taille du fichier en bytes';
COMMENT ON COLUMN public.photo_metadata.mime_type IS 'Type MIME du fichier';