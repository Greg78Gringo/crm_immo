/*
  # Mise à jour des politiques RLS pour les contacts

  1. Problème actuel
    - Les administrateurs peuvent VOIR tous les contacts mais ne peuvent pas les MODIFIER
    - Seuls les agents propriétaires peuvent modifier leurs propres contacts
    
  2. Solution
    - Permettre aux administrateurs de modifier tous les contacts
    - Maintenir les restrictions pour les agents normaux
    
  3. Sécurité
    - Lecture : tous les agents peuvent voir tous les contacts (déjà en place)
    - Écriture : 
      - Les agents ne peuvent modifier que leurs propres contacts
      - Les administrateurs peuvent modifier tous les contacts
*/

-- Supprimer les anciennes politiques d'écriture
DROP POLICY IF EXISTS "Agents can insert their contacts" ON public.contact;
DROP POLICY IF EXISTS "Agents can update their contacts" ON public.contact;
DROP POLICY IF EXISTS "Agents can delete their contacts" ON public.contact;

-- Politique pour l'insertion (agents + admins)
CREATE POLICY "contact_insert_policy"
  ON public.contact
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- L'agent peut créer des contacts pour lui-même
    agent_id = auth.uid()
    OR
    -- Les admins peuvent créer des contacts pour n'importe qui
    (
      SELECT COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
    )
  );

-- Politique pour la mise à jour (propriétaire ou admin)
CREATE POLICY "contact_update_policy"
  ON public.contact
  FOR UPDATE
  TO authenticated
  USING (
    -- L'agent peut modifier ses propres contacts
    agent_id = auth.uid()
    OR
    -- Les admins peuvent modifier tous les contacts
    (
      SELECT COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
    )
  )
  WITH CHECK (
    -- L'agent peut modifier ses propres contacts
    agent_id = auth.uid()
    OR
    -- Les admins peuvent modifier tous les contacts
    (
      SELECT COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
    )
  );

-- Politique pour la suppression (propriétaire ou admin)
CREATE POLICY "contact_delete_policy"
  ON public.contact
  FOR DELETE
  TO authenticated
  USING (
    -- L'agent peut supprimer ses propres contacts
    agent_id = auth.uid()
    OR
    -- Les admins peuvent supprimer tous les contacts
    (
      SELECT COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
    )
  );

-- Ajouter des commentaires pour documenter les changements
COMMENT ON POLICY "contact_insert_policy" ON public.contact IS 
'Permet aux agents de créer leurs contacts et aux admins de créer des contacts pour tous';

COMMENT ON POLICY "contact_update_policy" ON public.contact IS 
'Permet aux agents de modifier leurs contacts et aux admins de modifier tous les contacts';

COMMENT ON POLICY "contact_delete_policy" ON public.contact IS 
'Permet aux agents de supprimer leurs contacts et aux admins de supprimer tous les contacts';