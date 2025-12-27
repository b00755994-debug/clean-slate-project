import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Workspace {
  id: string;
  workspace_name: string;
  is_connected: boolean;
  connected_at: string | null;
  slack_workspace_auth: string | null;
}

export function useWorkspace() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: workspace, isLoading, refetch } = useQuery({
    queryKey: ['workspace', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        workspace_name: data.workspace_name,
        is_connected: data.is_connected || false,
        connected_at: data.connected_at,
        slack_workspace_auth: data.slack_workspace_auth,
      } as Workspace;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const disconnectMutation = useMutation({
    mutationFn: async (workspaceId: string) => {
      const { error } = await supabase
        .from('workspaces')
        .update({
          is_connected: false,
          slack_workspace_auth: null,
        })
        .eq('id', workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(['workspace', user?.id], (old: Workspace | null) => 
        old ? { ...old, is_connected: false, slack_workspace_auth: null } : null
      );
      // Invalidate slack members cache when disconnecting
      queryClient.invalidateQueries({ queryKey: ['slack-members'] });
    },
  });

  return {
    workspace,
    isLoading,
    refetch,
    disconnect: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,
  };
}
