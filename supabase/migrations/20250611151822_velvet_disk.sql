/*
  # Ajout de nouveaux champs à la table description_bien_principale

  1. Nouveaux champs
    - DPE (text) - Diagnostic de Performance Énergétique
    - GES (text) - Gaz à Effet de Serre
    - Détecteur de fumée (boolean)
    - Présence de cuve à fioul enterrée (boolean)
    - Présence de cuve à fioul non enterrée (boolean)
    - Lotissement (boolean)
    - ASL existante (boolean)
    - ASL dissoute (boolean)
    - Servitudes (boolean)
    - Panneaux photovoltaïques (boolean)
    - Fibre optique (boolean)

  2. Contraintes
    - DPE et GES limités aux valeurs A, B, C, D, E, F, G
*/

-- Ajouter les nouveaux champs à la table description_bien_principale
alter table public.description_bien_principale
  add column dpe text check (dpe in ('A', 'B', 'C', 'D', 'E', 'F', 'G')),
  add column ges text check (ges in ('A', 'B', 'C', 'D', 'E', 'F', 'G')),
  add column has_smoke_detector boolean default false,
  add column has_buried_fuel_tank boolean default false,
  add column has_non_buried_fuel_tank boolean default false,
  add column is_subdivision boolean default false,
  add column has_existing_asl boolean default false,
  add column has_dissolved_asl boolean default false,
  add column has_easements boolean default false,
  add column has_solar_panels boolean default false,
  add column has_fiber_optic boolean default false;

-- Ajouter les commentaires
comment on column public.description_bien_principale.dpe is 'Diagnostic de Performance Énergétique (A à G)';
comment on column public.description_bien_principale.ges is 'Gaz à Effet de Serre (A à G)';
comment on column public.description_bien_principale.has_smoke_detector is 'Présence d''un détecteur de fumée';
comment on column public.description_bien_principale.has_buried_fuel_tank is 'Présence de cuve à fioul enterrée';
comment on column public.description_bien_principale.has_non_buried_fuel_tank is 'Présence de cuve à fioul non enterrée';
comment on column public.description_bien_principale.is_subdivision is 'Lotissement';
comment on column public.description_bien_principale.has_existing_asl is 'ASL existante';
comment on column public.description_bien_principale.has_dissolved_asl is 'ASL dissoute';
comment on column public.description_bien_principale.has_easements is 'Servitudes';
comment on column public.description_bien_principale.has_solar_panels is 'Panneaux photovoltaïques';
comment on column public.description_bien_principale.has_fiber_optic is 'Fibre optique';