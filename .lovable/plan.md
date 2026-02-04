

# Plan : Notification globale pour INSERT et DELETE

## Objectif

Modifier le hook de notification pour detecter aussi les suppressions de posts (notamment apres suppression d'un billable user en cascade), et adapter le message pour etre plus generique.

## Modification a effectuer

### Fichier : `src/hooks/useNewPostsNotification.ts`

**Changements :**

1. Remplacer `event: 'INSERT'` par `event: '*'` pour ecouter tous les evenements (INSERT, UPDATE, DELETE)
2. Modifier le message du toast :
   - Titre : `"Donnees mises a jour"` (au lieu de "Nouveaux posts disponibles")
   - Description : `"Actualisez la page pour voir les changements"` (au lieu de "Actualisez la page pour les voir")

**Code modifie :**

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
        event: '*',  // Ecoute INSERT, UPDATE et DELETE
        schema: 'public',
        table: 'posts',
        filter: `workspace_id=eq.${workspace.id}`
      }, () => {
        if (toastIdRef.current) {
          toast.dismiss(toastIdRef.current);
        }
        
        toastIdRef.current = toast.info('Donnees mises a jour', {
          description: 'Actualisez la page pour voir les changements',
          action: {
            label: 'Actualiser',
            onClick: () => window.location.reload()
          },
          duration: Infinity,
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

## Comportement apres modification

| Evenement | Avant | Apres |
|-----------|-------|-------|
| Nouveau post ajoute | Toast "Nouveaux posts disponibles" | Toast "Donnees mises a jour" |
| Post supprime (cascade billable_user) | Rien | Toast "Donnees mises a jour" |
| Post modifie (impressions, etc.) | Rien | Toast "Donnees mises a jour" |

## Fichiers modifies

| Fichier | Action |
|---------|--------|
| `src/hooks/useNewPostsNotification.ts` | Modifier event et messages |

