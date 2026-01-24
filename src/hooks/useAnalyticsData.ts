import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from './useWorkspace';
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

export function useAnalyticsData() {
  const { workspace } = useWorkspace();

  const { data: overviewKPIs, isLoading: isLoadingKPIs } = useQuery({
    queryKey: ['analytics-overview-kpis', workspace?.id],
    queryFn: async (): Promise<OverviewKPIs> => {
      if (!workspace?.id) {
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
        .eq('workspace_id', workspace.id)
        .gte('linkedin_created_at', thirtyDaysAgo.toISOString().split('T')[0]);

      if (currentError) throw currentError;

      // Get posts for the previous 30-day period (for comparison)
      const { data: previousPosts, error: previousError } = await supabase
        .from('posts')
        .select('id, impressions, linkedin_profiles')
        .eq('workspace_id', workspace.id)
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
    enabled: !!workspace?.id,
    staleTime: 5 * 60 * 1000,
  });

  const { data: trendData, isLoading: isLoadingTrend } = useQuery({
    queryKey: ['analytics-trend-data', workspace?.id],
    queryFn: async (): Promise<TrendDataPoint[]> => {
      if (!workspace?.id) return [];

      const monthsData: TrendDataPoint[] = [];
      const monthKeys = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

      // Get all posts from the last 12 months
      const twelveMonthsAgo = subMonths(new Date(), 12);
      
      const { data: posts, error } = await supabase
        .from('posts')
        .select('id, impressions, linkedin_created_at, linkedin_profiles')
        .eq('workspace_id', workspace.id)
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
    enabled: !!workspace?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Team Activation KPIs
  const { data: teamActivationKPIs, isLoading: isLoadingActivation } = useQuery({
    queryKey: ['analytics-team-activation-kpis', workspace?.id],
    queryFn: async (): Promise<TeamActivationKPIs> => {
      if (!workspace?.id) {
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

      // Get total billable users (connected team members)
      const { data: allUsers, error: usersError } = await supabase
        .from('billable_users')
        .select('id')
        .eq('workspace_id', workspace.id);

      if (usersError) throw usersError;
      const totalTeamMembers = allUsers?.length || 0;

      // Get posts for current period
      const { data: currentPosts, error: currentError } = await supabase
        .from('posts')
        .select('id, linkedin_profiles, linkedin_created_at')
        .eq('workspace_id', workspace.id)
        .gte('linkedin_created_at', thirtyDaysAgo.toISOString().split('T')[0]);

      if (currentError) throw currentError;

      // Get posts for previous period
      const { data: previousPosts, error: previousError } = await supabase
        .from('posts')
        .select('id, linkedin_profiles, linkedin_created_at')
        .eq('workspace_id', workspace.id)
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
    enabled: !!workspace?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Activation trend data (contributors per month)
  const { data: activationTrendData, isLoading: isLoadingActivationTrend } = useQuery({
    queryKey: ['analytics-activation-trend', workspace?.id],
    queryFn: async (): Promise<ActivationTrendDataPoint[]> => {
      if (!workspace?.id) return [];

      const monthsData: ActivationTrendDataPoint[] = [];
      const monthKeys = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

      const twelveMonthsAgo = subMonths(new Date(), 12);
      
      const { data: posts, error } = await supabase
        .from('posts')
        .select('id, linkedin_created_at, linkedin_profiles')
        .eq('workspace_id', workspace.id)
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
    enabled: !!workspace?.id,
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
    isLoading: isLoadingKPIs || isLoadingTrend || isLoadingActivation || isLoadingActivationTrend,
  };
}
