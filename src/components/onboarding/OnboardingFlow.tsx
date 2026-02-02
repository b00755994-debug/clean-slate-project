import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OnboardingStepper } from './OnboardingStepper';
import { OnboardingStep1, Step1Data } from './OnboardingStep1';
import { OnboardingStepLinkedIn } from './OnboardingStepLinkedIn';
import { OnboardingStepSlack } from './OnboardingStepSlack';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useWorkspace } from '@/hooks/useWorkspace';
import { supabase } from '@/integrations/supabase/client';
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
    'Doit être une URL LinkedIn valide'
  );

const profileNameSchema = z.string()
  .min(1, 'Le nom ne peut pas être vide')
  .max(100, 'Le nom ne peut pas dépasser 100 caractères');

interface LinkedInProfileInput {
  id: string;
  firstName: string;
  lastName: string;
  linkedinUrl: string;
}

const stepLabels = {
  fr: ['Infos', 'Profils', 'Slack'],
  en: ['Info', 'Profiles', 'Slack'],
};

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const { user, profile } = useAuthContext();
  const { workspace, refetch: refetchWorkspace } = useWorkspace();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(workspace?.id ?? null);

  const isSlackConnected = workspace?.is_connected ?? false;

  // Sync workspaceId when workspace loads
  useEffect(() => {
    if (workspace?.id && !workspaceId) {
      setWorkspaceId(workspace.id);
    }
  }, [workspace?.id, workspaceId]);

  // Handle Slack OAuth callback
  useEffect(() => {
    const slackSuccess = searchParams.get('slack_success');
    const slackError = searchParams.get('slack_error');

    if (slackSuccess === 'true') {
      toast.success(language === 'fr' ? 'Slack connecté avec succès !' : 'Slack connected successfully!');
      refetchWorkspace();
      // Clean URL
      searchParams.delete('slack_success');
      setSearchParams(searchParams, { replace: true });
    }

    if (slackError) {
      toast.error(language === 'fr' ? `Erreur Slack: ${slackError}` : `Slack error: ${slackError}`);
      searchParams.delete('slack_error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, refetchWorkspace, language]);

  const handleConnectSlack = async () => {
    const { data, error } = await supabase.functions.invoke('slack-auth', {
      body: { 
        redirectUrl: `${window.location.origin}/onboarding`,
        userId: user?.id 
      }
    });

    if (error) {
      toast.error(language === 'fr' ? 'Erreur lors de la connexion Slack' : 'Error connecting to Slack');
      return;
    }

    if (data?.authUrl) {
      window.location.href = data.authUrl;
    }
  };

  // Create or get workspace for the user
  const ensureWorkspace = async (companyName?: string): Promise<string | null> => {
    if (!user) {
      console.error('[Onboarding] No user found');
      return null;
    }

    console.log('[Onboarding] User authenticated:', user.id, user.email);

    // If we already have a workspace, use it
    if (workspaceId) {
      console.log('[Onboarding] Using existing workspaceId:', workspaceId);
      return workspaceId;
    }

    // Check if user already has a workspace (from useWorkspace hook or DB)
    if (workspace?.id) {
      console.log('[Onboarding] Using workspace from hook:', workspace.id);
      setWorkspaceId(workspace.id);
      return workspace.id;
    }

    // Create a new workspace using RPC function (bypasses PostgREST RLS cache issues)
    const workspaceName = companyName?.trim() || `${user.email}'s Workspace`;
    console.log('[Onboarding] Creating new workspace via RPC:', workspaceName);
    
    const { data: newWorkspaceId, error } = await supabase
      .rpc('create_workspace_for_user', {
        p_workspace_name: workspaceName,
        p_user_id: user.id
      });

    if (error) {
      console.error('[Onboarding] Error creating workspace:', error);
      console.error('[Onboarding] Error code:', error.code);
      console.error('[Onboarding] Error message:', error.message);
      toast.error(language === 'fr' ? 'Erreur lors de la création du workspace' : 'Error creating workspace');
      return null;
    }

    console.log('[Onboarding] Workspace and membership created successfully:', newWorkspaceId);
    setWorkspaceId(newWorkspaceId);
    
    return newWorkspaceId;
  };

  const completeOnboarding = async () => {
    if (!user) return;

    const updateData: Record<string, unknown> = {
      onboarding_completed: true,
    };

    if (step1Data) {
      if (step1Data.companyName) updateData.company_name = step1Data.companyName;
      if (step1Data.jobRole) updateData.job_role = step1Data.jobRole;
      if (step1Data.teamSize) updateData.team_size = step1Data.teamSize;
      if (step1Data.acquisitionChannel) updateData.acquisition_channel = step1Data.acquisitionChannel;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      console.error('Error completing onboarding:', error);
      toast.error(language === 'fr' ? 'Erreur lors de la finalisation' : 'Error completing setup');
      return;
    }

    toast.success(language === 'fr' ? 'Configuration terminée !' : 'Setup complete!');
    window.location.replace('/dashboard');
  };

  // Step 1: User info → Create workspace
  const handleStep1Next = async (data: Step1Data) => {
    setStep1Data(data);
    
    // Create workspace with company name
    const wsId = await ensureWorkspace(data.companyName);
    if (!wsId) {
      toast.error(language === 'fr' ? 'Erreur lors de la création du workspace' : 'Error creating workspace');
      return;
    }
    
    setCurrentStep(2);
  };

  const handleSkipStep1 = async () => {
    // Create workspace with default name even when skipping
    const wsId = await ensureWorkspace();
    if (!wsId) {
      toast.error(language === 'fr' ? 'Erreur lors de la création du workspace' : 'Error creating workspace');
      return;
    }
    
    setCurrentStep(2);
  };

  // Step 2: LinkedIn profiles → Insert billable_users with workspace_id
  const handleStep2Complete = async (profiles: LinkedInProfileInput[]) => {
    if (!workspaceId) {
      toast.error(language === 'fr' ? 'Workspace non trouvé' : 'Workspace not found');
      return;
    }

    // Add LinkedIn profiles with validation
    for (const profile of profiles) {
      const trimmedName = `${profile.firstName} ${profile.lastName}`.trim();
      const trimmedUrl = profile.linkedinUrl.trim();
      
      // Validate before inserting
      try {
        profileNameSchema.parse(trimmedName);
        linkedinUrlSchema.parse(trimmedUrl);
      } catch (e) {
        if (e instanceof z.ZodError) {
          toast.error(e.errors[0].message);
          continue; // Skip invalid profiles
        }
        continue;
      }
      
      const { error } = await supabase.from('billable_users').insert({
        workspace_id: workspaceId,
        profile_name: trimmedName,
        linkedin_url: trimmedUrl,
        slack_user_id: null,
      });

      if (error) {
        console.error('Error adding profile:', error);
      }
    }

    setCurrentStep(3);
  };

  const handleSkipStep2 = () => {
    setCurrentStep(3);
  };

  // Step 3: Slack (optional) → Complete onboarding
  const handleStep3Complete = async () => {
    await completeOnboarding();
  };

  const handleSkipStep3 = async () => {
    await completeOnboarding();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className={`w-full ${currentStep === 2 ? 'max-w-2xl' : 'max-w-lg'}`}>
        {currentStep === 1 && (
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold">
              {language === 'fr' 
                ? 'Bienvenue sur superpump !'
                : 'Welcome to superpump!'
              }
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'fr' 
                ? 'Parlez-nous de vous'
                : 'Tell us more about yourself'
              }
            </p>
          </div>
        )}
        <OnboardingStepper
          currentStep={currentStep}
          totalSteps={3}
          labels={stepLabels[language]}
        />

        <div className="transition-all duration-300">
          {currentStep === 1 && (
            <OnboardingStep1
              onNext={handleStep1Next}
              onSkip={handleSkipStep1}
              language={language}
            />
          )}
          {currentStep === 2 && (
            <OnboardingStepLinkedIn
              onComplete={handleStep2Complete}
              onSkip={handleSkipStep2}
              language={language}
            />
          )}
          {currentStep === 3 && (
            <OnboardingStepSlack
              onNext={handleStep3Complete}
              onSkip={handleSkipStep3}
              onConnectSlack={handleConnectSlack}
              isSlackConnected={isSlackConnected}
              language={language}
            />
          )}
        </div>
      </div>
    </div>
  );
}
