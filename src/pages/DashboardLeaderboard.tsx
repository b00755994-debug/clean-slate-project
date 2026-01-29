import { Trophy } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useFullLeaderboard, PeriodFilter } from '@/hooks/useFullLeaderboard';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const translations = {
  en: {
    title: 'Leaderboard',
    subtitle: 'Team member ranking by LinkedIn performance',
    rank: 'Rank',
    member: 'Member',
    title_col: 'Title',
    posts: 'Posts',
    impressions: 'Impressions',
    reactions: 'Reactions',
    engagement: 'Engagement',
    all: 'All time',
    month: 'This month',
    '3months': 'Last 3 months',
    '6months': 'Last 6 months',
    noData: 'No team members found',
  },
  fr: {
    title: 'Classement',
    subtitle: 'Classement des membres par performance LinkedIn',
    rank: 'Rang',
    member: 'Membre',
    title_col: 'Titre',
    posts: 'Posts',
    impressions: 'Impressions',
    reactions: 'Réactions',
    engagement: 'Engagement',
    all: 'Toutes les dates',
    month: 'Ce mois',
    '3months': '3 derniers mois',
    '6months': '6 derniers mois',
    noData: 'Aucun membre trouvé',
  },
};

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function RankBadge({ rank }: { rank: number }) {
  const baseClasses = 'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold';
  
  if (rank === 1) {
    return <div className={`${baseClasses} bg-amber-500/20 text-amber-600`}>1</div>;
  }
  if (rank === 2) {
    return <div className={`${baseClasses} bg-gray-400/20 text-gray-500`}>2</div>;
  }
  if (rank === 3) {
    return <div className={`${baseClasses} bg-orange-400/20 text-orange-500`}>3</div>;
  }
  return <div className={`${baseClasses} bg-muted text-muted-foreground`}>{rank}</div>;
}

export default function DashboardLeaderboard() {
  const { language } = useLanguage();
  const t = translations[language];
  const { leaderboard, loading, period, setPeriod } = useFullLeaderboard();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              {t.title}
            </h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
          
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="month">{t.month}</SelectItem>
              <SelectItem value="3months">{t['3months']}</SelectItem>
              <SelectItem value="6months">{t['6months']}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto rounded-lg border border-border/50 bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wide">{t.member}</TableHead>
                <TableHead className="hidden md:table-cell text-xs uppercase tracking-wide">{t.title_col}</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wide">{t.posts}</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wide">{t.impressions}</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wide">{t.reactions}</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wide">{t.engagement}</TableHead>
                <TableHead className="w-14 text-center text-xs uppercase tracking-wide">{t.rank}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-7 h-7 rounded-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-2">
                      <Skeleton className="h-3 w-28" />
                    </TableCell>
                    <TableCell className="py-2"><Skeleton className="h-3 w-6 ml-auto" /></TableCell>
                    <TableCell className="py-2"><Skeleton className="h-3 w-10 ml-auto" /></TableCell>
                    <TableCell className="py-2"><Skeleton className="h-3 w-8 ml-auto" /></TableCell>
                    <TableCell className="py-2"><Skeleton className="h-3 w-10 ml-auto" /></TableCell>
                    <TableCell className="py-2 text-center">
                      <Skeleton className="w-6 h-6 rounded-full mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : leaderboard.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                    {t.noData}
                  </TableCell>
                </TableRow>
              ) : (
                leaderboard.map((entry) => (
                  <TableRow key={entry.id} className="group">
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={entry.avatarUrl || undefined} alt={entry.profileName} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(entry.profileName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm text-foreground">{entry.profileName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm truncate max-w-[180px] py-2">
                      {entry.linkedinTitle || '—'}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium py-2">{entry.postCount}</TableCell>
                    <TableCell className="text-right text-sm font-medium py-2">{formatNumber(entry.impressions)}</TableCell>
                    <TableCell className="text-right text-sm font-medium py-2">{formatNumber(entry.reactions)}</TableCell>
                    <TableCell className="text-right text-sm font-medium py-2">
                      {entry.engagementRate.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <div className="flex justify-center">
                        <RankBadge rank={entry.rank} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
