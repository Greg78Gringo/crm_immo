-- Commentaires en français pour la table agents
comment on table public.agents is 'Table des agents immobiliers';

-- Commentaires sur les colonnes
comment on column public.agents.id is 'Identifiant unique de l''agent (lié à auth.users)';
comment on column public.agents.first_name is 'Prénom de l''agent';
comment on column public.agents.last_name is 'Nom de famille de l''agent';
comment on column public.agents.phone is 'Numéro de téléphone (format: 10 chiffres)';
comment on column public.agents.role is 'Rôle de l''agent (admin, agent, manager)';
comment on column public.agents.rsac_number is 'Numéro RSAC (6 chiffres)';
comment on column public.agents.sponsor_email is 'Email du parrain';
comment on column public.agents.is_admin is 'Indique si l''agent est administrateur';
comment on column public.agents.created_at is 'Date de création';
comment on column public.agents.updated_at is 'Date de dernière modification';

-- Mise à jour des messages de contrainte
alter table public.agents 
  drop constraint if exists valid_rsac_number,
  add constraint valid_rsac_number check (rsac_number ~ '^[0-9]{6}$') 
  not valid;
comment on constraint valid_rsac_number on public.agents 
  is 'Le numéro RSAC doit contenir exactement 6 chiffres';

alter table public.agents 
  drop constraint if exists valid_phone_number,
  add constraint valid_phone_number check (phone ~ '^[0-9]{10}$') 
  not valid;
comment on constraint valid_phone_number on public.agents 
  is 'Le numéro de téléphone doit contenir exactement 10 chiffres';

alter table public.agents 
  drop constraint if exists valid_sponsor_email,
  add constraint valid_sponsor_email check (sponsor_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') 
  not valid;
comment on constraint valid_sponsor_email on public.agents 
  is 'L''email du parrain doit être dans un format valide';

-- Validation des contraintes
alter table public.agents validate constraint valid_rsac_number;
alter table public.agents validate constraint valid_phone_number;
alter table public.agents validate constraint valid_sponsor_email;