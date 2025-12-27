import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TeamFeed } from '@/components/content/TeamFeed';
import { VettedLibrary } from '@/components/content/VettedLibrary';
import { Library, Newspaper, Bookmark, Grid3X3, List, Plus, X, Check, ChevronDown } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

type ContentTab = 'feed' | 'vetted';
type ViewMode = 'grid' | 'list';

interface BillableUser {
  id: string;
  profile_name: string;
}

const categories = [
  { value: 'general', label: 'Général' },
  { value: 'announcement', label: 'Annonce' },
  { value: 'product', label: 'Produit' },
  { value: 'culture', label: 'Culture' },
  { value: 'event', label: 'Événement' },
  { value: 'stats', label: 'Chiffres' },
];

export default function DashboardContent() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<ContentTab>('feed');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  
  // Team Feed filters
  const [sortBy, setSortBy] = useState<'recent' | 'impressions' | 'reactions'>('recent');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [authors, setAuthors] = useState<BillableUser[]>([]);

  // Vetted Library filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>('all');
  
  // Shared
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      const { data } = await supabase
        .from('billable_users')
        .select('id, profile_name');
      setAuthors(data || []);
    };
    fetchAuthors();
  }, []);

  const toggleCategory = (value: string) => {
    setSelectedCategories(prev => 
      prev.includes(value) 
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setDateFilter('all');
  };

  const hasActiveFilters = selectedCategories.length > 0 || dateFilter !== 'all';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with title on left and toggle on right */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Library className="w-8 h-8 text-primary" />
              Content Library
            </h1>
            <p className="text-muted-foreground">
              Explorez les posts de votre équipe et les contenus validés par l'entreprise
            </p>
          </div>

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
        </div>

        {/* Filters line: Filtres spécifiques | Toggle grille/liste | Bouton ajouter */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Left side: Specific filters */}
          <div className="flex items-center gap-3 flex-wrap flex-1">
            {activeTab === 'feed' ? (
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
            ) : (
              <>
                {/* Category multi-select dropdown */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="h-10 w-[160px] justify-between border-input bg-background px-3 text-sm font-normal hover:bg-background"
                    >
                      <span className="truncate">
                        {selectedCategories.length > 0 
                          ? `${selectedCategories.length} catégorie${selectedCategories.length > 1 ? 's' : ''}`
                          : 'Catégories'}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 bg-popover" align="start">
                    <Command>
                      <CommandGroup>
                        {categories.map(cat => (
                          <CommandItem
                            key={cat.value}
                            onSelect={() => toggleCategory(cat.value)}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCategories.includes(cat.value) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {cat.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes dates</SelectItem>
                    <SelectItem value="week">7 derniers jours</SelectItem>
                    <SelectItem value="month">30 derniers jours</SelectItem>
                    <SelectItem value="quarter">3 derniers mois</SelectItem>
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

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-3">
                    <X className="h-3 w-3 mr-1" />
                    Effacer
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Right side: View mode toggle + Add button */}
          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as ViewMode)}>
              <ToggleGroupItem value="grid" aria-label="Vue grille">
                <Grid3X3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="Vue liste">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            {activeTab === 'vetted' && isAdmin && (
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'feed' ? (
          <TeamFeed 
            showBookmarksOnly={showBookmarksOnly}
            sortBy={sortBy}
            authorFilter={authorFilter}
            viewMode={viewMode}
          />
        ) : (
          <VettedLibrary 
            showBookmarksOnly={showBookmarksOnly}
            selectedCategories={selectedCategories}
            dateFilter={dateFilter}
            viewMode={viewMode}
            modalOpen={modalOpen}
            onModalOpenChange={setModalOpen}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
