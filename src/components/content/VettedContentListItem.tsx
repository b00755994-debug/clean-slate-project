import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Copy, Check, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VettedContentListItemProps {
  content: {
    id: string;
    title: string;
    content: string;
    image_url: string | null;
    category: string | null;
    created_at: string;
  };
  isBookmarked?: boolean;
  isAdmin?: boolean;
  onToggleBookmark?: (contentId: string) => void;
  onEdit?: (content: VettedContentListItemProps['content']) => void;
  onDelete?: (contentId: string) => void;
}

const categoryColors: Record<string, string> = {
  general: 'bg-muted text-muted-foreground',
  announcement: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  product: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  culture: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  event: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  stats: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
};

const categoryLabels: Record<string, string> = {
  general: 'Général',
  announcement: 'Annonce',
  product: 'Produit',
  culture: 'Culture',
  event: 'Événement',
  stats: 'Chiffres',
};

export function VettedContentListItem({ 
  content, 
  isBookmarked = false, 
  isAdmin = false,
  onToggleBookmark,
  onEdit,
  onDelete
}: VettedContentListItemProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [copied, setCopied] = useState(false);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onToggleBookmark?.(content.id);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.content);
      setCopied(true);
      toast.success('Contenu copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  const category = content.category || 'general';

  return (
    <div className="flex items-center gap-4 p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
      {/* Image thumbnail */}
      {content.image_url && (
        <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden">
          <img 
            src={content.image_url} 
            alt={content.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge className={cn("text-xs", categoryColors[category])}>
            {categoryLabels[category] || category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(content.created_at), { addSuffix: true, locale: fr })}
          </span>
        </div>
        <h3 className="font-medium text-foreground truncate">{content.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{content.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmark}
          className={cn("h-8 w-8", bookmarked && "text-primary")}
        >
          <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-8 w-8"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        {isAdmin && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit?.(content)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(content.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}