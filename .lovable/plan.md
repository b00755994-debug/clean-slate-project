

# Plan: Select Simple par Mois + Indicateur de Progression du Classement

## Objectif

1. Remplacer le select actuel par un select de mois individuels (12 derniers mois)
2. Filtre par defaut : mois courant
3. Ajouter une colonne "Progression" a droite du Rank (+1, -2, =, new)

## Architecture simplifiee

### 1. Format du select

```text
+------------------------+
|  Janvier 2025       v  |  <- Select simple avec les 12 derniers mois
+------------------------+
| Janvier 2025          |
| Decembre 2024         |
| Novembre 2024         |
| ...                   |
+------------------------+
```

### 2. Logique de calcul de la progression

Pour calculer la progression:
1. Calculer le classement du mois selectionne
2. Calculer le classement du mois precedent (M-1)
3. Comparer les rangs: `rankChange = previousRank - currentRank`

## Modifications detaillees

### Fichier 1: `src/hooks/useFullLeaderboard.ts`

Modifications:

| Avant | Apres |
|-------|-------|
| `period: PeriodFilter` (all/month/3months/6months) | `selectedMonth: string` ("2025-01") |
| `setPeriod` | `setSelectedMonth` |
| Pas de calcul de progression | Calcul du ranking M-1 pour progression |

Nouvelle structure:

```typescript
// Types
export interface LeaderboardEntry {
  // ... champs existants
  rankChange: number | null;  // +1, -2, 0, null (nouveau membre)
}

// Generer les 12 derniers mois
const availableMonths = useMemo(() => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = subMonths(new Date(), i);
    months.push({
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy', { locale: language === 'fr' ? fr : undefined })
    });
  }
  return months;
}, [language]);

// Etat par defaut = mois courant
const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));

// Calculer le mois precedent
const previousMonth = useMemo(() => {
  const [year, month] = selectedMonth.split('-').map(Number);
  const prevDate = subMonths(new Date(year, month - 1), 1);
  return format(prevDate, 'yyyy-MM');
}, [selectedMonth]);
```

### Fichier 2: `src/pages/DashboardLeaderboard.tsx`

Modifications:

1. **Adapter le Select pour les mois**:
```tsx
<Select value={selectedMonth} onValueChange={setSelectedMonth}>
  <SelectTrigger className="w-[180px] bg-white">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {availableMonths.map(month => (
      <SelectItem key={month.value} value={month.value}>
        {month.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

2. **Ajouter colonne Evolution**:
```tsx
<TableHead className="w-16 text-center text-xs uppercase tracking-wide">
  {t.evolution}
</TableHead>
```

3. **Composant RankProgression**:
```tsx
function RankProgression({ change }: { change: number | null }) {
  if (change === null) return <span className="text-muted-foreground text-xs">new</span>;
  if (change === 0) return <span className="text-muted-foreground">=</span>;
  if (change > 0) return <span className="text-green-600 font-medium">+{change}</span>;
  return <span className="text-red-500 font-medium">{change}</span>;
}
```

## Traductions a ajouter

```typescript
const translations = {
  en: {
    // ... existants
    evolution: 'Change',
    new: 'new',
  },
  fr: {
    // ... existants  
    evolution: 'Evol.',
    new: 'nouveau',
  },
};
```

## Fichiers a modifier

| Fichier | Description |
|---------|-------------|
| `src/hooks/useFullLeaderboard.ts` | Logique mois unique + calcul progression |
| `src/pages/DashboardLeaderboard.tsx` | UI select mois + colonne evolution |

## Exemple d'affichage

```text
+----------+----------------+-------+-------------+-----------+------------+------+-------+
| MEMBER   | TITLE          | POSTS | IMPRESSIONS | REACTIONS | ENGAGEMENT | RANK | EVOL. |
+----------+----------------+-------+-------------+-----------+------------+------+-------+
| Alice    | Head of Sales  |   12  |    45.2k    |   1.2k    |   2.65%    |  1   |  +2   |
| Bob      | CEO            |    8  |    32.1k    |    890    |   2.77%    |  2   |  -1   |
| Charlie  | Marketing Lead |    6  |    18.5k    |    456    |   2.46%    |  3   |   =   |
| David    | New Member     |    2  |     5.2k    |    120    |   2.31%    |  4   |  new  |
+----------+----------------+-------+-------------+-----------+------------+------+-------+
```

Filtre affiche: `[Janvier 2025 v]`

