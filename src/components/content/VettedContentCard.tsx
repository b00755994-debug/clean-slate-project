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
        <div className="overflow-hidden rounded-t-lg aspect-[16/9] max-h-32">
          <img 
            src={content.image_url} 
            alt={content.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="py-2 px-3">
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1 min-w-0">
            <Badge className={cn("text-[10px] px-1.5 py-0 mb-1", categoryColors[category])}>
              {categoryLabels[category] || category}
            </Badge>
            <h3 className="font-medium text-sm text-foreground line-clamp-2">
              {content.title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className={cn("h-6 w-6 shrink-0", bookmarked && "text-primary")}
          >
            <Bookmark className={cn("h-3 w-3", bookmarked && "fill-current")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0 px-3 pb-2">
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
          {content.content}
        </p>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(content.created_at), { addSuffix: true, locale: fr })}
          </span>
          <div className="flex gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-1.5 text-[10px]"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="ml-0.5">{copied ? 'Copié' : 'Copier'}</span>
            </Button>
            {isAdmin && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit?.(content)}
                  className="h-6 w-6"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete?.(content.id)}
                  className="h-6 w-6 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
