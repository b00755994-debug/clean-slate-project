import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TeamFeed } from '@/components/content/TeamFeed';
import { Newspaper, Bookmark, X } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface BillableUser {
  id: string;
  profile_name: string;
}

export default function DashboardContent() {
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  
  // Team Feed filters
  const [sortBy, setSortBy] = useState<'recent' | 'impressions' | 'reactions'>('recent');
  const [authorFilter, setAuthorFilter] = useState<string>('all');

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

  const hasActiveFeedFilters = sortBy !== 'recent' || authorFilter !== 'all';

  const clearFeedFilters = () => {
    setSortBy('recent');
    setAuthorFilter('all');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Sticky Header */}
        <div className="flex-shrink-0 space-y-6 pb-4 border-b border-border shadow-sm bg-background">
          {/* Header with title */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-primary" />
              Team Feed
            </h1>
            <p className="text-muted-foreground">
              Explorez les posts LinkedIn de votre équipe
            </p>
          </div>

          {/* Filters line */}
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
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-4">
          <TeamFeed 
            showBookmarksOnly={showBookmarksOnly}
            sortBy={sortBy}
            authorFilter={authorFilter}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}