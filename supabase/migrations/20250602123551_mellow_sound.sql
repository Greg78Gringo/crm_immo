-- Supprimer les types enum s'ils existent
drop type if exists public.property_type cascade;
drop type if exists public.heating_type cascade;

-- Créer la table des types de bien
create table public.property_types (
  id serial primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Créer la table des types de chauffage
create table public.heating_types (
  id serial primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer RLS
alter table public.property_types enable row level security;
alter table public.heating_types enable row level security;

-- Créer les politiques RLS pour l'accès en lecture seule
create policy "Anyone can view property types"
  on public.property_types for select
  to authenticated
  using (true);

create policy "Anyone can view heating types"
  on public.heating_types for select
  to authenticated
  using (true);

-- Insérer les données initiales pour les types de bien
insert into public.property_types (name) values
  ('maison'),
  ('maison_architecte'),
  ('appartement'),
  ('loft'),
  ('terrain'),
  ('chateau'),
  ('immeuble');

-- Insérer les données initiales pour les types de chauffage
insert into public.heating_types (name) values
  ('electrique'),
  ('gaz'),
  ('fioul'),
  ('bois'),
  ('pompe_chaleur'),
  ('climatisation_reversible'),
  ('autre');

-- Modifier la table description_bien_principale pour utiliser les nouvelles tables
alter table public.description_bien_principale
  drop column if exists property_type,
  drop column if exists heating_type,
  add column property_type_id integer references public.property_types(id),
  add column heating_type_id integer references public.heating_types(id);

-- Ajouter les commentaires
comment on table public.property_types is 'Table des types de bien disponibles';
comment on table public.heating_types is 'Table des types de chauffage disponibles';
comment on column public.description_bien_principale.property_type_id is 'Identifiant du type de bien';
comment on column public.description_bien_principale.heating_type_id is 'Identifiant du type de chauffage';