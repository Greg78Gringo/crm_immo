-- Suppression des anciennes politiques
drop policy if exists "Les administrateurs peuvent modifier tous les profils" on public.agents;
drop policy if exists "Les administrateurs peuvent créer des profils" on public.agents;
drop policy if exists "Les administrateurs peuvent lire tous les profils" on public.agents;
drop policy if exists "Les agents peuvent modifier leur propre profil" on public.agents;
drop policy if exists "Les agents peuvent insérer leur profil" on public.agents;

-- Politique permettant aux agents de créer leur profil initial
create policy "Les agents peuvent créer leur profil initial"
  on public.agents
  for insert
  with check (auth.uid() = id);

-- Politique permettant aux agents de lire leur propre profil
create policy "Les agents peuvent lire leur propre profil"
  on public.agents
  for select
  using (auth.uid() = id);

-- Politique permettant aux agents de modifier leur propre profil
create policy "Les agents peuvent modifier leur propre profil"
  on public.agents
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);