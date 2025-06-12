/*
  # Création de la table des prix des affaires

  1. Nouvelle Table
    - `deals_price`
      - `id` (uuid, clé primaire)
      - `deal_id` (uuid, référence vers deals)
      - `mandate_type` (texte: simple ou exclusif)
      - `estimated_price` (decimal)
      - `display_price` (decimal)
      - `agency_commission` (decimal)
      - `pap_price` (decimal)
      - `agency_prices` (tableau d'objets JSON)

  2. Sécurité
    - Enable RLS
    - Politiques pour les agents
*/

-- Création de la table deals_price
create table public.deals_price (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  mandate_type text check (mandate_type in ('simple', 'exclusif')),
  estimated_price decimal(12,2),
  display_price decimal(12,2),
  agency_commission decimal(5,2),
  pap_price decimal(12,2),
  agency_prices jsonb[] default array[]::jsonb[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer RLS
alter table public.deals_price enable row level security;

-- Créer les politiques RLS
create policy "Agents can view their deals prices"
  on public.deals_price
  for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = deals_price.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can insert deals prices"
  on public.deals_price
  for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = deals_price.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update deals prices"
  on public.deals_price
  for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = deals_price.deal_id
      and deals.agent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.deals
      where deals.id = deals_price.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can delete deals prices"
  on public.deals_price
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = deals_price.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Créer les index
create index idx_deals_price_deal_id on public.deals_price(deal_id);

-- Ajouter le trigger pour updated_at
create trigger handle_deals_price_updated_at
  before update on public.deals_price
  for each row
  execute function handle_updated_at();

-- Ajouter les commentaires
comment on table public.deals_price is 'Table des prix des affaires';
comment on column public.deals_price.deal_id is 'Identifiant de l''affaire associée';
comment on column public.deals_price.mandate_type is 'Type de mandat (simple ou exclusif)';
comment on column public.deals_price.estimated_price is 'Estimation du bien';
comment on column public.deals_price.display_price is 'Prix affiché';
comment on column public.deals_price.agency_commission is 'Commission d''agence en pourcentage';
comment on column public.deals_price.pap_price is 'Prix sur PAP';
comment on column public.deals_price.agency_prices is 'Prix et commissions par agence (tableau d''objets JSON)';