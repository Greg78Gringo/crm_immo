-- Ajout des politiques d'écriture pour la table agents

-- Politique permettant aux agents de modifier leur propre profil
create policy "Les agents peuvent modifier leur propre profil"
  on public.agents
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Politique permettant aux agents de mettre à jour leur profil
create policy "Les agents peuvent insérer leur profil"
  on public.agents
  for insert
  with check (auth.uid() = id);

-- Politique permettant aux administrateurs de modifier tous les profils
create policy "Les administrateurs peuvent modifier tous les profils"
  on public.agents
  for update
  using (
    exists (
      select 1 
      from public.agents 
      where id = auth.uid() and is_admin = true
    )
  )
  with check (
    exists (
      select 1 
      from public.agents 
      where id = auth.uid() and is_admin = true
    )
  );

-- Politique permettant aux administrateurs d'insérer de nouveaux profils
create policy "Les administrateurs peuvent créer des profils"
  on public.agents
  for insert
  with check (
    exists (
      select 1 
      from public.agents 
      where id = auth.uid() and is_admin = true
    )
  );