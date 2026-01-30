import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, TrendingUp, ThumbsUp, Eye, MessageSquare, Heart, PartyPopper, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import slackLogo from "@/assets/slack-logo.png";
import FloatingMetric from "@/components/visuals/FloatingMetric";
import SlackNotificationBubble from "@/components/visuals/SlackNotificationBubble";
import SingleReaction from "@/components/visuals/SingleReaction";
const Hero = () => {
  const {
    language
  } = useLanguage();
  const translations = {
    fr: {
      title1: "Transformez votre équipe",
      title2: "en moteur de croissance.",
      subtitleStart: "Rally your team. Amplify your reach. ",
      subtitleHighlight: "Grow your pipeline.",
      joinBeta: "Rejoindre la Beta",
      viewDemo: "On en parle ?",
      feature1Title: "Slack Alerts",
      feature1Desc: "Notification instantanée à chaque post LinkedIn",
      feature2Title: "Team Feed",
      feature2Desc: "Tous les posts de votre équipe en un seul endroit",
      feature3Title: "Analytics",
      feature3Desc: "Suivez reach, engagement & métriques pipeline",
      feature4Title: "Leaderboard",
      feature4Desc: "Classez et récompensez vos meilleurs ambassadeurs"
    },
    en: {
      title1: "Turn your team into",
      title2: "your growth engine.",
      subtitleStart: "Rally your team. Amplify your reach. ",
      subtitleHighlight: "Grow your pipeline.",
      joinBeta: "Join the Beta",
      viewDemo: "Book a call with us",
      feature1Title: "Slack Alerts",
      feature1Desc: "Instant notification for every LinkedIn post",
      feature2Title: "Team Feed",
      feature2Desc: "All your team's posts in one place",
      feature3Title: "Analytics",
      feature3Desc: "Track reach, engagement & pipeline metrics",
      feature4Title: "Leaderboard",
      feature4Desc: "Rank and reward your top ambassadors"
    }
  };
  const t = translations[language];
  return <section className="relative overflow-hidden pt-0 pb-12 min-h-screen flex items-center bg-transparent">
      
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
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-primary/10" style={{
          backgroundColor: 'color-mix(in srgb, hsl(210 90% 40%) 5%, hsl(340 100% 99%))'
        }}>
            <img src={slackLogo} alt="Slack" className="h-4 w-4" />
            <span className="text-sm font-bold text-primary tracking-wide">5mn Slack Setup</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight" style={{
          color: '#1B1B1B'
        }}>
            <span style={{ color: '#1B1B1B' }}>
              {t.title1}
            </span>
            <br />
            <span style={{ color: '#1B1B1B' }}>your </span>
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              growth engine.
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: '#5A5A5A' }}>
            {t.subtitleStart}
            <span className="bg-primary/15 text-primary px-1.5 py-0.5 rounded-sm font-medium">
              {t.subtitleHighlight}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link to="/auth?mode=signup">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{
                backgroundColor: 'color-mix(in srgb, hsl(210 90% 40%) 5%, hsl(340 100% 99%))'
              }}>
                <img src={slackLogo} alt="Slack" className="h-7 w-7" />
              </div>
              <div className="text-2xl font-bold mb-1 tracking-tight" style={{ color: '#1B1B1B' }}>
                {t.feature1Title}
              </div>
              <div className="text-base" style={{ color: '#4A4A4A' }}>
                {t.feature1Desc}
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{
                backgroundColor: 'color-mix(in srgb, hsl(210 90% 40%) 5%, hsl(340 100% 99%))'
              }}>
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-1 tracking-tight" style={{ color: '#1B1B1B' }}>
                {t.feature2Title}
              </div>
              <div className="text-base" style={{ color: '#4A4A4A' }}>
                {t.feature2Desc}
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{
                backgroundColor: 'color-mix(in srgb, hsl(210 90% 40%) 5%, hsl(340 100% 99%))'
              }}>
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-1 tracking-tight" style={{ color: '#1B1B1B' }}>
                {t.feature3Title}
              </div>
              <div className="text-base" style={{ color: '#4A4A4A' }}>
                {t.feature3Desc}
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{
                backgroundColor: 'color-mix(in srgb, hsl(210 90% 40%) 5%, hsl(340 100% 99%))'
              }}>
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-1 tracking-tight" style={{ color: '#1B1B1B' }}>
                {t.feature4Title}
              </div>
              <div className="text-base" style={{ color: '#4A4A4A' }}>
                {t.feature4Desc}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>;
};
export default Hero;