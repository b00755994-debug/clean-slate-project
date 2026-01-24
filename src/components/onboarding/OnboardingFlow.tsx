import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OnboardingStepper } from './OnboardingStepper';
import { OnboardingStep1, Step1Data } from './OnboardingStep1';
import { OnboardingStep2 } from './OnboardingStep2';
import { OnboardingStep3 } from './OnboardingStep3';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useSlackMembers } from '@/hooks/useSlackMembers';
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
  slackUserId: string | null;
}

const stepLabels = {
  fr: ['Infos', 'Slack', 'Profils'],
  en: ['Info', 'Slack', 'Profiles'],
};

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const { user, profile } = useAuthContext();
  const { workspace, refetch: refetchWorkspace } = useWorkspace();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  const isSlackConnected = workspace?.is_connected ?? false;
  const { data: slackMembers = [] } = useSlackMembers(isSlackConnected);

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
    // AuthContext ne refetch pas automatiquement le profil après cette UPDATE;
    // du coup ProtectedRoute peut re-rediriger vers /onboarding avec un profil encore "stale".
    // Un reload garantit la relecture du profil (onboarding_completed=true) avant d'afficher /dashboard.
    window.location.replace('/dashboard');
  };

  const handleStep1Next = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    setCurrentStep(3);
  };

  const handleStep3Complete = async (profiles: LinkedInProfileInput[]) => {
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
        user_id: user?.id,
        profile_name: trimmedName,
        linkedin_url: trimmedUrl,
        slack_user_id: profile.slackUserId,
      });

      if (error) {
        console.error('Error adding profile:', error);
      }
    }

    await completeOnboarding();
  };

  const handleSkipStep1 = () => {
    setCurrentStep(2);
  };

  const handleSkipStep2 = () => {
    setCurrentStep(3);
  };

  const handleSkipStep3 = async () => {
    await completeOnboarding();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-4">
      <div className={`w-full ${currentStep === 3 ? 'max-w-2xl' : 'max-w-lg'}`}>
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
            <OnboardingStep2
              onNext={handleStep2Next}
              onSkip={handleSkipStep2}
              onConnectSlack={handleConnectSlack}
              isSlackConnected={isSlackConnected}
              language={language}
            />
          )}
          {currentStep === 3 && (
            <OnboardingStep3
              onComplete={handleStep3Complete}
              onSkip={handleSkipStep3}
              slackMembers={slackMembers}
              isSlackConnected={isSlackConnected}
              language={language}
            />
          )}
        </div>
      </div>
    </div>
  );
}
