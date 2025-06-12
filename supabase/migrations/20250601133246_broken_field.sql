-- Suppression des politiques RLS
drop policy if exists "Lecture du profil" on public.agents;
drop policy if exists "Création du profil" on public.agents;
drop policy if exists "Modification du profil" on public.agents;

-- Suppression des triggers
drop trigger if exists handle_agents_updated_at on public.agents;
drop trigger if exists handle_properties_updated_at on public.properties;

-- Suppression de la fonction de mise à jour automatique
drop function if exists handle_updated_at();

-- Suppression des contraintes de clé étrangère
alter table if exists public.properties
  drop constraint if exists properties_agent_id_fkey;

-- Suppression des tables
drop table if exists public.properties;
drop table if exists public.agents;