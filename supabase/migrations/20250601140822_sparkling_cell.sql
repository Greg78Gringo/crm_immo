-- Create function to handle updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

comment on function handle_updated_at() is 'Fonction pour mettre à jour automatiquement le champ updated_at';