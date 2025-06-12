-- Supprimer l'ancienne contrainte
alter table public.deals drop constraint if exists check_agency_fields;

-- Ajouter la nouvelle contrainte plus souple
alter table public.deals
  add constraint check_agency_fields check (
    (method = 'agence') or
    (method = 'pap' and agency_name is null and mandate_type is null) or
    (method is null)
  );

comment on constraint check_agency_fields on public.deals is 'Vérifie que les champs d''agence sont vides pour la méthode PAP';