import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  num_members: number;
  is_member: boolean;
}

interface ChannelsResponse {
  channels: SlackChannel[];
  currentChannel: string | null;
}

export function useSlackChannels(isConnected: boolean) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['slack-channels'],
    queryFn: async (): Promise<ChannelsResponse> => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch('https://hvmrjymweajxxkoiupzf.supabase.co/functions/v1/slack-channels', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch channels');
      }

      return response.json();
    },
    enabled: isConnected,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: (previousData) => previousData, // Keep previous data during refetch
  });

  const joinChannelMutation = useMutation({
    mutationFn: async ({ channelId }: { channelId: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch('https://hvmrjymweajxxkoiupzf.supabase.co/functions/v1/slack-join-channel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(data.error || 'Failed to join channel') as Error & { needsReconnect?: boolean };
        error.needsReconnect = data.needsReconnect === true;
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      // Update the currentChannel and is_member in the cache
      queryClient.setQueryData(['slack-channels'], (old: ChannelsResponse | undefined) => {
        if (!old) return old;
        return { 
          ...old, 
          currentChannel: data.channelId,
          // Mark the channel as having the bot as member
          channels: old.channels.map(ch => 
            ch.id === data.channelId ? { ...ch, is_member: true } : ch
          )
        };
      });
      // Invalidate workspace to refresh channel info
      queryClient.invalidateQueries({ queryKey: ['workspace'] });
    },
  });

  return {
    channels: query.data?.channels || [],
    currentChannel: query.data?.currentChannel || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    joinChannel: joinChannelMutation.mutate,
    isJoiningChannel: joinChannelMutation.isPending,
    joinError: joinChannelMutation.error,
  };
}
