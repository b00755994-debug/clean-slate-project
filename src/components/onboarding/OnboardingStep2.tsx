import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import slackLogo from '@/assets/slack-logo.png';

interface OnboardingStep2Props {
  onNext: () => void;
  onSkip: () => void;
  onConnectSlack: () => Promise<void>;
  isSlackConnected: boolean;
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    title: "Connectez votre Slack",
    description: "Recevez des notifications en temps réel quand vos posts performent",
    benefit1: "Alertes instantanées pour chaque nouveau post",
    benefit2: "Notifications de performance en temps réel",
    benefit3: "Rappels personnalisés pour votre équipe",
    connect: "Connecter Slack",
    connecting: "Connexion...",
    connected: "Slack connecté !",
    connectedDesc: "Vous recevrez désormais des alertes dans votre workspace",
    next: "Continuer",
    skip: "Passer",
  },
  en: {
    title: "Connect your Slack",
    description: "Get real-time notifications when your posts perform",
    benefit1: "Instant alerts for every new post",
    benefit2: "Real-time performance notifications",
    benefit3: "Personalized reminders for your team",
    connect: "Connect Slack",
    connecting: "Connecting...",
    connected: "Slack connected!",
    connectedDesc: "You will now receive alerts in your workspace",
    next: "Continue",
    skip: "Skip",
  },
};

export function OnboardingStep2({ onNext, onSkip, onConnectSlack, isSlackConnected, language }: OnboardingStep2Props) {
  const t = translations[language];
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnectSlack();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-[#4A154B]/10 rounded-2xl flex items-center justify-center mb-4">
          <img src={slackLogo} alt="Slack" className="h-10 w-10" />
        </div>
        <CardTitle className="text-2xl">{t.title}</CardTitle>
        <CardDescription className="text-base">{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
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
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
            <p className="font-semibold text-primary">{t.connected}</p>
            <p className="text-sm text-muted-foreground">{t.connectedDesc}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          {isSlackConnected && (
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
