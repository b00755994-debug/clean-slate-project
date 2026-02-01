
# Plan : Permettre la suppression des profils LinkedIn avec des posts associés

## Problème identifié

La suppression échoue avec l'erreur **409 Conflict** car :
- La table `posts` a une contrainte de clé étrangère `posts_linkedin_profiles_fkey` 
- Cette contrainte est configurée en mode **RESTRICT** (bloquer la suppression)
- Le profil "Raphaël Charpenet" a 1 post associé → impossible de le supprimer

## Solution recommandée

Modifier la contrainte de clé étrangère pour utiliser `ON DELETE SET NULL` au lieu de `RESTRICT`.

**Avantages** :
- Les posts restent dans la base de données (historique conservé)
- Le champ `linkedin_profiles` devient `NULL` pour les posts orphelins
- Permet la suppression du profil sans perdre les données des posts

## Migration SQL

```sql
-- Supprimer l'ancienne contrainte
ALTER TABLE public.posts 
DROP CONSTRAINT IF EXISTS posts_linkedin_profiles_fkey;

-- Recréer avec ON DELETE SET NULL
ALTER TABLE public.posts 
ADD CONSTRAINT posts_linkedin_profiles_fkey 
FOREIGN KEY (linkedin_profiles) 
REFERENCES public.billable_users(id) 
ON DELETE SET NULL;
```

## Impact

| Avant | Après |
|-------|-------|
| Suppression bloquée si posts existent | Suppression autorisée |
| Posts orphelins impossibles | Posts gardés avec `linkedin_profiles = NULL` |

## Alternative (non recommandée)

Utiliser `ON DELETE CASCADE` supprimerait automatiquement tous les posts associés, ce qui n'est probablement pas souhaitable pour conserver l'historique.
