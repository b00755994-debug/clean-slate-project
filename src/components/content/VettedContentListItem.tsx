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

  const categories = (content.category || 'general').split(',').filter(Boolean);

  return (
    <div className="flex items-center gap-4 px-3 py-2.5 hover:bg-muted/50 transition-colors group">
      {/* Title column - flexible width */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground truncate">{content.title}</p>
        <p className="text-xs text-muted-foreground truncate">{content.content}</p>
      </div>

      {/* Category column - fixed width */}
      <div className="w-32 hidden sm:flex justify-center gap-1 flex-wrap">
        {categories.slice(0, 2).map(cat => (
          <Badge key={cat} className={cn("text-xs", categoryColors[cat] || categoryColors.general)}>
            {categoryLabels[cat] || cat}
          </Badge>
        ))}
        {categories.length > 2 && (
          <Badge className="text-xs bg-muted text-muted-foreground">+{categories.length - 2}</Badge>
        )}
      </div>

      {/* Date column - fixed width */}
      <div className="w-24 hidden md:block text-center">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(content.created_at), { addSuffix: true, locale: fr })}
        </span>
      </div>

      {/* Actions column - fixed width */}
      <div className="w-28 flex items-center justify-end gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmark}
          className={cn("h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity", bookmarked && "opacity-100 text-primary")}
        >
          <Bookmark className={cn("h-3.5 w-3.5", bookmarked && "fill-current")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
        {isAdmin && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit?.(content)}
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(content.id)}
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
