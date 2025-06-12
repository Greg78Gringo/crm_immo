-- Create agents table with additional fields
alter table public.agents
add column rsac_number text,
add column sponsor_email text,
add column is_admin boolean default false;

-- Add validation for RSAC number format
alter table public.agents
add constraint valid_rsac_number check (rsac_number ~ '^[0-9]{6}$');

-- Add validation for phone number format
alter table public.agents
add constraint valid_phone_number check (phone ~ '^[0-9]{10}$');

-- Add validation for email format
alter table public.agents
add constraint valid_sponsor_email check (sponsor_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create index for faster lookups
create index idx_agents_rsac on public.agents(rsac_number);
create index idx_agents_role on public.agents(role);

-- Update RLS policies to include new admin check
drop policy if exists "Admins can view all agents" on public.agents;
create policy "Admins can view all agents"
  on public.agents for select
  using (
    auth.uid() in (
      select id from public.agents where is_admin = true
    )
  );