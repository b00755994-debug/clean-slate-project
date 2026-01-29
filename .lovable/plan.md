

# Harmoniser le Header du Leaderboard

## Probleme
Le header de la page Leaderboard utilise un style different des autres pages du dashboard:
- Titre trop petit (`text-xl` au lieu de `text-3xl`)
- Icone trop petite (`w-5 h-5` au lieu de `w-8 h-8`)
- Icone dans un container separe avec `p-2` qui cause le rognage

## Solution
Aligner le style du header sur celui d'Analytics et Team Feed.

## Modification

**Fichier: `src/pages/DashboardLeaderboard.tsx`**

Remplacer le header actuel (lignes 97-106):
```tsx
{/* Ancien */}
<div className="flex items-center gap-3">
  <div className="p-2 rounded-lg bg-primary/10">
    <Trophy className="w-5 h-5 text-primary" />
  </div>
  <div>
    <h1 className="text-xl font-semibold text-foreground">{t.title}</h1>
    <p className="text-sm text-muted-foreground">{t.subtitle}</p>
  </div>
</div>
```

Par:
```tsx
{/* Nouveau - meme style qu'Analytics */}
<div className="flex flex-col gap-1">
  <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
    <Trophy className="w-8 h-8 text-primary" />
    {t.title}
  </h1>
  <p className="text-muted-foreground">{t.subtitle}</p>
</div>
```

## Changements cles
| Element | Avant | Apres |
|---------|-------|-------|
| Titre | `text-xl font-semibold` | `text-3xl font-bold` |
| Icone | `w-5 h-5` dans container | `w-8 h-8` inline |
| Structure | Container separe pour icone | Icone dans le h1 |

## Fichier a modifier

| Fichier | Changement |
|---------|------------|
| `src/pages/DashboardLeaderboard.tsx` | Restructurer le header pour correspondre aux autres pages |

