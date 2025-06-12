-- Add mandate_type field to deals table
alter table public.deals
  add column mandate_type text check (mandate_type in ('simple', 'exclusif'));

-- Add comment
comment on column public.deals.mandate_type is 'Type de mandat (simple ou exclusif)';