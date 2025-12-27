import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Copy, Check, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VettedContentCardProps {
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
  onEdit?: (content: VettedContentCardProps['content']) => void;
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

export function VettedContentCard({ 
  content, 
  isBookmarked = false, 
  isAdmin = false,
  onToggleBookmark,
  onEdit,
  onDelete
}: VettedContentCardProps) {
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
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {content.image_url && (
        <div className="overflow-hidden rounded-t-lg aspect-video">
          <img 
            src={content.image_url} 
            alt={content.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Badge className={cn("text-xs mb-2", categoryColors[category])}>
              {categoryLabels[category] || category}
            </Badge>
            <h3 className="font-semibold text-foreground line-clamp-2">
              {content.title}
            </h3>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className={cn("h-8 w-8", bookmarked && "text-primary")}
            >
              <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {content.content}
        </p>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(content.created_at), { addSuffix: true, locale: fr })}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-1 text-xs">{copied ? 'Copié' : 'Copier'}</span>
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
      </CardContent>
    </Card>
  );
}
