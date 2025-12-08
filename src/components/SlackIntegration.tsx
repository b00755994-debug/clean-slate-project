import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, TrendingUp, Trophy, Share2, Bell, BarChart3, Users, MessageSquare, ThumbsUp, Eye, Smile, Repeat2, Bookmark, Zap, Home, MoreHorizontal } from "lucide-react";
import slackLogo from "@/assets/slack-logo.png";

const SlackIntegration = () => {
  const { language } = useLanguage();
  const [activeChannel, setActiveChannel] = useState("posts");
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);

  const translations = {
    fr: {
      badge: "Intégré avec Slack",
      title1: "Meilleure ",
      title2: "Application Slack",
      title3: "",
      subtitle: "Notifications instantanées, analytics, gamification et gestion de contenu, le tout dans vos canaux Slack préférés.",
      impressionsGenerated: "impressions générées",
      channels: {
        posts: { name: "#superpump-posts", description: "Recevez une alerte instantanée à chaque publication de l'équipe", messages: [] },
        analytics: { name: "#superpump-analytics", description: "Consultez les rapports de performance hebdomadaires et mensuels", messages: [] },
        leaderboard: { name: "#superpump-leaderboard", description: "Suivez les top performers et célébrez les succès de l'équipe", messages: [] },
        share: { name: "#superpump-please-share", description: "Accédez au contenu pré-approuvé prêt à partager sur votre réseau", messages: [] }
      }
    },
    en: {
      badge: "Integrated with Slack",
      title1: "Best-in-class ",
      title2: "Slack",
      title3: " App",
      subtitle: "Instant notifications, analytics, gamification and content management, all in your favorite Slack channels.",
      impressionsGenerated: "impressions generated",
      channels: {
        posts: { name: "#superpump-posts", description: "Get instant alerts when your team posts on LinkedIn", messages: [] },
        analytics: { name: "#superpump-analytics", description: "Access weekly and monthly performance reports", messages: [] },
        leaderboard: { name: "#superpump-leaderboard", description: "Track top performers and celebrate team achievements", messages: [] },
        share: { name: "#superpump-please-share", description: "Access pre-approved content ready to share", messages: [] }
      }
    }
  };

  const t = translations[language];
  const channels = [
    { id: "posts", icon: Bell, data: t.channels.posts },
    { id: "analytics", icon: BarChart3, data: t.channels.analytics },
    { id: "leaderboard", icon: Trophy, data: t.channels.leaderboard },
    { id: "share", icon: Share2, data: t.channels.share }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    const channelIds = ["posts", "analytics", "leaderboard", "share"];
    const currentIndex = channelIds.indexOf(activeChannel);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / 70);
        if (newProgress >= 100) {
          const nextIndex = (currentIndex + 1) % channelIds.length;
          setActiveChannel(channelIds[nextIndex]);
          return 0;
        }
        return newProgress;
      });
    }, 100);
    return () => clearInterval(progressInterval);
  }, [activeChannel, isAutoPlay]);

  const handleChannelClick = (channelId: string) => {
    setIsAutoPlay(false);
    setActiveChannel(channelId);
    setProgress(0);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.title1}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              {t.title2}
            </span>
            {t.title3}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="border-2 border-border bg-card overflow-hidden shadow-lg">
            <div className="flex h-[500px]">
              {/* Left Sidebar */}
              <div className="w-16 bg-[#350D36] flex flex-col items-center py-4 gap-3 border-r border-white/10">
                <button className="flex flex-col items-center gap-1 px-1 py-2 rounded-lg hover:bg-white/10 transition-colors w-full">
                  <Home className="h-5 w-5 text-white" />
                  <span className="text-[9px] text-white font-medium">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 px-1 py-2 rounded-lg hover:bg-white/10 transition-colors w-full">
                  <MessageSquare className="h-5 w-5 text-white" />
                  <span className="text-[9px] text-white font-medium">DMs</span>
                </button>
                <button className="flex flex-col items-center gap-1 px-1 py-2 rounded-lg hover:bg-white/10 transition-colors w-full">
                  <Bell className="h-5 w-5 text-white" />
                  <span className="text-[9px] text-white font-medium">Activity</span>
                </button>
              </div>

              {/* Channel Sidebar */}
              <div className="w-64 bg-[#3F0E40] text-white p-4 flex flex-col border-r border-white/10">
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-1">superpump</h3>
                  <p className="text-sm text-white/70">Workspace</p>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-semibold text-white/50 mb-2 px-2">CHANNELS</div>
                  {channels.map((channel) => {
                    const isActive = activeChannel === channel.id;
                    return (
                      <button
                        key={channel.id}
                        onClick={() => handleChannelClick(channel.id)}
                        className={`relative w-full text-left px-2 py-1.5 rounded flex items-center gap-2 transition-all overflow-hidden ${
                          isActive ? "bg-primary/60 text-white shadow-sm" : "text-white/70 hover:bg-primary/40"
                        }`}
                      >
                        {isActive && isAutoPlay && (
                          <div className="absolute inset-0 bg-primary/40 transition-all" style={{ width: `${progress}%` }} />
                        )}
                        <Hash className="h-4 w-4 flex-shrink-0 relative z-10" />
                        <span className="text-sm truncate flex-1 relative z-10">{channel.data.name.replace('#', '')}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white relative z-10"></span>}
                      </button>
                    );
                  })}
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-white/50 mb-2 px-2">APPS</div>
                    <button className="w-full text-left px-2 py-1.5 rounded flex items-center gap-2 text-white/70 hover:bg-white/10">
                      <div className="w-4 h-4 rounded bg-gradient-to-br from-primary to-destructive flex-shrink-0 flex items-center justify-center">
                        <Zap className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-sm truncate">superpump</span>
                      <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0 h-4 bg-green-500/20 text-green-300 border-none">NEW</Badge>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col bg-background">
                <div className="border-b border-border p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      {channels.find(c => c.id === activeChannel)?.data.name.replace('#', '')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {channels.find(c => c.id === activeChannel)?.data.description}
                    </p>
                  </div>
                  <a href="/beta" className="flex items-center gap-2 px-4 py-2 bg-[#4A154B] hover:bg-[#4A154B]/90 rounded text-sm font-semibold text-white transition-colors shadow-sm">
                    <img src={slackLogo} alt="Slack" className="h-4 w-4" />
                    <span>Add to Slack</span>
                  </a>
                </div>
                <div className="flex-1 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-destructive flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">{language === 'fr' ? 'Découvrez superpump en action' : 'See superpump in action'}</h4>
                    <p className="text-muted-foreground">{language === 'fr' ? 'Rejoignez la beta pour voir toutes les fonctionnalités' : 'Join the beta to see all features'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SlackIntegration;
