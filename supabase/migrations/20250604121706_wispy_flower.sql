-- Modifier la colonne marital_status pour être une clé étrangère
alter table public.buyers
  -- Supprimer l'ancienne colonne
  drop column if exists marital_status,
  -- Ajouter la nouvelle colonne avec la référence
  add column marital_status_id integer references public.statut_marital(id);

-- Ajouter un index pour améliorer les performances
create index idx_buyers_marital_status on public.buyers(marital_status_id);

-- Mettre à jour le commentaire
comment on column public.buyers.marital_status_id is 'Identifiant du statut marital (référence à statut_marital)';