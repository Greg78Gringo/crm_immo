/*
  # Ajout des champs Latitude et Longitude

  1. Nouveaux Champs
    - `latitude` (numeric) - Latitude du bien
    - `longitude` (numeric) - Longitude du bien

  2. Contraintes
    - Latitude entre -90 et 90
    - Longitude entre -180 et 180

  3. Index
    - Index spatial pour les recherches géographiques
*/

-- Ajouter les colonnes latitude et longitude à la table description_bien_principale
ALTER TABLE public.description_bien_principale 
ADD COLUMN IF NOT EXISTS latitude numeric(10, 8),
ADD COLUMN IF NOT EXISTS longitude numeric(11, 8);

-- Ajouter des contraintes pour valider les coordonnées
ALTER TABLE public.description_bien_principale 
ADD CONSTRAINT check_latitude_range 
CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));

ALTER TABLE public.description_bien_principale 
ADD CONSTRAINT check_longitude_range 
CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));

-- Créer un index spatial pour les recherches géographiques
CREATE INDEX IF NOT EXISTS idx_description_bien_coordinates 
ON public.description_bien_principale(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Ajouter des commentaires
COMMENT ON COLUMN public.description_bien_principale.latitude IS 'Latitude du bien immobilier (format décimal)';
COMMENT ON COLUMN public.description_bien_principale.longitude IS 'Longitude du bien immobilier (format décimal)';