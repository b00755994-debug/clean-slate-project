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
  profile_name: string;
  avatar_url: string | null;
  slack_user_id: string | null;
  posts_count?: number;
}

export function useLinkedInProfiles() {
  const { user } = useAuth();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

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
    enabled: !!user && !!workspace?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: (previousData) => previousData,
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
      // Validate inputs before database insert
      const trimmedName = profileName.trim();
      const trimmedUrl = linkedinUrl.trim();
      
      try {
        profileNameSchema.parse(trimmedName);
        linkedinUrlSchema.parse(trimmedUrl);
      } catch (e) {
        if (e instanceof z.ZodError) {
          throw new Error(e.errors[0].message);
        }
        throw e;
      }

      const { error } = await supabase.from('billable_users').insert({
        user_id: user?.id,
        workspace_id: workspace?.id,
        profile_name: trimmedName,
        linkedin_url: trimmedUrl,
        slack_user_id: slackUserId || null,
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

  return {
    linkedinProfiles,
    isLoading,
    addProfile: addProfileMutation.mutateAsync,
    isAddingProfile: addProfileMutation.isPending,
    deleteProfile: deleteProfileMutation.mutate,
    updateSlackUser: updateSlackUserMutation.mutate,
  };
}
