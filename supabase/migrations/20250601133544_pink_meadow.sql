-- Ajout des champs dans la table auth.users
alter table auth.users 
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists phone text check (phone ~ '^[0-9]{10}$'),
  add column if not exists sponsor_email text check (sponsor_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  add column if not exists rsac_number text check (rsac_number ~ '^[0-9]{6}$'),
  add column if not exists role text check (role in ('agent', 'admin')) default 'agent';

-- Ajout des commentaires
comment on column auth.users.first_name is 'Prénom de l''utilisateur';
comment on column auth.users.last_name is 'Nom de famille de l''utilisateur';
comment on column auth.users.phone is 'Numéro de téléphone (10 chiffres)';
comment on column auth.users.sponsor_email is 'Email du parrain';
comment on column auth.users.rsac_number is 'Numéro RSAC (6 chiffres)';
comment on column auth.users.role is 'Rôle de l''utilisateur (agent ou admin)';