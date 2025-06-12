-- Create sellers table
create table public.sellers (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text check (phone ~ '^[0-9]{10}$'),
  email text check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  marital_status_id integer references public.statut_marital(id),
  person_type_id integer references public.type_personne(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.sellers enable row level security;

-- Create RLS policies
create policy "Agents can view their deals' sellers"
  on public.sellers for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = sellers.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can create sellers for their deals"
  on public.sellers for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = sellers.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update their deals' sellers"
  on public.sellers for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = sellers.deal_id
      and deals.agent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.deals
      where deals.id = sellers.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Create trigger for updated_at
create trigger handle_sellers_updated_at
  before update on public.sellers
  for each row
  execute function handle_updated_at();

-- Add comments
comment on table public.sellers is 'Table des vendeurs associés aux affaires';
comment on column public.sellers.deal_id is 'Identifiant de l''affaire associée';
comment on column public.sellers.first_name is 'Prénom du vendeur';
comment on column public.sellers.last_name is 'Nom du vendeur';
comment on column public.sellers.phone is 'Numéro de téléphone (10 chiffres)';
comment on column public.sellers.email is 'Adresse email';
comment on column public.sellers.marital_status_id is 'Identifiant du statut marital';
comment on column public.sellers.person_type_id is 'Identifiant du type de personne';