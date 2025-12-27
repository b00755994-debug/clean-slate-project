import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TeamFeed } from '@/components/content/TeamFeed';
import { VettedLibrary } from '@/components/content/VettedLibrary';
import { Library, Newspaper, Bookmark } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

type ContentTab = 'feed' | 'vetted';

interface BillableUser {
  id: string;
  profile_name: string;
}

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState<ContentTab>('feed');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  
  // Team Feed filters
  const [sortBy, setSortBy] = useState<'recent' | 'impressions' | 'reactions'>('recent');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [authors, setAuthors] = useState<BillableUser[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const { data } = await supabase
        .from('billable_users')
        .select('id, profile_name');
      setAuthors(data || []);
    };
    fetchAuthors();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Library className="w-8 h-8 text-primary" />
            Content Library
          </h1>
          <p className="text-muted-foreground">
            Explorez les posts de votre équipe et les contenus validés par l'entreprise
          </p>
        </div>

        {/* Header with tabs on left and filters on right */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <ToggleGroup 
            type="single" 
            value={activeTab} 
            onValueChange={(v) => v && setActiveTab(v as ContentTab)}
            className="bg-muted rounded-lg p-1"
          >
            <ToggleGroupItem value="feed" className="flex items-center gap-2 px-4">
              <Newspaper className="h-4 w-4" />
              <span className="hidden sm:inline">Team Feed</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="vetted" className="flex items-center gap-2 px-4">
              <Library className="h-4 w-4" />
              <span className="hidden sm:inline">Vetted Library</span>
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Filters - right side */}
          <div className="flex items-center gap-3 flex-wrap">
            {activeTab === 'feed' && (
              <>
                <Select value={sortBy} onValueChange={(v: 'recent' | 'impressions' | 'reactions') => setSortBy(v)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Plus récents</SelectItem>
                    <SelectItem value="impressions">Plus vus</SelectItem>
                    <SelectItem value="reactions">Plus de réactions</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={authorFilter} onValueChange={setAuthorFilter}>
                  <SelectTrigger className="w-[160px]">
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
              </>
            )}

            <Toggle
              pressed={showBookmarksOnly}
              onPressedChange={setShowBookmarksOnly}
              className="flex items-center gap-2"
              aria-label="Filtrer les favoris"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Favoris</span>
            </Toggle>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'feed' ? (
          <TeamFeed 
            showBookmarksOnly={showBookmarksOnly}
            sortBy={sortBy}
            authorFilter={authorFilter}
          />
        ) : (
          <VettedLibrary showBookmarksOnly={showBookmarksOnly} />
        )}
      </div>
    </DashboardLayout>
  );
}
