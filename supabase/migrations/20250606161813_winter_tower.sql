/*
  # Ajout des champs de situation familiale pour les vendeurs

  1. Modifications
    - Ajout de tous les champs de situation familiale à la table sellers
    - Ajout des champs pour les entreprises (Personne Morale)
    - Ajout des champs pour le mariage, divorce, PACS, veuvage

  2. Nouveaux champs
    - Champs enfants et commentaires
    - Champs entreprise (forme juridique, SIRET, adresse)
    - Champs mariage complets avec contrat et modifications
    - Champs divorce et séparation
    - Champs PACS avec notaire
    - Champs veuvage
*/

-- Ajout des champs de situation familiale à la table sellers
alter table public.sellers
  -- Champs enfants
  add column children_count integer default 0,
  add column children_comments text,
  
  -- Champs entreprise (Personne Morale)
  add column company_legal_form text,
  add column siret_number text,
  add column company_address text,
  add column company_postal_code text,
  add column company_city text,
  
  -- Champs mariage
  add column marriage_date date,
  add column marriage_city text,
  add column marriage_postal_code text,
  add column marriage_contract boolean default false,
  add column marriage_contract_notary text,
  add column marriage_contract_date date,
  add column matrimonial_regime text,
  add column regime_modification boolean default false,
  add column modification_notary text,
  add column regime_modification_date date,
  add column new_regime text,
  
  -- Champs divorce
  add column divorce_judgment_date date,
  add column divorce_court text,
  
  -- Champs PACS
  add column pacs_date date,
  add column pacs_court text,
  add column pacs_city_hall text,
  add column pacs_notary boolean default false,
  add column pacs_notary_address text,
  add column pacs_regime text,
  
  -- Champs veuvage
  add column spouse_death_date date,
  add column spouse_death_place text;

-- Ajouter les commentaires
comment on column public.sellers.children_count is 'Nombre d''enfants';
comment on column public.sellers.children_comments is 'Commentaires sur les enfants';
comment on column public.sellers.company_legal_form is 'Forme juridique de l''entreprise';
comment on column public.sellers.siret_number is 'Numéro SIRET';
comment on column public.sellers.company_address is 'Adresse de l''entreprise';
comment on column public.sellers.company_postal_code is 'Code postal de l''entreprise';
comment on column public.sellers.company_city is 'Ville de l''entreprise';
comment on column public.sellers.marriage_date is 'Date du mariage';
comment on column public.sellers.marriage_city is 'Commune du mariage';
comment on column public.sellers.marriage_postal_code is 'Code postal du lieu de mariage';
comment on column public.sellers.marriage_contract is 'Présence d''un contrat de mariage';
comment on column public.sellers.marriage_contract_notary is 'Ville du notaire du contrat de mariage';
comment on column public.sellers.marriage_contract_date is 'Date du contrat de mariage';
comment on column public.sellers.matrimonial_regime is 'Régime matrimonial adopté';
comment on column public.sellers.regime_modification is 'Modification du régime matrimonial';
comment on column public.sellers.modification_notary is 'Notaire de la modification';
comment on column public.sellers.regime_modification_date is 'Date d''homologation de la modification';
comment on column public.sellers.new_regime is 'Nouveau régime matrimonial';
comment on column public.sellers.divorce_judgment_date is 'Date du jugement de divorce';
comment on column public.sellers.divorce_court is 'Tribunal du divorce';
comment on column public.sellers.pacs_date is 'Date du PACS';
comment on column public.sellers.pacs_court is 'Tribunal du PACS';
comment on column public.sellers.pacs_city_hall is 'Mairie du PACS';
comment on column public.sellers.pacs_notary is 'PACS chez un notaire';
comment on column public.sellers.pacs_notary_address is 'Adresse du notaire du PACS';
comment on column public.sellers.pacs_regime is 'Régime du PACS';
comment on column public.sellers.spouse_death_date is 'Date de décès du conjoint';
comment on column public.sellers.spouse_death_place is 'Lieu de décès du conjoint';