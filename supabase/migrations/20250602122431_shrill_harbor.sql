-- Create enum for property types
create type public.property_type as enum (
  'maison',
  'maison_architecte',
  'appartement',
  'loft',
  'terrain',
  'chateau',
  'immeuble'
);

-- Create enum for heating types
create type public.heating_type as enum (
  'electrique',
  'gaz',
  'fioul',
  'bois',
  'pompe_chaleur',
  'climatisation_reversible',
  'autre'
);

-- Add property details columns to deals table
alter table public.deals
  add column property_type property_type,
  add column address text,
  add column city text,
  add column rooms_count integer,
  add column bedrooms_count integer,
  add column living_room_area decimal(10,2),
  add column dining_room_area decimal(10,2),
  add column bathrooms_count integer,
  add column shower_rooms_count integer,
  add column wc_count integer,
  add column has_cellar boolean default false,
  add column has_partial_basement boolean default false,
  add column has_full_basement boolean default false,
  add column has_terrace boolean default false,
  add column terrace_count integer,
  add column terrace_area decimal(10,2),
  add column has_garden boolean default false,
  add column garden_area decimal(10,2),
  add column has_parking boolean default false,
  add column parking_count integer,
  add column has_box boolean default false,
  add column box_count integer,
  add column has_pool boolean default false,
  add column is_pool_possible boolean default false,
  add column has_fireplace boolean default false,
  add column has_alarm boolean default false,
  add column heating_type heating_type;

-- Add comments
comment on column public.deals.property_type is 'Type de bien';
comment on column public.deals.address is 'Adresse du bien';
comment on column public.deals.city is 'Ville';
comment on column public.deals.rooms_count is 'Nombre de pièces';
comment on column public.deals.bedrooms_count is 'Nombre de chambres';
comment on column public.deals.living_room_area is 'Surface du salon en m²';
comment on column public.deals.dining_room_area is 'Surface de la salle à manger en m²';
comment on column public.deals.bathrooms_count is 'Nombre de salles de bain';
comment on column public.deals.shower_rooms_count is 'Nombre de salles d''eau';
comment on column public.deals.wc_count is 'Nombre de WC';
comment on column public.deals.has_cellar is 'Présence d''une cave';
comment on column public.deals.has_partial_basement is 'Présence d''un sous-sol partiel';
comment on column public.deals.has_full_basement is 'Présence d''un sous-sol complet';
comment on column public.deals.has_terrace is 'Présence d''une terrasse';
comment on column public.deals.terrace_count is 'Nombre de terrasses';
comment on column public.deals.terrace_area is 'Surface totale des terrasses en m²';
comment on column public.deals.has_garden is 'Présence d''un jardin';
comment on column public.deals.garden_area is 'Surface du jardin en m²';
comment on column public.deals.has_parking is 'Présence d''un parking';
comment on column public.deals.parking_count is 'Nombre de places de parking';
comment on column public.deals.has_box is 'Présence d''un box';
comment on column public.deals.box_count is 'Nombre de box';
comment on column public.deals.has_pool is 'Présence d''une piscine';
comment on column public.deals.is_pool_possible is 'Terrain piscinable';
comment on column public.deals.has_fireplace is 'Présence d''une cheminée';
comment on column public.deals.has_alarm is 'Présence d''une alarme';
comment on column public.deals.heating_type is 'Type de chauffage';