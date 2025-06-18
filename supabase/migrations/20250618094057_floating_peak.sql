/*
  # Création d'une vue pour les agents avec leurs noms

  1. Nouvelle Vue
    - `agents_view` 
      - Combine les données d'authentification avec les métadonnées
      - Accessible en lecture pour tous les agents authentifiés

  2. Fonction pour extraire les métadonnées
    - Fonction pour récupérer le prénom et nom depuis user_metadata

  3. Sécurité
    - Vue accessible en lecture seule
    - Pas d'exposition des données sensibles
*/

-- Créer une fonction pour extraire les métadonnées utilisateur
CREATE OR REPLACE FUNCTION get_user_display_name(user_id uuid)
RETURNS TABLE(
  id uuid,
  first_name text,
  last_name text,
  email text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    COALESCE((au.raw_user_meta_data->>'first_name')::text, 'Agent') as first_name,
    COALESCE((au.raw_user_meta_data->>'last_name')::text, SUBSTRING(au.id::text, 1, 8)) as last_name,
    au.email
  FROM auth.users au
  WHERE au.id = user_id;
END;
$$;

-- Créer une vue pour les agents
CREATE OR REPLACE VIEW public.agents_view AS
SELECT 
  au.id,
  COALESCE((au.raw_user_meta_data->>'first_name')::text, 'Agent') as first_name,
  COALESCE((au.raw_user_meta_data->>'last_name')::text, SUBSTRING(au.id::text, 1, 8)) as last_name,
  au.email,
  COALESCE((au.raw_user_meta_data->>'role')::text, 'agent') as role,
  au.created_at
FROM auth.users au
WHERE au.deleted_at IS NULL;

-- Donner les permissions de lecture sur la vue
GRANT SELECT ON public.agents_view TO authenticated;

-- Ajouter des commentaires
COMMENT ON VIEW public.agents_view IS 'Vue pour accéder aux informations des agents avec leurs noms depuis les métadonnées';
COMMENT ON FUNCTION get_user_display_name(uuid) IS 'Fonction pour récupérer le nom d''affichage d''un utilisateur';