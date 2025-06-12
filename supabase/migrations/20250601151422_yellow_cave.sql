-- Activer RLS sur la table deals
alter table public.deals enable row level security;

-- Supprimer les anciennes politiques si elles existent
drop policy if exists "Agents can view their deals" on public.deals;
drop policy if exists "Agents can insert deals" on public.deals;
drop policy if exists "Agents can update deals" on public.deals;

-- Créer les nouvelles politiques
create policy "Agents can view their deals"
  on public.deals
  for select
  using (auth.uid() = agent_id);

create policy "Agents can insert deals"
  on public.deals
  for insert
  with check (auth.uid() = agent_id);

create policy "Agents can update deals"
  on public.deals
  for update
  using (auth.uid() = agent_id)
  with check (auth.uid() = agent_id);