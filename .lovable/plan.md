

# Limiter les Active Contributors au Top 3

## Constat

- **Mockup (`MockTeamFeed.tsx`)** : `mockContributors` contient 5 entrées (Marie, Julie, Thomas, Nicolas, Sophie). Il faut réduire à 3.
- **Interface réelle (`useLeaderboards.ts`)** : déjà limité à `.slice(0, 3)` -- aucun changement nécessaire.
- **`ActiveContributorsLeaderboard.tsx`** : le composant affiche tout ce qu'on lui passe, pas de limite interne -- c'est correct, la limite est côté données.

## Modifications

### 1. `src/components/mockups/MockTeamFeed.tsx`

Supprimer les 2 dernières entrées du tableau `mockContributors` (lignes 51-52 : Nicolas et Sophie), ne garder que les 3 premières.

```ts
const mockContributors = [
  { id: 'c-1', name: 'Marie Dupont', avatarUrl: marieAvatar, postCount: 8 },
  { id: 'c-2', name: 'Julie Bernard', avatarUrl: julieAvatar, postCount: 6 },
  { id: 'c-3', name: 'Thomas Martin', avatarUrl: thomasAvatar, postCount: 5 },
];
```

C'est le seul fichier à modifier.

