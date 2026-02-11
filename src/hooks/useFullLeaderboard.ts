import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/hooks/useWorkspace';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

export interface MonthOption {
  value: string;
  label: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  profileName: string;
  linkedinTitle: string | null;
  avatarUrl: string | null;
  followers: number | null;
  postCount: number;
  impressions: number;
  reactions: number;
  engagementRate: number;
  rankChange: number | null;
}

function getPostDate(post: { linkedin_created_at?: string | null }): Date | null {
  return post.linkedin_created_at ? new Date(post.linkedin_created_at) : null;
}

function calculateRankings(
  posts: Array<{ linkedin_profiles: string | null; linkedin_created_at?: string | null; impressions: number | null; likes: number | null; comments: number | null }>,
  billableUsers: Array<{ id: string }>,
  monthStart: Date,
  monthEnd: Date
): Map<string, number> {
  const userMetrics = new Map<string, { impressions: number; reactions: number }>();

  posts.forEach(post => {
    if (!post.linkedin_profiles) return;
    const postDate = getPostDate(post);
    if (!postDate || !isWithinInterval(postDate, { start: monthStart, end: monthEnd })) return;

    const existing = userMetrics.get(post.linkedin_profiles) || { impressions: 0, reactions: 0 };
    const reactions = (post.likes || 0) + (post.comments || 0);

    userMetrics.set(post.linkedin_profiles, {
      impressions: existing.impressions + (post.impressions || 0),
      reactions: existing.reactions + reactions,
    });
  });

  // Build entries and sort
  const entries = billableUsers
    .map(user => ({
      id: user.id,
      ...userMetrics.get(user.id) || { impressions: 0, reactions: 0 },
    }))
    .sort((a, b) => {
      if (b.impressions !== a.impressions) return b.impressions - a.impressions;
      return b.reactions - a.reactions;
    });

  // Create rank map
  const rankMap = new Map<string, number>();
  entries.forEach((entry, index) => {
    rankMap.set(entry.id, index + 1);
  });

  return rankMap;
}

export function useFullLeaderboard() {
  const { workspace } = useWorkspace();
  const { language } = useLanguage();

  // Generate last 12 months
  const availableMonths = useMemo<MonthOption[]>(() => {
    const months: MonthOption[] = [];
    for (let i = 0; i < 12; i++) {
      const date = subMonths(new Date(), i);
      months.push({
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy', { locale: language === 'fr' ? fr : undefined }),
      });
    }
    return months;
  }, [language]);

  // Default to current month
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));

  const { data: billableUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ['billable-users-list', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      const { data, error } = await supabase
        .from('billable_users')
        .select('id, profile_name, linkedin_title, avatar_url, profile_picture, followers')
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
        .select('id, linkedin_profiles, linkedin_created_at, impressions, likes, comments, reactions')
        .eq('workspace_id', workspace.id)
        .limit(10000);
      if (error) throw error;
      return data || [];
    },
    enabled: !!workspace?.id,
  });

  const leaderboard = useMemo(() => {
    if (!billableUsers || !Array.isArray(billableUsers) || !posts || !Array.isArray(posts)) return [];

    // Parse selected month
    const [year, month] = selectedMonth.split('-').map(Number);
    const currentMonthStart = startOfMonth(new Date(year, month - 1));
    const currentMonthEnd = endOfMonth(new Date(year, month - 1));

    // Previous month
    const prevMonthDate = subMonths(currentMonthStart, 1);
    const prevMonthStart = startOfMonth(prevMonthDate);
    const prevMonthEnd = endOfMonth(prevMonthDate);

    // Calculate rankings for both months
    const previousRanks = calculateRankings(posts, billableUsers, prevMonthStart, prevMonthEnd);

    // Aggregate metrics for current month
    const userMetrics = new Map<string, { postCount: number; impressions: number; reactions: number }>();

    posts.forEach(post => {
      if (!post.linkedin_profiles) return;
      const postDate = getPostDate(post);
      if (!postDate || !isWithinInterval(postDate, { start: currentMonthStart, end: currentMonthEnd })) return;

      const existing = userMetrics.get(post.linkedin_profiles) || { postCount: 0, impressions: 0, reactions: 0 };
      const reactions = (post.likes || 0) + (post.comments || 0);

      userMetrics.set(post.linkedin_profiles, {
        postCount: existing.postCount + 1,
        impressions: existing.impressions + (post.impressions || 0),
        reactions: existing.reactions + reactions,
      });
    });

    // Build leaderboard entries
    const entries: Omit<LeaderboardEntry, 'rank' | 'rankChange'>[] = billableUsers.map(user => {
      const metrics = userMetrics.get(user.id) || { postCount: 0, impressions: 0, reactions: 0 };
      const engagementRate = metrics.impressions > 0
        ? (metrics.reactions / metrics.impressions) * 100
        : 0;

      return {
        id: user.id,
        profileName: user.profile_name,
        linkedinTitle: user.linkedin_title,
        avatarUrl: user.profile_picture || user.avatar_url,
        followers: user.followers,
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

    // Assign ranks and calculate rank change
    return entries.map((entry, index) => {
      const currentRank = index + 1;
      const previousRank = previousRanks.get(entry.id);
      
      // If user had no activity last month, they're "new" in ranking
      let rankChange: number | null = null;
      if (previousRank !== undefined) {
        rankChange = previousRank - currentRank;
      }

      return {
        ...entry,
        rank: currentRank,
        rankChange,
      };
    });
  }, [billableUsers, posts, selectedMonth]);

  return {
    leaderboard,
    loading: loadingUsers || loadingPosts,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
  };
}
