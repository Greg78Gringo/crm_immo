-- Create buyers table
create table public.buyers (
  id uuid default gen_random_uuid() primary key,
  source text,
  agent_id uuid references auth.users(id),
  deal_id uuid references public.deals(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Informations personnelles
  last_name text,
  first_name text,
  address text,
  city text,
  postal_code text,
  phone text,
  email text,
  profession text,
  workplace text,
  transport_means text,

  -- Situation familiale
  marital_status text,
  children_count integer,
  children_comments text,

  -- Logement actuel
  current_housing_type text,
  surface_area integer,
  strengths text,
  weaknesses text,
  housing_status text,
  property_since date,
  selling_for_buying boolean default false,
  planned_action text,
  renting_since date,
  rent_amount decimal(12,2),
  first_time_buyer boolean default false,
  agency_discovery_source text,

  -- Projet immobilier
  project_context text,
  needs_and_motivations text,
  possible_compromises text,
  financing text,

  -- Mariage
  marriage_date date,
  marriage_city text,
  marriage_postal_code text,
  marriage_contract boolean default false,
  marriage_contract_notary text,
  marriage_contract_date date,
  matrimonial_regime text,
  regime_modification boolean default false,
  modification_notary text,
  regime_modification_date date,
  new_regime text,
  modification_approved boolean default false,
  approval_date date,
  divorce_judgment_date date,
  divorce_court text,

  -- PACS
  pacs_date date,
  pacs_court text,
  pacs_city_hall text,
  pacs_notary boolean default false,
  pacs_notary_address text,
  pacs_regime text,

  -- Informations entreprise
  company_legal_form text,
  siret_number text,
  company_address text,
  company_postal_code text,
  company_city text,

  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.buyers enable row level security;

-- Create RLS policies
create policy "Agents can view their buyers"
  on public.buyers
  for select
  using (agent_id = auth.uid());

create policy "Agents can insert buyers"
  on public.buyers
  for insert
  with check (agent_id = auth.uid());

create policy "Agents can update their buyers"
  on public.buyers
  for update
  using (agent_id = auth.uid())
  with check (agent_id = auth.uid());

create policy "Agents can delete their buyers"
  on public.buyers
  for delete
  using (agent_id = auth.uid());

-- Create indexes
create index idx_buyers_agent_id on public.buyers(agent_id);
create index idx_buyers_deal_id on public.buyers(deal_id);
create index idx_buyers_email on public.buyers(email);
create index idx_buyers_phone on public.buyers(phone);
create index idx_buyers_siret on public.buyers(siret_number);

-- Add trigger for updated_at
create trigger handle_buyers_updated_at
  before update on public.buyers
  for each row
  execute function handle_updated_at();

-- Add comments
comment on table public.buyers is 'Table des acheteurs potentiels';
comment on column public.buyers.source is 'Origine du contact (internet, agent, etc.)';
comment on column public.buyers.agent_id is 'Référence à l''agent responsable';
comment on column public.buyers.deal_id is 'Référence à l''affaire associée';
comment on column public.buyers.last_name is 'Nom de famille';
comment on column public.buyers.first_name is 'Prénom';
comment on column public.buyers.address is 'Adresse';
comment on column public.buyers.city is 'Ville';
comment on column public.buyers.postal_code is 'Code postal';
comment on column public.buyers.phone is 'Numéro de téléphone';
comment on column public.buyers.email is 'Adresse email';
comment on column public.buyers.profession is 'Profession';
comment on column public.buyers.workplace is 'Lieu de travail';
comment on column public.buyers.transport_means is 'Moyen de transport';
comment on column public.buyers.marital_status is 'Statut marital';
comment on column public.buyers.children_count is 'Nombre d''enfants';
comment on column public.buyers.children_comments is 'Commentaires sur les enfants';
comment on column public.buyers.current_housing_type is 'Type de logement actuel';
comment on column public.buyers.surface_area is 'Superficie en m²';
comment on column public.buyers.strengths is 'Points forts du logement actuel';
comment on column public.buyers.weaknesses is 'Points faibles du logement actuel';
comment on column public.buyers.housing_status is 'Statut (propriétaire ou locataire)';
comment on column public.buyers.property_since is 'Date d''acquisition';
comment on column public.buyers.selling_for_buying is 'Vente pour achat';
comment on column public.buyers.planned_action is 'Action envisagée';
comment on column public.buyers.renting_since is 'Date de début de location';
comment on column public.buyers.rent_amount is 'Montant du loyer';
comment on column public.buyers.first_time_buyer is 'Primo-accédant';
comment on column public.buyers.agency_discovery_source is 'Source de découverte de l''agence';
comment on column public.buyers.project_context is 'Contexte du projet';
comment on column public.buyers.needs_and_motivations is 'Attentes, besoins et motivations';
comment on column public.buyers.possible_compromises is 'Compromis possibles';
comment on column public.buyers.financing is 'Financement';
comment on column public.buyers.marriage_date is 'Date du mariage';
comment on column public.buyers.marriage_city is 'Commune du mariage';
comment on column public.buyers.marriage_postal_code is 'Code postal du lieu de mariage';
comment on column public.buyers.marriage_contract is 'Présence d''un contrat de mariage';
comment on column public.buyers.marriage_contract_notary is 'Notaire du contrat de mariage';
comment on column public.buyers.marriage_contract_date is 'Date du contrat de mariage';
comment on column public.buyers.matrimonial_regime is 'Régime matrimonial';
comment on column public.buyers.regime_modification is 'Modification du régime matrimonial';
comment on column public.buyers.modification_notary is 'Notaire de la modification';
comment on column public.buyers.regime_modification_date is 'Date de modification du régime';
comment on column public.buyers.new_regime is 'Nouveau régime matrimonial';
comment on column public.buyers.modification_approved is 'Homologation de la modification';
comment on column public.buyers.approval_date is 'Date d''homologation';
comment on column public.buyers.divorce_judgment_date is 'Date du jugement de divorce';
comment on column public.buyers.divorce_court is 'Tribunal du divorce';
comment on column public.buyers.pacs_date is 'Date du PACS';
comment on column public.buyers.pacs_court is 'Tribunal du PACS';
comment on column public.buyers.pacs_city_hall is 'Mairie du PACS';
comment on column public.buyers.pacs_notary is 'PACS chez un notaire';
comment on column public.buyers.pacs_notary_address is 'Adresse du notaire du PACS';
comment on column public.buyers.pacs_regime is 'Régime du PACS';
comment on column public.buyers.company_legal_form is 'Forme juridique de l''entreprise';
comment on column public.buyers.siret_number is 'Numéro SIRET';
comment on column public.buyers.company_address is 'Adresse de l''entreprise';
comment on column public.buyers.company_postal_code is 'Code postal de l''entreprise';
comment on column public.buyers.company_city is 'Ville de l''entreprise';