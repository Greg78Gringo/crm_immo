/*
  # Mise à jour de la table deals_price
  
  1. Modifications
    - Renommage de agency_commission en my_agency_commission
    - Ajout d'une colonne agency_commissions pour stocker les commissions des agences
  
  2. Changements
    - La commission de l'agent devient my_agency_commission
    - Les commissions des agences sont stockées dans un tableau
*/

-- Renommer la colonne agency_commission
alter table public.deals_price
  rename column agency_commission to my_agency_commission;

-- Ajouter la nouvelle colonne pour les commissions des agences
alter table public.deals_price
  add column agency_commissions decimal(5,2)[] default array[]::decimal(5,2)[];

-- Mettre à jour les commentaires
comment on column public.deals_price.my_agency_commission is 'Commission de mon agence en pourcentage';
comment on column public.deals_price.agency_commissions is 'Commissions des agences en pourcentage (tableau)';