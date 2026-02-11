import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useNewPostsNotification() {
  const { workspace } = useWorkspace();
  const toastIdRef = useRef<string | number | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspace?.id) return;

    const channel = supabase
      .channel(`posts-notification-${workspace.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: `workspace_id=eq.${workspace.id}`
      }, () => {
        if (toastIdRef.current) {
          toast.dismiss(toastIdRef.current);
        }
        
        toastIdRef.current = toast.info('Données mises à jour', {
          description: 'Cliquez pour actualiser les données',
          action: {
            label: 'Actualiser',
            onClick: () => {
              // Invalidate all relevant queries instead of full page reload
              queryClient.invalidateQueries({ queryKey: ['posts'] });
              queryClient.invalidateQueries({ queryKey: ['analytics-all-posts'] });
              queryClient.invalidateQueries({ queryKey: ['all-posts-leaderboard'] });
              queryClient.invalidateQueries({ queryKey: ['linkedin-profiles'] });
              queryClient.invalidateQueries({ queryKey: ['billable-users'] });
            }
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
  }, [workspace?.id, queryClient]);
}
