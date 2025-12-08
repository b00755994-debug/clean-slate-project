import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import slackLogo from "@/assets/slack-logo.png";

const Hero = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title1: "Boostez votre portée sur",
      title2: "LinkedIn",
      subtitle: "Transformez votre équipe en force de frappe LinkedIn, directement depuis Slack. Notifications instantanées, engagement collectif, impact décuplé.",
      joinBeta: "Rejoindre la Beta",
      viewDemo: "On en parle ?",
      impressions: "Impressions LinkedIn",
      engagement: "Engagement d'équipe",
      setup: "Setup Slack complet"
    },
    en: {
      title1: "Supercharge your reach on",
      title2: "LinkedIn",
      subtitle: "Turn your team into a LinkedIn powerhouse, directly from Slack. Instant notifications, built-in analytics, collective engagement.",
      joinBeta: "Join the Beta",
      viewDemo: "Book a call with us",
      impressions: "LinkedIn Impressions",
      engagement: "Team Engagement",
      setup: "Complete Slack Setup"
    }
  };

  const t = translations[language];
  return (
    <section className="relative overflow-hidden pt-0 pb-12 min-h-screen flex items-center bg-background">
      <div className="container mx-auto px-4 relative z-10 -mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/5 border border-primary/10">
            <img src={slackLogo} alt="Slack" className="h-4 w-4" />
            <span className="text-sm font-bold text-primary tracking-wide">
              #1 Employee Influence Slack App
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-foreground">
            {t.title1}
            <br />
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              {t.title2}
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-muted-foreground">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link to="/beta">
              <Button variant="hero" size="lg" className="text-base h-12 px-6">
                {t.joinBeta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/beta">
              <Button variant="outline" size="lg" className="text-base h-12 px-6">
                <span className="text-primary">
                  {t.viewDemo}
                </span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/5 mb-4">
                <Linkedin className="h-7 w-7 text-primary" />
              </div>
              <div className="text-5xl font-bold mb-2 text-primary">
                +350%
              </div>
              <div className="text-sm font-medium text-muted-foreground">{t.impressions}</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/5 mb-4">
                <img src={slackLogo} alt="Slack" className="h-7 w-7" />
              </div>
              <div className="text-5xl font-bold mb-2 text-primary">
                5min
              </div>
              <div className="text-sm font-medium text-muted-foreground">{t.setup}</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/5 mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div className="text-5xl font-bold mb-2 text-primary">
                10x
              </div>
              <div className="text-sm font-medium text-muted-foreground">{t.engagement}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default Hero;
