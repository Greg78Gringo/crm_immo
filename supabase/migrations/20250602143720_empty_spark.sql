-- Add listing_url field to deals table
alter table public.deals
  add column listing_url text;

-- Add comment
comment on column public.deals.listing_url is 'URL de l''annonce';