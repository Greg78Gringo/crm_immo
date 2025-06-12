-- Suppression des politiques existantes
drop policy if exists "Agents can update their own deals" on public.deals;
drop policy if exists "Agents can create their own deals" on public.deals;
drop policy if exists "Agents can view their own deals" on public.deals;

-- Recréation des politiques
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