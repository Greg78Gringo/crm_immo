/*
  # Création de la table liste_travaux

  1. Nouvelle Table
    - `liste_travaux`
      - `id` (uuid, clé primaire)
      - `deal_id` (uuid, référence vers deals)
      - `description_travaux` (text)
      - `date_travaux` (date)
      - `sinistre_catastrophe_naturelle` (boolean)
      - `declaration_prealable` (boolean)
      - `permis_construire` (boolean)
      - `nom_entreprise` (text)
      - `adresse_entreprise` (text)
      - `code_postal_entreprise` (text)
      - `ville_entreprise` (text)
      - `nom_assureur` (text)
      - `adresse_assureur` (text)
      - `code_postal_assureur` (text)
      - `ville_assureur` (text)

  2. Sécurité
    - Enable RLS
    - Politiques pour les agents
*/

-- Création de la table liste_travaux
create table public.liste_travaux (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  description_travaux text,
  date_travaux date,
  sinistre_catastrophe_naturelle boolean default false,
  declaration_prealable boolean default false,
  permis_construire boolean default false,
  nom_entreprise text,
  adresse_entreprise text,
  code_postal_entreprise text,
  ville_entreprise text,
  nom_assureur text,
  adresse_assureur text,
  code_postal_assureur text,
  ville_assureur text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer RLS
alter table public.liste_travaux enable row level security;

-- Créer les politiques RLS
create policy "Agents can view their travaux"
  on public.liste_travaux
  for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = liste_travaux.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can insert travaux"
  on public.liste_travaux
  for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = liste_travaux.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update travaux"
  on public.liste_travaux
  for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = liste_travaux.deal_id
      and deals.agent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.deals
      where deals.id = liste_travaux.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can delete travaux"
  on public.liste_travaux
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = liste_travaux.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Créer les index
create index idx_liste_travaux_deal_id on public.liste_travaux(deal_id);

-- Ajouter le trigger pour updated_at
create trigger handle_liste_travaux_updated_at
  before update on public.liste_travaux
  for each row
  execute function handle_updated_at();

-- Ajouter les commentaires
comment on table public.liste_travaux is 'Table de la liste des travaux réalisés';
comment on column public.liste_travaux.deal_id is 'Identifiant de l''affaire associée';
comment on column public.liste_travaux.description_travaux is 'Description des travaux';
comment on column public.liste_travaux.date_travaux is 'Date des travaux';
comment on column public.liste_travaux.sinistre_catastrophe_naturelle is 'Sinistre catastrophe naturelle';
comment on column public.liste_travaux.declaration_prealable is 'Déclaration préalable';
comment on column public.liste_travaux.permis_construire is 'Permis de construire';
comment on column public.liste_travaux.nom_entreprise is 'Nom de l''entreprise';
comment on column public.liste_travaux.adresse_entreprise is 'Adresse de l''entreprise';
comment on column public.liste_travaux.code_postal_entreprise is 'Code postal de l''entreprise';
comment on column public.liste_travaux.ville_entreprise is 'Ville de l''entreprise';
comment on column public.liste_travaux.nom_assureur is 'Nom de l''assureur';
comment on column public.liste_travaux.adresse_assureur is 'Adresse de l''assureur';
comment on column public.liste_travaux.code_postal_assureur is 'Code postal de l''assureur';
comment on column public.liste_travaux.ville_assureur is 'Ville de l''assureur';