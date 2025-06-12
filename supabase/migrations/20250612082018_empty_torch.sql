-- Ajouter les nouveaux champs pour le titre de propriété à la table description_bien_principale
alter table public.description_bien_principale
  add column property_title text check (property_title in ('Acquisition', 'Héritage', 'Donation', 'Autres')),
  add column title_designation_identical boolean default false,
  add column current_designation text,
  add column title_details text;

-- Ajouter les commentaires
comment on column public.description_bien_principale.property_title is 'Titre de propriété (Acquisition, Héritage, Donation, Autres)';
comment on column public.description_bien_principale.title_designation_identical is 'Désignation du titre identique';
comment on column public.description_bien_principale.current_designation is 'Désignation actuelle';
comment on column public.description_bien_principale.title_details is 'Détails du titre de propriété';