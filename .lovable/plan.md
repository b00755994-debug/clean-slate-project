
# Plan: Correction des queries par workspace_id

## Problèmes identifiés

### useTeamFeed.ts
- **billable_users** : Pas de filtre → récupère TOUS les utilisateurs de toutes les workspaces
- **posts** : Pas de filtre → récupère TOUS les posts de toutes les workspaces  
- **Tri** : Utilise `created_at` au lieu de `linkedin_created_at`

### useAnalyticsData.ts
- **billable_users** : Filtre par `user_id` au lieu de `workspace_id`

## Corrections

### Fichier 1: src/hooks/useTeamFeed.ts

| Avant | Après |
|-------|-------|
| `queryKey: ['billable-users']` | `queryKey: ['billable-users', workspace?.id]` |
| Pas de filtre | `.eq('workspace_id', workspace.id)` |
| `queryKey: ['posts']` | `queryKey: ['posts', workspace?.id]` |
| Pas de filtre | `.eq('workspace_id', workspace.id)` |
| `.order('created_at', ...)` | `.order('linkedin_created_at', ...)` |

Ajouts :
- Import `useWorkspace`
- `enabled: !!workspace?.id`
- `placeholderData: (prev) => prev` pour éviter les flashes UI

### Fichier 2: src/hooks/useAnalyticsData.ts

| Avant | Après |
|-------|-------|
| `queryKey: ['user-profile-ids', user?.id]` | `queryKey: ['user-profile-ids', workspace?.id]` |
| `.eq('user_id', user?.id)` | `.eq('workspace_id', workspace.id)` |
| `enabled: !!user` | `enabled: !!workspace?.id` |

Ajouts :
- Import `useWorkspace`
- `placeholderData: (prev) => prev`

## Impact

- Les données seront correctement scopées au workspace actif
- Meilleure performance (moins de données récupérées)
- Cache React Query correctement invalidé par workspace
