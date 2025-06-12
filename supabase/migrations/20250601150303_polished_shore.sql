-- Ajout des colonnes pour les informations de base
alter table public.deals
  add column reason_id integer references public.deal_reasons(id),
  add column status_id integer references public.deal_statuses(id);

-- Ajout des colonnes pour le statut du bien
alter table public.deals
  add column method text check (method in ('agence', 'pap')),
  add column agency_name text,
  add column mandate_type text check (mandate_type in ('simple', 'exclusif')),
  add column listing_date date;

-- Ajout des contraintes conditionnelles
alter table public.deals
  add constraint check_agency_fields check (
    (method = 'agence' and agency_name is not null and mandate_type is not null) or
    (method = 'pap' and agency_name is null and mandate_type is null) or
    (method is null)
  );

-- Ajout des commentaires
comment on column public.deals.reason_id is 'Identifiant du motif de l''affaire';
comment on column public.deals.status_id is 'Identifiant du statut de l''affaire';
comment on column public.deals.method is 'Méthode de vente (agence ou pap)';
comment on column public.deals.agency_name is 'Nom de l''agence (si méthode = agence)';
comment on column public.deals.mandate_type is 'Type de mandat (si méthode = agence)';
comment on column public.deals.listing_date is 'Date de mise en vente';

-- Création d'index pour améliorer les performances
create index idx_deals_reason_id on public.deals(reason_id);
create index idx_deals_status_id on public.deals(status_id);
create index idx_deals_method on public.deals(method);