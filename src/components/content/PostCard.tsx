import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Globe, MoreHorizontal, ExternalLink, Flame, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Import LinkedIn reaction icons
import likeIcon from '@/assets/linkedin-reactions/like.png';
import celebrateIcon from '@/assets/linkedin-reactions/celebrate.png';
import loveIcon from '@/assets/linkedin-reactions/love.png';
import insightfulIcon from '@/assets/linkedin-reactions/insightful.png';
import supportIcon from '@/assets/linkedin-reactions/support.png';
import funnyIcon from '@/assets/linkedin-reactions/funny.png';

interface PostCardProps {
  post: {
    id: string;
    content: string | null;
    url: string | null;
    avatar_url: string | null;
    impressions: number | null;
    likes: number | null;
    comments: number | null;
    shares: number | null;
    reactions: number | null;
    created_at: string;
    // Detailed reactions
    praise?: number | null;
    empathy?: number | null;
    appreciation?: number | null;
    interest?: number | null;
  };
  author?: {
    profile_name: string;
    avatar_url: string | null;
    linkedin_url: string;
    linkedin_title: string | null;
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
  support: supportIcon,
  funny: funnyIcon,
};

type ReactionType = keyof typeof reactionIcons;

const ReactionIcon = ({ type }: { type: ReactionType }) => {
  return (
    <div className="h-[18px] w-[18px] rounded-full flex-shrink-0 bg-white ring-[0.8px] ring-white overflow-hidden">
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

  // Get top 3 reactions based on their counts
  const getTopReactions = (): ReactionType[] => {
    const reactionCounts: { type: ReactionType; count: number }[] = [
      { type: 'like', count: post.likes || 0 },
      { type: 'celebrate', count: post.praise || 0 },
      { type: 'love', count: post.appreciation || 0 },
      { type: 'support', count: post.empathy || 0 },
      { type: 'insightful', count: post.interest || 0 },
    ];

    return reactionCounts
      .filter(r => r.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(r => r.type);
  };

  const topReactions = getTopReactions();

  return (
    <Card className="bg-card border border-border/40 rounded-lg shadow-sm hover:shadow-md transition-shadow font-linkedin">
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
                <AvatarImage src={post.avatar_url || author?.avatar_url || undefined} alt={author?.profile_name} />
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
                className="font-semibold text-foreground hover:text-primary hover:underline transition-colors text-[13px] leading-tight block"
              >
                {author?.profile_name || 'Utilisateur inconnu'}
              </a>
              {author?.linkedin_title && (
                <p className="text-xs text-muted-foreground truncate max-w-[200px] mt-0.5">
                  {author.linkedin_title}
                </p>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
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
          <p className="text-[14px] text-foreground whitespace-pre-wrap leading-[1.45] font-normal">
            {displayContent}
            {shouldTruncate && !isExpanded && (
              <>
                ...{' '}
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="text-muted-foreground hover:text-primary hover:underline font-semibold text-[13px]"
                >
                  voir plus
                </button>
              </>
            )}
          </p>
        </div>

        {/* Stats Line */}
        {(totalReactions > 0 || totalComments > 0 || (post.impressions || 0) > 0) && (
          <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {totalReactions > 0 && (
                <>
                  <div className="flex -space-x-1.5">
                    {topReactions.length > 0 ? (
                      topReactions.map((type) => (
                        <ReactionIcon key={type} type={type} />
                      ))
                    ) : (
                      <ReactionIcon type="like" />
                    )}
                  </div>
                  <span className="ml-1.5">{formatNumber(totalReactions)}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {(post.impressions || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{formatNumber(post.impressions)}</span>
                </div>
              )}
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
