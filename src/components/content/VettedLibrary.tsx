import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { VettedContentCard } from './VettedContentCard';
import { VettedContentListItem } from './VettedContentListItem';
import { AddContentModal } from './AddContentModal';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface VettedContent {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string | null;
  created_at: string;
  workspace_id: string;
}

type ViewMode = 'grid' | 'list';

interface VettedLibraryProps {
  showBookmarksOnly?: boolean;
  selectedCategories: string[];
  dateFilter: string;
  viewMode: ViewMode;
  modalOpen: boolean;
  onModalOpenChange: (open: boolean) => void;
}

export function VettedLibrary({ 
  showBookmarksOnly = false,
  selectedCategories,
  dateFilter,
  viewMode,
  modalOpen,
  onModalOpenChange
}: VettedLibraryProps) {
  const { user, isAdmin } = useAuth();
  const [contents, setContents] = useState<VettedContent[]>([]);
  const [bookmarkedContents, setBookmarkedContents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<VettedContent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch vetted contents
      const { data: contentsData, error: contentsError } = await supabase
        .from('vetted_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (contentsError) throw contentsError;
      setContents(contentsData || []);

      // Fetch user's bookmarks for vetted content
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('vetted_content_id')
        .eq('user_id', user.id)
        .not('vetted_content_id', 'is', null);

      if (bookmarksError) throw bookmarksError;
      setBookmarkedContents(new Set(bookmarks?.map(b => b.vetted_content_id!) || []));

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des contenus');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (contentId: string) => {
    if (!user) return;

    const isCurrentlyBookmarked = bookmarkedContents.has(contentId);

    try {
      if (isCurrentlyBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('vetted_content_id', contentId);

        if (error) throw error;
        setBookmarkedContents(prev => {
          const next = new Set(prev);
          next.delete(contentId);
          return next;
        });
        toast.success('Retiré des favoris');
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, vetted_content_id: contentId });

        if (error) throw error;
        setBookmarkedContents(prev => new Set([...prev, contentId]));
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  const handleSubmitContent = async (data: { id?: string; title: string; content: string; image_url: string | null; category: string }) => {
    if (!user) return;

    try {
      // First get user's workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (workspaceError) throw workspaceError;

      if (!workspace) {
        toast.error('Aucun workspace trouvé');
        return;
      }

      if (data.id) {
        // Update existing
        const { error } = await supabase
          .from('vetted_content')
          .update({
            title: data.title,
            content: data.content,
            image_url: data.image_url,
            category: data.category,
          })
          .eq('id', data.id);

        if (error) throw error;
        toast.success('Contenu modifié');
      } else {
        // Create new
        const { error } = await supabase
          .from('vetted_content')
          .insert({
            title: data.title,
            content: data.content,
            image_url: data.image_url,
            category: data.category,
            workspace_id: workspace.id,
            created_by: user.id,
          });

        if (error) throw error;
        toast.success('Contenu ajouté');
      }

      setEditingContent(null);
      onModalOpenChange(false);
      fetchData();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (content: VettedContent) => {
    setEditingContent(content);
    onModalOpenChange(true);
  };

  const handleDeleteClick = (contentId: string) => {
    setContentToDelete(contentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contentToDelete) return;

    try {
      const { error } = await supabase
        .from('vetted_content')
        .delete()
        .eq('id', contentToDelete);

      if (error) throw error;
      toast.success('Contenu supprimé');
      fetchData();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteDialogOpen(false);
      setContentToDelete(null);
    }
  };

  const filteredContents = contents
    .filter(c => selectedCategories.length === 0 || selectedCategories.includes(c.category || 'general'))
    .filter(c => !showBookmarksOnly || bookmarkedContents.has(c.id))
    .filter(c => {
      if (dateFilter === 'all') return true;
      const now = new Date();
      const contentDate = new Date(c.created_at);
      const diffDays = Math.floor((now.getTime() - contentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dateFilter === 'week') return diffDays <= 7;
      if (dateFilter === 'month') return diffDays <= 30;
      if (dateFilter === 'quarter') return diffDays <= 90;
      return true;
    });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Content display */}
      {filteredContents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucun contenu validé</p>
          {isAdmin && (
            <p className="text-sm mt-2">Cliquez sur "Ajouter" pour commencer</p>
          )}
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-2">
          {filteredContents.map(content => (
            <VettedContentListItem
              key={content.id}
              content={content}
              isBookmarked={bookmarkedContents.has(content.id)}
              isAdmin={isAdmin}
              onToggleBookmark={handleToggleBookmark}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredContents.map(content => (
            <VettedContentCard
              key={content.id}
              content={content}
              isBookmarked={bookmarkedContents.has(content.id)}
              isAdmin={isAdmin}
              onToggleBookmark={handleToggleBookmark}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <AddContentModal
        open={modalOpen}
        onOpenChange={(open) => {
          onModalOpenChange(open);
          if (!open) setEditingContent(null);
        }}
        onSubmit={handleSubmitContent}
        editingContent={editingContent}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce contenu ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le contenu sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
