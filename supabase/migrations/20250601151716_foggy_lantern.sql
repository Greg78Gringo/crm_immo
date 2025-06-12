-- Supprimer et recréer la table deals avec la bonne configuration
drop table if exists public.deals cascade;

create table public.deals (
  id uuid default gen_random_uuid() primary key,
  deal_id serial unique,
  agent_id uuid references auth.users(id) not null,
  name text not null,
  status_id integer references public.deal_statuses(id),
  reason_id integer references public.deal_reasons(id),
  method text check (method in ('agence', 'pap')),
  agency_name text,
  mandate_type text check (mandate_type in ('simple', 'exclusif')),
  listing_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint check_agency_fields check (
    (method = 'agence' and agency_name is not null and mandate_type is not null) or
    (method = 'pap' and agency_name is null and mandate_type is null) or
    (method is null)
  )
);

-- Activer RLS
alter table public.deals enable row level security;

-- Créer les politiques RLS
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

-- Créer les index
create index idx_deals_agent_id on public.deals(agent_id);
create index idx_deals_status_id on public.deals(status_id);
create index idx_deals_reason_id on public.deals(reason_id);

-- Ajouter le trigger pour updated_at
create trigger handle_deals_updated_at
  before update on public.deals
  for each row
  execute function handle_updated_at();