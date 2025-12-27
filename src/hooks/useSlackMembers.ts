import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SlackMember {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
}

export function useSlackMembers(isConnected: boolean) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['slack-members', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('slack-members');
      
      if (error) {
        console.error('Error fetching Slack members:', error);
        throw error;
      }

      // Handle rate limit error from edge function
      if (data?.error === 'ratelimited') {
        toast.error('API Slack surchargée. Réessayez dans quelques secondes.');
        throw new Error('Rate limited');
      }

      return (data?.members || []) as SlackMember[];
    },
    enabled: !!user && isConnected,
    staleTime: 10 * 60 * 1000, // 10 minutes - données considérées fraîches
    gcTime: 30 * 60 * 1000, // 30 minutes - garde en cache
    retry: false, // Ne pas réessayer automatiquement en cas d'erreur rate limit
  });
}
