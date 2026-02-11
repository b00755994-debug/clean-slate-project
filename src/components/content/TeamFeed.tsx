import { useMemo, RefObject } from 'react';
import { useTeamFeed } from '@/hooks/useTeamFeed';
import { useNewPostsBadge } from '@/hooks/useNewPostsBadge';
import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { differenceInDays, isToday } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowUp } from 'lucide-react';

const translations = {
  fr: {
    noPostsFound: 'Aucun post trouvé',
  },
  en: {
    noPostsFound: 'No posts found',
  }
};

type ViewMode = 'grid' | 'list';
type TimePeriod = 'all' | 'today' | 'week' | 'month';

interface TeamFeedProps {
  showBookmarksOnly?: boolean;
  sortBy?: 'recent' | 'impressions' | 'reactions';
  authorFilter?: string;
  viewMode?: ViewMode;
  searchQuery?: string;
  timePeriod?: TimePeriod;
  scrollContainerRef?: RefObject<HTMLDivElement>;
  onStatsChange?: (stats: { 
    totalPosts: number; 
    totalImpressions: number; 
    engagementRate: number; 
    activeMembers: number; 
  }) => void;
}

export function TeamFeed({ 
  showBookmarksOnly = false,
  sortBy = 'recent',
  authorFilter = 'all',
  viewMode = 'list',
  searchQuery = '',
  timePeriod = 'all',
  scrollContainerRef
}: TeamFeedProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const { posts, profiles, bookmarkedPosts, loading, toggleBookmark } = useTeamFeed();
  const { hasNewPosts, loadNewPosts } = useNewPostsBadge();

  // Filter posts by time period
  const filterByTimePeriod = (postDate: Date) => {
    if (timePeriod === 'all') return true;
    const now = new Date();
    switch (timePeriod) {
      case 'today':
        return isToday(postDate);
      case 'week':
        return differenceInDays(now, postDate) <= 7;
      case 'month':
        return differenceInDays(now, postDate) <= 30;
      default:
        return true;
    }
  };

  const filteredAndSortedPosts = useMemo(() => {
    return posts
      .filter(post => authorFilter === 'all' || post.linkedin_profiles === authorFilter)
      .filter(post => !showBookmarksOnly || bookmarkedPosts.has(post.id))
      .filter(post => !searchQuery || post.content?.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(post => {
        if (!post.linkedin_created_at) return timePeriod === 'all';
        return filterByTimePeriod(new Date(post.linkedin_created_at));
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'impressions':
            return (b.impressions || 0) - (a.impressions || 0);
          case 'reactions':
            return (b.reactions || b.likes || 0) - (a.reactions || a.likes || 0);
          default:
            // Posts without linkedin_created_at are sorted last
            const dateA = a.linkedin_created_at ? new Date(a.linkedin_created_at).getTime() : 0;
            const dateB = b.linkedin_created_at ? new Date(b.linkedin_created_at).getTime() : 0;
            return dateB - dateA;
        }
      });
  }, [posts, authorFilter, showBookmarksOnly, bookmarkedPosts, searchQuery, timePeriod, sortBy]);

  // Calculate top performer threshold (top 20% by impressions)
  const topPerformerThreshold = useMemo(() => {
    const postsWithImpressions = posts.filter(p => p.impressions && p.impressions > 0);
    if (postsWithImpressions.length < 5) return Infinity; // Need at least 5 posts
    const sorted = [...postsWithImpressions].sort((a, b) => (b.impressions || 0) - (a.impressions || 0));
    const top20Index = Math.max(0, Math.floor(sorted.length * 0.2) - 1);
    return sorted[top20Index]?.impressions || Infinity;
  }, [posts]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalPosts = filteredAndSortedPosts.length;
    const totalImpressions = filteredAndSortedPosts.reduce((sum, p) => sum + (p.impressions || 0), 0);
    const totalReactions = filteredAndSortedPosts.reduce((sum, p) => sum + (p.reactions || p.likes || 0), 0);
    const engagementRate = totalImpressions > 0 ? (totalReactions / totalImpressions) * 100 : 0;
    const activeMembers = new Set(filteredAndSortedPosts.map(p => p.linkedin_profiles).filter(Boolean)).size;
    
    return { totalPosts, totalImpressions, engagementRate, activeMembers };
  }, [filteredAndSortedPosts]);

  if (loading) {
    return (
      <div className="w-full max-w-[700px] space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card p-4 border border-border/40 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-20 w-full mb-3" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[700px]">
      {hasNewPosts && (
        <button
          onClick={() => {
            scrollContainerRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
            loadNewPosts();
          }}
          className="sticky top-0 z-10 w-full flex items-center justify-center gap-2 
                     bg-primary text-primary-foreground px-4 py-2 rounded-full 
                     shadow-lg cursor-pointer hover:bg-primary/90 mb-2 transition-colors"
        >
          <ArrowUp className="h-4 w-4" />
          New posts
        </button>
      )}
      {filteredAndSortedPosts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border/40">
          <p>{t.noPostsFound}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              author={post.linkedin_profiles ? profiles[post.linkedin_profiles] : undefined}
              isBookmarked={bookmarkedPosts.has(post.id)}
              onToggleBookmark={toggleBookmark}
              isTopPerformer={(post.impressions || 0) >= topPerformerThreshold}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Export stats hook for parent components
export function useTeamFeedStats() {
  const { posts, loading } = useTeamFeed();
  
  const stats = useMemo(() => {
    // Filter posts from the last 30 days (only posts with linkedin_created_at)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPosts = posts.filter(p => {
      if (!p.linkedin_created_at) return false;
      const postDate = new Date(p.linkedin_created_at);
      return postDate >= thirtyDaysAgo;
    });
    
    const totalPosts = recentPosts.length;
    const totalImpressions = recentPosts.reduce((sum, p) => sum + (p.impressions || 0), 0);
    const totalReactions = recentPosts.reduce((sum, p) => sum + (p.reactions || p.likes || 0), 0);
    const engagementRate = totalImpressions > 0 ? (totalReactions / totalImpressions) * 100 : 0;
    const activeMembers = new Set(recentPosts.map(p => p.linkedin_profiles).filter(Boolean)).size;
    
    return { totalPosts, totalImpressions, engagementRate, activeMembers };
  }, [posts]);

  return { stats, loading };
}

