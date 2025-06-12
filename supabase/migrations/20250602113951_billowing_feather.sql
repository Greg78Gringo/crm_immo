-- Ajouter une politique de suppression pour les vendeurs
create policy "Agents can delete their deals' sellers"
  on public.sellers
  for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = sellers.deal_id
      and deals.agent_id = auth.uid()
    )
  );

comment on policy "Agents can delete their deals' sellers" on public.sellers
  is 'Permet aux agents de supprimer les vendeurs de leurs propres affaires';