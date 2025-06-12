-- Create enum for property types if not exists
create type public.property_type as enum (
  'maison',
  'maison_architecte',
  'appartement',
  'loft',
  'terrain',
  'chateau',
  'immeuble'
);

-- Create enum for heating types if not exists
create type public.heating_type as enum (
  'electrique',
  'gaz',
  'fioul',
  'bois',
  'pompe_chaleur',
  'climatisation_reversible',
  'autre'
);

-- Create property description table
create table public.description_bien_principale (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  property_type property_type,
  address text,
  city text,
  rooms_count integer,
  bedrooms_count integer,
  living_room_area decimal(10,2),
  dining_room_area decimal(10,2),
  bathrooms_count integer,
  shower_rooms_count integer,
  wc_count integer,
  has_cellar boolean default false,
  has_partial_basement boolean default false,
  has_full_basement boolean default false,
  has_terrace boolean default false,
  terrace_count integer,
  terrace_area decimal(10,2),
  has_garden boolean default false,
  garden_area decimal(10,2),
  has_parking boolean default false,
  parking_count integer,
  has_box boolean default false,
  box_count integer,
  has_pool boolean default false,
  is_pool_possible boolean default false,
  has_fireplace boolean default false,
  has_alarm boolean default false,
  heating_type heating_type,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.description_bien_principale enable row level security;

-- Create RLS policies
create policy "Agents can view property descriptions"
  on public.description_bien_principale
  for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = description_bien_principale.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can insert property descriptions"
  on public.description_bien_principale
  for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = description_bien_principale.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update property descriptions"
  on public.description_bien_principale
  for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = description_bien_principale.deal_id
      and deals.agent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.deals
      where deals.id = description_bien_principale.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can delete property descriptions"
  on public.description_bien_principale
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = description_bien_principale.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Create indexes
create index idx_property_description_deal_id on public.description_bien_principale(deal_id);

-- Add trigger for updated_at
create trigger handle_property_description_updated_at
  before update on public.description_bien_principale
  for each row
  execute function handle_updated_at();

-- Add comments
comment on table public.description_bien_principale is 'Table des descriptions principales des biens';
comment on column public.description_bien_principale.deal_id is 'Identifiant de l''affaire associée';
comment on column public.description_bien_principale.property_type is 'Type de bien';
comment on column public.description_bien_principale.address is 'Adresse du bien';
comment on column public.description_bien_principale.city is 'Ville';
comment on column public.description_bien_principale.rooms_count is 'Nombre de pièces';
comment on column public.description_bien_principale.bedrooms_count is 'Nombre de chambres';
comment on column public.description_bien_principale.living_room_area is 'Surface du salon en m²';
comment on column public.description_bien_principale.dining_room_area is 'Surface de la salle à manger en m²';
comment on column public.description_bien_principale.bathrooms_count is 'Nombre de salles de bain';
comment on column public.description_bien_principale.shower_rooms_count is 'Nombre de salles d''eau';
comment on column public.description_bien_principale.wc_count is 'Nombre de WC';
comment on column public.description_bien_principale.has_cellar is 'Présence d''une cave';
comment on column public.description_bien_principale.has_partial_basement is 'Présence d''un sous-sol partiel';
comment on column public.description_bien_principale.has_full_basement is 'Présence d''un sous-sol complet';
comment on column public.description_bien_principale.has_terrace is 'Présence d''une terrasse';
comment on column public.description_bien_principale.terrace_count is 'Nombre de terrasses';
comment on column public.description_bien_principale.terrace_area is 'Surface totale des terrasses en m²';
comment on column public.description_bien_principale.has_garden is 'Présence d''un jardin';
comment on column public.description_bien_principale.garden_area is 'Surface du jardin en m²';
comment on column public.description_bien_principale.has_parking is 'Présence d''un parking';
comment on column public.description_bien_principale.parking_count is 'Nombre de places de parking';
comment on column public.description_bien_principale.has_box is 'Présence d''un box';
comment on column public.description_bien_principale.box_count is 'Nombre de box';
comment on column public.description_bien_principale.has_pool is 'Présence d''une piscine';
comment on column public.description_bien_principale.is_pool_possible is 'Terrain piscinable';
comment on column public.description_bien_principale.has_fireplace is 'Présence d''une cheminée';
comment on column public.description_bien_principale.has_alarm is 'Présence d''une alarme';
comment on column public.description_bien_principale.heating_type is 'Type de chauffage';