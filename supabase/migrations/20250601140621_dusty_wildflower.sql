-- Create deals table
create table public.deals (
  id uuid default gen_random_uuid() primary key,
  deal_id serial unique,
  agent_id uuid references auth.users on delete restrict,
  name text not null,
  status text check (status in ('new', 'in_progress', 'pending', 'completed')) default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.deals enable row level security;

-- Create RLS policies
create policy "Agents can view their own deals"
  on public.deals for select
  using (agent_id = auth.uid());

create policy "Agents can insert their own deals"
  on public.deals for insert
  with check (agent_id = auth.uid());

create policy "Agents can update their own deals"
  on public.deals for update
  using (agent_id = auth.uid())
  with check (agent_id = auth.uid());

-- Create index for faster lookups
create index idx_deals_agent_id on public.deals(agent_id);
create index idx_deals_status on public.deals(status);

-- Add trigger for updated_at
create trigger handle_updated_at
  before update on public.deals
  for each row
  execute function handle_updated_at();

-- Add comments
comment on table public.deals is 'Table des affaires immobilières';
comment on column public.deals.deal_id is 'Identifiant séquentiel de l''affaire';
comment on column public.deals.agent_id is 'Identifiant de l''agent responsable';
comment on column public.deals.name is 'Nom de l''affaire';
comment on column public.deals.status is 'Statut de l''affaire (new, in_progress, pending, completed)';