import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TeamFeed, useTeamFeedStats } from '@/components/content/TeamFeed';
import { TeamFeedStats } from '@/components/content/TeamFeedStats';
import { Newspaper, Bookmark, X, Search, Calendar } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface BillableUser {
  id: string;
  profile_name: string;
}

type TimePeriod = 'all' | 'today' | 'week' | 'month';

export default function DashboardContent() {
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  
  // Team Feed filters
  const [sortBy, setSortBy] = useState<'recent' | 'impressions' | 'reactions'>('recent');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');

  // Get stats
  const { stats, loading: statsLoading } = useTeamFeedStats();

  // Use React Query for authors with caching
  const { data: authors = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const { data } = await supabase
        .from('billable_users')
        .select('id, profile_name');
      return (data || []) as BillableUser[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const hasActiveFeedFilters = sortBy !== 'recent' || authorFilter !== 'all' || searchQuery !== '' || timePeriod !== 'month';

  const clearFeedFilters = () => {
    setSortBy('recent');
    setAuthorFilter('all');
    setSearchQuery('');
    setTimePeriod('month');
  };

  const timePeriodLabels: Record<TimePeriod, string> = {
    all: 'Toutes les dates',
    today: "Aujourd'hui",
    week: 'Cette semaine',
    month: '30 derniers jours',
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Sticky Header */}
        <div className="flex-shrink-0 space-y-4 pb-4 border-b border-border shadow-sm bg-background">
          {/* Header row: Title + Stats 2x2 */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Newspaper className="w-8 h-8 text-primary" />
                Team Feed
              </h1>
              <p className="text-muted-foreground">
                Explorez les posts LinkedIn de votre équipe
              </p>
            </div>

            {/* Stats Cards - 2x2 Grid */}
            {!statsLoading && (
              <TeamFeedStats 
                totalPosts={stats.totalPosts}
                totalImpressions={stats.totalImpressions}
                engagementRate={stats.engagementRate}
                activeMembers={stats.activeMembers}
                layout="grid"
              />
            )}
          </div>

          {/* Filters + Search bar on the right */}
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={sortBy} onValueChange={(v: 'recent' | 'impressions' | 'reactions') => setSortBy(v)}>
              <SelectTrigger className="w-[150px] bg-card">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récents</SelectItem>
                <SelectItem value="impressions">Plus vus</SelectItem>
                <SelectItem value="reactions">Plus de réactions</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timePeriod} onValueChange={(v: TimePeriod) => setTimePeriod(v)}>
              <SelectTrigger className="w-[180px] bg-card">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{timePeriodLabels.all}</SelectItem>
                <SelectItem value="today">{timePeriodLabels.today}</SelectItem>
                <SelectItem value="week">{timePeriodLabels.week}</SelectItem>
                <SelectItem value="month">{timePeriodLabels.month}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="w-[160px] bg-card">
                <SelectValue placeholder="Filtrer par auteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les auteurs</SelectItem>
                {authors.map(author => (
                  <SelectItem key={author.id} value={author.id}>
                    {author.profile_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Toggle
              pressed={showBookmarksOnly}
              onPressedChange={setShowBookmarksOnly}
              className="flex items-center gap-2"
              aria-label="Filtrer les favoris"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Favoris</span>
            </Toggle>

            {hasActiveFeedFilters && (
              <Button variant="ghost" size="sm" onClick={clearFeedFilters} className="h-8 px-3">
                <X className="h-3 w-3 mr-1" />
                Effacer
              </Button>
            )}

            {/* Search bar - Right side */}
            <div className="relative w-[200px] ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-4">
          <TeamFeed 
            showBookmarksOnly={showBookmarksOnly}
            sortBy={sortBy}
            authorFilter={authorFilter}
            searchQuery={searchQuery}
            timePeriod={timePeriod}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
