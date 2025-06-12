-- Create agencies table
create table public.agencies (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  method text not null check (method in ('pas_encore', 'pap', 'agence')),
  name text,
  listing_url text,
  listing_date date,
  price decimal(12,2),
  commission decimal(5,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.agencies enable row level security;

-- Create RLS policies
create policy "Agents can view their agencies"
  on public.agencies
  for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = agencies.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can insert agencies"
  on public.agencies
  for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = agencies.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update agencies"
  on public.agencies
  for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = agencies.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can delete agencies"
  on public.agencies
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = agencies.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Create indexes
create index idx_agencies_deal_id on public.agencies(deal_id);
create index idx_agencies_method on public.agencies(method);

-- Add trigger for updated_at
create trigger handle_agencies_updated_at
  before update on public.agencies
  for each row
  execute function handle_updated_at();

-- Add comments
comment on table public.agencies is 'Table des agences associées aux affaires';
comment on column public.agencies.deal_id is 'Identifiant de l''affaire associée';
comment on column public.agencies.method is 'Méthode de vente (pas_encore, pap, agence)';
comment on column public.agencies.name is 'Nom de l''agence';
comment on column public.agencies.listing_url is 'URL de l''annonce';
comment on column public.agencies.listing_date is 'Date de mise en vente';
comment on column public.agencies.price is 'Prix affiché';
comment on column public.agencies.commission is 'Commission en pourcentage';