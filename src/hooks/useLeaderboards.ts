import { useMemo } from 'react';
import { useTeamFeed } from '@/hooks/useTeamFeed';
import { differenceInDays } from 'date-fns';

interface TopPost {
  id: string;
  content: string | null;
  url: string | null;
  authorName: string;
  authorAvatar: string | null;
  interactions: number;
  impressions: number;
}

interface ActiveContributor {
  id: string;
  name: string;
  avatarUrl: string | null;
  postCount: number;
}

export function useLeaderboards() {
  const { posts, profiles, loading } = useTeamFeed();

  const { topPosts, activeContributors } = useMemo(() => {
    const now = new Date();
    
    // Filter posts from last 30 days
    const last30DaysPosts = posts.filter(post => {
      const postDate = new Date(post.created_at);
      return differenceInDays(now, postDate) <= 30;
    });

    // Top Posts: ranked by interactions (likes + comments)
    const postsWithMetrics = last30DaysPosts
      .map(post => {
        const interactions = (post.likes || 0) + (post.comments || 0);
        const author = post.linkedin_profiles ? profiles[post.linkedin_profiles] : null;
        // Prioritize post.avatar_url, fallback to author profile
        const avatarUrl = post.avatar_url || author?.avatar_url || null;
        return {
          id: post.id,
          content: post.content,
          url: post.url,
          authorName: author?.profile_name || 'Anonyme',
          authorAvatar: avatarUrl,
          interactions,
          impressions: post.impressions || 0,
        };
      })
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 3);

    // Active Contributors: ranked by number of posts (NOT engagement)
    const contributorMap = new Map<string, { name: string; avatarUrl: string | null; postCount: number }>();
    
    last30DaysPosts.forEach(post => {
      if (!post.linkedin_profiles) return;
      const author = profiles[post.linkedin_profiles];
      if (!author) return;

      const existing = contributorMap.get(post.linkedin_profiles);
      if (existing) {
        existing.postCount += 1;
        // Update avatar if we find one from post and don't have one yet
        if (!existing.avatarUrl && post.avatar_url) {
          existing.avatarUrl = post.avatar_url;
        }
      } else {
        // Prioritize post.avatar_url, fallback to author profile
        contributorMap.set(post.linkedin_profiles, {
          name: author.profile_name,
          avatarUrl: post.avatar_url || author.avatar_url,
          postCount: 1,
        });
      }
    });

    const contributors: ActiveContributor[] = Array.from(contributorMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 3);

    return {
      topPosts: postsWithMetrics as TopPost[],
      activeContributors: contributors,
    };
  }, [posts, profiles]);

  return {
    topPosts,
    activeContributors,
    loading,
  };
}
