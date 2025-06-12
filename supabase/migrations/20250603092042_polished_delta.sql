-- Create autre_mode_vente table
create table public.autre_mode_vente (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  mode text not null,
  mandate_type text check (mandate_type in ('simple', 'exclusif')),
  name text,
  url text,
  price decimal(12,2),
  agency_commission decimal(5,2),
  listing_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.autre_mode_vente enable row level security;

-- Create RLS policies
create policy "Agents can view their autre_mode_vente"
  on public.autre_mode_vente
  for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = autre_mode_vente.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can insert autre_mode_vente"
  on public.autre_mode_vente
  for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = autre_mode_vente.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update autre_mode_vente"
  on public.autre_mode_vente
  for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = autre_mode_vente.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can delete autre_mode_vente"
  on public.autre_mode_vente
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = autre_mode_vente.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Create indexes
create index idx_autre_mode_vente_deal_id on public.autre_mode_vente(deal_id);

-- Add trigger for updated_at
create trigger handle_autre_mode_vente_updated_at
  before update on public.autre_mode_vente
  for each row
  execute function handle_updated_at();

-- Add comments
comment on table public.autre_mode_vente is 'Table des autres modes de vente';
comment on column public.autre_mode_vente.deal_id is 'Identifiant de l''affaire associée';
comment on column public.autre_mode_vente.mode is 'Mode de vente';
comment on column public.autre_mode_vente.mandate_type is 'Type de mandat (simple ou exclusif)';
comment on column public.autre_mode_vente.name is 'Nom';
comment on column public.autre_mode_vente.url is 'URL de l''annonce';
comment on column public.autre_mode_vente.price is 'Prix affiché';
comment on column public.autre_mode_vente.agency_commission is 'Commission d''agence en pourcentage';
comment on column public.autre_mode_vente.listing_date is 'Date de mise en vente';