import { Sparkles } from 'lucide-react';
import { useLeaderboards } from '@/hooks/useLeaderboards';
import { TopPostsLeaderboard } from './TopPostsLeaderboard';
import { ActiveContributorsLeaderboard } from './ActiveContributorsLeaderboard';

export function FeedLeaderboards() {
  const { topPosts, activeContributors, loading } = useLeaderboards();

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Highlights</h2>
        <span className="text-xs text-muted-foreground ml-1">• 30 derniers jours</span>
      </div>
      
      {/* Leaderboards side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TopPostsLeaderboard posts={topPosts} loading={loading} />
        <ActiveContributorsLeaderboard contributors={activeContributors} loading={loading} />
      </div>
    </div>
  );
}
