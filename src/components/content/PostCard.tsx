import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Globe, MoreHorizontal, ExternalLink, Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Import LinkedIn reaction icons
import likeIcon from '@/assets/linkedin-reactions/like.png';
import celebrateIcon from '@/assets/linkedin-reactions/celebrate.png';
import loveIcon from '@/assets/linkedin-reactions/love.png';
import insightfulIcon from '@/assets/linkedin-reactions/insightful.png';
import curiousIcon from '@/assets/linkedin-reactions/curious.png';
import supportIcon from '@/assets/linkedin-reactions/support.png';
import funnyIcon from '@/assets/linkedin-reactions/funny.png';

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
  isTopPerformer?: boolean;
}

// LinkedIn reaction icons mapping
const reactionIcons = {
  like: likeIcon,
  celebrate: celebrateIcon,
  love: loveIcon,
  insightful: insightfulIcon,
  curious: curiousIcon,
  support: supportIcon,
  funny: funnyIcon,
};

type ReactionType = keyof typeof reactionIcons;

const ReactionIcon = ({ type }: { type: ReactionType }) => {
  return (
    <div className="h-[18px] w-[18px] rounded-full ring-2 ring-white flex-shrink-0">
      <img 
        src={reactionIcons[type]} 
        alt={type}
        className="h-full w-full rounded-full object-cover"
      />
    </div>
  );
};

export function PostCard({ post, author, isBookmarked = false, onToggleBookmark, isTopPerformer = false }: PostCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const content = post.content || '';
  const shouldTruncate = content.length > 280;
  const displayContent = isExpanded || !shouldTruncate 
    ? content 
    : content.slice(0, 280);

  const totalReactions = post.reactions || post.likes || 0;
  const totalComments = post.comments || 0;

  return (
    <Card className="bg-card border border-border/40 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Author Header */}
        <div className="flex items-start justify-between p-4 pb-0">
          <div className="flex gap-3">
            <a 
              href={author?.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                <AvatarImage src={author?.avatar_url || undefined} alt={author?.profile_name} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {author ? getInitials(author.profile_name) : '??'}
                </AvatarFallback>
              </Avatar>
            </a>
            <div className="min-w-0">
              <a 
                href={author?.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary hover:underline transition-colors text-sm leading-tight block"
              >
                {author?.profile_name || 'Utilisateur inconnu'}
              </a>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: false, locale: fr })}</span>
                <span>•</span>
                <Globe className="h-3 w-3" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isTopPerformer && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs px-2 py-0.5">
                <Flame className="h-3 w-3 mr-1" />
                Top
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className={cn(
                "h-8 w-8 rounded-full hover:bg-muted",
                bookmarked && "text-primary"
              )}
            >
              <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {displayContent}
            {shouldTruncate && !isExpanded && (
              <>
                ...{' '}
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="text-muted-foreground hover:text-primary hover:underline font-medium"
                >
                  voir plus
                </button>
              </>
            )}
          </p>
        </div>

        {/* Stats Line */}
        {(totalReactions > 0 || totalComments > 0) && (
          <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {totalReactions > 0 && (
                <>
                  <div className="flex -space-x-1.5">
                    <ReactionIcon type="like" />
                    <ReactionIcon type="celebrate" />
                    <ReactionIcon type="love" />
                  </div>
                  <span className="ml-1.5">{formatNumber(totalReactions)}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {totalComments > 0 && (
                <span>{formatNumber(totalComments)} commentaire{totalComments > 1 ? 's' : ''}</span>
              )}
              {(post.shares || 0) > 0 && (
                <span>{formatNumber(post.shares)} partage{(post.shares || 0) > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        )}

        {/* View on LinkedIn Link - More prominent */}
        {post.url && (
          <div className="border-t border-border/40 px-4 py-3">
            <a 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              Voir sur LinkedIn
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
