-- Supprimer les anciennes colonnes
alter table public.deals
  drop column if exists agency_name cascade,
  drop column if exists url_agence cascade,
  drop column if exists url_pap cascade;

-- Modifier la contrainte sur method
alter table public.deals drop constraint if exists deals_method_check;
alter table public.deals add constraint deals_method_check 
  check (method in ('pas_encore', 'pap', 'agence'));

-- Créer le type pour stocker les informations d'agence
create type public.agency_info as (
  name text,
  listing_date date,
  listing_url text
);

-- Ajouter les nouvelles colonnes
alter table public.deals
  add column agencies public.agency_info[],
  add column pap_url text;

-- Ajouter les commentaires
comment on column public.deals.method is 'Méthode de vente (pas_encore, pap, agence)';
comment on column public.deals.agencies is 'Informations des agences (nom, date de mise en vente, URL)';
comment on column public.deals.pap_url is 'URL de l''annonce PAP';