-- Add RLS policy for deals insertion
create policy "Agents can create their own deals"
  on public.deals
  for insert
  with check (auth.uid() = agent_id);

-- Add RLS policy for deals update
create policy "Agents can update their own deals"
  on public.deals
  for update
  using (auth.uid() = agent_id)
  with check (auth.uid() = agent_id);

-- Add RLS policy for deals select
create policy "Agents can view their own deals"
  on public.deals
  for select
  using (auth.uid() = agent_id);