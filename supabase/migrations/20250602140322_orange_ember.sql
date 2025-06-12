-- Create table for agency prices
create table public.agency_prices (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  agency_name text not null,
  price decimal(12,2) not null,
  commission decimal(5,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.agency_prices enable row level security;

-- Create RLS policies
create policy "Agents can view agency prices"
  on public.agency_prices
  for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = agency_prices.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can insert agency prices"
  on public.agency_prices
  for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = agency_prices.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update agency prices"
  on public.agency_prices
  for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = agency_prices.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can delete agency prices"
  on public.agency_prices
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = agency_prices.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Create indexes
create index idx_agency_prices_deal_id on public.agency_prices(deal_id);

-- Add trigger for updated_at
create trigger handle_agency_prices_updated_at
  before update on public.agency_prices
  for each row
  execute function handle_updated_at();

-- Add comments
comment on table public.agency_prices is 'Table des prix par agence';
comment on column public.agency_prices.deal_id is 'Identifiant de l''affaire associée';
comment on column public.agency_prices.agency_name is 'Nom de l''agence';
comment on column public.agency_prices.price is 'Prix affiché par l''agence';
comment on column public.agency_prices.commission is 'Commission de l''agence en pourcentage';