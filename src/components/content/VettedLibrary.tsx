import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { VettedContentCard } from './VettedContentCard';
import { VettedContentListItem } from './VettedContentListItem';
import { AddContentModal } from './AddContentModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Grid3X3, List, LayoutGrid, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
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

type ViewMode = 'grid' | 'list' | 'cards';

const categories = [
  { value: 'general', label: 'Général' },
  { value: 'announcement', label: 'Annonce' },
  { value: 'product', label: 'Produit' },
  { value: 'culture', label: 'Culture' },
  { value: 'event', label: 'Événement' },
  { value: 'stats', label: 'Chiffres' },
];

interface VettedLibraryProps {
  showBookmarksOnly?: boolean;
}

export function VettedLibrary({ showBookmarksOnly = false }: VettedLibraryProps) {
  const { user, isAdmin } = useAuth();
  const [contents, setContents] = useState<VettedContent[]>([]);
  const [bookmarkedContents, setBookmarkedContents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [modalOpen, setModalOpen] = useState(false);
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
      fetchData();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (content: VettedContent) => {
    setEditingContent(content);
    setModalOpen(true);
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
    .filter(c => !showBookmarksOnly || bookmarkedContents.has(c.id));

  const toggleCategory = (value: string) => {
    setSelectedCategories(prev => 
      prev.includes(value) 
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  };

  const clearFilters = () => setSelectedCategories([]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      {/* Header with filters and add button */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          {/* Category multi-select badges */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {categories.map(cat => (
              <Badge
                key={cat.value}
                variant={selectedCategories.includes(cat.value) ? 'default' : 'outline'}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedCategories.includes(cat.value) && "bg-primary text-primary-foreground"
                )}
                onClick={() => toggleCategory(cat.value)}
              >
                {cat.label}
              </Badge>
            ))}
            {selectedCategories.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2">
                <X className="h-3 w-3 mr-1" />
                Effacer
              </Button>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as ViewMode)}>
              <ToggleGroupItem value="grid" aria-label="Vue grille">
                <Grid3X3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="Vue liste">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="cards" aria-label="Vue fiches">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            {isAdmin && (
              <Button onClick={() => { setEditingContent(null); setModalOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            )}
          </div>
        </div>
      </div>

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
        <div className={cn(
          "grid gap-4",
          viewMode === 'grid' 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1 md:grid-cols-2"
        )}>
          {filteredContents.map(content => (
            <VettedContentCard
              key={content.id}
              content={content}
              isBookmarked={bookmarkedContents.has(content.id)}
              isAdmin={isAdmin}
              onToggleBookmark={handleToggleBookmark}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              variant={viewMode === 'cards' ? 'card' : 'default'}
            />
          ))}
        </div>
      )}

      <AddContentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
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
