-- Activer RLS sur la table deals s'il n'est pas déjà activé
alter table if exists public.deals enable row level security;

-- Supprimer toutes les politiques existantes pour éviter les conflits
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

-- Vérifier que la colonne agent_id existe et est de type uuid
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_name = 'deals'
    and column_name = 'agent_id'
    and data_type = 'uuid'
  ) then
    alter table public.deals add column agent_id uuid references auth.users(id);
  end if;
end
$$;