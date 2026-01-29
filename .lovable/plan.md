
# Plan: Style Majuscules Minimalistes pour les Colonnes du Leaderboard

## Objectif

Appliquer le style typographique "minimalist uppercase" aux en-tetes de colonnes du tableau, conformement au design system du dashboard.

## Style a appliquer

Le pattern utilise dans le projet (visible dans les tabs, labels de section) :

```
text-xs text-muted-foreground uppercase tracking-wide
```

## Modification

### Fichier: `src/pages/DashboardLeaderboard.tsx`

Ajouter les classes de style a chaque `TableHead` (lignes 124-130) :

| Avant | Apres |
|-------|-------|
| `<TableHead>` | `<TableHead className="text-xs uppercase tracking-wide">` |
| `<TableHead className="hidden md:table-cell">` | `<TableHead className="hidden md:table-cell text-xs uppercase tracking-wide">` |
| `<TableHead className="text-right">` | `<TableHead className="text-right text-xs uppercase tracking-wide">` |
| `<TableHead className="w-14 text-center">` | `<TableHead className="w-14 text-center text-xs uppercase tracking-wide">` |

### Code modifie

```jsx
<TableHeader>
  <TableRow className="hover:bg-transparent">
    <TableHead className="text-xs uppercase tracking-wide">{t.member}</TableHead>
    <TableHead className="hidden md:table-cell text-xs uppercase tracking-wide">{t.title_col}</TableHead>
    <TableHead className="text-right text-xs uppercase tracking-wide">{t.posts}</TableHead>
    <TableHead className="text-right text-xs uppercase tracking-wide">{t.impressions}</TableHead>
    <TableHead className="text-right text-xs uppercase tracking-wide">{t.reactions}</TableHead>
    <TableHead className="text-right text-xs uppercase tracking-wide">{t.engagement}</TableHead>
    <TableHead className="w-14 text-center text-xs uppercase tracking-wide">{t.rank}</TableHead>
  </TableRow>
</TableHeader>
```

## Fichier a modifier

| Fichier | Changement |
|---------|------------|
| `src/pages/DashboardLeaderboard.tsx` | Ajouter `text-xs uppercase tracking-wide` aux 7 TableHead |

## Resultat attendu

- En-tetes de colonnes en majuscules petites et espacees
- Coherence avec le reste du dashboard (tabs, labels)
- Aspect plus pro et structure
