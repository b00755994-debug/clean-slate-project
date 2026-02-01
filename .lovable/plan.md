
# Plan : Suppression en cascade des données billable_users

## Situation actuelle

Quand tu supprimes un profil LinkedIn (`billable_users`), voici ce qui se passe :

| Table | Comportement actuel | Problème |
|-------|---------------------|----------|
| `posts` | SET NULL → garde les posts orphelins | Posts sans auteur affichés dans le feed |
| `kpis` | RESTRICT → bloque la suppression | Erreur si des KPIs existent |
| `posts_activity` | CASCADE → OK | Fonctionne déjà |

**Résultat** : 6 posts orphelins actuellement dans la base, et les stats/feed montrent des données de profils supprimés.

## Solution

Modifier les contraintes de clé étrangère pour utiliser `ON DELETE CASCADE` :

### Migration SQL

```sql
-- 1. Table posts : passer de SET NULL à CASCADE
ALTER TABLE public.posts 
DROP CONSTRAINT IF EXISTS posts_linkedin_profiles_fkey;

ALTER TABLE public.posts 
ADD CONSTRAINT posts_linkedin_profiles_fkey 
FOREIGN KEY (linkedin_profiles) 
REFERENCES public.billable_users(id) 
ON DELETE CASCADE;

-- 2. Table kpis : passer de RESTRICT à CASCADE
ALTER TABLE public.kpis 
DROP CONSTRAINT IF EXISTS kpis_billable_user_id_fkey;

ALTER TABLE public.kpis 
ADD CONSTRAINT kpis_billable_user_id_fkey 
FOREIGN KEY (billable_user_id) 
REFERENCES public.billable_users(id) 
ON DELETE CASCADE;

-- 3. Table post_history : ajouter CASCADE via posts
-- (déjà OK car post_history → posts est RESTRICT, 
--  et posts → billable_users sera CASCADE)
```

### Nettoyage des données orphelines

```sql
-- Supprimer les posts orphelins existants
DELETE FROM posts WHERE linkedin_profiles IS NULL;

-- Supprimer les KPIs orphelins (si applicable)
DELETE FROM kpis WHERE billable_user_id IS NULL;
```

## Impact

| Action | Avant | Après |
|--------|-------|-------|
| Supprimer un profil | Bloqué ou posts orphelins | Suppression complète |
| Posts du profil | Gardés sans auteur | Supprimés |
| KPIs du profil | Bloquent la suppression | Supprimés |
| Stats/Feed | Données corrompues | Données cohérentes |

## Schema de suppression en cascade

```text
billable_users (supprimé)
    │
    ├── posts (CASCADE → supprimés)
    │       └── post_history (CASCADE → supprimé)
    │       └── posts_activity (CASCADE → supprimé)
    │       └── bookmarks (CASCADE → supprimés)
    │
    ├── kpis (CASCADE → supprimés)
    │
    └── posts_activity (CASCADE → déjà OK)
```

## Aucune modification de code requise

Les hooks `useTeamFeed`, `useLeaderboards` et `useLinkedInProfiles` n'ont pas besoin d'être modifiés - ils fonctionneront correctement une fois les contraintes corrigées.
