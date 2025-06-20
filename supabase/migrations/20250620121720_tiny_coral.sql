/*
  # Mise à jour des politiques RLS pour l'accès administrateur

  1. Tables concernées
    - buyers (acheteurs)
    - sellers (vendeurs)
    - description_bien_principale (détails du bien)
    - prix_bien (prix du bien)
    - liste_travaux (travaux réalisés)
    - sinistre_en_cours (sinistres)
    - liste_mobilier_restant (mobilier)
    - autre_mode_vente (autres modes de vente)
    - personal_required_doc (documents personnels)
    - property_required_doc (documents du bien)
    - work_claim_required_doc (documents travaux/sinistres)
    - diag_required_doc (documents diagnostics)
    - other_required_doc (autres documents)
    - photo_metadata (métadonnées photos)

  2. Principe
    - Agents : accès à leurs propres données (via deal.agent_id)
    - Admins : accès à toutes les données
*/

-- =====================================================
-- TABLE: buyers (acheteurs)
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Agents can view buyers for their deals" ON public.buyers;
DROP POLICY IF EXISTS "Agents can insert buyers for their deals" ON public.buyers;
DROP POLICY IF EXISTS "Agents can update buyers for their deals" ON public.buyers;
DROP POLICY IF EXISTS "Agents can delete buyers for their deals" ON public.buyers;

-- Nouvelles politiques avec accès admin
CREATE POLICY "buyers_select_policy"
  ON public.buyers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = buyers.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "buyers_insert_policy"
  ON public.buyers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = buyers.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "buyers_update_policy"
  ON public.buyers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = buyers.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = buyers.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "buyers_delete_policy"
  ON public.buyers
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = buyers.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

-- =====================================================
-- TABLE: sellers (vendeurs)
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Agents can view sellers for their deals" ON public.sellers;
DROP POLICY IF EXISTS "Agents can insert sellers for their deals" ON public.sellers;
DROP POLICY IF EXISTS "Agents can update sellers for their deals" ON public.sellers;
DROP POLICY IF EXISTS "Agents can delete sellers for their deals" ON public.sellers;

-- Nouvelles politiques avec accès admin
CREATE POLICY "sellers_select_policy"
  ON public.sellers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = sellers.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "sellers_insert_policy"
  ON public.sellers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = sellers.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "sellers_update_policy"
  ON public.sellers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = sellers.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = sellers.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "sellers_delete_policy"
  ON public.sellers
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = sellers.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

-- =====================================================
-- TABLE: description_bien_principale
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Agents can view property details for their deals" ON public.description_bien_principale;
DROP POLICY IF EXISTS "Agents can insert property details for their deals" ON public.description_bien_principale;
DROP POLICY IF EXISTS "Agents can update property details for their deals" ON public.description_bien_principale;
DROP POLICY IF EXISTS "Agents can delete property details for their deals" ON public.description_bien_principale;

-- Nouvelles politiques avec accès admin
CREATE POLICY "description_bien_select_policy"
  ON public.description_bien_principale
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = description_bien_principale.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "description_bien_insert_policy"
  ON public.description_bien_principale
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = description_bien_principale.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "description_bien_update_policy"
  ON public.description_bien_principale
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = description_bien_principale.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = description_bien_principale.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "description_bien_delete_policy"
  ON public.description_bien_principale
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = description_bien_principale.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

-- =====================================================
-- TABLE: personal_required_doc
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Agents can view their personal required documents" ON public.personal_required_doc;
DROP POLICY IF EXISTS "Agents can insert personal required documents" ON public.personal_required_doc;
DROP POLICY IF EXISTS "Agents can update personal required documents" ON public.personal_required_doc;
DROP POLICY IF EXISTS "Agents can delete personal required documents" ON public.personal_required_doc;

-- Nouvelles politiques avec accès admin
CREATE POLICY "personal_required_doc_select_policy"
  ON public.personal_required_doc
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = personal_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "personal_required_doc_insert_policy"
  ON public.personal_required_doc
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = personal_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "personal_required_doc_update_policy"
  ON public.personal_required_doc
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = personal_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = personal_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "personal_required_doc_delete_policy"
  ON public.personal_required_doc
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = personal_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

