import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
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
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  const { data: contents = [], isLoading: contentsLoading, refetch } = useQuery({
    queryKey: ['vetted-content', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      const { data, error } = await supabase
        .from('vetted_content')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VettedContent[];
    },
    enabled: !!workspace?.id,
    staleTime: 2 * 60 * 1000,
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
    staleTime: 60 * 1000,
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
      queryClient.setQueryData(['vetted-content', workspace?.id], (old: VettedContent[]) => 
        old?.filter(c => c.id !== contentId) || []
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
