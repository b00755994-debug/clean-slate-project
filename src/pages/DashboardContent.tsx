import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TeamFeed } from '@/components/content/TeamFeed';
import { VettedLibrary } from '@/components/content/VettedLibrary';
import { Library, Newspaper, Bookmark } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toggle } from '@/components/ui/toggle';

type ContentTab = 'feed' | 'vetted';

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState<ContentTab>('feed');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

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

        {/* Header with tabs on left and bookmark filter on right */}
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

          <Toggle
            pressed={showBookmarksOnly}
            onPressedChange={setShowBookmarksOnly}
            className="flex items-center gap-2"
            aria-label="Filtrer les favoris"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Favoris uniquement</span>
          </Toggle>
        </div>

        {/* Content */}
        {activeTab === 'feed' ? (
          <TeamFeed showBookmarksOnly={showBookmarksOnly} />
        ) : (
          <VettedLibrary showBookmarksOnly={showBookmarksOnly} />
        )}
      </div>
    </DashboardLayout>
  );
}
