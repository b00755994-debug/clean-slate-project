import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/hooks/useWorkspace';
import { startOfMonth, subMonths, isAfter } from 'date-fns';

export type PeriodFilter = 'all' | 'month' | '3months' | '6months';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  profileName: string;
  linkedinTitle: string | null;
  avatarUrl: string | null;
  postCount: number;
  impressions: number;
  reactions: number;
  engagementRate: number;
}

function getPostDate(post: { linkedin_created_at?: string | null; created_at?: string | null }): Date | null {
  const dateStr = post.linkedin_created_at || post.created_at;
  return dateStr ? new Date(dateStr) : null;
}

function getPeriodStartDate(period: PeriodFilter): Date | null {
  const now = new Date();
  switch (period) {
    case 'month':
      return startOfMonth(now);
    case '3months':
      return startOfMonth(subMonths(now, 2));
    case '6months':
      return startOfMonth(subMonths(now, 5));
    case 'all':
    default:
      return null;
  }
}

export function useFullLeaderboard() {
  const { workspace } = useWorkspace();
  const [period, setPeriod] = useState<PeriodFilter>('all');

  const { data: billableUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ['billable-users', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      const { data, error } = await supabase
        .from('billable_users')
        .select('id, profile_name, linkedin_title, avatar_url, profile_picture')
        .eq('workspace_id', workspace.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!workspace?.id,
  });

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ['all-posts-leaderboard', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      const { data, error } = await supabase
        .from('posts')
        .select('id, linkedin_profiles, linkedin_created_at, created_at, impressions, likes, comments, reactions')
        .eq('workspace_id', workspace.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!workspace?.id,
  });

  const leaderboard = useMemo(() => {
    if (!Array.isArray(billableUsers) || !Array.isArray(posts)) return [];

    const periodStart = getPeriodStartDate(period);

    // Filter posts by period
    const filteredPosts = posts.filter(post => {
      if (!periodStart) return true;
      const postDate = getPostDate(post);
      return postDate && isAfter(postDate, periodStart);
    });

    // Aggregate metrics per user
    const userMetrics = new Map<string, { postCount: number; impressions: number; reactions: number }>();

    filteredPosts.forEach(post => {
      if (!post.linkedin_profiles) return;
      
      const existing = userMetrics.get(post.linkedin_profiles) || { postCount: 0, impressions: 0, reactions: 0 };
      const reactions = (post.likes || 0) + (post.comments || 0);
      
      userMetrics.set(post.linkedin_profiles, {
        postCount: existing.postCount + 1,
        impressions: existing.impressions + (post.impressions || 0),
        reactions: existing.reactions + reactions,
      });
    });

    // Build leaderboard entries
    const entries: Omit<LeaderboardEntry, 'rank'>[] = billableUsers.map(user => {
      const metrics = userMetrics.get(user.id) || { postCount: 0, impressions: 0, reactions: 0 };
      const engagementRate = metrics.impressions > 0 
        ? (metrics.reactions / metrics.impressions) * 100 
        : 0;

      return {
        id: user.id,
        profileName: user.profile_name,
        linkedinTitle: user.linkedin_title,
        avatarUrl: user.profile_picture || user.avatar_url,
        postCount: metrics.postCount,
        impressions: metrics.impressions,
        reactions: metrics.reactions,
        engagementRate,
      };
    });

    // Sort by impressions (primary), then by reactions (secondary)
    entries.sort((a, b) => {
      if (b.impressions !== a.impressions) return b.impressions - a.impressions;
      return b.reactions - a.reactions;
    });

    // Assign ranks
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }, [billableUsers, posts, period]);

  return {
    leaderboard,
    loading: loadingUsers || loadingPosts,
    period,
    setPeriod,
  };
}
