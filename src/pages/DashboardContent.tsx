import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamFeed } from '@/components/content/TeamFeed';
import { VettedLibrary } from '@/components/content/VettedLibrary';
import { BookmarksList } from '@/components/content/BookmarksList';
import { Library, Newspaper, Bookmark } from 'lucide-react';

export default function DashboardContent() {
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

        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span className="hidden sm:inline">Team Feed</span>
            </TabsTrigger>
            <TabsTrigger value="vetted" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              <span className="hidden sm:inline">Vetted Library</span>
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">My Bookmarks</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-6">
            <TeamFeed />
          </TabsContent>

          <TabsContent value="vetted" className="mt-6">
            <VettedLibrary />
          </TabsContent>

          <TabsContent value="bookmarks" className="mt-6">
            <BookmarksList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
