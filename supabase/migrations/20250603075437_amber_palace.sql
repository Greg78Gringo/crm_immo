-- Create prix_bien table
create table public.prix_bien (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  mandate_type text check (mandate_type in ('simple', 'exclusif')),
  estimated_price decimal(12,2),
  display_price decimal(12,2),
  agency_commission decimal(5,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.prix_bien enable row level security;

-- Create RLS policies
create policy "Agents can view their prix_bien"
  on public.prix_bien
  for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = prix_bien.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can insert prix_bien"
  on public.prix_bien
  for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = prix_bien.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update prix_bien"
  on public.prix_bien
  for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = prix_bien.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can delete prix_bien"
  on public.prix_bien
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = prix_bien.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Create indexes
create index idx_prix_bien_deal_id on public.prix_bien(deal_id);

-- Add trigger for updated_at
create trigger handle_prix_bien_updated_at
  before update on public.prix_bien
  for each row
  execute function handle_updated_at();

-- Add comments
comment on table public.prix_bien is 'Table des prix des biens immobiliers';
comment on column public.prix_bien.deal_id is 'Identifiant de l''affaire associée';
comment on column public.prix_bien.mandate_type is 'Type de mandat (simple ou exclusif)';
comment on column public.prix_bien.estimated_price is 'Estimation du bien';
comment on column public.prix_bien.display_price is 'Prix affiché';
comment on column public.prix_bien.agency_commission is 'Commission d''agence en pourcentage';