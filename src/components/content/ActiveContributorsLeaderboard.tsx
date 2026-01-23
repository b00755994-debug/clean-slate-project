import { Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    activeContributors: 'Contributeurs actifs',
    noActivityInLast30Days: 'Aucune activité dans les 30 derniers jours',
    postPublished: 'post publié',
    postsPublished: 'posts publiés',
  },
  en: {
    activeContributors: 'Active Contributors',
    noActivityInLast30Days: 'No activity in the last 30 days',
    postPublished: 'post published',
    postsPublished: 'posts published',
  }
};

interface ActiveContributor {
  id: string;
  name: string;
  avatarUrl: string | null;
  postCount: number;
}

interface ActiveContributorsLeaderboardProps {
  contributors: ActiveContributor[];
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

export function ActiveContributorsLeaderboard({ contributors, loading }: ActiveContributorsLeaderboardProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (loading) {
    return (
      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            {t.activeContributors}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (contributors.length === 0) {
    return (
      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            {t.activeContributors}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            {t.noActivityInLast30Days}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          {t.activeContributors}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contributors.map((contributor, index) => (
          <div
            key={contributor.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            {/* Rank */}
            <span className={`
              flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
              ${index === 0 ? 'bg-amber-500/20 text-amber-600' : ''}
              ${index === 1 ? 'bg-gray-400/20 text-gray-500' : ''}
              ${index === 2 ? 'bg-orange-400/20 text-orange-500' : ''}
              ${index > 2 ? 'bg-muted text-muted-foreground' : ''}
            `}>
              {index + 1}
            </span>

            {/* Avatar */}
            <Avatar className="h-8 w-8">
              <AvatarImage src={contributor.avatarUrl || undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(contributor.name)}
              </AvatarFallback>
            </Avatar>

            {/* Name and post count */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {contributor.name.split(' ')[0]}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {contributor.postCount} {contributor.postCount > 1 ? t.postsPublished : t.postPublished}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
