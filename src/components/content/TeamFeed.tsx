import { useTeamFeed } from '@/hooks/useTeamFeed';
import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';

type ViewMode = 'grid' | 'list';

interface TeamFeedProps {
  showBookmarksOnly?: boolean;
  sortBy?: 'recent' | 'impressions' | 'reactions';
  authorFilter?: string;
  viewMode?: ViewMode;
}

export function TeamFeed({ 
  showBookmarksOnly = false,
  sortBy = 'recent',
  authorFilter = 'all',
  viewMode = 'list'
}: TeamFeedProps) {
  const { posts, profiles, bookmarkedPosts, loading, toggleBookmark } = useTeamFeed();

  const filteredAndSortedPosts = posts
    .filter(post => authorFilter === 'all' || post.linkedin_profiles === authorFilter)
    .filter(post => !showBookmarksOnly || bookmarkedPosts.has(post.id))
    .sort((a, b) => {
      switch (sortBy) {
        case 'impressions':
          return (b.impressions || 0) - (a.impressions || 0);
        case 'reactions':
          return (b.reactions || b.likes || 0) - (a.reactions || a.likes || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAndSortedPosts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucun post trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              author={post.linkedin_profiles ? profiles[post.linkedin_profiles] : undefined}
              isBookmarked={bookmarkedPosts.has(post.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}
