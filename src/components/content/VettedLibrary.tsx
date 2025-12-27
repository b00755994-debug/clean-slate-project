import { useState } from 'react';
import { useVettedLibrary } from '@/hooks/useVettedLibrary';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
  const { contents, bookmarkedContents, loading, toggleBookmark, deleteContent, refetch } = useVettedLibrary();
  const [editingContent, setEditingContent] = useState<VettedContent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);

  const handleToggleBookmark = (contentId: string) => {
    toggleBookmark(contentId);
  };

  const handleSubmitContent = async (data: { id?: string; title: string; content: string; image_url: string | null; category: string }) => {
    if (!user) return;

    try {
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
      refetch();
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

  const handleConfirmDelete = () => {
    if (!contentToDelete) return;
    deleteContent(contentToDelete);
    setDeleteDialogOpen(false);
    setContentToDelete(null);
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
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
