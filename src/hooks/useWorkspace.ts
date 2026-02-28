import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type WorkspaceRole = 'owner' | 'admin' | 'member';

interface WorkspaceMembership {
  workspace_id: string;
  role: WorkspaceRole;
  joined_at: string | null;
  workspace: {
    id: string;
    workspace_name: string;
    is_connected: boolean;
    connected_at: string | null;
    slack_workspace_auth: string | null;
  };
}

interface Workspace {
  id: string;
  workspace_name: string;
  is_connected: boolean;
  connected_at: string | null;
  slack_workspace_auth: string | null;
  role: WorkspaceRole;
  plan: string;
  max_billable_users: number;
}

export function useWorkspace() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: workspace, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['workspace', user?.id],
    queryFn: async () => {
      // Get workspace through workspace_members junction table
      const { data, error } = await supabase
        .from('workspace_members')
        .select(`
          workspace_id,
          role,
          joined_at,
          workspace:workspaces (
            id,
            workspace_name,
            is_connected,
            connected_at,
            slack_workspace_auth,
            plan,
            max_billable_users
          )
        `)
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data || !data.workspace) return null;
      
      // Handle the workspace data - it comes as an object, not an array
      const ws = data.workspace as unknown as {
        id: string;
        workspace_name: string;
        is_connected: boolean | null;
        connected_at: string | null;
        slack_workspace_auth: string | null;
        plan: string | null;
        max_billable_users: number | null;
      };
      
      return {
        id: ws.id,
        workspace_name: ws.workspace_name,
        is_connected: ws.is_connected || false,
        connected_at: ws.connected_at,
        slack_workspace_auth: ws.slack_workspace_auth,
        role: data.role as WorkspaceRole,
        plan: ws.plan || 'free',
        max_billable_users: ws.max_billable_users ?? 3,
      } as Workspace;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: (previousData) => previousData,
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
    isFetching,
    refetch,
    disconnect: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,
  };
}
