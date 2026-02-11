import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useQueryClient } from '@tanstack/react-query';

export function useNewPostsBadge() {
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();
  const [hasNewPosts, setHasNewPosts] = useState(false);

  useEffect(() => {
    if (!workspace?.id) return;

    const channel = supabase
      .channel(`new-posts-badge-${workspace.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
        filter: `workspace_id=eq.${workspace.id}`
      }, () => {
        setHasNewPosts(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspace?.id]);

  const loadNewPosts = () => {
    setHasNewPosts(false);
    queryClient.invalidateQueries({ queryKey: ['posts', workspace?.id] });
    queryClient.invalidateQueries({ queryKey: ['all-posts-leaderboard', workspace?.id] });
  };

  return { hasNewPosts, loadNewPosts };
}
