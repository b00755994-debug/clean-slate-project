

# Plan: Augmenter la largeur du titre LinkedIn + Resserrer les colonnes de droite

## Objectif

1. Augmenter `max-w-[180px]` a `max-w-[300px]` pour la colonne Title
2. Resserrer les colonnes de droite (Posts, Impressions, Reactions, Engagement, Rank, Evolution)

## Modifications

**Fichier**: `src/pages/DashboardLeaderboard.tsx`

### 1. Colonne Title - Augmenter la largeur

```tsx
// Ligne 200 - Avant
<TableCell className="hidden md:table-cell text-muted-foreground text-sm truncate max-w-[180px] py-2">

// Apres
<TableCell className="hidden md:table-cell text-muted-foreground text-sm truncate max-w-[300px] py-2">
```

### 2. Colonnes de droite - Ajouter des largeurs fixes plus compactes

| Colonne | Avant | Apres |
|---------|-------|-------|
| Posts | `text-right` | `w-16 text-right` |
| Impressions | `text-right` | `w-20 text-right` |
| Reactions | `text-right` | `w-20 text-right` |
| Engagement | `text-right` | `w-20 text-right` |
| Rank | `w-14` | `w-12` |
| Evolution | `w-16` | `w-14` |

### 3. Padding des cellules

Reduire le padding horizontal des TableHead et TableCell de droite avec `px-2` au lieu du padding par defaut.

## Resume des changements

```text
+----------+---------------------------+-------+--------+--------+------+------+------+
| MEMBER   | TITLE (300px max)         | POSTS | IMPR.  | REACT. | ENG. | RANK | EVOL |
|          |                           | (w-16)| (w-20) | (w-20) |(w-20)|(w-12)|(w-14)|
+----------+---------------------------+-------+--------+--------+------+------+------+
```

