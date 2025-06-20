/*
  # Correction des politiques RLS pour permettre aux admins de voir toutes les affaires

  1. Problème
    - Les politiques RLS empêchent les admins de voir toutes les affaires
    - Erreur de politique déjà existante lors de la migration précédente

  2. Solution
    - Supprimer TOUTES les anciennes politiques existantes
    - Créer de nouvelles politiques basées sur le rôle utilisateur
    - Vérifier le rôle admin via les métadonnées JWT

  3. Sécurité
    - Agents : Accès limité à leurs propres affaires
    - Admins : Accès complet à toutes les affaires
    - Authentification requise pour toutes les opérations
*/

-- Supprimer TOUTES les anciennes politiques pour éviter les conflits
DROP POLICY IF EXISTS "Agents can view their deals" ON public.deals;
DROP POLICY IF EXISTS "Agents can view deals based on role" ON public.deals;
DROP POLICY IF EXISTS "Agents can insert their deals" ON public.deals;
DROP POLICY IF EXISTS "Agents can insert deals" ON public.deals;
DROP POLICY IF EXISTS "Agents can update their deals" ON public.deals;
DROP POLICY IF EXISTS "Agents can update deals based on role" ON public.deals;
DROP POLICY IF EXISTS "Agents can delete their deals" ON public.deals;
DROP POLICY IF EXISTS "Agents can delete deals based on role" ON public.deals;

-- Créer les nouvelles politiques avec des noms uniques

-- Politique de lecture : agents voient leurs affaires, admins voient tout
CREATE POLICY "deals_select_policy"
  ON public.deals
  FOR SELECT
  TO authenticated
  USING (
    -- L'agent peut voir ses propres affaires
    agent_id = auth.uid()
    OR
    -- Les admins peuvent voir toutes les affaires
    (
      SELECT COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
    )
  );

-- Politique d'insertion : agents créent pour eux, admins créent pour tous
CREATE POLICY "deals_insert_policy"
  ON public.deals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- L'agent peut créer des affaires pour lui-même
    agent_id = auth.uid()
    OR
    -- Les admins peuvent créer des affaires pour n'importe qui
    (
      SELECT COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
    )
  );

-- Politique de mise à jour : propriétaire ou admin
CREATE POLICY "deals_update_policy"
  ON public.deals
  FOR UPDATE
  TO authenticated
  USING (
    -- L'agent peut modifier ses propres affaires
    agent_id = auth.uid()
    OR
    -- Les admins peuvent modifier toutes les affaires
    (
      SELECT COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
    )
  )
  WITH CHECK (
    -- L'agent peut modifier ses propres affaires
    agent_id = auth.uid()
    OR
    -- Les admins peuvent modifier toutes les affaires
    (
      SELECT COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
    )
  );

-- Politique de suppression : propriétaire ou admin
CREATE POLICY "deals_delete_policy"
  ON public.deals
  FOR DELETE
  TO authenticated
  USING (
    -- L'agent peut supprimer ses propres affaires
    agent_id = auth.uid()
    OR
    -- Les admins peuvent supprimer toutes les affaires
    (
      SELECT COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
    )
  );

-- Ajouter des commentaires pour documenter les nouvelles politiques
COMMENT ON POLICY "deals_select_policy" ON public.deals IS 
'Permet aux agents de voir leurs affaires et aux admins de voir toutes les affaires';

COMMENT ON POLICY "deals_insert_policy" ON public.deals IS 
'Permet aux agents de créer leurs affaires et aux admins de créer des affaires pour tous';

COMMENT ON POLICY "deals_update_policy" ON public.deals IS 
'Permet aux agents de modifier leurs affaires et aux admins de modifier toutes les affaires';

COMMENT ON POLICY "deals_delete_policy" ON public.deals IS 
'Permet aux agents de supprimer leurs affaires et aux admins de supprimer toutes les affaires';

-- Vérifier que RLS est bien activé sur la table deals
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;