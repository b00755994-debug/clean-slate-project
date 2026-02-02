
# Plan : Utiliser uniquement `linkedin_created_at` pour les posts

## Contexte

Actuellement, le code utilise un pattern fallback `linkedin_created_at || created_at` partout où une date de post est nécessaire. `created_at` correspond à la date de scrapping (insertion en base), pas à la vraie date de publication LinkedIn.

## Fichiers à modifier

### 1. `src/hooks/useTeamFeed.ts`

**Supprimer `created_at` de l'interface Post** - Ne garder que `linkedin_created_at`

```typescript
// Ligne 17 : Supprimer
created_at: string;

// Garder uniquement
linkedin_created_at: string | null;
```

### 2. `src/components/content/TeamFeed.tsx`

**Lignes 68, 76** - Remplacer les fallbacks par `linkedin_created_at` uniquement

```typescript
// Ligne 68 : Filtrage par période
.filter(post => {
  if (!post.linkedin_created_at) return false; // Exclure les posts sans date LinkedIn
  return filterByTimePeriod(new Date(post.linkedin_created_at));
})

// Ligne 76 : Tri par date
.sort((a, b) => {
  // ...
  return new Date(b.linkedin_created_at || 0).getTime() - new Date(a.linkedin_created_at || 0).getTime();
})
```

**Lignes 154-156** - Stats hook - Même correction

```typescript
const postDate = p.linkedin_created_at ? new Date(p.linkedin_created_at) : null;
if (!postDate) return false;
return postDate >= thirtyDaysAgo;
```

### 3. `src/hooks/useLeaderboards.ts`

**Ligne 30** - Utiliser uniquement `linkedin_created_at`

```typescript
const last30DaysPosts = posts.filter(post => {
  if (!post.linkedin_created_at) return false;
  const postDate = new Date(post.linkedin_created_at);
  return differenceInDays(now, postDate) <= 30;
});
```

### 4. `src/hooks/useFullLeaderboard.ts`

**Lignes 27-29** - Modifier la fonction `getPostDate`

```typescript
function getPostDate(post: { linkedin_created_at?: string | null }): Date | null {
  return post.linkedin_created_at ? new Date(post.linkedin_created_at) : null;
}
```

**Ligne 33** - Retirer `created_at` du type dans `calculateRankings`

**Ligne 114** - Supprimer `created_at` de la requête Supabase

### 5. `src/hooks/useAnalyticsData.ts`

**Lignes 57-60** - Modifier la fonction `getPostDate`

```typescript
function getPostDate(post: { linkedin_created_at?: string | null }): Date | null {
  return post.linkedin_created_at ? new Date(post.linkedin_created_at) : null;
}
```

**Ligne 97** - Retirer `created_at` de la requête Supabase

### 6. `src/components/content/PostCard.tsx`

**Lignes 30-31** - Garder l'interface mais modifier l'affichage

```typescript
// Interface (garder pour compatibilité)
created_at: string;
linkedin_created_at?: string | null;

// Ligne 159 : Affichage - utiliser uniquement linkedin_created_at
<span>
  {post.linkedin_created_at 
    ? formatDistanceToNow(new Date(post.linkedin_created_at), { addSuffix: false, locale: fr })
    : '—'
  }
</span>
```

## Résumé des changements

| Fichier | Changement |
|---------|------------|
| `useTeamFeed.ts` | Retirer `created_at` de l'interface |
| `TeamFeed.tsx` | 3 corrections : filtrage, tri, stats |
| `useLeaderboards.ts` | 1 correction : filtrage 30 jours |
| `useFullLeaderboard.ts` | 3 corrections : fonction, type, requête |
| `useAnalyticsData.ts` | 2 corrections : fonction, requête |
| `PostCard.tsx` | 1 correction : affichage date |

## Comportement après modification

- Les posts sans `linkedin_created_at` seront :
  - Exclus des filtres par période (sauf "Toutes les dates")
  - Affichés avec un tiret "—" au lieu d'une date
  - Triés en dernier si tri par date récente
- Les statistiques et leaderboards seront basés uniquement sur la vraie date de publication LinkedIn