-- =====================================================
-- TABLE: property_required_doc
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Agents can view their property required documents" ON public.property_required_doc;
DROP POLICY IF EXISTS "Agents can insert property required documents" ON public.property_required_doc;
DROP POLICY IF EXISTS "Agents can update property required documents" ON public.property_required_doc;
DROP POLICY IF EXISTS "Agents can delete property required documents" ON public.property_required_doc;

-- Nouvelles politiques avec accès admin
CREATE POLICY "property_required_doc_select_policy"
  ON public.property_required_doc
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = property_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "property_required_doc_insert_policy"
  ON public.property_required_doc
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = property_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "property_required_doc_update_policy"
  ON public.property_required_doc
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = property_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = property_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "property_required_doc_delete_policy"
  ON public.property_required_doc
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = property_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

-- =====================================================
-- TABLE: work_claim_required_doc
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Agents can view their work claim required documents" ON public.work_claim_required_doc;
DROP POLICY IF EXISTS "Agents can insert work claim required documents" ON public.work_claim_required_doc;
DROP POLICY IF EXISTS "Agents can update work claim required documents" ON public.work_claim_required_doc;
DROP POLICY IF EXISTS "Agents can delete work claim required documents" ON public.work_claim_required_doc;

-- Nouvelles politiques avec accès admin
CREATE POLICY "work_claim_required_doc_select_policy"
  ON public.work_claim_required_doc
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = work_claim_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "work_claim_required_doc_insert_policy"
  ON public.work_claim_required_doc
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = work_claim_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "work_claim_required_doc_update_policy"
  ON public.work_claim_required_doc
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = work_claim_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = work_claim_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "work_claim_required_doc_delete_policy"
  ON public.work_claim_required_doc
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = work_claim_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

-- =====================================================
-- TABLE: diag_required_doc
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Agents can view their diag required documents" ON public.diag_required_doc;
DROP POLICY IF EXISTS "Agents can insert diag required documents" ON public.diag_required_doc;
DROP POLICY IF EXISTS "Agents can update diag required documents" ON public.diag_required_doc;
DROP POLICY IF EXISTS "Agents can delete diag required documents" ON public.diag_required_doc;

-- Nouvelles politiques avec accès admin
CREATE POLICY "diag_required_doc_select_policy"
  ON public.diag_required_doc
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = diag_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "diag_required_doc_insert_policy"
  ON public.diag_required_doc
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = diag_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "diag_required_doc_update_policy"
  ON public.diag_required_doc
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = diag_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = diag_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "diag_required_doc_delete_policy"
  ON public.diag_required_doc
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = diag_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

-- =====================================================
-- TABLE: other_required_doc
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Agents can view their other required documents" ON public.other_required_doc;
DROP POLICY IF EXISTS "Agents can insert other required documents" ON public.other_required_doc;
DROP POLICY IF EXISTS "Agents can update other required documents" ON public.other_required_doc;
DROP POLICY IF EXISTS "Agents can delete other required documents" ON public.other_required_doc;

-- Nouvelles politiques avec accès admin
CREATE POLICY "other_required_doc_select_policy"
  ON public.other_required_doc
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = other_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "other_required_doc_insert_policy"
  ON public.other_required_doc
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = other_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "other_required_doc_update_policy"
  ON public.other_required_doc
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = other_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = other_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "other_required_doc_delete_policy"
  ON public.other_required_doc
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = other_required_doc.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

-- =====================================================
-- TABLE: photo_metadata
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Agents can view photo metadata for all deals" ON public.photo_metadata;
DROP POLICY IF EXISTS "Agents can insert photo metadata for their deals" ON public.photo_metadata;
DROP POLICY IF EXISTS "Agents can update photo metadata for their deals" ON public.photo_metadata;
DROP POLICY IF EXISTS "Agents can delete photo metadata for their deals" ON public.photo_metadata;

-- Nouvelles politiques avec accès admin
CREATE POLICY "photo_metadata_select_policy"
  ON public.photo_metadata
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = photo_metadata.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "photo_metadata_insert_policy"
  ON public.photo_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = photo_metadata.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "photo_metadata_update_policy"
  ON public.photo_metadata
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = photo_metadata.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = photo_metadata.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

