import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { toast } from 'sonner';
import { z } from 'zod';

// Validation schemas for LinkedIn profile data
const linkedinUrlSchema = z.string()
  .min(1, 'URL LinkedIn requise')
  .url('URL invalide')
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' && 
               (parsed.hostname === 'linkedin.com' || 
                parsed.hostname === 'www.linkedin.com' ||
                parsed.hostname.endsWith('.linkedin.com'));
      } catch {
        return false;
      }
    },
    'Doit être une URL LinkedIn valide (https://linkedin.com ou https://www.linkedin.com)'
  );

const profileNameSchema = z.string()
  .min(1, 'Le nom ne peut pas être vide')
  .max(100, 'Le nom ne peut pas dépasser 100 caractères');

interface LinkedInProfile {
  id: string;
  linkedin_url: string;
  profile_name: string | null;
  profile_picture: string | null;
  avatar_url: string | null;
  slack_user_id: string | null;
  followers: number | null;
  scrapping_onboarding_done: boolean | null;
  posts_count?: number;
}

export function useLinkedInProfiles() {
  const { user } = useAuth();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();
  const pollingStartRef = useRef<number | null>(null);
  const prevScrapingStatesRef = useRef<Record<string, boolean | null>>({});

  const { data: linkedinProfiles = [], isLoading } = useQuery({
    queryKey: ['linkedin-profiles', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      
      const { data: profiles, error } = await supabase
        .from('billable_users')
        .select('*')
        .eq('workspace_id', workspace.id);

      if (error) throw error;
      if (!profiles) return [];

      // Get posts count for each profile in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Single query to get post counts for all profiles (eliminates N+1)
      const { data: postCounts, error: postCountsError } = await supabase
        .from('posts')
        .select('linkedin_profiles')
        .eq('workspace_id', workspace.id)
        .gte('linkedin_created_at', thirtyDaysAgo.toISOString());

      // Count posts per profile client-side
      const countsMap: Record<string, number> = {};
      if (!postCountsError && postCounts) {
        postCounts.forEach(p => {
          if (p.linkedin_profiles) {
            countsMap[p.linkedin_profiles] = (countsMap[p.linkedin_profiles] || 0) + 1;
          }
        });
      }

      return profiles.map(p => ({
        ...p,
        posts_count: countsMap[p.id] || 0,
      } as LinkedInProfile));
    },
    enabled: !!user && !!workspace?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: (previousData) => previousData,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;

      // Detect profiles that just finished scraping → invalidate feed caches
      const prevStates = prevScrapingStatesRef.current;
      let anyTransitioned = false;
      const newStates: Record<string, boolean | null> = {};
      data.forEach((p: LinkedInProfile) => {
        newStates[p.id] = p.scrapping_onboarding_done ?? null;
        if (p.scrapping_onboarding_done === true && prevStates[p.id] !== true && prevStates[p.id] !== undefined) {
          anyTransitioned = true;
        }
      });
      prevScrapingStatesRef.current = newStates;

      if (anyTransitioned && workspace?.id) {
        queryClient.invalidateQueries({ queryKey: ['billable-users', workspace.id] });
        queryClient.invalidateQueries({ queryKey: ['billable-users-list', workspace.id] });
        queryClient.invalidateQueries({ queryKey: ['posts', workspace.id] });
        queryClient.invalidateQueries({ queryKey: ['all-posts-leaderboard', workspace.id] });
      }

      const hasIncomplete = data.some(
        (p: LinkedInProfile) => p.scrapping_onboarding_done === false || p.scrapping_onboarding_done === null
      );
      
      if (!hasIncomplete) {
        pollingStartRef.current = null;
        return false;
      }
      
      if (!pollingStartRef.current) {
        pollingStartRef.current = Date.now();
      }
      
      const elapsed = Date.now() - pollingStartRef.current;
      if (elapsed < 180_000) return 3_000;
      return false;
    },
  });

  const addProfileMutation = useMutation({
    mutationFn: async ({
      profileName,
      linkedinUrl,
      slackUserId,
    }: {
      profileName: string;
      linkedinUrl: string;
      slackUserId?: string;
    }) => {
      const trimmedName = profileName.trim();
      const trimmedUrl = linkedinUrl.trim();

      // Client-side limit check (UX guard — server also enforces this)
      const maxUsers = workspace?.max_billable_users ?? 10;
      if (linkedinProfiles.length >= maxUsers) {
        throw new Error(
          `Limite de ${maxUsers} profils atteinte. Passez à Pro pour en suivre davantage.`
        );
      }
      
      try {
        if (trimmedName) {
          profileNameSchema.parse(trimmedName);
        }
        linkedinUrlSchema.parse(trimmedUrl);
      } catch (e) {
        if (e instanceof z.ZodError) {
          throw new Error(e.errors[0].message);
        }
        throw e;
      }

      const { error } = await supabase.rpc('add_billable_user', {
        p_workspace_id: workspace?.id,
        p_profile_name: trimmedName || null,
        p_linkedin_url: trimmedUrl,
        p_slack_user_id: slackUserId || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-profiles', workspace?.id] });
      toast.success('Le profil LinkedIn a été ajouté avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || "Impossible d'ajouter le profil");
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase
        .from('billable_users')
        .delete()
        .eq('id', profileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-profiles', workspace?.id] });
      queryClient.invalidateQueries({ queryKey: ['posts', workspace?.id] });
      toast.success('Le profil LinkedIn a été supprimé');
    },
    onError: () => {
      toast.error('Impossible de supprimer le profil');
    },
  });

  const updateSlackUserMutation = useMutation({
    mutationFn: async ({
      profileId,
      slackUserId,
    }: {
      profileId: string;
      slackUserId: string | null;
    }) => {
      const { error } = await supabase
        .from('billable_users')
        .update({ slack_user_id: slackUserId })
        .eq('id', profileId);

      if (error) throw error;
    },
    onSuccess: (_, { slackUserId }) => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-profiles', workspace?.id] });
      toast.success(
        slackUserId
          ? 'Le profil a été associé à un utilisateur Slack'
          : "L'association Slack a été supprimée"
      );
    },
    onError: () => {
      toast.error("Impossible de mettre à jour l'association Slack");
    },
  });

  const hasPendingScraping = linkedinProfiles.some(
    (p) => p.scrapping_onboarding_done === false || p.scrapping_onboarding_done === null
  );

  // Polling timed out if we have pending profiles but polling has stopped (elapsed >= 180s)
  const pollingTimedOut = hasPendingScraping && pollingStartRef.current !== null && (Date.now() - pollingStartRef.current) >= 180_000;

  return {
    linkedinProfiles,
    isLoading,
    hasPendingScraping,
    pollingTimedOut,
    addProfile: addProfileMutation.mutateAsync,
    isAddingProfile: addProfileMutation.isPending,
    deleteProfile: deleteProfileMutation.mutate,
    updateSlackUser: updateSlackUserMutation.mutate,
  };
}
