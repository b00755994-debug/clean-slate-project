

# Cadre uniforme et dimensions reduites pour les mockups

## Constat actuel

- **MockTeamFeed** a deja un cadre visible : `rounded-xl border border-border bg-background` avec `h-[700px] overflow-hidden` -- c'est le style de reference.
- **MockAnalytics** n'a aucun cadre exterieur (simple `div` avec `space-y-6`), pas de hauteur fixe.
- **MockLeaderboard** n'a aucun cadre exterieur (simple `div` avec `flex flex-col gap-6`), pas de hauteur fixe.
- **SlackIntegration (embedded)** a son propre style de card mais sans cadre uniforme avec les autres.

## Plan

### 1. `src/components/Features.tsx` -- Wrapper uniforme

Remplacer le wrapper actuel des mockups (ligne 121) :
```
<div className="rounded-xl overflow-hidden">
```
par un wrapper avec un cadre plus marque et une hauteur reduite :
```
<div className="rounded-xl border-2 border-border/80 shadow-lg bg-background overflow-hidden h-[600px]">
```

Cela applique a tous les mockups :
- `border-2` au lieu de `border` pour un cadre plus visible
- `border-border/80` pour une couleur de bordure plus marquee
- `shadow-lg` pour un effet d'elevation
- `h-[600px]` avec `overflow-hidden` pour des dimensions reduites et uniformes

### 2. `src/components/mockups/MockTeamFeed.tsx` -- Ajuster la hauteur

Modifier le conteneur principal (ligne 134) :
- Retirer le `h-[700px]`, `rounded-xl`, `border border-border` du composant lui-meme puisque le wrapper parent dans Features.tsx s'en charge
- Remplacer par `h-full` pour qu'il remplisse le conteneur parent

### 3. `src/components/mockups/MockAnalytics.tsx` -- Ajuster pour le cadre

Modifier le conteneur principal (ligne 186) :
- Ajouter `h-full overflow-y-auto p-4` au wrapper pour que le contenu scrolle dans le cadre fixe

### 4. `src/components/mockups/MockLeaderboard.tsx` -- Ajuster pour le cadre

Modifier le conteneur principal (ligne 63) :
- Ajouter `h-full overflow-y-auto p-4` au wrapper pour que le contenu scrolle dans le cadre fixe

## Fichiers concernes

- `src/components/Features.tsx` -- wrapper uniforme
- `src/components/mockups/MockTeamFeed.tsx` -- retrait du cadre propre, `h-full`
- `src/components/mockups/MockAnalytics.tsx` -- ajout scroll interne
- `src/components/mockups/MockLeaderboard.tsx` -- ajout scroll interne

