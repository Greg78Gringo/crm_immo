-- Create agents table to extend Supabase auth users
create table public.agents (
  id uuid references auth.users on delete cascade,
  first_name text,
  last_name text,
  phone text,
  role text check (role in ('admin', 'agent', 'manager')),
  agency_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable RLS
alter table public.agents enable row level security;

-- Create RLS policies
create policy "Agents can view their own profile"
  on public.agents for select
  using (auth.uid() = id);

create policy "Admins can view all agents"
  on public.agents for select
  using (
    exists (
      select 1 from public.agents where id = auth.uid() and role = 'admin'
    )
  );

-- Create properties table
create table public.properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price decimal(12,2) not null,
  address text not null,
  city text not null,
  postal_code text not null,
  property_type text check (property_type in ('house', 'apartment', 'land', 'commercial')),
  status text check (status in ('available', 'under_contract', 'sold')) default 'available',
  bedrooms integer,
  bathrooms integer,
  surface_area decimal(10,2),
  agent_id uuid references public.agents(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.properties enable row level security;

-- Create RLS policies
create policy "Agents can view their assigned properties"
  on public.properties for select
  using (agent_id = auth.uid());

create policy "Admins can view all properties"
  on public.properties for select
  using (
    exists (
      select 1 from public.agents where id = auth.uid() and role = 'admin'
    )
  );

-- Create function to handle updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_agents_updated_at
  before update on public.agents
  for each row
  execute function handle_updated_at();

create trigger handle_properties_updated_at
  before update on public.properties
  for each row
  execute function handle_updated_at();