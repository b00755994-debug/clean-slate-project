
# Plan: Ajuster le Leaderboard

## Problemes identifies

1. **Photos manquantes** : Le hook utilise `avatar_url` qui est toujours `null`. Les vraies photos sont dans `profile_picture`
2. **Tableau trop grand** : Les lignes et polices sont trop grandes pour afficher un top 10 confortablement
3. **Rank mal place** : La colonne Rank est a gauche, doit etre a droite apres les metrics
4. **Select non blanc** : Le fond du dropdown "All time" utilise `bg-background` au lieu de blanc

## Modifications

### 1. Recuperer les bonnes photos
**Fichier: `src/hooks/useFullLeaderboard.ts`**
- Ajouter `profile_picture` dans la requete Supabase
- Utiliser `profile_picture` en priorite, avec fallback sur `avatar_url`

```typescript
// Query mise a jour
.select('id, profile_name, linkedin_title, avatar_url, profile_picture')

// Dans le mapping
avatarUrl: user.profile_picture || user.avatar_url,
```

### 2. Reduire la hauteur de liste et police
**Fichier: `src/pages/DashboardLeaderboard.tsx`**
- Avatar: `w-10 h-10` devient `w-7 h-7`
- RankBadge: `w-8 h-8` devient `w-6 h-6` avec `text-xs`
- TableCell padding: reduire via classes personnalisees `py-2` au lieu de `p-4`
- Font: ajouter `text-sm` aux cellules de donnees

### 3. Deplacer Rank a droite
**Fichier: `src/pages/DashboardLeaderboard.tsx`**
- Reorganiser l'ordre des colonnes dans TableHeader et TableBody:
  - Photo + Nom (combine)
  - Titre LinkedIn
  - Posts
  - Impressions
  - Reactions
  - Engagement
  - **Rank** (derniere colonne)

### 4. Fond blanc pour le Select
**Fichier: `src/pages/DashboardLeaderboard.tsx`**
- Ajouter `bg-white` au SelectTrigger

## Fichiers a modifier

| Fichier | Changement |
|---------|------------|
| `src/hooks/useFullLeaderboard.ts` | Ajouter `profile_picture` dans la query |
| `src/pages/DashboardLeaderboard.tsx` | Reorganiser colonnes, reduire tailles, bg-white sur Select |
