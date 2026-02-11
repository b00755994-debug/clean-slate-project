

# Fix: Bug d'affichage du Content Dashboard

## Diagnostic

Apres analyse complete du code, il n'y a pas d'erreur evidente dans l'implementation du badge "New posts". Les logs console ne montrent aucune erreur, et les requetes reseau retournent des donnees correctement.

Le probleme le plus probable est lie au **hook `useNewPostsBadge`** qui s'execute dans `TeamFeed`, lequel est utilise a la fois dans `DashboardContent` et indirectement dans `Dashboard` (via `useTeamFeedStats`). Le hook cree un canal Realtime Supabase qui pourrait entrer en conflit avec le canal similaire dans `useNewPostsNotification` (utilise dans `DashboardLayout`).

## Corrections preventives

### 1. Proteger `useNewPostsBadge` contre les cas limites

- Ajouter un guard plus strict : ne pas souscrire si `workspace?.id` n'est pas encore disponible
- S'assurer que le cleanup du canal Realtime est robuste

### 2. Eviter les conflits de canaux Realtime

Les deux hooks (`useNewPostsBadge` et `useNewPostsNotification`) souscrivent au meme type d'evenements sur la meme table `posts`. Les noms de canaux sont differents (`new-posts-badge-{id}` vs `posts-notification-{id}`), donc il ne devrait pas y avoir de conflit. Mais on va s'assurer que c'est bien le cas.

### 3. Ajouter un Error Boundary defensif

Envelopper le `TeamFeed` dans un try/catch au niveau du rendu pour eviter qu'une erreur silencieuse ne bloque tout le dashboard content.

## Detail technique

**`src/components/content/TeamFeed.tsx`** :
- Envelopper l'appel a `useNewPostsBadge` dans un pattern defensif
- Si le hook echoue, le badge ne s'affiche simplement pas mais le feed fonctionne toujours

**`src/hooks/useNewPostsBadge.ts`** :
- Ajouter un `try/catch` autour de la souscription Realtime
- Ajouter une verification que le canal est bien cree avant de tenter le cleanup

En parallele, je vais **forcer un rebuild propre** en touchant les fichiers concernes, ce qui devrait resoudre le probleme si c'est lie a un build cache corrompu.

