-- Modifier la structure de la table deals_price
alter table public.deals_price
  -- Supprimer les anciennes colonnes
  drop column if exists agency_prices,
  drop column if exists agency_commissions,
  -- Ajouter les nouvelles colonnes avec séparateurs
  add column agency_names text, -- Noms séparés par des |
  add column agency_prices decimal(12,2)[], -- Prix en tableau
  add column agency_commissions decimal(5,2)[]; -- Commissions en tableau

comment on column public.deals_price.agency_names is 'Noms des agences séparés par des |';
comment on column public.deals_price.agency_prices is 'Prix des agences';
comment on column public.deals_price.agency_commissions is 'Commissions des agences';