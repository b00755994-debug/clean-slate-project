import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { toast } from 'sonner';

interface Post {
  id: string;
  content: string | null;
  url: string | null;
  avatar_url: string | null;
  impressions: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  reactions: number | null;
  linkedin_created_at: string | null;
  linkedin_profiles: string | null;
  post_image: string | null;
}

interface BillableUser {
  id: string;
  profile_name: string;
  avatar_url: string | null;
  profile_picture: string | null;
  linkedin_url: string;
  linkedin_title: string | null;
}

export function useTeamFeed() {
  const { user } = useAuth();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  const { data: profiles = {}, isLoading: profilesLoading } = useQuery({
    queryKey: ['billable-users', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return {};
      
      const { data, error } = await supabase
        .from('billable_users')
        .select('id, profile_name, avatar_url, profile_picture, linkedin_url, linkedin_title')
        .eq('workspace_id', workspace.id);

      if (error) throw error;
      
      const profilesMap: Record<string, BillableUser> = {};
      data?.forEach(u => {
        profilesMap[u.id] = u;
      });
      return profilesMap;
    },
    enabled: !!workspace?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('linkedin_created_at', { ascending: false })
        .limit(10000);

      if (error) throw error;
      return (data as Post[]).filter(post => post.content && post.content.trim().length > 0);
    },
    enabled: !!workspace?.id,
    staleTime: 2 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchInterval: 30_000,
    placeholderData: (prev) => prev,
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
    staleTime: 60 * 1000,
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
