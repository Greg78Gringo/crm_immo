-- Création de la table deals
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
  
  -- Contrainte pour s'assurer que les champs d'agence sont remplis uniquement si method = 'agence'
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

-- Créer les index pour de meilleures performances
create index idx_deals_agent_id on public.deals(agent_id);
create index idx_deals_status_id on public.deals(status_id);
create index idx_deals_reason_id on public.deals(reason_id);

-- Ajouter le trigger pour updated_at
create trigger handle_deals_updated_at
  before update on public.deals
  for each row
  execute function handle_updated_at();

-- Ajouter les commentaires
comment on table public.deals is 'Table des affaires immobilières';
comment on column public.deals.deal_id is 'Identifiant séquentiel de l''affaire';
comment on column public.deals.agent_id is 'Identifiant de l''agent responsable';
comment on column public.deals.name is 'Nom de l''affaire';
comment on column public.deals.status_id is 'Statut de l''affaire';
comment on column public.deals.reason_id is 'Motif de l''affaire';
comment on column public.deals.method is 'Méthode de vente (agence ou pap)';
comment on column public.deals.agency_name is 'Nom de l''agence si méthode = agence';
comment on column public.deals.mandate_type is 'Type de mandat si méthode = agence';
comment on column public.deals.listing_date is 'Date de mise en vente';