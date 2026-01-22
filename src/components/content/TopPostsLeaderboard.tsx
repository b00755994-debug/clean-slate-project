import { Trophy, ExternalLink, MessageCircle, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    topPosts: 'Top Posts',
    noPostsInLast30Days: 'Aucun post dans les 30 derniers jours',
    interactions: 'interactions',
    noContent: 'Pas de contenu',
  },
  en: {
    topPosts: 'Top Posts',
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

function truncateContent(content: string | null, noContentText: string, maxLength: number = 80): string {
  if (!content) return noContentText;
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trim() + '...';
}

export function TopPostsLeaderboard({ posts, loading }: TopPostsLeaderboardProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (loading) {
    return (
      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            {t.topPosts}
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
            {t.topPosts}
          </CardTitle>
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
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          {t.topPosts}
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
                flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shadow-sm
                ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white ring-2 ring-amber-300/50' : ''}
                ${index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white ring-2 ring-slate-200/50' : ''}
                ${index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white ring-2 ring-orange-300/50' : ''}
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
