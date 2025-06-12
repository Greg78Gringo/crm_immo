-- Create transport_means table
create table public.transport_means (
  id serial primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.transport_means enable row level security;

-- Create RLS policies for read-only access
create policy "Anyone can view transport means"
  on public.transport_means for select
  to authenticated
  using (true);

-- Insert initial data
insert into public.transport_means (name) values
  ('Voiture'),
  ('Transports en commun'),
  ('À pied'),
  ('Vélo');

-- Add comments
comment on table public.transport_means is 'Table des moyens de transport disponibles';
comment on column public.transport_means.name is 'Nom du moyen de transport';

-- Modify buyers table to use foreign key
alter table public.buyers
  drop column if exists transport_means,
  add column transport_means_id integer references public.transport_means(id);

-- Add index for better performance
create index idx_buyers_transport_means on public.buyers(transport_means_id);

-- Add comment
comment on column public.buyers.transport_means_id is 'Identifiant du moyen de transport (référence à transport_means)';