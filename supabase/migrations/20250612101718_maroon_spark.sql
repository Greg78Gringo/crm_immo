/*
  # Création de la table sinistre_en_cours

  1. Nouvelle Table
    - `sinistre_en_cours`
      - `id` (uuid, clé primaire)
      - `deal_id` (uuid, référence vers deals)
      - `designation_sinistre` (text)
      - `description_sinistre` (text)
      - `date_declaration` (date)
      - `montant_des_travaux` (decimal)

  2. Sécurité
    - Enable RLS
    - Politiques pour les agents
*/

-- Création de la table sinistre_en_cours
create table public.sinistre_en_cours (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  designation_sinistre text,
  description_sinistre text,
  date_declaration date,
  montant_des_travaux decimal(12,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer RLS
alter table public.sinistre_en_cours enable row level security;

-- Créer les politiques RLS
create policy "Agents can view their sinistres"
  on public.sinistre_en_cours
  for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = sinistre_en_cours.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can insert sinistres"
  on public.sinistre_en_cours
  for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = sinistre_en_cours.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update sinistres"
  on public.sinistre_en_cours
  for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = sinistre_en_cours.deal_id
      and deals.agent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.deals
      where deals.id = sinistre_en_cours.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can delete sinistres"
  on public.sinistre_en_cours
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = sinistre_en_cours.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Créer les index
create index idx_sinistre_en_cours_deal_id on public.sinistre_en_cours(deal_id);

-- Ajouter le trigger pour updated_at
create trigger handle_sinistre_en_cours_updated_at
  before update on public.sinistre_en_cours
  for each row
  execute function handle_updated_at();

-- Ajouter les commentaires
comment on table public.sinistre_en_cours is 'Table des sinistres en cours';
comment on column public.sinistre_en_cours.deal_id is 'Identifiant de l''affaire associée';
comment on column public.sinistre_en_cours.designation_sinistre is 'Désignation du sinistre';
comment on column public.sinistre_en_cours.description_sinistre is 'Description du sinistre';
comment on column public.sinistre_en_cours.date_declaration is 'Date de déclaration du sinistre';
comment on column public.sinistre_en_cours.montant_des_travaux is 'Montant des travaux en euros';