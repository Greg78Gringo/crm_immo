-- Add pricing fields to deals table
alter table public.deals
  add column estimated_price decimal(12,2),
  add column display_price decimal(12,2),
  add column agency_commission decimal(5,2);

-- Add comments
comment on column public.deals.estimated_price is 'Estimation du bien';
comment on column public.deals.display_price is 'Prix affiché';
comment on column public.deals.agency_commission is 'Commission d''agence en pourcentage';