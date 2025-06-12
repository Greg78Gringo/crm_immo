-- Supprimer complètement la contrainte check_agency_fields
alter table public.deals drop constraint if exists check_agency_fields;

comment on column public.deals.agency_name is 'Nom de l''agence (optionnel)';
comment on column public.deals.mandate_type is 'Type de mandat (optionnel)';