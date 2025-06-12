-- Add spouse death fields to buyers table
alter table public.buyers
  add column spouse_death_date date,
  add column spouse_death_place text;

-- Add comments
comment on column public.buyers.spouse_death_date is 'Date du décès du conjoint';
comment on column public.buyers.spouse_death_place is 'Lieu de décès du conjoint';