-- Add agency_commission field to deals table
alter table public.deals
  add column if not exists agency_commission decimal(5,2);

-- Add comment
comment on column public.deals.agency_commission is 'Commission d''agence en pourcentage';