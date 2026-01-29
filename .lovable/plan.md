

# Plan: Inverser les positions des leaderboards

## Objectif

Placer **Active Contributors** à gauche et **Top Posts** à droite dans la grille.

## Modification

**Fichier**: `src/components/content/FeedLeaderboards.tsx`

### Changement (lignes 33-36)

```tsx
// Avant
<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <TopPostsLeaderboard posts={topPosts} loading={loading} />
  <ActiveContributorsLeaderboard contributors={activeContributors} loading={loading} />
</div>

// Après
<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <ActiveContributorsLeaderboard contributors={activeContributors} loading={loading} />
  <TopPostsLeaderboard posts={topPosts} loading={loading} />
</div>
```

Simplement inverser l'ordre des deux composants dans la grille.

