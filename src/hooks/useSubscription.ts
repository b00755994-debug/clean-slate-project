import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SubscriptionData {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
  quantity: number | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, refetch } = useQuery<SubscriptionData>({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data as SubscriptionData;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Handle checkout=success param
  useEffect(() => {
    if (searchParams.get('checkout') === 'success' && user) {
      // Refetch subscription to sync workspace
      refetch().then(() => {
        // Invalidate workspace to refresh dashboard
        queryClient.invalidateQueries({ queryKey: ['workspace', user.id] });
      });
      // Clean URL
      searchParams.delete('checkout');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, user]);

  const openCustomerPortal = async () => {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    if (error) throw error;
    if (data?.url) window.open(data.url, '_blank');
  };

  return {
    subscribed: data?.subscribed ?? false,
    productId: data?.product_id ?? null,
    quantity: data?.quantity ?? null,
    subscriptionEnd: data?.subscription_end ?? null,
    isLoading,
    refetch,
    openCustomerPortal,
  };
}
