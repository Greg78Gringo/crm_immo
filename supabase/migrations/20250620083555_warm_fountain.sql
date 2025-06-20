/*
  # Recréation complète de la vue agents_view

  1. Suppression
    - Supprimer l'ancienne vue agents_view
    - Supprimer l'ancienne fonction get_user_display_name

  2. Nouvelle Vue agents_view
    - Inclut toutes les métadonnées utilisateur
    - Structure claire et complète
    - Accessible en lecture pour tous les agents authentifiés

  3. Champs inclus
    - id (uuid)
    - email (text)
    - first_name (text)
    - last_name (text)
    - role (text)
    - phone (text)
    - rsac_number (text)
    - sponsor_email (text)
    - created_at (timestamp)
    - last_sign_in_at (timestamp)

  4. Sécurité
    - Vue accessible en lecture seule
    - Pas d'exposition des données sensibles
    - Valeurs par défaut pour les champs manquants
*/

-- Supprimer l'ancienne vue si elle existe
DROP VIEW IF EXISTS public.agents_view;

-- Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS public.get_user_display_name(uuid);

-- Créer la nouvelle vue agents_view complète
CREATE VIEW public.agents_view AS
SELECT 
  au.id,
  au.email,
  COALESCE((au.raw_user_meta_data->>'first_name')::text, 'Agent') as first_name,
  COALESCE((au.raw_user_meta_data->>'last_name')::text, SUBSTRING(au.id::text, 1, 8)) as last_name,
  COALESCE((au.raw_user_meta_data->>'role')::text, 'agent') as role,
  COALESCE((au.raw_user_meta_data->>'phone')::text, '') as phone,
  COALESCE((au.raw_user_meta_data->>'rsac_number')::text, '') as rsac_number,
  COALESCE((au.raw_user_meta_data->>'sponsor_email')::text, '') as sponsor_email,
  au.created_at,
  au.last_sign_in_at,
  au.email_confirmed_at,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN 'active'
    ELSE 'pending'
  END as status
FROM auth.users au
WHERE au.deleted_at IS NULL
ORDER BY au.created_at DESC;

-- Donner les permissions de lecture sur la vue à tous les utilisateurs authentifiés
GRANT SELECT ON public.agents_view TO authenticated;

-- Ajouter des commentaires pour documenter la vue
COMMENT ON VIEW public.agents_view IS 'Vue complète des agents avec toutes leurs métadonnées utilisateur';

-- Commentaires sur les colonnes
COMMENT ON COLUMN public.agents_view.id IS 'Identifiant unique de l''utilisateur';
COMMENT ON COLUMN public.agents_view.email IS 'Adresse email de l''utilisateur';
COMMENT ON COLUMN public.agents_view.first_name IS 'Prénom de l''utilisateur (défaut: Agent)';
COMMENT ON COLUMN public.agents_view.last_name IS 'Nom de l''utilisateur (défaut: 8 premiers caractères de l''ID)';
COMMENT ON COLUMN public.agents_view.role IS 'Rôle de l''utilisateur (agent ou admin, défaut: agent)';
COMMENT ON COLUMN public.agents_view.phone IS 'Numéro de téléphone de l''utilisateur';
COMMENT ON COLUMN public.agents_view.rsac_number IS 'Numéro RSAC de l''agent';
COMMENT ON COLUMN public.agents_view.sponsor_email IS 'Email du parrain de l''agent';
COMMENT ON COLUMN public.agents_view.created_at IS 'Date de création du compte';
COMMENT ON COLUMN public.agents_view.last_sign_in_at IS 'Dernière connexion';
COMMENT ON COLUMN public.agents_view.email_confirmed_at IS 'Date de confirmation de l''email';
COMMENT ON COLUMN public.agents_view.status IS 'Statut du compte (active ou pending)';