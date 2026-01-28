import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { subDays, startOfMonth, subMonths, format } from 'date-fns';

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

export function useAnalyticsData() {
  const { user } = useAuth();

  // Get user's billable_users IDs (LinkedIn profiles)
  const { data: userProfileIds = [], isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['user-profile-ids', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('billable_users')
        .select('id')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data?.map(p => p.id) || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const hasProfiles = userProfileIds.length > 0;

  const { data: overviewKPIs, isLoading: isLoadingKPIs } = useQuery({
    queryKey: ['analytics-overview-kpis', user?.id, userProfileIds],
    queryFn: async (): Promise<OverviewKPIs> => {
      if (!hasProfiles) {
        return {
          totalPosts: { value: 0, change: 0 },
          totalImpressions: { value: 0, change: 0 },
          activeContributors: { value: 0, change: 0 },
          avgPostsPerContributor: { value: 0, change: 0 },
        };
      }

      const now = new Date();
      const thirtyDaysAgo = subDays(now, 30);
      const sixtyDaysAgo = subDays(now, 60);

      // Get posts for the current 30-day period
      const { data: currentPosts, error: currentError } = await supabase
        .from('posts')
        .select('id, impressions, linkedin_profiles')
        .in('linkedin_profiles', userProfileIds)
        .gte('linkedin_created_at', thirtyDaysAgo.toISOString().split('T')[0]);

      if (currentError) throw currentError;

      // Get posts for the previous 30-day period (for comparison)
      const { data: previousPosts, error: previousError } = await supabase
        .from('posts')
        .select('id, impressions, linkedin_profiles')
        .in('linkedin_profiles', userProfileIds)
        .gte('linkedin_created_at', sixtyDaysAgo.toISOString().split('T')[0])
        .lt('linkedin_created_at', thirtyDaysAgo.toISOString().split('T')[0]);

      if (previousError) throw previousError;

      // Calculate current period metrics
      const currentTotalPosts = currentPosts?.length || 0;
      const currentTotalImpressions = Math.round((currentPosts?.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0) || 0) / 100) * 100;
      const currentActiveContributors = new Set(currentPosts?.map(p => p.linkedin_profiles).filter(Boolean)).size;
      const currentAvgPosts = currentActiveContributors > 0 
        ? Math.round((currentTotalPosts / currentActiveContributors) * 10) / 10 
        : 0;

      // Calculate previous period metrics
      const previousTotalPosts = previousPosts?.length || 0;
      const previousTotalImpressions = Math.round((previousPosts?.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0) || 0) / 100) * 100;
      const previousActiveContributors = new Set(previousPosts?.map(p => p.linkedin_profiles).filter(Boolean)).size;
      const previousAvgPosts = previousActiveContributors > 0 
        ? Math.round((previousTotalPosts / previousActiveContributors) * 10) / 10 
        : 0;

      // Calculate percentage changes
      const calcChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 1000) / 10;
      };

      return {
        totalPosts: { 
          value: currentTotalPosts, 
          change: calcChange(currentTotalPosts, previousTotalPosts) 
        },
        totalImpressions: { 
          value: currentTotalImpressions, 
          change: calcChange(currentTotalImpressions, previousTotalImpressions) 
        },
        activeContributors: { 
          value: currentActiveContributors, 
          change: calcChange(currentActiveContributors, previousActiveContributors) 
        },
        avgPostsPerContributor: { 
          value: currentAvgPosts, 
          change: calcChange(currentAvgPosts, previousAvgPosts) 
        },
      };
    },
    enabled: !!user && hasProfiles,
    staleTime: 5 * 60 * 1000,
  });

  const { data: trendData, isLoading: isLoadingTrend } = useQuery({
    queryKey: ['analytics-trend-data', user?.id, userProfileIds],
    queryFn: async (): Promise<TrendDataPoint[]> => {
      if (!hasProfiles) return [];

      const monthsData: TrendDataPoint[] = [];
      const monthKeys = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

      // Get all posts from the last 12 months
      const twelveMonthsAgo = subMonths(new Date(), 12);
      
      const { data: posts, error } = await supabase
        .from('posts')
        .select('id, impressions, linkedin_created_at, linkedin_profiles')
        .in('linkedin_profiles', userProfileIds)
        .gte('linkedin_created_at', twelveMonthsAgo.toISOString().split('T')[0]);

      if (error) throw error;

      // Group by month
      for (let i = 11; i >= 0; i--) {
        const monthDate = subMonths(new Date(), i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = startOfMonth(subMonths(monthDate, -1));
        
        const monthPosts = posts?.filter(p => {
          if (!p.linkedin_created_at) return false;
          const postDate = new Date(p.linkedin_created_at);
          return postDate >= monthStart && postDate < monthEnd;
        }) || [];

        const monthKey = monthKeys[monthDate.getMonth()];
        
        monthsData.push({
          month: monthKey,
          posts: monthPosts.length,
          impressions: monthPosts.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0),
        });
      }

      return monthsData;
    },
    enabled: !!user && hasProfiles,
    staleTime: 5 * 60 * 1000,
  });

  // Team Activation KPIs
  const { data: teamActivationKPIs, isLoading: isLoadingActivation } = useQuery({
    queryKey: ['analytics-team-activation-kpis', user?.id, userProfileIds],
    queryFn: async (): Promise<TeamActivationKPIs> => {
      if (!hasProfiles) {
        return {
          activeContributorsCount: { value: 0, change: 0 },
          activeContributorsPercent: { value: 0, change: 0 },
          postsPerContributor: { value: 0, change: 0 },
          postingRegularity: { value: 0, change: 0 },
        };
      }

      const now = new Date();
      const thirtyDaysAgo = subDays(now, 30);
      const sixtyDaysAgo = subDays(now, 60);

      // Get total billable users for this user
      const { data: allUsers, error: usersError } = await supabase
        .from('billable_users')
        .select('id')
        .eq('user_id', user?.id);

      if (usersError) throw usersError;
      const totalTeamMembers = allUsers?.length || 0;

      // Get posts for current period
      const { data: currentPosts, error: currentError } = await supabase
        .from('posts')
        .select('id, linkedin_profiles, linkedin_created_at')
        .in('linkedin_profiles', userProfileIds)
        .gte('linkedin_created_at', thirtyDaysAgo.toISOString().split('T')[0]);

      if (currentError) throw currentError;

      // Get posts for previous period
      const { data: previousPosts, error: previousError } = await supabase
        .from('posts')
        .select('id, linkedin_profiles, linkedin_created_at')
        .in('linkedin_profiles', userProfileIds)
        .gte('linkedin_created_at', sixtyDaysAgo.toISOString().split('T')[0])
        .lt('linkedin_created_at', thirtyDaysAgo.toISOString().split('T')[0]);

      if (previousError) throw previousError;

      // Current period metrics
      const currentActiveContributors = new Set(currentPosts?.map(p => p.linkedin_profiles).filter(Boolean)).size;
      const currentActivePercent = totalTeamMembers > 0 
        ? Math.round((currentActiveContributors / totalTeamMembers) * 100) 
        : 0;
      const currentPostsPerContributor = currentActiveContributors > 0 
        ? Math.round((currentPosts?.length || 0) / currentActiveContributors * 10) / 10 
        : 0;

      // Previous period metrics
      const previousActiveContributors = new Set(previousPosts?.map(p => p.linkedin_profiles).filter(Boolean)).size;
      const previousActivePercent = totalTeamMembers > 0 
        ? Math.round((previousActiveContributors / totalTeamMembers) * 100) 
        : 0;
      const previousPostsPerContributor = previousActiveContributors > 0 
        ? Math.round((previousPosts?.length || 0) / previousActiveContributors * 10) / 10 
        : 0;

      // Calculate posting regularity (% of contributors who posted at least once per week in last 4 weeks)
      const fourWeeksAgo = subDays(now, 28);
      const weeklyPosts = currentPosts?.filter(p => 
        p.linkedin_created_at && new Date(p.linkedin_created_at) >= fourWeeksAgo
      ) || [];
      
      // Count contributors who posted at least 4 times in 4 weeks (weekly)
      const contributorPostCounts: Record<string, number> = {};
      weeklyPosts.forEach(p => {
        if (p.linkedin_profiles) {
          contributorPostCounts[p.linkedin_profiles] = (contributorPostCounts[p.linkedin_profiles] || 0) + 1;
        }
      });
      const regularContributors = Object.values(contributorPostCounts).filter(count => count >= 4).length;
      const postingRegularity = currentActiveContributors > 0 
        ? Math.round((regularContributors / currentActiveContributors) * 100) 
        : 0;

      const calcChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 1000) / 10;
      };

      return {
        activeContributorsCount: { 
          value: currentActiveContributors, 
          change: calcChange(currentActiveContributors, previousActiveContributors) 
        },
        activeContributorsPercent: { 
          value: currentActivePercent, 
          change: calcChange(currentActivePercent, previousActivePercent) 
        },
        postsPerContributor: { 
          value: currentPostsPerContributor, 
          change: calcChange(currentPostsPerContributor, previousPostsPerContributor) 
        },
        postingRegularity: { 
          value: postingRegularity, 
          change: 0 // No previous period comparison for regularity
        },
      };
    },
    enabled: !!user && hasProfiles,
    staleTime: 5 * 60 * 1000,
  });

  // Activation trend data (contributors per month)
  const { data: activationTrendData, isLoading: isLoadingActivationTrend } = useQuery({
    queryKey: ['analytics-activation-trend', user?.id, userProfileIds],
    queryFn: async (): Promise<ActivationTrendDataPoint[]> => {
      if (!hasProfiles) return [];

      const monthsData: ActivationTrendDataPoint[] = [];
      const monthKeys = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

      const twelveMonthsAgo = subMonths(new Date(), 12);
      
      const { data: posts, error } = await supabase
        .from('posts')
        .select('id, linkedin_created_at, linkedin_profiles')
        .in('linkedin_profiles', userProfileIds)
        .gte('linkedin_created_at', twelveMonthsAgo.toISOString().split('T')[0]);

      if (error) throw error;

      for (let i = 11; i >= 0; i--) {
        const monthDate = subMonths(new Date(), i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = startOfMonth(subMonths(monthDate, -1));
        
        const monthPosts = posts?.filter(p => {
          if (!p.linkedin_created_at) return false;
          const postDate = new Date(p.linkedin_created_at);
          return postDate >= monthStart && postDate < monthEnd;
        }) || [];

        const activeContributors = new Set(monthPosts.map(p => p.linkedin_profiles).filter(Boolean)).size;
        const monthKey = monthKeys[monthDate.getMonth()];
        
        monthsData.push({
          month: monthKey,
          activeContributors,
        });
      }

      return monthsData;
    },
    enabled: !!user && hasProfiles,
    staleTime: 5 * 60 * 1000,
  });

  // Posting heatmap data (real data based on post timestamps)
  const { data: postingHeatmapData, isLoading: isLoadingHeatmap } = useQuery({
    queryKey: ['analytics-posting-heatmap', user?.id, userProfileIds],
    queryFn: async (): Promise<HeatmapCell[]> => {
      if (!hasProfiles) return [];

      const DAYS_KEYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const HOURS_KEYS = ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h'];
      
      // Initialize heatmap grid
      const heatmapGrid: Record<string, Record<string, { count: number; impressions: number }>> = {};
      DAYS_KEYS.forEach(day => {
        heatmapGrid[day] = {};
        HOURS_KEYS.forEach(hour => {
          heatmapGrid[day][hour] = { count: 0, impressions: 0 };
        });
      });

      // Get all posts with their creation timestamps
      const { data: posts, error } = await supabase
        .from('posts')
        .select('id, impressions, linkedin_created_at, created_at')
        .in('linkedin_profiles', userProfileIds);

      if (error) throw error;

      // Group posts by day and hour
      posts?.forEach(post => {
        // Use linkedin_created_at if available, otherwise created_at
        const timestamp = post.linkedin_created_at || post.created_at;
        if (!timestamp) return;

        const date = new Date(timestamp);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hour = date.getHours();

        // Map to our day keys (reorder to start with Lun)
        const dayKey = DAYS_KEYS[dayOfWeek];
        
        // Map hour to closest 2-hour bucket
        let hourKey: string;
        if (hour < 7) hourKey = '6h';
        else if (hour < 9) hourKey = '8h';
        else if (hour < 11) hourKey = '10h';
        else if (hour < 13) hourKey = '12h';
        else if (hour < 15) hourKey = '14h';
        else if (hour < 17) hourKey = '16h';
        else if (hour < 19) hourKey = '18h';
        else hourKey = '20h';

        if (heatmapGrid[dayKey] && heatmapGrid[dayKey][hourKey]) {
          heatmapGrid[dayKey][hourKey].count += 1;
          heatmapGrid[dayKey][hourKey].impressions += Number(post.impressions) || 0;
        }
      });

      // Convert to array format expected by PostingHeatmap
      const result: HeatmapCell[] = [];
      // Reorder days to start with Monday (Lun)
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
    },
    enabled: !!user && hasProfiles,
    staleTime: 5 * 60 * 1000,
  });

  // Reach & Impact KPIs
  const { data: reachKPIs, isLoading: isLoadingReach } = useQuery({
    queryKey: ['analytics-reach-kpis', user?.id, userProfileIds],
    queryFn: async (): Promise<ReachKPIs> => {
      if (!hasProfiles) {
        return {
          totalImpressions: { value: 0, change: 0 },
          avgImpressionsPerPost: { value: 0, change: 0 },
          engagementRate: { value: 0, change: 0 },
          commentRate: { value: 0, change: 0 },
        };
      }

      const now = new Date();
      const thirtyDaysAgo = subDays(now, 30);
      const sixtyDaysAgo = subDays(now, 60);

      // Get posts for current period with engagement metrics
      const { data: currentPosts, error: currentError } = await supabase
        .from('posts')
        .select('id, impressions, reactions, comments, likes, praise, empathy, appreciation, interest')
        .in('linkedin_profiles', userProfileIds)
        .gte('linkedin_created_at', thirtyDaysAgo.toISOString().split('T')[0]);

      if (currentError) throw currentError;

      // Get posts for previous period
      const { data: previousPosts, error: previousError } = await supabase
        .from('posts')
        .select('id, impressions, reactions, comments, likes, praise, empathy, appreciation, interest')
        .in('linkedin_profiles', userProfileIds)
        .gte('linkedin_created_at', sixtyDaysAgo.toISOString().split('T')[0])
        .lt('linkedin_created_at', thirtyDaysAgo.toISOString().split('T')[0]);

      if (previousError) throw previousError;

      // Calculate metrics for current period
      const currentTotalImpressions = currentPosts?.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0) || 0;
      const currentTotalPosts = currentPosts?.length || 0;
      const currentAvgImpressions = currentTotalPosts > 0 ? Math.round(currentTotalImpressions / currentTotalPosts) : 0;
      
      // Total reactions = likes + praise + empathy + appreciation + interest (or use reactions field)
      const currentTotalReactions = currentPosts?.reduce((sum, p) => {
        const reactions = Number(p.reactions) || (
          (Number(p.likes) || 0) + 
          (Number(p.praise) || 0) + 
          (Number(p.empathy) || 0) + 
          (Number(p.appreciation) || 0) + 
          (Number(p.interest) || 0)
        );
        return sum + reactions;
      }, 0) || 0;
      const currentTotalComments = currentPosts?.reduce((sum, p) => sum + (Number(p.comments) || 0), 0) || 0;
      const currentTotalInteractions = currentTotalReactions + currentTotalComments;
      const currentEngagementRate = currentTotalImpressions > 0 
        ? Math.round((currentTotalInteractions / currentTotalImpressions) * 10000) / 100 
        : 0;
      const currentCommentRate = currentTotalInteractions > 0 
        ? Math.round((currentTotalComments / currentTotalInteractions) * 1000) / 10 
        : 0;

      // Calculate metrics for previous period
      const previousTotalImpressions = previousPosts?.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0) || 0;
      const previousTotalPosts = previousPosts?.length || 0;
      const previousAvgImpressions = previousTotalPosts > 0 ? Math.round(previousTotalImpressions / previousTotalPosts) : 0;
      
      const previousTotalReactions = previousPosts?.reduce((sum, p) => {
        const reactions = Number(p.reactions) || (
          (Number(p.likes) || 0) + 
          (Number(p.praise) || 0) + 
          (Number(p.empathy) || 0) + 
          (Number(p.appreciation) || 0) + 
          (Number(p.interest) || 0)
        );
        return sum + reactions;
      }, 0) || 0;
      const previousTotalComments = previousPosts?.reduce((sum, p) => sum + (Number(p.comments) || 0), 0) || 0;
      const previousTotalInteractions = previousTotalReactions + previousTotalComments;
      const previousEngagementRate = previousTotalImpressions > 0 
        ? Math.round((previousTotalInteractions / previousTotalImpressions) * 10000) / 100 
        : 0;
      const previousCommentRate = previousTotalInteractions > 0 
        ? Math.round((previousTotalComments / previousTotalInteractions) * 1000) / 10 
        : 0;

      const calcChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 1000) / 10;
      };

      return {
        totalImpressions: { 
          value: currentTotalImpressions, 
          change: calcChange(currentTotalImpressions, previousTotalImpressions) 
        },
        avgImpressionsPerPost: { 
          value: currentAvgImpressions, 
          change: calcChange(currentAvgImpressions, previousAvgImpressions) 
        },
        engagementRate: { 
          value: currentEngagementRate, 
          change: calcChange(currentEngagementRate, previousEngagementRate) 
        },
        commentRate: { 
          value: currentCommentRate, 
          change: calcChange(currentCommentRate, previousCommentRate) 
        },
      };
    },
    enabled: !!user && hasProfiles,
    staleTime: 5 * 60 * 1000,
  });

  // Reach trend data (impressions + engagement rate per month)
  const { data: reachTrendData, isLoading: isLoadingReachTrend } = useQuery({
    queryKey: ['analytics-reach-trend', user?.id, userProfileIds],
    queryFn: async (): Promise<ReachTrendDataPoint[]> => {
      if (!hasProfiles) return [];

      const monthsData: ReachTrendDataPoint[] = [];
      const monthKeys = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

      const twelveMonthsAgo = subMonths(new Date(), 12);
      
      const { data: posts, error } = await supabase
        .from('posts')
        .select('id, impressions, reactions, comments, likes, praise, empathy, appreciation, interest, linkedin_created_at')
        .in('linkedin_profiles', userProfileIds)
        .gte('linkedin_created_at', twelveMonthsAgo.toISOString().split('T')[0]);

      if (error) throw error;

      for (let i = 11; i >= 0; i--) {
        const monthDate = subMonths(new Date(), i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = startOfMonth(subMonths(monthDate, -1));
        
        const monthPosts = posts?.filter(p => {
          if (!p.linkedin_created_at) return false;
          const postDate = new Date(p.linkedin_created_at);
          return postDate >= monthStart && postDate < monthEnd;
        }) || [];

        const impressions = monthPosts.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0);
        const totalReactions = monthPosts.reduce((sum, p) => {
          const reactions = Number(p.reactions) || (
            (Number(p.likes) || 0) + 
            (Number(p.praise) || 0) + 
            (Number(p.empathy) || 0) + 
            (Number(p.appreciation) || 0) + 
            (Number(p.interest) || 0)
          );
          return sum + reactions;
        }, 0);
        const totalComments = monthPosts.reduce((sum, p) => sum + (Number(p.comments) || 0), 0);
        const totalInteractions = totalReactions + totalComments;
        const engagementRate = impressions > 0 
          ? Math.round((totalInteractions / impressions) * 10000) / 100 
          : 0;

        const monthKey = monthKeys[monthDate.getMonth()];
        
        monthsData.push({
          month: monthKey,
          impressions,
          engagementRate,
        });
      }

      return monthsData;
    },
    enabled: !!user && hasProfiles,
    staleTime: 5 * 60 * 1000,
  });

  // Impressions distribution (posts bucketed by impression ranges)
  const { data: impressionsDistribution, isLoading: isLoadingDistribution } = useQuery({
    queryKey: ['analytics-impressions-distribution', user?.id, userProfileIds],
    queryFn: async (): Promise<ImpressionsDistributionPoint[]> => {
      if (!hasProfiles) return [];

      const { data: posts, error } = await supabase
        .from('posts')
        .select('id, impressions')
        .in('linkedin_profiles', userProfileIds);

      if (error) throw error;

      // Define buckets
      const buckets = [
        { label: '0-1K', min: 0, max: 1000 },
        { label: '1K-2K', min: 1000, max: 2000 },
        { label: '2K-5K', min: 2000, max: 5000 },
        { label: '5K-10K', min: 5000, max: 10000 },
        { label: '10K-20K', min: 10000, max: 20000 },
        { label: '20K+', min: 20000, max: Infinity },
      ];

      const distribution = buckets.map(bucket => {
        const count = posts?.filter(p => {
          const imp = Number(p.impressions) || 0;
          return imp >= bucket.min && imp < bucket.max;
        }).length || 0;
        return { bucket: bucket.label, count };
      });

      return distribution;
    },
    enabled: !!user && hasProfiles,
    staleTime: 5 * 60 * 1000,
  });

  return {
    overviewKPIs: overviewKPIs || {
      totalPosts: { value: 0, change: 0 },
      totalImpressions: { value: 0, change: 0 },
      activeContributors: { value: 0, change: 0 },
      avgPostsPerContributor: { value: 0, change: 0 },
    },
    trendData: trendData || [],
    teamActivationKPIs: teamActivationKPIs || {
      activeContributorsCount: { value: 0, change: 0 },
      activeContributorsPercent: { value: 0, change: 0 },
      postsPerContributor: { value: 0, change: 0 },
      postingRegularity: { value: 0, change: 0 },
    },
    activationTrendData: activationTrendData || [],
    postingHeatmapData: postingHeatmapData || [],
    reachKPIs: reachKPIs || {
      totalImpressions: { value: 0, change: 0 },
      avgImpressionsPerPost: { value: 0, change: 0 },
      engagementRate: { value: 0, change: 0 },
      commentRate: { value: 0, change: 0 },
    },
    reachTrendData: reachTrendData || [],
    impressionsDistribution: impressionsDistribution || [],
    isLoading: isLoadingProfiles || isLoadingKPIs || isLoadingTrend || isLoadingActivation || isLoadingActivationTrend || isLoadingHeatmap || isLoadingReach || isLoadingReachTrend || isLoadingDistribution,
  };
}
