import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useWorkspace } from './useWorkspace';
import { subDays, startOfMonth, subMonths } from 'date-fns';

interface OverviewKPIs {
  totalPosts: { value: number; change: number };
  totalImpressions: { value: number; change: number };
  activeContributors: { value: number; change: number };
  avgPostsPerContributor: { value: number; change: number };
}

interface TeamActivationKPIs {
  activeContributorsCount: { value: number; change: number };
  activeContributorsPercent: { value: number; change: number };
  postsPerContributor: { value: number; change: number };
  postingRegularity: { value: number; change: number };
}

interface TrendDataPoint {
  month: string;
  posts: number;
  impressions: number;
}

interface ActivationTrendDataPoint {
  month: string;
  activeContributors: number;
}

interface HeatmapCell {
  day: string;
  hour: string;
  count: number;
  impressions: number;
}

interface ReachKPIs {
  totalImpressions: { value: number; change: number };
  avgImpressionsPerPost: { value: number; change: number };
  engagementRate: { value: number; change: number };
  commentRate: { value: number; change: number };
}

interface ReachTrendDataPoint {
  month: string;
  impressions: number;
  engagementRate: number;
}

interface ImpressionsDistributionPoint {
  bucket: string;
  count: number;
}

// Helper to get post date (linkedin_created_at only)
function getPostDate(post: { linkedin_created_at?: string | null }): Date | null {
  return post.linkedin_created_at ? new Date(post.linkedin_created_at) : null;
}

const calcChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
};

const emptyOverviewKPIs: OverviewKPIs = {
  totalPosts: { value: 0, change: 0 },
  totalImpressions: { value: 0, change: 0 },
  activeContributors: { value: 0, change: 0 },
  avgPostsPerContributor: { value: 0, change: 0 },
};

const emptyTeamActivationKPIs: TeamActivationKPIs = {
  activeContributorsCount: { value: 0, change: 0 },
  activeContributorsPercent: { value: 0, change: 0 },
  postsPerContributor: { value: 0, change: 0 },
  postingRegularity: { value: 0, change: 0 },
};

const emptyReachKPIs: ReachKPIs = {
  totalImpressions: { value: 0, change: 0 },
  avgImpressionsPerPost: { value: 0, change: 0 },
  engagementRate: { value: 0, change: 0 },
  commentRate: { value: 0, change: 0 },
};

