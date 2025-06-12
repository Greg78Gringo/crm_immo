-- Supprimer la colonne agency_commission de la table deals
alter table public.deals drop column if exists agency_commission;