import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Post {
  id: string;
  content: string | null;
  url: string | null;
  impressions: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  reactions: number | null;
  created_at: string;
  linkedin_profiles: string | null;
}

interface BillableUser {
  id: string;
  profile_name: string;
  avatar_url: string | null;
  linkedin_url: string;
}

export function useTeamFeed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profiles = {}, isLoading: profilesLoading } = useQuery({
    queryKey: ['billable-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('billable_users')
        .select('id, profile_name, avatar_url, linkedin_url');

      if (error) throw error;
      
      const profilesMap: Record<string, BillableUser> = {};
      data?.forEach(u => {
        profilesMap[u.id] = u;
      });
      return profilesMap;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { data: bookmarkedPosts = new Set<string>(), isLoading: bookmarksLoading } = useQuery({
    queryKey: ['post-bookmarks', user?.id],
    queryFn: async () => {
      if (!user) return new Set<string>();
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select('post_id')
        .eq('user_id', user.id)
        .not('post_id', 'is', null);

      if (error) throw error;
      return new Set(data?.map(b => b.post_id!) || []);
    },
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const isCurrentlyBookmarked = bookmarkedPosts.has(postId);

      if (isCurrentlyBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
        if (error) throw error;
        return { postId, action: 'removed' as const };
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, post_id: postId });
        if (error) throw error;
        return { postId, action: 'added' as const };
      }
    },
    onSuccess: ({ postId, action }) => {
      queryClient.setQueryData(['post-bookmarks', user?.id], (old: Set<string>) => {
        const next = new Set(old);
        if (action === 'removed') {
          next.delete(postId);
        } else {
          next.add(postId);
        }
        return next;
      });
      toast.success(action === 'added' ? 'Ajouté aux favoris' : 'Retiré des favoris');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour des favoris');
    },
  });

  return {
    posts,
    profiles,
    bookmarkedPosts,
    loading: profilesLoading || postsLoading || bookmarksLoading,
    toggleBookmark: toggleBookmarkMutation.mutate,
  };
}
