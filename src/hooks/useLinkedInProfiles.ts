import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface LinkedInProfile {
  id: string;
  linkedin_url: string;
  profile_name: string;
  avatar_url: string | null;
  slack_user_id: string | null;
  posts_count?: number;
}

export function useLinkedInProfiles() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: linkedinProfiles = [], isLoading } = useQuery({
    queryKey: ['linkedin-profiles', user?.id],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('billable_users')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      if (!profiles) return [];

      // Get posts count for each profile in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const profilesWithPosts = await Promise.all(
        profiles.map(async (p) => {
          const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('linkedin_profiles', p.id)
            .gte('created_at', thirtyDaysAgo.toISOString());

          return {
            ...p,
            posts_count: count || 0,
          } as LinkedInProfile;
        })
      );

      return profilesWithPosts;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
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
      const { error } = await supabase.from('billable_users').insert({
        user_id: user?.id,
        profile_name: profileName.trim(),
        linkedin_url: linkedinUrl.trim(),
        slack_user_id: slackUserId || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-profiles', user?.id] });
      toast.success('Le profil LinkedIn a été ajouté avec succès');
    },
    onError: () => {
      toast.error("Impossible d'ajouter le profil");
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
      queryClient.invalidateQueries({ queryKey: ['linkedin-profiles', user?.id] });
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
      queryClient.invalidateQueries({ queryKey: ['linkedin-profiles', user?.id] });
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

  return {
    linkedinProfiles,
    isLoading,
    addProfile: addProfileMutation.mutateAsync,
    isAddingProfile: addProfileMutation.isPending,
    deleteProfile: deleteProfileMutation.mutate,
    updateSlackUser: updateSlackUserMutation.mutate,
  };
}
