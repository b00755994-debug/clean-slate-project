

# Plan: Corriger le Conflit de Cache React Query

## Problème identifié

**Conflit de `queryKey`** entre deux hooks :

| Hook | queryKey | Format retourné |
|------|----------|-----------------|
| `useTeamFeed` | `['billable-users', workspace?.id]` | Objet `{}` (Map) |
| `useFullLeaderboard` | `['billable-users', workspace?.id]` | Tableau `[]` |

React Query utilise la `queryKey` pour identifier les données en cache. Quand les deux hooks utilisent la même clé mais retournent des formats différents, le hook qui s'exécute en second reçoit les données du cache (format incorrect).

**Exemple** : Si on navigue d'abord vers Team Feed puis vers Leaderboard :
1. `useTeamFeed` charge les données → cache `['billable-users', workspace.id]` = `{ id1: {...}, id2: {...} }`
2. `useFullLeaderboard` lit le cache → reçoit l'objet au lieu d'un tableau
3. `billableUsers.map()` échoue car un objet n'a pas de méthode `.map()`

## Solution

Renommer la `queryKey` dans `useFullLeaderboard` pour éviter le conflit :

```typescript
// Avant
queryKey: ['billable-users', workspace?.id]

// Après
queryKey: ['billable-users-list', workspace?.id]
```

## Modification

### Fichier: `src/hooks/useFullLeaderboard.ts`

Ligne 46, changer la queryKey :

```typescript
const { data: billableUsers, isLoading: loadingUsers } = useQuery({
  queryKey: ['billable-users-list', workspace?.id],  // Clé unique
  queryFn: async () => {
    if (!workspace?.id) return [];
    const { data, error } = await supabase
      .from('billable_users')
      .select('id, profile_name, linkedin_title, avatar_url, profile_picture')
      .eq('workspace_id', workspace.id);
    if (error) throw error;
    return data || [];
  },
  enabled: !!workspace?.id,
});
```

## Résultat attendu

- Chaque hook a son propre cache indépendant
- `useTeamFeed` garde son cache objet (Map)
- `useFullLeaderboard` a son cache tableau (Array)
- Le leaderboard affiche correctement les membres de l'équipe

