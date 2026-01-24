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

interface TrendDataPoint {
  month: string;
  posts: number;
  impressions: number;
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
      const currentTotalImpressions = currentPosts?.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0) || 0;
      const currentActiveContributors = new Set(currentPosts?.map(p => p.linkedin_profiles).filter(Boolean)).size;
      const currentAvgPosts = currentActiveContributors > 0 
        ? Math.round((currentTotalPosts / currentActiveContributors) * 10) / 10 
        : 0;

      // Calculate previous period metrics
      const previousTotalPosts = previousPosts?.length || 0;
      const previousTotalImpressions = previousPosts?.reduce((sum, p) => sum + (Number(p.impressions) || 0), 0) || 0;
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

  return {
    overviewKPIs: overviewKPIs || {
      totalPosts: { value: 0, change: 0 },
      totalImpressions: { value: 0, change: 0 },
      activeContributors: { value: 0, change: 0 },
      avgPostsPerContributor: { value: 0, change: 0 },
    },
    trendData: trendData || [],
    isLoading: isLoadingKPIs || isLoadingTrend,
  };
}