CREATE POLICY "photo_metadata_delete_policy"
  ON public.photo_metadata
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = photo_metadata.deal_id
      AND (
        deals.agent_id = auth.uid()
        OR
        COALESCE((auth.jwt() -> 'user_metadata' ->> 'role')::text, 'agent') = 'admin'
      )
    )
  );

-- =====================================================
-- TABLES SUPPLÉMENTAIRES (si elles existent)
-- =====================================================

-- TABLE: prix_bien (si elle existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'prix_bien') THEN
    -- Supprimer les anciennes politiques
    DROP POLICY IF EXISTS "Agents can view price for their deals" ON public.prix_bien;
    DROP POLICY IF EXISTS "Agents can insert price for their deals" ON public.prix_bien;
    DROP POLICY IF EXISTS "Agents can update price for their deals" ON public.prix_bien;
    DROP POLICY IF EXISTS "Agents can delete price for their deals" ON public.prix_bien;

    -- Nouvelles politiques avec accès admin
    EXECUTE 'CREATE POLICY "prix_bien_select_policy"
      ON public.prix_bien
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = prix_bien.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "prix_bien_insert_policy"
      ON public.prix_bien
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = prix_bien.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "prix_bien_update_policy"
      ON public.prix_bien
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = prix_bien.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = prix_bien.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "prix_bien_delete_policy"
      ON public.prix_bien
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = prix_bien.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';
  END IF;
END $$;

-- TABLE: liste_travaux (si elle existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'liste_travaux') THEN
    -- Supprimer les anciennes politiques
    DROP POLICY IF EXISTS "Agents can view work for their deals" ON public.liste_travaux;
    DROP POLICY IF EXISTS "Agents can insert work for their deals" ON public.liste_travaux;
    DROP POLICY IF EXISTS "Agents can update work for their deals" ON public.liste_travaux;
    DROP POLICY IF EXISTS "Agents can delete work for their deals" ON public.liste_travaux;

    -- Nouvelles politiques avec accès admin
    EXECUTE 'CREATE POLICY "liste_travaux_select_policy"
      ON public.liste_travaux
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = liste_travaux.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "liste_travaux_insert_policy"
      ON public.liste_travaux
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = liste_travaux.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "liste_travaux_update_policy"
      ON public.liste_travaux
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = liste_travaux.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = liste_travaux.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "liste_travaux_delete_policy"
      ON public.liste_travaux
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = liste_travaux.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';
  END IF;
END $$;

