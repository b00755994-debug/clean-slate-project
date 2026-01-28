
# Plan : Afficher les analytics basées sur l'utilisateur (pas le workspace)

## Problème identifié

Le hook `useAnalyticsData.ts` filtre **toutes** les requêtes par `workspace_id` :
- Ligne 79: `.eq('workspace_id', workspace.id)`
- Ligne 153: `.eq('workspace_id', workspace.id)`
- Ligne 206: `.eq('workspace_id', workspace.id)`
- etc.

Comme les posts ont `workspace_id = null`, les requêtes retournent **0 résultats**.

Pendant ce temps, `useTeamFeed` et `useLeaderboards` fonctionnent car ils s'appuient sur les RLS policies qui filtrent par `billable_users.user_id`.

---

## Solution

Modifier `useAnalyticsData` pour utiliser la même logique que les autres hooks :
1. Récupérer les `billable_users` de l'utilisateur connecté
2. Filtrer les posts par `linkedin_profiles IN (user's billable_user IDs)`
3. Supprimer la dépendance au `workspace_id`

---

## Changements à effectuer

### Fichier : `src/hooks/useAnalyticsData.ts`

**1. Remplacer l'import `useWorkspace` par `useAuth`**

```typescript
// Avant
import { useWorkspace } from './useWorkspace';

// Après
import { useAuth } from './useAuth';
```

**2. Ajouter une requête pour récupérer les billable_users IDs**

```typescript
export function useAnalyticsData() {
  const { user } = useAuth();

  // Récupérer les IDs des profils LinkedIn de l'utilisateur
  const { data: userProfileIds = [] } = useQuery({
    queryKey: ['user-profile-ids', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('billable_users')
        .select('id')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data?.map(p => p.id) || [];
    },
    enabled: !!user,
  });
```

**3. Modifier toutes les requêtes pour filtrer par `linkedin_profiles`**

Exemple pour `overviewKPIs` :

```typescript
// Avant
.eq('workspace_id', workspace.id)

// Après
.in('linkedin_profiles', userProfileIds)
```

**4. Changer les conditions `enabled`**

```typescript
// Avant
enabled: !!workspace?.id

// Après
enabled: !!user && userProfileIds.length > 0
```

---

## Requêtes à modifier (10 au total)

| Query | Ligne | Modification |
|-------|-------|--------------|
| overviewKPIs | 76, 85 | `.in('linkedin_profiles', userProfileIds)` |
| trendData | 150 | `.in('linkedin_profiles', userProfileIds)` |
| teamActivationKPIs | 203, 212, 221 | `.in('linkedin_profiles', userProfileIds)` |
| activationTrendData | 305 | `.in('linkedin_profiles', userProfileIds)` |
| postingHeatmapData | 358 | `.in('linkedin_profiles', userProfileIds)` |
| reachKPIs | 434, 443 | `.in('linkedin_profiles', userProfileIds)` |
| reachTrendData | 540 | `.in('linkedin_profiles', userProfileIds)` |
| impressionsDistribution | 597 | `.in('linkedin_profiles', userProfileIds)` |

---

## Pour billable_users (Team Activation)

La requête de comptage des billable_users doit aussi être modifiée :

```typescript
// Avant
.eq('workspace_id', workspace.id)

// Après
.eq('user_id', user?.id)
```

---

## Résultat attendu

| Élément | Avant | Après |
|---------|-------|-------|
| Dépendance | `workspace_id` obligatoire | `user_id` (authentification) |
| Posts sans workspace_id | Non affichés | Affichés |
| Connexion Slack | Requise | Optionnelle |
| Analytics Overview | Vide | Affiche les 5 posts |
| Team Activation | Vide | Affiche 1 contributeur |

---

## Fichiers modifiés

| Fichier | Modification |
|---------|--------------|
| `src/hooks/useAnalyticsData.ts` | Refactoring complet pour filtrer par `user_id` via `billable_users` |

---

## Avantages de cette approche

1. **Cohérence** : Même logique que `useTeamFeed` et `useLeaderboards`
2. **Simplicité** : Pas besoin de corriger les données existantes en base
3. **Robustesse** : Fonctionne indépendamment de la connexion Slack/workspace
4. **Sécurité** : Respecte les RLS policies existantes sur `posts`
