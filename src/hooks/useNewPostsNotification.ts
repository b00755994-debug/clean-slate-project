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
