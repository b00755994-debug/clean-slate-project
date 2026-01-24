import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import slackLogo from '@/assets/slack-logo.png';
import { SlackChannelSelector } from '@/components/slack/SlackChannelSelector';

interface OnboardingStep2Props {
  onNext: () => void;
  onSkip: () => void;
  onConnectSlack: () => Promise<void>;
  isSlackConnected: boolean;
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    // Step 1: Connection
    title: "Connectez votre Slack",
    description: "Recevez des notifications en temps réel quand vos posts performent",
    benefit1: "Alertes instantanées pour chaque nouveau post",
    benefit2: "Notifications de performance en temps réel",
    benefit3: "Rappels personnalisés pour votre équipe",
    connect: "Connecter Slack",
    connecting: "Connexion...",
    connected: "Slack connecté !",
    // Step 2: Channel selection
    channelTitle: "Choisissez un canal",
    channelDescription: "Sélectionnez le canal où Superpump enverra les notifications",
    channelSelected: "Canal configuré !",
    // Navigation
    next: "Continuer",
    skip: "Passer",
    step1: "Connexion",
    step2: "Canal",
  },
  en: {
    // Step 1: Connection
    title: "Connect your Slack",
    description: "Get real-time notifications when your posts perform",
    benefit1: "Instant alerts for every new post",
    benefit2: "Real-time performance notifications",
    benefit3: "Personalized reminders for your team",
    connect: "Connect Slack",
    connecting: "Connecting...",
    connected: "Slack connected!",
    // Step 2: Channel selection
    channelTitle: "Choose a channel",
    channelDescription: "Select the channel where Superpump will send notifications",
    channelSelected: "Channel configured!",
    // Navigation
    next: "Continue",
    skip: "Skip",
    step1: "Connection",
    step2: "Channel",
  },
};

export function OnboardingStep2({ onNext, onSkip, onConnectSlack, isSlackConnected, language }: OnboardingStep2Props) {
  const t = translations[language];
  const [isConnecting, setIsConnecting] = useState(false);
  const [subStep, setSubStep] = useState<1 | 2>(isSlackConnected ? 2 : 1);
  const [channelConfigured, setChannelConfigured] = useState(false);
  const [selectedChannelName, setSelectedChannelName] = useState<string | null>(null);

  // Move to step 2 when Slack gets connected
  useEffect(() => {
    if (isSlackConnected && subStep === 1) {
      setSubStep(2);
    }
  }, [isSlackConnected, subStep]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnectSlack();
    } finally {
      setIsConnecting(false);
    }
  };

  const handleChannelSelected = (channelId: string, channelName: string) => {
    setChannelConfigured(true);
    setSelectedChannelName(channelName);
  };

  const handleSkipChannel = () => {
    // Skip channel selection and continue to next onboarding step
    onNext();
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-[#4A154B]/10 rounded-2xl flex items-center justify-center mb-4">
          <img src={slackLogo} alt="Slack" className="h-10 w-10" />
        </div>
        
        {/* Title changes based on substep */}
        <CardTitle className="text-2xl">
          {subStep === 1 ? t.title : t.channelTitle}
        </CardTitle>
        <CardDescription className="text-base">
          {subStep === 1 ? t.description : t.channelDescription}
        </CardDescription>

        {/* Mini progress indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
              subStep >= 1 ? 'bg-[#4A154B]' : 'bg-muted'
            }`} />
            <span className={`text-xs ${subStep === 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {t.step1}
            </span>
          </div>
          <div className="w-6 h-px bg-border" />
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
              subStep >= 2 ? 'bg-[#4A154B]' : 'bg-muted'
            }`} />
            <span className={`text-xs ${subStep === 2 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {t.step2}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Sub-step 1: Connect Slack */}
        {subStep === 1 && (
          <>
            {!isSlackConnected ? (
              <>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <span className="text-sm">{t.benefit1}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <span className="text-sm">{t.benefit2}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <span className="text-sm">{t.benefit3}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleConnect} 
                  className="w-full bg-[#4A154B] hover:bg-[#3a1039]" 
                  size="lg"
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.connecting}
                    </>
                  ) : (
                    <>
                      <img src={slackLogo} alt="" className="mr-2 h-5 w-5" />
                      {t.connect}
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 py-4 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">{t.connected}</span>
              </div>
            )}
          </>
        )}

        {/* Sub-step 2: Channel Selection */}
        {subStep === 2 && (
          <>
            <SlackChannelSelector
              isConnected={isSlackConnected}
              onChannelSelected={handleChannelSelected}
              language={language}
              compact
            />
            
            {/* Inline success message */}
            {channelConfigured && selectedChannelName && (
              <div className="flex items-center justify-center gap-2 py-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">{t.channelSelected}</span>
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex flex-col gap-3 pt-2">
          {/* Show Continue button when channel is configured or we're done with step 2 */}
          {((subStep === 2 && channelConfigured) || (subStep === 1 && isSlackConnected)) && (
            <Button onClick={onNext} className="w-full" size="lg">
              {t.next}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          {/* Skip button */}
          <div className="flex justify-center mt-2">
            <button 
              onClick={subStep === 2 ? handleSkipChannel : onSkip} 
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground hover:underline transition-colors"
            >
              {t.skip}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
