-- Supprimer la table sellers existante
drop table if exists public.sellers cascade;

-- Recréer la table sellers
create table public.sellers (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  first_name text,
  last_name text,
  phone text check (phone ~ '^[0-9]{10}$' or phone is null),
  email text check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' or email is null),
  marital_status_id integer references public.statut_marital(id),
  person_type_id integer references public.type_personne(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer RLS
alter table public.sellers enable row level security;

-- Créer les politiques RLS
create policy "Agents can view sellers"
  on public.sellers
  for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = sellers.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can insert sellers"
  on public.sellers
  for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = sellers.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update sellers"
  on public.sellers
  for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = sellers.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can delete sellers"
  on public.sellers
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = sellers.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Créer les index
create index idx_sellers_deal_id on public.sellers(deal_id);
create index idx_sellers_marital_status on public.sellers(marital_status_id);
create index idx_sellers_person_type on public.sellers(person_type_id);

-- Ajouter le trigger pour updated_at
create trigger handle_sellers_updated_at
  before update on public.sellers
  for each row
  execute function handle_updated_at();

-- Ajouter les commentaires
comment on table public.sellers is 'Table des vendeurs associés aux affaires';
comment on column public.sellers.deal_id is 'Identifiant de l''affaire associée';
comment on column public.sellers.first_name is 'Prénom du vendeur';
comment on column public.sellers.last_name is 'Nom du vendeur';
comment on column public.sellers.phone is 'Numéro de téléphone (10 chiffres, optionnel)';
comment on column public.sellers.email is 'Adresse email (optionnelle)';
comment on column public.sellers.marital_status_id is 'Identifiant du statut marital (optionnel)';
comment on column public.sellers.person_type_id is 'Identifiant du type de personne (optionnel)';