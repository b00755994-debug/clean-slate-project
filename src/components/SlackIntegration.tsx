import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Hash, 
  ChevronDown, 
  Plus, 
  MessageSquare, 
  Bell, 
  MoreHorizontal, 
  Home, 
  Search,
  Bookmark,
  Send,
  Smile,
  AtSign,
  Paperclip,
  Mic,
  Video,
  BarChart2,
  Trophy,
  Share2,
  ThumbsUp,
  Heart,
  Laugh,
  Star,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Repeat2,
  Award,
  Crown,
  Medal,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";
import slackLogo from "@/assets/slack-logo.png";

const SlackIntegration = () => {
  const { language } = useLanguage();
  const [activeChannel, setActiveChannel] = useState("posts");
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);

  const translations = {
    fr: {
      title: "Intégré directement dans Slack",
      subtitle: "Recevez vos notifications LinkedIn là où vous travaillez déjà",
      channels: {
        posts: "Publications",
        analytics: "Statistiques", 
        leaderboard: "Classement",
        share: "Partager"
      },
      channelDescriptions: {
        posts: "Notifications en temps réel de vos publications LinkedIn",
        analytics: "Statistiques détaillées de vos performances",
        leaderboard: "Classement de votre équipe",
        share: "Partagez du contenu pré-approuvé"
      },
      newPost: "Nouvelle publication LinkedIn",
      viewOnLinkedIn: "Voir sur LinkedIn",
      impressions: "impressions",
      reactions: "réactions",
      comments: "commentaires",
      shares: "partages",
      thisWeek: "Cette semaine",
      vsLastWeek: "vs semaine dernière",
      topPerformers: "Top Performers",
      rank: "Rang",
      member: "Membre",
      posts_label: "Publications",
      engagement: "Engagement",
      readyToShare: "Prêt à partager",
      approvedContent: "Contenu approuvé",
      shareNow: "Partager maintenant",
      scheduled: "Programmé"
    },
    en: {
      title: "Integrated directly into Slack",
      subtitle: "Get your LinkedIn notifications where you already work",
      channels: {
        posts: "Posts",
        analytics: "Analytics",
        leaderboard: "Leaderboard", 
        share: "Share"
      },
      channelDescriptions: {
        posts: "Real-time notifications from your LinkedIn posts",
        analytics: "Detailed statistics of your performance",
        leaderboard: "Your team ranking",
        share: "Share pre-approved content"
      },
      newPost: "New LinkedIn post",
      viewOnLinkedIn: "View on LinkedIn",
      impressions: "impressions",
      reactions: "reactions",
      comments: "comments",
      shares: "shares",
      thisWeek: "This week",
      vsLastWeek: "vs last week",
      topPerformers: "Top Performers",
      rank: "Rank",
      member: "Member",
      posts_label: "Posts",
      engagement: "Engagement",
      readyToShare: "Ready to share",
      approvedContent: "Approved content",
      shareNow: "Share now",
      scheduled: "Scheduled"
    }
  };

  const t = translations[language];

  const channels = [
    { id: "posts", icon: Hash, name: t.channels.posts },
    { id: "analytics", icon: BarChart2, name: t.channels.analytics },
    { id: "leaderboard", icon: Trophy, name: t.channels.leaderboard },
    { id: "share", icon: Share2, name: t.channels.share }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const currentIndex = channels.findIndex(c => c.id === activeChannel);
          const nextIndex = (currentIndex + 1) % channels.length;
          setActiveChannel(channels[nextIndex].id);
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAutoPlay, activeChannel, channels]);

  const handleChannelClick = (channelId: string) => {
    setActiveChannel(channelId);
    setProgress(0);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const formatSlackText = (text: string) => {
    const parts = text.split(/(\*[^*]+\*|@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <span key={index} className="font-bold">{part.slice(1, -1)}</span>;
      }
      if (part.startsWith('@')) {
        return <span key={index} className="text-slack-link bg-slack-mention-bg px-0.5 rounded">@{part.slice(1)}</span>;
      }
      return part;
    });
  };

  const renderPostsContent = () => (
    <div className="space-y-4">
      {/* Post notification */}
      <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
          SP
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-foreground">superpump</span>
            <span className="text-xs text-muted-foreground">11:42 AM</span>
          </div>
          <div className="text-sm text-foreground/90 mb-3">
            {formatSlackText(`📊 *${t.newPost}*`)}
          </div>
          
          {/* LinkedIn preview card */}
          <div className="border-l-4 border-primary bg-muted/30 rounded-r-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                JD
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Jean Dupont</p>
                <p className="text-xs text-muted-foreground">CEO @ TechStartup</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 mb-3">
              🚀 Excited to announce our Series A! After 2 years of hard work, we've raised €5M to accelerate our growth...
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> 2,847 {t.impressions}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> 156 {t.reactions}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> 23 {t.comments}
              </span>
            </div>
          </div>

          {/* Reactions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 text-xs">
              <span>👍</span> <span className="text-primary font-medium">12</span>
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5 text-xs">
              <span>🎉</span> <span className="text-muted-foreground">5</span>
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5 text-xs">
              <span>🔥</span> <span className="text-muted-foreground">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second message */}
      <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
          SP
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-foreground">superpump</span>
            <span className="text-xs text-muted-foreground">10:15 AM</span>
          </div>
          <div className="text-sm text-foreground/90">
            {formatSlackText("🔔 *@Marie* just commented on your post: \"Great insights! Would love to discuss further.\"")}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5 text-xs">
              <span>👀</span> <span className="text-muted-foreground">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsContent = () => (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
          SP
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-foreground">superpump</span>
            <span className="text-xs text-muted-foreground">9:00 AM</span>
          </div>
          <div className="text-sm text-foreground/90 mb-3">
            {formatSlackText(`📈 *${t.thisWeek}*`)}
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">{t.impressions}</span>
              </div>
              <p className="text-xl font-bold text-foreground">12,847</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +23% {t.vsLastWeek}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <ThumbsUp className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">{t.reactions}</span>
              </div>
              <p className="text-xl font-bold text-foreground">489</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +15% {t.vsLastWeek}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">{t.comments}</span>
              </div>
              <p className="text-xl font-bold text-foreground">67</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +8% {t.vsLastWeek}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Repeat2 className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">{t.shares}</span>
              </div>
              <p className="text-xl font-bold text-foreground">34</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +42% {t.vsLastWeek}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeaderboardContent = () => (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
          SP
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-foreground">superpump</span>
            <span className="text-xs text-muted-foreground">Monday 9:00 AM</span>
          </div>
          <div className="text-sm text-foreground/90 mb-3">
            {formatSlackText(`🏆 *${t.topPerformers}* - ${t.thisWeek}`)}
          </div>
          
          {/* Leaderboard */}
          <div className="bg-muted/30 rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-2 p-2 bg-muted/50 text-xs font-medium text-muted-foreground">
              <span>{t.rank}</span>
              <span>{t.member}</span>
              <span>{t.posts_label}</span>
              <span>{t.engagement}</span>
            </div>
            {[
              { rank: 1, name: "Marie L.", posts: 8, engagement: "12.4%", icon: Crown, color: "text-yellow-500" },
              { rank: 2, name: "Jean D.", posts: 6, engagement: "10.2%", icon: Medal, color: "text-gray-400" },
              { rank: 3, name: "Pierre M.", posts: 5, engagement: "9.8%", icon: Award, color: "text-amber-600" },
              { rank: 4, name: "Sophie B.", posts: 4, engagement: "8.5%", icon: Star, color: "text-muted-foreground" },
            ].map((member) => (
              <div key={member.rank} className="grid grid-cols-4 gap-2 p-2 items-center text-sm border-t border-border/50">
                <span className="flex items-center gap-1">
                  <member.icon className={`w-4 h-4 ${member.color}`} />
                  #{member.rank}
                </span>
                <span className="font-medium text-foreground">{member.name}</span>
                <span className="text-muted-foreground">{member.posts}</span>
                <span className="text-green-500 font-medium">{member.engagement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderShareContent = () => (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
          SP
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-foreground">superpump</span>
            <span className="text-xs text-muted-foreground">Just now</span>
          </div>
          <div className="text-sm text-foreground/90 mb-3">
            {formatSlackText(`✨ *${t.readyToShare}* - ${t.approvedContent}`)}
          </div>
          
          {/* Share cards */}
          <div className="space-y-3">
            <div className="border border-border rounded-lg p-3 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium text-green-500">{t.approvedContent}</span>
                </div>
                <button className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full hover:bg-primary/90 transition-colors">
                  {t.shareNow}
                </button>
              </div>
              <p className="text-sm text-foreground/80">
                🎯 Just hit 10K followers! Thank you all for the incredible support on this journey...
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-3 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-medium text-amber-500">{t.scheduled}</span>
                </div>
                <span className="text-xs text-muted-foreground">Tomorrow 10:00 AM</span>
              </div>
              <p className="text-sm text-foreground/80">
                💡 5 tips for better LinkedIn engagement that I learned this month...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChannelContent = () => {
    switch (activeChannel) {
      case "posts":
        return renderPostsContent();
      case "analytics":
        return renderAnalyticsContent();
      case "leaderboard":
        return renderLeaderboardContent();
      case "share":
        return renderShareContent();
      default:
        return renderPostsContent();
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
            {t.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Slack mockup */}
        <Card className="overflow-hidden shadow-2xl border-border/50 bg-card max-w-4xl mx-auto">
          <div className="flex h-[550px]">
            {/* Sidebar */}
            <div className="w-60 bg-slack border-r border-border flex flex-col">
              {/* Workspace header */}
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <img src={slackLogo} alt="Slack" className="w-8 h-8" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white text-sm truncate">TechStartup</span>
                      <ChevronDown className="w-4 h-4 text-white/70 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-2 space-y-0.5">
                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-white/70 hover:bg-white/10 rounded transition-colors">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-white/70 hover:bg-white/10 rounded transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>DMs</span>
                </button>
                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-white/70 hover:bg-white/10 rounded transition-colors">
                  <Bell className="w-4 h-4" />
                  <span>Activity</span>
                </button>
              </div>

              {/* Channels section */}
              <div className="flex-1 overflow-auto p-2">
                <div className="flex items-center justify-between px-2 py-1 mb-1">
                  <span className="text-xs font-medium text-white/50 uppercase tracking-wide">Channels</span>
                  <Plus className="w-4 h-4 text-white/50 cursor-pointer hover:text-white" />
                </div>
                
                <div className="space-y-0.5">
                  {channels.map((channel) => {
                    const Icon = channel.icon;
                    const isActive = activeChannel === channel.id;
                    return (
                      <button
                        key={channel.id}
                        onClick={() => handleChannelClick(channel.id)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors relative ${
                          isActive 
                            ? "bg-white/20 text-white font-medium" 
                            : "text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="truncate">{channel.name}</span>
                        {isActive && (
                          <div 
                            className="absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-100"
                            style={{ width: `${progress}%` }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Apps section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between px-2 py-1 mb-1">
                    <span className="text-xs font-medium text-white/50 uppercase tracking-wide">Apps</span>
                    <Plus className="w-4 h-4 text-white/50 cursor-pointer hover:text-white" />
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-white bg-white/10 rounded">
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-xs font-bold">
                      S
                    </div>
                    <span className="font-medium">superpump</span>
                    <Zap className="w-3 h-3 text-primary ml-auto" />
                  </div>
                </div>
              </div>

              {/* User profile */}
              <div className="p-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                    Y
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">You</p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-white/50">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col bg-background">
              {/* Channel header */}
              <div className="h-12 border-b border-border flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  {(() => {
                    const channel = channels.find(c => c.id === activeChannel);
                    const Icon = channel?.icon || Hash;
                    return (
                      <>
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <span className="font-bold text-foreground">{channel?.name}</span>
                      </>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-muted rounded transition-colors">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 hover:bg-muted rounded transition-colors">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 hover:bg-muted rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-auto p-4">
                {renderChannelContent()}
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 border border-border">
                  <Plus className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground" />
                  <input 
                    type="text" 
                    placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name.toLowerCase()}`}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-muted rounded transition-colors">
                      <Smile className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 hover:bg-muted rounded transition-colors">
                      <AtSign className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 hover:bg-muted rounded transition-colors">
                      <Paperclip className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 hover:bg-muted rounded transition-colors">
                      <Send className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SlackIntegration;
