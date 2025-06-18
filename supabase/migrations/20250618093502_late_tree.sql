/*
  # Correction des permissions pour la table contact

  1. Problème actuel
    - Les politiques RLS limitent l'accès aux contacts selon l'agent connecté
    - Les agents ne peuvent voir que leurs propres contacts
    
  2. Solution
    - Permettre la lecture de tous les contacts pour tous les agents authentifiés
    - Maintenir les restrictions pour les modifications (insert/update/delete)
    
  3. Sécurité
    - Lecture : tous les agents peuvent voir tous les contacts
    - Écriture : seul l'agent propriétaire peut modifier ses contacts
*/

-- Supprimer l'ancienne politique de lecture restrictive
DROP POLICY IF EXISTS "Agents can view their contacts" ON public.contact;

-- Créer une nouvelle politique de lecture permissive pour tous les contacts
CREATE POLICY "Agents can view all contacts"
  ON public.contact
  FOR SELECT
  TO authenticated
  USING (true);

-- Vérifier que les autres politiques restent restrictives pour les modifications
-- (les agents ne peuvent modifier que leurs propres contacts)

-- Politique pour l'insertion (reste restrictive)
DROP POLICY IF EXISTS "Agents can insert their contacts" ON public.contact;
CREATE POLICY "Agents can insert their contacts"
  ON public.contact
  FOR INSERT
  TO authenticated
  WITH CHECK (agent_id = auth.uid());

-- Politique pour la mise à jour (reste restrictive)
DROP POLICY IF EXISTS "Agents can update their contacts" ON public.contact;
CREATE POLICY "Agents can update their contacts"
  ON public.contact
  FOR UPDATE
  TO authenticated
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

-- Politique pour la suppression (reste restrictive)
DROP POLICY IF EXISTS "Agents can delete their contacts" ON public.contact;
CREATE POLICY "Agents can delete their contacts"
  ON public.contact
  FOR DELETE
  TO authenticated
  USING (agent_id = auth.uid());

-- Ajouter un commentaire pour documenter le changement
COMMENT ON POLICY "Agents can view all contacts" ON public.contact IS 
'Permet à tous les agents authentifiés de voir tous les contacts pour faciliter la collaboration';