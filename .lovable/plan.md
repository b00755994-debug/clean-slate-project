
# Badge "New posts" flottant dans le Team Feed

## Fonctionnement

Quand de nouveaux posts apparaissent en base (via Supabase Realtime), un badge flottant "New posts" apparait en haut de la zone de scroll du feed. Il reste fixe meme si l'utilisateur a scroll. Au clic, il (1) remonte le feed en haut et (2) charge les nouveaux posts en invalidant le cache.

## Changements

### 1. Modifier `useNewPostsNotification` pour exposer un etat au lieu d'un toast

Actuellement, le hook affiche un toast global. On va le transformer pour qu'il expose un booleen `hasNewPosts` et une fonction `loadNewPosts()`, tout en gardant le toast pour les autres pages (hors team feed).

On va creer un **nouveau hook** `useNewPostsBadge` dedie au feed, qui :
- Ecoute les changements Realtime sur la table `posts` (INSERT uniquement)
- Maintient un etat `hasNewPosts: boolean`
- Expose une fonction `loadNewPosts()` qui invalide le cache et remet le flag a false

### 2. Modifier le composant `TeamFeed`

- Ajouter une `ref` sur le conteneur du feed pour pouvoir faire `scrollIntoView` / `scrollTo(0)`
- Integrer le hook `useNewPostsBadge`
- Afficher un badge flottant en `position: sticky; top: 0` quand `hasNewPosts` est true
- Au clic : appeler `loadNewPosts()` + scroll to top

### 3. Modifier `DashboardContent`

Le conteneur scrollable du feed est dans `DashboardContent` (ligne 234, le `div` avec `overflow-y-auto`). Il faut passer une ref a `TeamFeed` ou restructurer legerement pour que le badge soit positionne dans ce conteneur scrollable avec `sticky top-0`.

## Detail technique

**Nouveau fichier : `src/hooks/useNewPostsBadge.ts`**

```typescript
// Ecoute INSERT sur posts, expose hasNewPosts + loadNewPosts()
// Utilise Supabase Realtime, filtre sur workspace_id
// loadNewPosts() invalide ['posts', workspaceId] et reset le flag
```

**`src/components/content/TeamFeed.tsx`** :

- Accepter une nouvelle prop `scrollContainerRef` (RefObject du parent scrollable)
- Utiliser `useNewPostsBadge()`
- Rendre un badge sticky en haut :

```tsx
{hasNewPosts && (
  <button
    onClick={() => {
      scrollContainerRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
      loadNewPosts();
    }}
    className="sticky top-0 z-10 mx-auto flex items-center gap-2 
               bg-primary text-primary-foreground px-4 py-2 rounded-full 
               shadow-lg animate-fade-in cursor-pointer hover:bg-primary/90"
  >
    <ArrowUp className="h-4 w-4" />
    New posts
  </button>
)}
```

**`src/pages/DashboardContent.tsx`** :

- Creer un `useRef` pour le conteneur scroll du feed (ligne 234)
- Passer cette ref en prop a `TeamFeed`

**`src/hooks/useNewPostsNotification.ts`** :

- Aucun changement : ce hook continue de fonctionner pour les autres pages du dashboard (analytics, leaderboard, etc.)