export function useAnalyticsData() {
  const { user } = useAuth();
  const { workspace } = useWorkspace();

  // Get workspace's billable_users IDs (LinkedIn profiles)
  const { data: userProfileIds = [], isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['user-profile-ids', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      
      const { data, error } = await supabase
        .from('billable_users')
        .select('id')
        .eq('workspace_id', workspace.id);
      
      if (error) throw error;
      return data?.map(p => p.id) || [];
    },
    enabled: !!workspace?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const hasProfiles = userProfileIds.length > 0;

  // Fetch all posts for analytics with explicit limit to avoid 1000-row cap
  const { data: allPosts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ['analytics-all-posts', workspace?.id, userProfileIds],
    queryFn: async () => {
      if (!hasProfiles) return [];
      
      const { data, error } = await supabase
        .from('posts')
        .select('id, impressions, reactions, comments, likes, praise, empathy, appreciation, interest, linkedin_created_at, linkedin_profiles')
        .in('linkedin_profiles', userProfileIds)
        .limit(10000);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!workspace?.id && hasProfiles,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // All derived computations use useMemo instead of useQuery
  const overviewKPIs = useMemo((): OverviewKPIs => {
    if (!hasProfiles || allPosts.length === 0) return emptyOverviewKPIs;

    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    const currentPosts = allPosts.filter(p => {
      const postDate = getPostDate(p);
      return postDate && postDate >= thirtyDaysAgo;
    });

    const previousPosts = allPosts.filter(p => {
      const postDate = getPostDate(p);
      return postDate && postDate >= sixtyDaysAgo && postDate < thirtyDaysAgo;
    });

    const currentTotalPosts = currentPosts.length;
    const currentTotalImpressions = Math.round((currentPosts.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0)) / 100) * 100;
    const currentActiveContributors = new Set(currentPosts.map(p => p.linkedin_profiles).filter(Boolean)).size;
    const currentAvgPosts = currentActiveContributors > 0 
      ? Math.round((currentTotalPosts / currentActiveContributors) * 10) / 10 
      : 0;

    const previousTotalPosts = previousPosts.length;
    const previousTotalImpressions = Math.round((previousPosts.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0)) / 100) * 100;
    const previousActiveContributors = new Set(previousPosts.map(p => p.linkedin_profiles).filter(Boolean)).size;
    const previousAvgPosts = previousActiveContributors > 0 
      ? Math.round((previousTotalPosts / previousActiveContributors) * 10) / 10 
      : 0;

    return {
      totalPosts: { value: currentTotalPosts, change: calcChange(currentTotalPosts, previousTotalPosts) },
      totalImpressions: { value: currentTotalImpressions, change: calcChange(currentTotalImpressions, previousTotalImpressions) },
      activeContributors: { value: currentActiveContributors, change: calcChange(currentActiveContributors, previousActiveContributors) },
      avgPostsPerContributor: { value: currentAvgPosts, change: calcChange(currentAvgPosts, previousAvgPosts) },
    };
  }, [hasProfiles, allPosts]);

  const trendData = useMemo((): TrendDataPoint[] => {
    if (!hasProfiles || allPosts.length === 0) return [];
    const monthsData: TrendDataPoint[] = [];
    const monthKeys = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = startOfMonth(subMonths(monthDate, -1));
      
      const monthPosts = allPosts.filter(p => {
        const postDate = getPostDate(p);
        return postDate && postDate >= monthStart && postDate < monthEnd;
      });

      monthsData.push({
        month: monthKeys[monthDate.getMonth()],
        posts: monthPosts.length,
        impressions: monthPosts.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0),
      });
    }
    return monthsData;
  }, [hasProfiles, allPosts]);

  const teamActivationKPIs = useMemo((): TeamActivationKPIs => {
    if (!hasProfiles) return emptyTeamActivationKPIs;

    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);
    const totalTeamMembers = userProfileIds.length;

    const currentPosts = allPosts.filter(p => {
      const postDate = getPostDate(p);
      return postDate && postDate >= thirtyDaysAgo;
    });

    const previousPosts = allPosts.filter(p => {
      const postDate = getPostDate(p);
      return postDate && postDate >= sixtyDaysAgo && postDate < thirtyDaysAgo;
    });

    const currentActiveContributors = new Set(currentPosts.map(p => p.linkedin_profiles).filter(Boolean)).size;
    const currentActivePercent = totalTeamMembers > 0 ? Math.round((currentActiveContributors / totalTeamMembers) * 100) : 0;
    const currentPostsPerContributor = currentActiveContributors > 0 
      ? Math.round(currentPosts.length / currentActiveContributors * 10) / 10 : 0;

    const previousActiveContributors = new Set(previousPosts.map(p => p.linkedin_profiles).filter(Boolean)).size;
    const previousActivePercent = totalTeamMembers > 0 ? Math.round((previousActiveContributors / totalTeamMembers) * 100) : 0;
    const previousPostsPerContributor = previousActiveContributors > 0 
      ? Math.round(previousPosts.length / previousActiveContributors * 10) / 10 : 0;

    const fourWeeksAgo = subDays(now, 28);
    const weeklyPosts = currentPosts.filter(p => {
      const postDate = getPostDate(p);
      return postDate && postDate >= fourWeeksAgo;
    });
    
    const contributorPostCounts: Record<string, number> = {};
    weeklyPosts.forEach(p => {
      if (p.linkedin_profiles) {
        contributorPostCounts[p.linkedin_profiles] = (contributorPostCounts[p.linkedin_profiles] || 0) + 1;
      }
    });
    const regularContributors = Object.values(contributorPostCounts).filter(count => count >= 4).length;
    const postingRegularity = currentActiveContributors > 0 
      ? Math.round((regularContributors / currentActiveContributors) * 100) : 0;

    return {
      activeContributorsCount: { value: currentActiveContributors, change: calcChange(currentActiveContributors, previousActiveContributors) },
      activeContributorsPercent: { value: currentActivePercent, change: calcChange(currentActivePercent, previousActivePercent) },
      postsPerContributor: { value: currentPostsPerContributor, change: calcChange(currentPostsPerContributor, previousPostsPerContributor) },
      postingRegularity: { value: postingRegularity, change: 0 },
    };
  }, [hasProfiles, allPosts, userProfileIds]);

  const activationTrendData = useMemo((): ActivationTrendDataPoint[] => {
    if (!hasProfiles || allPosts.length === 0) return [];
    const monthsData: ActivationTrendDataPoint[] = [];
    const monthKeys = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = startOfMonth(subMonths(monthDate, -1));
      
      const monthPosts = allPosts.filter(p => {
        const postDate = getPostDate(p);
        return postDate && postDate >= monthStart && postDate < monthEnd;
      });

      monthsData.push({
        month: monthKeys[monthDate.getMonth()],
        activeContributors: new Set(monthPosts.map(p => p.linkedin_profiles).filter(Boolean)).size,
      });
    }
    return monthsData;
  }, [hasProfiles, allPosts]);

  const postingHeatmapData = useMemo((): HeatmapCell[] => {
    if (!hasProfiles || allPosts.length === 0) return [];

    const DAYS_KEYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const HOURS_KEYS = ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h'];
    
    const heatmapGrid: Record<string, Record<string, { count: number; impressions: number }>> = {};
    DAYS_KEYS.forEach(day => {
      heatmapGrid[day] = {};
      HOURS_KEYS.forEach(hour => {
        heatmapGrid[day][hour] = { count: 0, impressions: 0 };
      });
    });

    allPosts.forEach(post => {
      const postDate = getPostDate(post);
      if (!postDate) return;

      const dayKey = DAYS_KEYS[postDate.getDay()];
      const hour = postDate.getHours();
      
      let hourKey: string;
      if (hour < 7) hourKey = '6h';
      else if (hour < 9) hourKey = '8h';
      else if (hour < 11) hourKey = '10h';
      else if (hour < 13) hourKey = '12h';
      else if (hour < 15) hourKey = '14h';
      else if (hour < 17) hourKey = '16h';
      else if (hour < 19) hourKey = '18h';
      else hourKey = '20h';

      if (heatmapGrid[dayKey]?.[hourKey]) {
        heatmapGrid[dayKey][hourKey].count += 1;
        heatmapGrid[dayKey][hourKey].impressions += Number(post.impressions) || 0;
      }
    });

    const result: HeatmapCell[] = [];
    const orderedDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    orderedDays.forEach(day => {
      HOURS_KEYS.forEach(hour => {
        result.push({
          day,
          hour,
          count: heatmapGrid[day][hour].count,
          impressions: heatmapGrid[day][hour].impressions,
        });
      });
    });
    return result;
  }, [hasProfiles, allPosts]);

  const reachKPIs = useMemo((): ReachKPIs => {
    if (!hasProfiles || allPosts.length === 0) return emptyReachKPIs;

    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    const currentPosts = allPosts.filter(p => {
      const postDate = getPostDate(p);
      return postDate && postDate >= thirtyDaysAgo;
    });
    const previousPosts = allPosts.filter(p => {
      const postDate = getPostDate(p);
      return postDate && postDate >= sixtyDaysAgo && postDate < thirtyDaysAgo;
    });

    const getReactions = (p: typeof allPosts[0]) => Number(p.reactions) || (
      (Number(p.likes) || 0) + (Number(p.praise) || 0) + (Number(p.empathy) || 0) + 
      (Number(p.appreciation) || 0) + (Number(p.interest) || 0)
    );

    const currentTotalImpressions = currentPosts.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0);
    const currentAvgImpressions = currentPosts.length > 0 ? Math.round(currentTotalImpressions / currentPosts.length) : 0;
    const currentTotalReactions = currentPosts.reduce((sum, p) => sum + getReactions(p), 0);
    const currentTotalComments = currentPosts.reduce((sum, p) => sum + (Number(p.comments) || 0), 0);
    const currentTotalInteractions = currentTotalReactions + currentTotalComments;
    const currentEngagementRate = currentTotalImpressions > 0 
      ? Math.round((currentTotalInteractions / currentTotalImpressions) * 10000) / 100 : 0;
    const currentCommentRate = currentTotalInteractions > 0 
      ? Math.round((currentTotalComments / currentTotalInteractions) * 1000) / 10 : 0;

    const previousTotalImpressions = previousPosts.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0);
    const previousAvgImpressions = previousPosts.length > 0 ? Math.round(previousTotalImpressions / previousPosts.length) : 0;
    const previousTotalReactions = previousPosts.reduce((sum, p) => sum + getReactions(p), 0);
    const previousTotalComments = previousPosts.reduce((sum, p) => sum + (Number(p.comments) || 0), 0);
    const previousTotalInteractions = previousTotalReactions + previousTotalComments;
    const previousEngagementRate = previousTotalImpressions > 0 
      ? Math.round((previousTotalInteractions / previousTotalImpressions) * 10000) / 100 : 0;
    const previousCommentRate = previousTotalInteractions > 0 
      ? Math.round((previousTotalComments / previousTotalInteractions) * 1000) / 10 : 0;

    return {
      totalImpressions: { value: currentTotalImpressions, change: calcChange(currentTotalImpressions, previousTotalImpressions) },
      avgImpressionsPerPost: { value: currentAvgImpressions, change: calcChange(currentAvgImpressions, previousAvgImpressions) },
      engagementRate: { value: currentEngagementRate, change: calcChange(currentEngagementRate, previousEngagementRate) },
      commentRate: { value: currentCommentRate, change: calcChange(currentCommentRate, previousCommentRate) },
    };
  }, [hasProfiles, allPosts]);

  const reachTrendData = useMemo((): ReachTrendDataPoint[] => {
    if (!hasProfiles || allPosts.length === 0) return [];
    const monthsData: ReachTrendDataPoint[] = [];
    const monthKeys = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    const getReactions = (p: typeof allPosts[0]) => Number(p.reactions) || (
      (Number(p.likes) || 0) + (Number(p.praise) || 0) + (Number(p.empathy) || 0) + 
      (Number(p.appreciation) || 0) + (Number(p.interest) || 0)
    );

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = startOfMonth(subMonths(monthDate, -1));
      
      const monthPosts = allPosts.filter(p => {
        const postDate = getPostDate(p);
        return postDate && postDate >= monthStart && postDate < monthEnd;
      });

      const impressions = monthPosts.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0);
      const totalReactions = monthPosts.reduce((sum, p) => sum + getReactions(p), 0);
      const totalComments = monthPosts.reduce((sum, p) => sum + (Number(p.comments) || 0), 0);
      const engagementRate = impressions > 0 
        ? Math.round(((totalReactions + totalComments) / impressions) * 10000) / 100 : 0;

      monthsData.push({ month: monthKeys[monthDate.getMonth()], impressions, engagementRate });
    }
    return monthsData;
  }, [hasProfiles, allPosts]);

  const impressionsDistribution = useMemo((): ImpressionsDistributionPoint[] => {
    if (!hasProfiles || allPosts.length === 0) return [];
    const buckets = [
      { label: '0-1K', min: 0, max: 1000 },
      { label: '1K-2K', min: 1000, max: 2000 },
      { label: '2K-5K', min: 2000, max: 5000 },
      { label: '5K-10K', min: 5000, max: 10000 },
      { label: '10K-20K', min: 10000, max: 20000 },
      { label: '20K+', min: 20000, max: Infinity },
    ];
    return buckets.map(bucket => ({
      bucket: bucket.label,
      count: allPosts.filter(p => {
        const imp = Number(p.impressions) || 0;
        return imp >= bucket.min && imp < bucket.max;
      }).length,
    }));
  }, [hasProfiles, allPosts]);

  return {
    overviewKPIs,
    trendData,
    teamActivationKPIs,
    activationTrendData,
    postingHeatmapData,
    reachKPIs,
    reachTrendData,
    impressionsDistribution,
    isLoading: isLoadingProfiles || isLoadingPosts,
  };
}
