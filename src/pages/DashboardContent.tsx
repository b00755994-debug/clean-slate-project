import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TeamFeed, useTeamFeedStats } from '@/components/content/TeamFeed';
import { TeamFeedStats } from '@/components/content/TeamFeedStats';
import { TopPostsLeaderboard } from '@/components/content/TopPostsLeaderboard';
import { ActiveContributorsLeaderboard } from '@/components/content/ActiveContributorsLeaderboard';
import { useLeaderboards } from '@/hooks/useLeaderboards';
import { Newspaper, Bookmark, X, Search, Calendar } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWorkspace } from '@/hooks/useWorkspace';

const translations = {
  fr: {
    subtitle: 'Explorez les posts LinkedIn de votre équipe',
    sortBy: 'Trier par',
    mostRecent: 'Plus récents',
    mostViewed: 'Plus vus',
    mostReactions: 'Plus de réactions',
    allTime: 'Toutes les dates',
    today: "Aujourd'hui",
    thisWeek: 'Cette semaine',
    last30Days: '30 derniers jours',
    filterByAuthor: 'Filtrer par auteur',
    allAuthors: 'Tous les auteurs',
    favorites: 'Favoris',
    clear: 'Effacer',
    search: 'Rechercher...',
  },
  en: {
    subtitle: "Explore your team's LinkedIn posts",
    sortBy: 'Sort by',
    mostRecent: 'Most recent',
    mostViewed: 'Most viewed',
    mostReactions: 'Most reactions',
    allTime: 'All time',
    today: 'Today',
    thisWeek: 'This week',
    last30Days: 'Last 30 days',
    filterByAuthor: 'Filter by author',
    allAuthors: 'All authors',
    favorites: 'Favorites',
    clear: 'Clear',
    search: 'Search...',
  }
};

interface BillableUser {
  id: string;
  profile_name: string;
  profile_picture: string | null;
}

type TimePeriod = 'all' | 'today' | 'week' | 'month';

export default function DashboardContent() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  
  // Team Feed filters
  const [sortBy, setSortBy] = useState<'recent' | 'impressions' | 'reactions'>('recent');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  

  // Get stats
  const { stats, loading: statsLoading } = useTeamFeedStats();

  // Get leaderboards data
  const { topPosts, activeContributors, loading: leaderboardsLoading } = useLeaderboards();

  // Use workspace-scoped query for authors with caching
  const { workspace } = useWorkspace();
  const { data: authors = [] } = useQuery({
    queryKey: ['authors', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      const { data } = await supabase
        .from('billable_users')
        .select('id, profile_name, profile_picture')
        .eq('workspace_id', workspace.id);
      return (data || []) as BillableUser[];
    },
    enabled: !!workspace?.id,
    staleTime: 5 * 60 * 1000,
  });

  const hasActiveFeedFilters = sortBy !== 'recent' || authorFilter !== 'all' || searchQuery !== '' || timePeriod !== 'all';

  const clearFeedFilters = () => {
    setSortBy('recent');
    setAuthorFilter('all');
    setSearchQuery('');
    setTimePeriod('all');
  };

  const timePeriodLabels: Record<TimePeriod, string> = {
    all: t.allTime,
    today: t.today,
    week: t.thisWeek,
    month: t.last30Days,
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Sticky Header */}
        <div className="flex-shrink-0 space-y-4 pb-4 border-b border-border shadow-sm bg-background">
          {/* Header row: Title + Stats in row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Newspaper className="w-8 h-8 text-primary" />
                Team Feed
              </h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>

            {/* Stats Cards - Row aligned right, half width */}
            {!statsLoading && (
              <div className="lg:w-1/2">
                <TeamFeedStats 
                  totalPosts={stats.totalPosts}
                  totalImpressions={stats.totalImpressions}
                  engagementRate={stats.engagementRate}
                  activeMembers={stats.activeMembers}
                  layout="row"
                />
              </div>
            )}
          </div>

          {/* Filters + Search bar on the right */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={sortBy} onValueChange={(v: 'recent' | 'impressions' | 'reactions') => setSortBy(v)}>
              <SelectTrigger className="w-[130px] h-8 text-sm bg-card">
                <SelectValue placeholder={t.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent" className="text-sm">{t.mostRecent}</SelectItem>
                <SelectItem value="impressions" className="text-sm">{t.mostViewed}</SelectItem>
                <SelectItem value="reactions" className="text-sm">{t.mostReactions}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timePeriod} onValueChange={(v: TimePeriod) => setTimePeriod(v)}>
              <SelectTrigger className="w-[160px] h-8 text-sm bg-card">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">{timePeriodLabels.all}</SelectItem>
                <SelectItem value="today" className="text-sm">{timePeriodLabels.today}</SelectItem>
                <SelectItem value="week" className="text-sm">{timePeriodLabels.week}</SelectItem>
                <SelectItem value="month" className="text-sm">{timePeriodLabels.month}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="w-[140px] h-8 text-sm bg-card">
                <SelectValue placeholder={t.filterByAuthor} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">{t.allAuthors}</SelectItem>
                {authors.filter(a => a.profile_name).map(author => (
                  <SelectItem key={author.id} value={author.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      {author.profile_picture ? (
                        <img src={author.profile_picture} alt={author.profile_name || ''} className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-[10px] font-medium text-primary">
                            {(author.profile_name || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span>{author.profile_name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Toggle
              pressed={showBookmarksOnly}
              onPressedChange={setShowBookmarksOnly}
              className="flex items-center gap-1.5 h-8 text-sm px-2"
              aria-label={t.favorites}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.favorites}</span>
            </Toggle>

            {hasActiveFeedFilters && (
              <Button variant="ghost" size="sm" onClick={clearFeedFilters} className="h-8 px-2 text-sm">
                <X className="h-3 w-3 mr-1" />
                {t.clear}
              </Button>
            )}

            {/* Search bar - Right side */}
            <div className="relative w-[240px] ml-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm bg-card"
              />
            </div>
          </div>
        </div>

        {/* Content - Three Column Layout */}
        <div className="flex-1 flex gap-0 pt-4 overflow-hidden">
          {/* Left Column - Top Posts */}
          <div className="hidden xl:block w-[300px] flex-shrink-0 overflow-y-auto pr-2">
            <div className="sticky top-0">
              <TopPostsLeaderboard posts={topPosts} loading={leaderboardsLoading} />
            </div>
          </div>
          
          {/* Left Separator */}
          <div className="hidden xl:block w-px bg-border mx-2 flex-shrink-0" />
          
          {/* Center Column - Feed */}
          <div className="flex-1 xl:max-w-[552px] mx-auto overflow-y-auto pl-2 pr-4">
            <TeamFeed 
              showBookmarksOnly={showBookmarksOnly}
              sortBy={sortBy}
              authorFilter={authorFilter}
              searchQuery={searchQuery}
              timePeriod={timePeriod}
            />
          </div>
          
          {/* Right Separator */}
          <div className="hidden xl:block w-px bg-border mx-2 flex-shrink-0" />
          
          {/* Right Column - Active Contributors */}
          <div className="hidden xl:block w-[300px] flex-shrink-0 overflow-y-auto pl-2">
            <div className="sticky top-0">
              <ActiveContributorsLeaderboard contributors={activeContributors} loading={leaderboardsLoading} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
