

# Plan : Toast simple de notification globale

## Objectif

Afficher un toast discret partout sur le site quand de nouveaux posts sont detectes, demandant simplement a l'utilisateur d'actualiser la page.

## Solution

Un toast simple avec un bouton "Actualiser" qui fait un `window.location.reload()`.

## Fichiers a creer

### 1. `src/hooks/useNewPostsNotification.ts` (nouveau)

```typescript
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/hooks/useWorkspace';
import { toast } from 'sonner';

export function useNewPostsNotification() {
  const { workspace } = useWorkspace();
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!workspace?.id) return;

    const channel = supabase
      .channel(`posts-notification-${workspace.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
        filter: `workspace_id=eq.${workspace.id}`
      }, () => {
        // Afficher un seul toast (dismiss l'ancien si existe)
        if (toastIdRef.current) {
          toast.dismiss(toastIdRef.current);
        }
        
        toastIdRef.current = toast.info('Nouveaux posts disponibles', {
          description: 'Actualisez la page pour les voir',
          action: {
            label: 'Actualiser',
            onClick: () => window.location.reload()
          },
          duration: Infinity, // Reste jusqu'a action utilisateur
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [workspace?.id]);
}
```

## Fichiers a modifier

### 2. `src/components/dashboard/DashboardLayout.tsx`

Ajouter le hook au niveau du layout :

```typescript
import { useNewPostsNotification } from '@/hooks/useNewPostsNotification';

export function DashboardLayout({ children }: DashboardLayoutProps) {
  useNewPostsNotification(); // Active les notifications globales
  
  // ... reste du composant inchange
}
```

### 3. `src/hooks/useTeamFeed.ts`

Retirer la souscription Realtime (eviter les doublons) :
- Supprimer le state `newPostsCount`
- Supprimer le `useEffect` avec la souscription Realtime
- Supprimer la fonction `refreshPosts`
- Retirer ces exports du return

### 4. `src/components/content/TeamFeed.tsx`

Retirer l'import et l'utilisation de `NewPostsBanner` :
- Supprimer l'import de `NewPostsBanner`
- Retirer `newPostsCount` et `refreshPosts` du destructuring
- Supprimer le composant `<NewPostsBanner />`

### 5. `src/components/content/NewPostsBanner.tsx`

Supprimer ce fichier (plus necessaire).

## Resultat

| Avant | Apres |
|-------|-------|
| Bandeau visible uniquement sur `/dashboard/content` | Toast visible partout |
| Compteur incrementant | Un seul toast a la fois |
| Bouton "Afficher" | Bouton "Actualiser" (reload page) |

## Comportement du toast

- Apparait en bas a droite (comportement par defaut de sonner)
- Reste affiche jusqu'a ce que l'utilisateur clique sur "Actualiser" ou le ferme
- Si plusieurs posts arrivent, un seul toast est affiche (l'ancien est remplace)

