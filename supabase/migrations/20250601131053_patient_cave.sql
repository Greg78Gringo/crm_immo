-- Suppression des anciennes politiques qui causent la récursion
drop policy if exists "Les administrateurs peuvent modifier tous les profils" on public.agents;
drop policy if exists "Les administrateurs peuvent créer des profils" on public.agents;

-- Nouvelle politique pour les administrateurs avec vérification directe du rôle
create policy "Les administrateurs peuvent modifier tous les profils"
  on public.agents
  for update
  using (
    (select is_admin from public.agents where id = auth.uid()) = true
  )
  with check (
    (select is_admin from public.agents where id = auth.uid()) = true
  );

-- Nouvelle politique pour la création de profils par les administrateurs
create policy "Les administrateurs peuvent créer des profils"
  on public.agents
  for insert
  with check (
    (select is_admin from public.agents where id = auth.uid()) = true
  );

-- Ajout d'une politique pour permettre aux administrateurs de lire tous les profils
create policy "Les administrateurs peuvent lire tous les profils"
  on public.agents
  for select
  using (
    (select is_admin from public.agents where id = auth.uid()) = true
  );