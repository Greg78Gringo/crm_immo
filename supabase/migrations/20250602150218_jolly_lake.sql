/*
  # Mise à jour du statut du bien

  1. Modifications
    - Ajout d'une contrainte pour le champ method
    - Ajout des champs pour les URLs des annonces
    - Modification de la gestion des agences multiples

  2. Changements
    - Le champ method accepte maintenant 'pas_encore', 'pap', ou 'agence'
    - Ajout des champs url_pap et url_agence
    - Les champs agency_name, listing_date deviennent des arrays pour gérer plusieurs agences
*/

-- Supprimer l'ancienne contrainte sur method
alter table public.deals drop constraint if exists deals_method_check;

-- Ajouter la nouvelle contrainte
alter table public.deals 
  add constraint deals_method_check 
  check (method in ('pas_encore', 'pap', 'agence'));

-- Ajouter les nouveaux champs
alter table public.deals
  add column if not exists url_pap text,
  add column if not exists url_agence text[];

-- Modifier les champs existants pour supporter plusieurs agences
alter table public.deals
  alter column agency_name type text[] using array[agency_name],
  alter column listing_date type date[] using array[listing_date];

-- Ajouter les commentaires
comment on column public.deals.method is 'Méthode de vente (pas_encore, pap, agence)';
comment on column public.deals.url_pap is 'URL de l''annonce PAP';
comment on column public.deals.url_agence is 'URLs des annonces des agences';
comment on column public.deals.agency_name is 'Noms des agences';
comment on column public.deals.listing_date is 'Dates de mise en vente par agence';