-- TABLE: sinistre_en_cours (si elle existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sinistre_en_cours') THEN
    -- Supprimer les anciennes politiques
    DROP POLICY IF EXISTS "Agents can view claims for their deals" ON public.sinistre_en_cours;
    DROP POLICY IF EXISTS "Agents can insert claims for their deals" ON public.sinistre_en_cours;
    DROP POLICY IF EXISTS "Agents can update claims for their deals" ON public.sinistre_en_cours;
    DROP POLICY IF EXISTS "Agents can delete claims for their deals" ON public.sinistre_en_cours;

    -- Nouvelles politiques avec accès admin
    EXECUTE 'CREATE POLICY "sinistre_en_cours_select_policy"
      ON public.sinistre_en_cours
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = sinistre_en_cours.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "sinistre_en_cours_insert_policy"
      ON public.sinistre_en_cours
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = sinistre_en_cours.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "sinistre_en_cours_update_policy"
      ON public.sinistre_en_cours
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = sinistre_en_cours.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = sinistre_en_cours.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "sinistre_en_cours_delete_policy"
      ON public.sinistre_en_cours
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = sinistre_en_cours.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';
  END IF;
END $$;

-- TABLE: liste_mobilier_restant (si elle existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'liste_mobilier_restant') THEN
    -- Supprimer les anciennes politiques
    DROP POLICY IF EXISTS "Agents can view furniture for their deals" ON public.liste_mobilier_restant;
    DROP POLICY IF EXISTS "Agents can insert furniture for their deals" ON public.liste_mobilier_restant;
    DROP POLICY IF EXISTS "Agents can update furniture for their deals" ON public.liste_mobilier_restant;
    DROP POLICY IF EXISTS "Agents can delete furniture for their deals" ON public.liste_mobilier_restant;

    -- Nouvelles politiques avec accès admin
    EXECUTE 'CREATE POLICY "liste_mobilier_restant_select_policy"
      ON public.liste_mobilier_restant
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = liste_mobilier_restant.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "liste_mobilier_restant_insert_policy"
      ON public.liste_mobilier_restant
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = liste_mobilier_restant.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "liste_mobilier_restant_update_policy"
      ON public.liste_mobilier_restant
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = liste_mobilier_restant.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = liste_mobilier_restant.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "liste_mobilier_restant_delete_policy"
      ON public.liste_mobilier_restant
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = liste_mobilier_restant.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';
  END IF;
END $$;

-- TABLE: autre_mode_vente (si elle existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'autre_mode_vente') THEN
    -- Supprimer les anciennes politiques
    DROP POLICY IF EXISTS "Agents can view sales modes for their deals" ON public.autre_mode_vente;
    DROP POLICY IF EXISTS "Agents can insert sales modes for their deals" ON public.autre_mode_vente;
    DROP POLICY IF EXISTS "Agents can update sales modes for their deals" ON public.autre_mode_vente;
    DROP POLICY IF EXISTS "Agents can delete sales modes for their deals" ON public.autre_mode_vente;

    -- Nouvelles politiques avec accès admin
    EXECUTE 'CREATE POLICY "autre_mode_vente_select_policy"
      ON public.autre_mode_vente
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = autre_mode_vente.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "autre_mode_vente_insert_policy"
      ON public.autre_mode_vente
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = autre_mode_vente.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "autre_mode_vente_update_policy"
      ON public.autre_mode_vente
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = autre_mode_vente.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = autre_mode_vente.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';

    EXECUTE 'CREATE POLICY "autre_mode_vente_delete_policy"
      ON public.autre_mode_vente
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.deals
          WHERE deals.id = autre_mode_vente.deal_id
          AND (
            deals.agent_id = auth.uid()
            OR
            COALESCE((auth.jwt() -> ''user_metadata'' ->> ''role'')::text, ''agent'') = ''admin''
          )
        )
      )';
  END IF;
END $$;

-- Commentaires sur les politiques
COMMENT ON POLICY "buyers_select_policy" ON public.buyers IS 
'Permet aux agents de voir les acheteurs de leurs affaires et aux admins de voir tous les acheteurs';

COMMENT ON POLICY "sellers_select_policy" ON public.sellers IS 
'Permet aux agents de voir les vendeurs de leurs affaires et aux admins de voir tous les vendeurs';

COMMENT ON POLICY "description_bien_select_policy" ON public.description_bien_principale IS 
'Permet aux agents de voir les détails des biens de leurs affaires et aux admins de voir tous les biens';

COMMENT ON POLICY "personal_required_doc_select_policy" ON public.personal_required_doc IS 
'Permet aux agents de voir les documents personnels de leurs affaires et aux admins de voir tous les documents';

COMMENT ON POLICY "property_required_doc_select_policy" ON public.property_required_doc IS 
'Permet aux agents de voir les documents des biens de leurs affaires et aux admins de voir tous les documents';

COMMENT ON POLICY "work_claim_required_doc_select_policy" ON public.work_claim_required_doc IS 
'Permet aux agents de voir les documents travaux/sinistres de leurs affaires et aux admins de voir tous les documents';

COMMENT ON POLICY "diag_required_doc_select_policy" ON public.diag_required_doc IS 
'Permet aux agents de voir les documents diagnostics de leurs affaires et aux admins de voir tous les documents';

COMMENT ON POLICY "other_required_doc_select_policy" ON public.other_required_doc IS 
'Permet aux agents de voir les autres documents de leurs affaires et aux admins de voir tous les documents';

COMMENT ON POLICY "photo_metadata_select_policy" ON public.photo_metadata IS 
'Permet aux agents de voir les métadonnées photos de leurs affaires et aux admins de voir toutes les métadonnées';