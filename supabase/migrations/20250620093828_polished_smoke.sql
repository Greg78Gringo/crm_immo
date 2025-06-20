/*
  # Mise à jour des politiques RLS pour la table deals - Accès admin

  1. Problème
    - Les administrateurs ne peuvent voir que leurs propres affaires
    - La photothèque ne peut pas charger toutes les affaires pour les admins

  2. Solution
    - Créer une nouvelle politique pour permettre aux admins de voir toutes les affaires
    - Maintenir la restriction pour les agents normaux

  3. Sécurité
    - Les agents voient seulement leurs affaires
    - Les admins voient toutes les affaires
    - Les modifications restent limitées au propriétaire ou admin
*/

-- Supprimer l'ancienne politique de lecture restrictive
DROP POLICY IF EXISTS "Agents can view their deals" ON public.deals;

-- Créer une nouvelle politique de lecture qui permet aux admins de voir toutes les affaires
CREATE POLICY "Agents can view deals based on role"
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

-- Vérifier que les autres politiques permettent aux admins de modifier toutes les affaires
-- Politique pour l'insertion (reste restrictive pour les agents, permissive pour les admins)
DROP POLICY IF EXISTS "Agents can insert their deals" ON public.deals;
CREATE POLICY "Agents can insert deals"
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

-- Politique pour la mise à jour (propriétaire ou admin)
DROP POLICY IF EXISTS "Agents can update their deals" ON public.deals;
CREATE POLICY "Agents can update deals based on role"
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

-- Politique pour la suppression (propriétaire ou admin)
DROP POLICY IF EXISTS "Agents can delete their deals" ON public.deals;
CREATE POLICY "Agents can delete deals based on role"
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

-- Ajouter des commentaires pour documenter les changements
COMMENT ON POLICY "Agents can view deals based on role" ON public.deals IS 
'Permet aux agents de voir leurs affaires et aux admins de voir toutes les affaires';

COMMENT ON POLICY "Agents can insert deals" ON public.deals IS 
'Permet aux agents de créer leurs affaires et aux admins de créer des affaires pour tous';

COMMENT ON POLICY "Agents can update deals based on role" ON public.deals IS 
'Permet aux agents de modifier leurs affaires et aux admins de modifier toutes les affaires';

COMMENT ON POLICY "Agents can delete deals based on role" ON public.deals IS 
'Permet aux agents de supprimer leurs affaires et aux admins de supprimer toutes les affaires';