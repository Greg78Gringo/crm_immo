-- Create table for deal statuses
create table public.deal_statuses (
  id serial primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create table for deal reasons
create table public.deal_reasons (
  id serial primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.deal_statuses enable row level security;
alter table public.deal_reasons enable row level security;

-- Create RLS policies for read-only access
create policy "Anyone can view deal statuses"
  on public.deal_statuses for select
  to authenticated
  using (true);

create policy "Anyone can view deal reasons"
  on public.deal_reasons for select
  to authenticated
  using (true);

-- Insert initial data for deal statuses
insert into public.deal_statuses (name) values
  ('Veille'),
  ('1er Rdv'),
  ('Estimation'),
  ('Mandat'),
  ('Offre d''achat'),
  ('Compromis'),
  ('Signée - Affaire terminée');

-- Insert initial data for deal reasons
insert into public.deal_reasons (name) values
  ('Déplacement'),
  ('Divorce'),
  ('Décès'),
  ('Dette'),
  ('Passoire énergétique');

-- Add comments
comment on table public.deal_statuses is 'Table des statuts d''affaire disponibles';
comment on table public.deal_reasons is 'Table des motifs d''affaire disponibles';