/*
  # Création de la table other_required_doc

  1. Nouvelle Table
    - `other_required_doc`
      - `id` (uuid, clé primaire)
      - `deal_id` (uuid, référence vers deals)
      - `document_name` (text) - Nom du document
      - `status` (text) - buyer ou seller
      - `received` (boolean) - Document reçu
      - `reception_date` (date) - Date de réception
      - `date_doc` (date) - Date du document
      - `comments` (text) - Commentaires

  2. Sécurité
    - Enable RLS
    - Politiques pour les agents
*/

-- Création de la table other_required_doc
create table public.other_required_doc (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade,
  document_name text not null,
  status text not null check (status in ('buyer', 'seller')),
  received boolean default false,
  reception_date date,
  date_doc date,
  comments text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer RLS
alter table public.other_required_doc enable row level security;

-- Créer les politiques RLS
create policy "Agents can view their other required documents"
  on public.other_required_doc
  for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = other_required_doc.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can insert other required documents"
  on public.other_required_doc
  for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = other_required_doc.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can update other required documents"
  on public.other_required_doc
  for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = other_required_doc.deal_id
      and deals.agent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.deals
      where deals.id = other_required_doc.deal_id
      and deals.agent_id = auth.uid()
    )
  );

create policy "Agents can delete other required documents"
  on public.other_required_doc
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = other_required_doc.deal_id
      and deals.agent_id = auth.uid()
    )
  );

-- Créer les index
create index idx_other_required_doc_deal_id on public.other_required_doc(deal_id);
create index idx_other_required_doc_status on public.other_required_doc(status);
create index idx_other_required_doc_received on public.other_required_doc(received);

-- Ajouter le trigger pour updated_at
create trigger handle_other_required_doc_updated_at
  before update on public.other_required_doc
  for each row
  execute function handle_updated_at();

-- Ajouter les commentaires
comment on table public.other_required_doc is 'Table des autres documents requis (ajout manuel)';
comment on column public.other_required_doc.deal_id is 'Identifiant de l''affaire associée';
comment on column public.other_required_doc.document_name is 'Nom du document requis';
comment on column public.other_required_doc.status is 'Statut (buyer ou seller)';
comment on column public.other_required_doc.received is 'Document reçu (true/false)';
comment on column public.other_required_doc.reception_date is 'Date de réception du document';
comment on column public.other_required_doc.date_doc is 'Date du document';
comment on column public.other_required_doc.comments is 'Commentaires sur le document';