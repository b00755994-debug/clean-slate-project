
# Plan: Corriger la date de filtrage dans useLeaderboards

## Probleme identifie

Un seul fichier utilise incorrectement `created_at` au lieu de `linkedin_created_at` :

| Fichier | Ligne | Statut |
|---------|-------|--------|
| `src/hooks/useLeaderboards.ts` | 30 | A corriger |
| `src/hooks/useAnalyticsData.ts` | - | OK (utilise `getPostDate()`) |
| `src/hooks/useFullLeaderboard.ts` | - | OK (utilise `getPostDate()`) |
| `src/components/content/TeamFeed.tsx` | 68, 76 | OK |
| `src/components/content/PostCard.tsx` | 159 | OK |

## Modification

**Fichier**: `src/hooks/useLeaderboards.ts`

**Ligne 30** - Changer:
```typescript
// AVANT
const postDate = new Date(post.created_at);

// APRES  
const postDate = new Date(post.linkedin_created_at || post.created_at);
```

## Impact

Cette correction permettra au leaderboard du dashboard (Top Posts et Contributeurs actifs) de filtrer correctement les posts des 30 derniers jours en utilisant la vraie date de publication LinkedIn plutot que la date d'import dans la base de donnees.
