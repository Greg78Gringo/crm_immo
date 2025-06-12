-- Create table for marital status
create table public.statut_marital (
  id serial primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create table for person types
create table public.type_personne (
  id serial primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.statut_marital enable row level security;
alter table public.type_personne enable row level security;

-- Create RLS policies for read-only access
create policy "Anyone can view marital status"
  on public.statut_marital for select
  to authenticated
  using (true);

create policy "Anyone can view person types"
  on public.type_personne for select
  to authenticated
  using (true);

-- Insert initial data for marital status
insert into public.statut_marital (name) values
  ('Célibataire'),
  ('Marié(e)'),
  ('Pacsé(e)'),
  ('Divorcé(e)'),
  ('Veuf(ve)');

-- Insert initial data for person types
insert into public.type_personne (name) values
  ('Personne Physique Décisionnaire'),
  ('Personne Physique sous protection'),
  ('Personne Morale');

-- Add comments
comment on table public.statut_marital is 'Table des statuts maritaux disponibles';
comment on table public.type_personne is 'Table des types de personne disponibles';