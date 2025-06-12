-- Add comments field to deals table
alter table public.deals
add column comments text;

comment on column public.deals.comments is 'Commentaires sur l''affaire';