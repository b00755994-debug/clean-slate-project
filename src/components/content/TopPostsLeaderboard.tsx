import { Trophy, ExternalLink, MessageCircle, ThumbsUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    topPosts: 'Top Posts',
    topPostsTooltip: 'Classement basé sur le nombre total d\'interactions (réactions + commentaires) sur les 30 derniers jours glissants',
    noPostsInLast30Days: 'Aucun post dans les 30 derniers jours',
    interactions: 'interactions',
    noContent: 'Pas de contenu',
  },
  en: {
    topPosts: 'Top Posts',
    topPostsTooltip: 'Ranking based on total interactions (reactions + comments) over the last rolling 30 days',
    noPostsInLast30Days: 'No posts in the last 30 days',
    interactions: 'interactions',
    noContent: 'No content',
  }
};

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

function getInitials(name: string | null): string {
  if (!name) return '?';
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

function truncateContent(content: string | null, noContentText: string, maxLength: number = 80): string {
  if (!content) return noContentText;
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trim() + '...';
}

const LeaderboardTitle = ({ t }: { t: typeof translations['fr'] }) => (
  <CardTitle className="text-base font-semibold flex items-center gap-2">
    <Trophy className="h-4 w-4 text-amber-500" />
    {t.topPosts}
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px] text-xs">
          {t.topPostsTooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </CardTitle>
);

export function TopPostsLeaderboard({ posts, loading }: TopPostsLeaderboardProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (loading) {
    return (
      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <LeaderboardTitle t={t} />
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
          <LeaderboardTitle t={t} />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            {t.noPostsInLast30Days}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 h-fit">
      <CardHeader className="pb-3">
        <LeaderboardTitle t={t} />
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
              {truncateContent(post.content, t.noContent)}
            </p>

            {/* Metrics and CTA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <MessageCircle className="h-3 w-3" />
                  {formatNumber(post.interactions)} {t.interactions}
                </span>
              </div>
              {post.url && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary hover:text-primary"
                  asChild
                >
                  <a href={post.url} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <ExternalLink className="h-3.5 w-3.5" />
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
