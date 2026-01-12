import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Linkedin, ThumbsUp, Eye, MessageSquare, Heart, PartyPopper } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import slackLogo from "@/assets/slack-logo.png";
import FloatingMetric from "@/components/visuals/FloatingMetric";
import SlackNotificationBubble from "@/components/visuals/SlackNotificationBubble";
import SingleReaction from "@/components/visuals/SingleReaction";

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
      {/* Background elements for depth */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.4]" />
      <div className="absolute -top-20 right-0 w-[700px] h-[700px] bg-primary/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -left-20 w-[600px] h-[600px] bg-destructive/12 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-[140px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
      
      {/* Premium background grid - blurred and behind content */}
      <div className="absolute inset-0 z-0 blur-[0.5px] pointer-events-none hidden lg:block">
        {/* Premium grouped vertical lines - LEFT SIDE */}
        {/* Group 1: 3 lines */}
        <div className="absolute top-0 left-[2%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
        <div className="absolute top-0 left-[3.5%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute top-0 left-[5%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
        
        {/* Group 2: 2 lines */}
        <div className="absolute top-0 left-[12%] w-px h-full bg-gradient-to-t from-primary/18 via-primary/6 to-transparent" />
        <div className="absolute top-0 left-[13.5%] w-px h-full bg-gradient-to-t from-primary/18 via-primary/6 to-transparent" />
        
        {/* Group 3: 4 lines */}
        <div className="absolute top-0 left-[21%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute top-0 left-[22.5%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
        <div className="absolute top-0 left-[24%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute top-0 left-[25.5%] w-px h-full bg-gradient-to-t from-primary/12 via-primary/4 to-transparent" />
        
        {/* Premium grouped vertical lines - RIGHT SIDE (mirrored) */}
        {/* Group 3: 4 lines */}
        <div className="absolute top-0 right-[25.5%] w-px h-full bg-gradient-to-t from-primary/12 via-primary/4 to-transparent" />
        <div className="absolute top-0 right-[24%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute top-0 right-[22.5%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
        <div className="absolute top-0 right-[21%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
        
        {/* Group 2: 2 lines */}
        <div className="absolute top-0 right-[13.5%] w-px h-full bg-gradient-to-t from-primary/18 via-primary/6 to-transparent" />
        <div className="absolute top-0 right-[12%] w-px h-full bg-gradient-to-t from-primary/18 via-primary/6 to-transparent" />
        
        {/* Group 1: 3 lines */}
        <div className="absolute top-0 right-[5%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
        <div className="absolute top-0 right-[3.5%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute top-0 right-[2%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
        
        {/* Premium grouped horizontal lines - TOP */}
        {/* Group 1: 2 lines */}
        <div className="absolute top-[8%] left-0 h-px w-full bg-gradient-to-r from-primary/18 via-transparent to-primary/18" />
        <div className="absolute top-[10%] left-0 h-px w-full bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />
        
        {/* Group 2: 3 lines */}
        <div className="absolute top-[22%] left-0 h-px w-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
        <div className="absolute top-[24%] left-0 h-px w-full bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />
        <div className="absolute top-[26%] left-0 h-px w-full bg-gradient-to-r from-primary/12 via-transparent to-primary/12" />
        
        {/* Premium grouped horizontal lines - BOTTOM */}
        {/* Group 3: 3 lines */}
        <div className="absolute top-[74%] left-0 h-px w-full bg-gradient-to-r from-primary/12 via-transparent to-primary/12" />
        <div className="absolute top-[76%] left-0 h-px w-full bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />
        <div className="absolute top-[78%] left-0 h-px w-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
        
        {/* Group 4: 2 lines */}
        <div className="absolute top-[90%] left-0 h-px w-full bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />
        <div className="absolute top-[92%] left-0 h-px w-full bg-gradient-to-r from-primary/18 via-transparent to-primary/18" />
      </div>
      
      {/* Floating visual elements - HIDDEN FOR NOW
      <FloatingMetric
        icon={ThumbsUp}
        value="+247"
        className="absolute top-[18%] left-[8%] opacity-75 hidden lg:flex"
        animation="float"
        variant="primary"
      />
      <SlackNotificationBubble
        channel="#sales-team"
        message="Paul vient de poster sur LinkedIn! 🔗"
        className="absolute top-[42%] left-[6%] opacity-80 hidden lg:block"
        animation="float-delayed"
      />
      <FloatingMetric
        icon={MessageSquare}
        value="156"
        label="comments"
        className="absolute bottom-[22%] left-[10%] opacity-65 hidden lg:flex"
        animation="float-delayed-2"
      />
      <FloatingMetric
        icon={Eye}
        value="24,782"
        label="impressions"
        className="absolute top-[15%] right-[8%] opacity-70 hidden lg:flex"
        animation="float-delayed"
      />
      <SlackNotificationBubble
        channel="#marketing"
        message="Nouveau post: 2.4k impressions! 🚀"
        className="absolute bottom-[35%] right-[6%] opacity-75 hidden lg:block"
        animation="float-delayed-2"
      />
      <SingleReaction
        icon={ThumbsUp}
        color="#0A66C2"
        className="absolute top-[32%] right-[12%] opacity-70 hidden xl:flex"
        animation="float"
      />
      <SingleReaction
        icon={Heart}
        color="#DF704D"
        className="absolute bottom-[45%] left-[14%] opacity-65 hidden xl:flex"
        animation="float-slow"
      />
      <SingleReaction
        icon={PartyPopper}
        color="#6DAE4F"
        className="absolute bottom-[18%] right-[14%] opacity-60 hidden xl:flex"
        animation="float-delayed"
      />
      */}

      <div className="container mx-auto px-4 relative z-10 -mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/5 border border-primary/10">
            <img src={slackLogo} alt="Slack" className="h-4 w-4" />
            <span className="text-sm font-bold text-primary tracking-wide">
              Leading Employee Influence Slack App
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight" style={{ color: '#1B1B1B' }}>
            {t.title1}
            <br />
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              {t.title2}
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: '#5A5A5A' }}>
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
              <div className="text-sm font-medium" style={{ color: '#5A5A5A' }}>{t.impressions}</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/5 mb-4">
                <img src={slackLogo} alt="Slack" className="h-7 w-7" />
              </div>
              <div className="text-5xl font-bold mb-2 text-primary">
                5min
              </div>
              <div className="text-sm font-medium" style={{ color: '#5A5A5A' }}>{t.setup}</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/5 mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div className="text-5xl font-bold mb-2 text-primary">
                10x
              </div>
              <div className="text-sm font-medium" style={{ color: '#5A5A5A' }}>{t.engagement}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default Hero;
