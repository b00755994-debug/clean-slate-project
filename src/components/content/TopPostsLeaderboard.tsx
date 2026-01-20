import { Trophy, ExternalLink, MessageCircle, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface TopPost {
  id: string;
  content: string | null;
  url: string | null;
  authorName: string;
  authorAvatar: string | null;
  interactions: number;
  impressions: number;
}

interface TopPostsLeaderboardProps {
  posts: TopPost[];
  loading?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

function truncateContent(content: string | null, maxLength: number = 80): string {
  if (!content) return 'Pas de contenu';
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trim() + '...';
}

export function TopPostsLeaderboard({ posts, loading }: TopPostsLeaderboardProps) {
  if (loading) {
    return (
      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Top Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Top Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun post dans les 30 derniers jours
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Top Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            {/* Rank badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`
                flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                ${index === 0 ? 'bg-amber-500/20 text-amber-600' : ''}
                ${index === 1 ? 'bg-gray-400/20 text-gray-500' : ''}
                ${index === 2 ? 'bg-orange-400/20 text-orange-500' : ''}
              `}>
                {index + 1}
              </span>
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.authorAvatar || undefined} />
                <AvatarFallback className="text-[10px]">
                  {getInitials(post.authorName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-foreground truncate">
                {post.authorName}
              </span>
            </div>

            {/* Post excerpt */}
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {truncateContent(post.content)}
            </p>

            {/* Metrics and CTA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <MessageCircle className="h-3 w-3" />
                  {formatNumber(post.interactions)} interactions
                </span>
              </div>
              {post.url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-primary hover:text-primary"
                  asChild
                >
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
