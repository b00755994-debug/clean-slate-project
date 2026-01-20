import { Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

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
  if (loading) {
    return (
      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Contributeurs actifs
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
            Contributeurs actifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune activité dans les 30 derniers jours
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Contributeurs actifs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {contributors.map((contributor, index) => (
          <div
            key={contributor.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
          >
            {/* Rank */}
            <span className={`
              flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
              ${index === 0 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
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
                {contributor.postCount} post{contributor.postCount > 1 ? 's' : ''} publié{contributor.postCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ))}

      </CardContent>
    </Card>
  );
}
