import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface VettedContent {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string | null;
  created_at: string;
  workspace_id: string;
}

export function useVettedLibrary() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contents = [], isLoading: contentsLoading, refetch } = useQuery({
    queryKey: ['vetted-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vetted_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VettedContent[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { data: bookmarkedContents = new Set<string>(), isLoading: bookmarksLoading } = useQuery({
    queryKey: ['vetted-bookmarks', user?.id],
    queryFn: async () => {
      if (!user) return new Set<string>();
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select('vetted_content_id')
        .eq('user_id', user.id)
        .not('vetted_content_id', 'is', null);

      if (error) throw error;
      return new Set(data?.map(b => b.vetted_content_id!) || []);
    },
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: async (contentId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const isCurrentlyBookmarked = bookmarkedContents.has(contentId);

      if (isCurrentlyBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('vetted_content_id', contentId);
        if (error) throw error;
        return { contentId, action: 'removed' as const };
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, vetted_content_id: contentId });
        if (error) throw error;
        return { contentId, action: 'added' as const };
      }
    },
    onSuccess: ({ contentId, action }) => {
      queryClient.setQueryData(['vetted-bookmarks', user?.id], (old: Set<string>) => {
        const next = new Set(old);
        if (action === 'removed') {
          next.delete(contentId);
        } else {
          next.add(contentId);
        }
        return next;
      });
      toast.success(action === 'added' ? 'Ajouté aux favoris' : 'Retiré des favoris');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour des favoris');
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const { error } = await supabase
        .from('vetted_content')
        .delete()
        .eq('id', contentId);
      if (error) throw error;
      return contentId;
    },
    onSuccess: (contentId) => {
      queryClient.setQueryData(['vetted-content'], (old: VettedContent[]) => 
        old.filter(c => c.id !== contentId)
      );
      toast.success('Contenu supprimé');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  return {
    contents,
    bookmarkedContents,
    loading: contentsLoading || bookmarksLoading,
    toggleBookmark: toggleBookmarkMutation.mutate,
    deleteContent: deleteContentMutation.mutate,
    refetch,
  };
}
