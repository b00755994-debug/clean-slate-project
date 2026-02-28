import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
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

  const { data, isLoading, isError, refetch } = useQuery<SubscriptionData>({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data as SubscriptionData;
    },
    enabled: !!user,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  // Handle checkout=success param
  useEffect(() => {
    if (searchParams.get('checkout') === 'success' && user) {
      refetch().then(() => {
        queryClient.invalidateQueries({ queryKey: ['workspace', user.id] });
      });
      searchParams.delete('checkout');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, user]);

  // Auto-refetch when user returns from Stripe Customer Portal tab
  useEffect(() => {
    if (!user) return;
    const handleFocus = () => {
      refetch().then(() => {
        queryClient.invalidateQueries({ queryKey: ['workspace', user.id] });
      });
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, refetch, queryClient]);

  const openCustomerPortal = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    if (error) throw error;
    if (data?.url) window.open(data.url, '_blank');
  }, []);

  return {
    subscribed: data?.subscribed ?? false,
    productId: data?.product_id ?? null,
    quantity: data?.quantity ?? null,
    subscriptionEnd: data?.subscription_end ?? null,
    isLoading,
    isError,
    refetch,
    openCustomerPortal,
  };
}
