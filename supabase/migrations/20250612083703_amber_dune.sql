/*
  # Création de la table liste_mobilier_restant

  1. Nouvelle Table
    - `liste_mobilier_restant`
      - `id` (uuid, clé primaire)
      - `deal_id` (uuid, référence vers deals)
      - `nom_mobilier` (text)
      - `prix_mobilier` (decimal)

  2. Sécurité
    - Enable RLS
    - Politiques pour les agents
*/

-- Création de la table liste_mobilier_restant
create table public.liste_mobilier_restant (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  nom_mobilier text,
  prix_mobilier decimal(12,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer RLS
alter table public.liste_mobilier_restant enable row level security;

-- Créer les politiques RLS
create policy "Agents can view their furniture list"
  on public.liste_mobilier_restant
  for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = liste_mobilier_restant.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can insert furniture list"
  on public.liste_mobilier_restant
  for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = liste_mobilier_restant.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update furniture list"
  on public.liste_mobilier_restant
  for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = liste_mobilier_restant.deal_id
      and deals.agent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.deals
      where deals.id = liste_mobilier_restant.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can delete furniture list"
  on public.liste_mobilier_restant
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = liste_mobilier_restant.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Créer les index
create index idx_liste_mobilier_restant_deal_id on public.liste_mobilier_restant(deal_id);

-- Ajouter le trigger pour updated_at
create trigger handle_liste_mobilier_restant_updated_at
  before update on public.liste_mobilier_restant
  for each row
  execute function handle_updated_at();

-- Ajouter les commentaires
comment on table public.liste_mobilier_restant is 'Table de la liste du mobilier restant';
comment on column public.liste_mobilier_restant.deal_id is 'Identifiant de l''affaire associée';
comment on column public.liste_mobilier_restant.nom_mobilier is 'Nom du mobilier';
comment on column public.liste_mobilier_restant.prix_mobilier is 'Valeur estimée du mobilier';