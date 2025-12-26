import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bookmark, Heart, MessageCircle, Eye, Share2, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: {
    id: string;
    content: string | null;
    url: string | null;
    impressions: number | null;
    likes: number | null;
    comments: number | null;
    shares: number | null;
    reactions: number | null;
    created_at: string;
  };
  author?: {
    profile_name: string;
    avatar_url: string | null;
    linkedin_url: string;
  };
  isBookmarked?: boolean;
  onToggleBookmark?: (postId: string) => void;
}

export function PostCard({ post, author, isBookmarked = false, onToggleBookmark }: PostCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onToggleBookmark?.(post.id);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return '0';
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Author Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author?.avatar_url || undefined} alt={author?.profile_name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {author ? getInitials(author.profile_name) : '??'}
              </AvatarFallback>
            </Avatar>
            <div>
              <a 
                href={author?.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                {author?.profile_name || 'Utilisateur inconnu'}
              </a>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: fr })}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className={cn(
              "h-8 w-8",
              bookmarked && "text-primary"
            )}
          >
            <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">
            {post.content || 'Contenu non disponible'}
          </p>
          {post.url && (
            <a 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-2 inline-block"
            >
              Voir sur LinkedIn →
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-3 border-t border-border/50 text-muted-foreground">
          <div className="flex items-center gap-1 text-xs">
            <Eye className="h-3.5 w-3.5" />
            <span>{formatNumber(post.impressions)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{formatNumber(post.reactions || post.likes)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{formatNumber(post.comments)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Share2 className="h-3.5 w-3.5" />
            <span>{formatNumber(post.shares)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
