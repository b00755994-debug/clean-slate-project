

# Indicateurs de chargement pour les profils en attente du scraper

## Contexte

Quand un profil LinkedIn est ajout via "Add User", seule l'URL est fournie. Les champs `profile_picture`, `profile_name`, `followers` restent `null` jusqu'a ce que le scraper les remplisse. On veut :
1. Afficher un indicateur de chargement anime sur ces champs null
2. Rafraichir automatiquement les donnees pour que les valeurs apparaissent des qu'elles sont disponibles

## Changements prevus

### 1. Indicateurs de chargement animes (src/pages/Dashboard.tsx)

Pour chaque profil dont certains champs sont encore `null`, afficher un skeleton anime a la place du contenu statique :

- **Photo** : cercle pulse anime au lieu du fallback statique (quand `profile_picture` est null)
- **Nom** : petit skeleton rectangle anime au lieu de "En attente..." (quand `profile_name` est null)
- **Followers** : skeleton anime au lieu du tiret "—" (quand `followers` est null)
- **Posts** : ce champ reste tel quel (c'est un compteur calcule, pas un champ scrape)

On utilisera le composant `Skeleton` deja present dans le projet (`src/components/ui/skeleton.tsx`) avec des tailles adaptees aux cellules du tableau.

### 2. Auto-refresh via polling (src/hooks/useLinkedInProfiles.ts)

Ajouter un `refetchInterval` conditionnel au hook `useLinkedInProfiles` :
- Si au moins un profil a `profile_name === null` (= en attente du scraper), activer un polling toutes les 10 secondes
- Des que tous les profils ont un `profile_name`, le polling s'arrete automatiquement

Cela se fait via l'option `refetchInterval` de React Query :
```typescript
refetchInterval: linkedinProfiles.some(p => !p.profile_name) ? 10_000 : false
```

## Detail technique

**src/pages/Dashboard.tsx** - 3 modifications dans le rendu du tableau :

1. Lignes 691-703 (photo + nom) : remplacer le fallback statique par `<Skeleton className="w-6 h-6 rounded-full" />` quand `profile_picture` est null ET `profile_name` est null, et remplacer le texte "En attente..." par `<Skeleton className="h-3 w-20" />`

2. Ligne 794 (followers) : remplacer le tiret par `<Skeleton className="h-3 w-10 ml-auto" />` quand `followers` est null

**src/hooks/useLinkedInProfiles.ts** :

Ajouter `refetchInterval` a la query pour activer le polling quand des profils sont incomplets. Cela necessite une petite reorganisation car on doit acceder aux donnees pour decider de l'intervalle - on utilisera une approche avec un state separe ou le calcul directement dans le composant.

