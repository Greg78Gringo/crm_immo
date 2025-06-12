-- Ajouter le champ type_personne_id à la table buyers
alter table public.buyers
  add column type_personne_id integer references public.type_personne(id);

-- Créer un index pour améliorer les performances
create index idx_buyers_type_personne on public.buyers(type_personne_id);

-- Ajouter un commentaire
comment on column public.buyers.type_personne_id is 'Identifiant du type de personne (référence à type_personne)';