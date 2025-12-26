import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TeamFeed, SortBy } from '@/components/content/TeamFeed';
import { VettedLibrary } from '@/components/content/VettedLibrary';
import { BookmarksList, BookmarkType } from '@/components/content/BookmarksList';
import { Library, Newspaper, Bookmark } from 'lucide-react';

interface Author {
  id: string;
  profile_name: string;
  avatar_url: string | null;
  linkedin_url: string;
}

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState('feed');
  
  // Feed filters
  const [feedSortBy, setFeedSortBy] = useState<SortBy>('recent');
  const [feedAuthorFilter, setFeedAuthorFilter] = useState('all');
  const [authors, setAuthors] = useState<Author[]>([]);
  
  // Vetted filters
  const [vettedCategoryFilter, setVettedCategoryFilter] = useState('all');
  
  // Bookmark filters
  const [bookmarkFilterType, setBookmarkFilterType] = useState<BookmarkType>('all');

  const handleAuthorsLoaded = useCallback((loadedAuthors: Author[]) => {
    setAuthors(loadedAuthors);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Compact header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Title */}
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Library className="w-6 h-6 text-primary" />
            Content Library
          </h1>
          
          {/* Right: Contextual filters + Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Contextual filters based on active tab */}
            {activeTab === 'feed' && (
              <>
                <Select value={feedSortBy} onValueChange={(v: SortBy) => setFeedSortBy(v)}>
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Plus récents</SelectItem>
                    <SelectItem value="impressions">Plus vus</SelectItem>
                    <SelectItem value="reactions">Plus de réactions</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={feedAuthorFilter} onValueChange={setFeedAuthorFilter}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Auteur" />
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

            {activeTab === 'vetted' && (
              <Select value={vettedCategoryFilter} onValueChange={setVettedCategoryFilter}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="general">Général</SelectItem>
                  <SelectItem value="announcement">Annonce</SelectItem>
                  <SelectItem value="product">Produit</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="event">Événement</SelectItem>
                  <SelectItem value="stats">Chiffres</SelectItem>
                </SelectContent>
              </Select>
            )}

            {activeTab === 'bookmarks' && (
              <Select value={bookmarkFilterType} onValueChange={(v: BookmarkType) => setBookmarkFilterType(v)}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les favoris</SelectItem>
                  <SelectItem value="posts">Posts d'équipe</SelectItem>
                  <SelectItem value="vetted">Contenus validés</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Tabs toggle */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-9">
                <TabsTrigger value="feed" className="flex items-center gap-1.5 px-3">
                  <Newspaper className="h-4 w-4" />
                  <span className="hidden md:inline">Feed</span>
                </TabsTrigger>
                <TabsTrigger value="vetted" className="flex items-center gap-1.5 px-3">
                  <Library className="h-4 w-4" />
                  <span className="hidden md:inline">Vetted</span>
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="flex items-center gap-1.5 px-3">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden md:inline">Favoris</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'feed' && (
          <TeamFeed 
            sortBy={feedSortBy} 
            authorFilter={feedAuthorFilter}
            onAuthorsLoaded={handleAuthorsLoaded}
          />
        )}

        {activeTab === 'vetted' && (
          <VettedLibrary categoryFilter={vettedCategoryFilter} />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksList filterType={bookmarkFilterType} />
        )}
      </div>
    </DashboardLayout>
  );
}
