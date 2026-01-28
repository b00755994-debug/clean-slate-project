import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import slackLogo from '@/assets/slack-logo.png';
import { SlackChannelSelector } from '@/components/slack/SlackChannelSelector';

interface OnboardingStepSlackProps {
  onNext: () => void;
  onSkip: () => void;
  onConnectSlack: () => Promise<void>;
  isSlackConnected: boolean;
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    title: "Connectez Slack",
    connect: "Connecter Slack",
    connecting: "Connexion...",
    connected: "Slack connecté",
    channelTitle: "Choisissez un canal",
    channelDescription: "C'est ici que superpump enverra les notifications. Vous pourrez le modifier ou le désactiver par la suite.",
    channelConfigured: "Canal configuré",
    next: "Terminer",
    skip: "Passer",
  },
  en: {
    title: "Connect Slack",
    connect: "Connect Slack",
    connecting: "Connecting...",
    connected: "Slack connected",
    channelTitle: "Choose a channel",
    channelDescription: "This is where superpump will send notifications. You can change or disable it later.",
    channelConfigured: "Channel configured",
    next: "Finish",
    skip: "Skip",
  },
};

export function OnboardingStepSlack({ onNext, onSkip, onConnectSlack, isSlackConnected, language }: OnboardingStepSlackProps) {
  const t = translations[language];
  const [isConnecting, setIsConnecting] = useState(false);
  const [channelConfigured, setChannelConfigured] = useState(false);

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
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">
          {isSlackConnected ? t.channelTitle : t.title}
        </CardTitle>
        {isSlackConnected && (
          <p className="text-sm text-muted-foreground mt-2">
            {t.channelDescription}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Not connected: show connect button */}
        {!isSlackConnected && (
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
        )}

        {/* Connected: show channel selector */}
        {isSlackConnected && (
          <>
            <SlackChannelSelector
              isConnected={isSlackConnected}
              onChannelSelected={handleChannelSelected}
              language={language}
              compact
            />
            
            {channelConfigured && (
              <div className="flex items-center justify-center gap-2 py-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">{t.channelConfigured}</span>
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex flex-col gap-3 pt-2">
          {((isSlackConnected && channelConfigured) || isSlackConnected) && (
            <Button onClick={onNext} className="w-full" size="lg">
              {t.next}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          <div className="flex justify-center mt-2">
            <button 
              onClick={onSkip} 
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
