-- Suppression de toutes les politiques existantes
drop policy if exists "Les administrateurs peuvent modifier tous les profils" on public.agents;
drop policy if exists "Les administrateurs peuvent créer des profils" on public.agents;
drop policy if exists "Les administrateurs peuvent lire tous les profils" on public.agents;
drop policy if exists "Les agents peuvent modifier leur propre profil" on public.agents;
drop policy if exists "Les agents peuvent insérer leur profil" on public.agents;
drop policy if exists "Les agents peuvent créer leur profil initial" on public.agents;
drop policy if exists "Les agents peuvent lire leur propre profil" on public.agents;

-- Politique simple pour la lecture
create policy "Lecture du profil"
  on public.agents
  for select
  using (auth.uid() = id);

-- Politique simple pour l'insertion
create policy "Création du profil"
  on public.agents
  for insert
  with check (auth.uid() = id);

-- Politique simple pour la modification
create policy "Modification du profil"
  on public.agents
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);