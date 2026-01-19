import { useLeaderboards } from '@/hooks/useLeaderboards';
import { TopPostsLeaderboard } from './TopPostsLeaderboard';
import { ActiveContributorsLeaderboard } from './ActiveContributorsLeaderboard';

export function FeedLeaderboards() {
  const { topPosts, activeContributors, loading } = useLeaderboards();

  return (
    <div className="space-y-4">
      <TopPostsLeaderboard posts={topPosts} loading={loading} />
      <ActiveContributorsLeaderboard contributors={activeContributors} loading={loading} />
    </div>
  );
}
