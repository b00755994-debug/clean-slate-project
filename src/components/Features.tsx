import { useState, useEffect, useRef, useCallback } from "react";
import { Zap, BarChart3, Rss, Trophy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import SlackIntegration from "@/components/SlackIntegration";
import { MockTeamFeed } from "@/components/mockups/MockTeamFeed";
import { MockAnalytics } from "@/components/mockups/MockAnalytics";
import { MockLeaderboard } from "@/components/mockups/MockLeaderboard";

const TAB_IDS = ["slack", "feed", "analytics", "leaderboard"];
const AUTO_INTERVAL = 5000;

const Features = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("slack");
  const [autoPlay, setAutoPlay] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoPlay = useCallback(() => {
    setAutoPlay(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    intervalRef.current = setInterval(() => {
      setActiveTab((prev) => {
        const idx = TAB_IDS.indexOf(prev);
        return TAB_IDS[(idx + 1) % TAB_IDS.length];
      });
    }, AUTO_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoPlay]);

  const translations = {
    fr: {
      title1: "Tout ce qu'il faut pour transformer",
      title2: "le contenu en pipeline.",
      subtitle: "Alertes Slack pour chaque post, Team Feed, leaderboards et analytics d'audience.",
      subtitleHighlight: "Tout-en-un.",
      tabs: [
        {
          id: "slack",
          icon: Zap,
          label: "Alertes Slack",
          description: "Notification instantanée dans Slack dès qu'un membre publie. Aperçu du post, lien direct, et call-to-action clair pour engager en quelques secondes.",
          highlight: "engager en quelques secondes"
        },
        {
          id: "feed",
          icon: Rss,
          label: "Team Feed",
          description: "Un seul flux pour toute l'activité LinkedIn de votre équipe.\nRepérez les tendances et reproduisez ce qui marche.",
          highlight: "reproduisez ce qui marche"
        },
        {
          id: "analytics",
          icon: BarChart3,
          label: "Analytics",
          description: "Transformez l'activité LinkedIn de votre équipe en données actionnables.\nSuivez la portée, l'activation et la qualité de l'audience, à grande échelle.",
          highlight: "données actionnables"
        },
        {
          id: "leaderboard",
          icon: Trophy,
          label: "Leaderboard",
          description: "Voyez qui mène la charge sur LinkedIn.\nGamifiez votre programme d'advocacy.",
          highlight: "Gamifiez votre programme d'advocacy"
        },
      ],
    },
    en: {
      title1: "Everything you need to turn",
      title2: "content into pipeline.",
      subtitle: "Slack alerts, Team Feed, leaderboards and audience analytics.",
      subtitleHighlight: "All in one.",
      tabs: [
        {
          id: "slack",
          icon: Zap,
          label: "Slack Alerts",
          description: "Instantly notify the right Slack channels when a team member posts on LinkedIn.\nWe help you drive fast, coordinated engagement.",
          highlight: "fast, coordinated engagement"
        },
        {
          id: "feed",
          icon: Rss,
          label: "Team Feed",
          description: "One feed for your entire team's LinkedIn activity.\nSpot trends and replicate what works.",
          highlight: "replicate what works"
        },
        {
          id: "analytics",
          icon: BarChart3,
          label: "Analytics",
          description: "Turn your team's LinkedIn activity into actionable data.\nTrack reach, activation & audience quality, at scale.",
          highlight: "actionable data"
        },
        {
          id: "leaderboard",
          icon: Trophy,
          label: "Leaderboard",
          description: "See who's leading the charge on LinkedIn.\nGamify your advocacy program.",
          highlight: "Gamify your advocacy program"
        },
      ]
    }
  };

  const t = translations[language];
  
  return (
    <section id="features" className="py-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.title1}{" "}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              {t.title2}
            </span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={(v) => { stopAutoPlay(); setActiveTab(v); }} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-2 gap-2 bg-transparent">
              {t.tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 py-3 px-4 text-sm font-semibold border border-border/60 rounded-lg bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {t.tabs.map((tab) => (
              <div key={tab.id} className={activeTab === tab.id ? "space-y-6" : "hidden"}>
                <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto text-center leading-relaxed whitespace-pre-line">
                  {tab.highlight && tab.description.includes(tab.highlight) ? (
                    <>{tab.description.split(tab.highlight)[0]}<span className="bg-primary/15 text-primary rounded-sm font-medium px-1">{tab.highlight}</span>{tab.description.split(tab.highlight)[1]}</>
                  ) : tab.description}
                </p>
                {tab.id === "slack" ? (
                  <SlackIntegration embedded />
                ) : (
                  <div className="rounded-xl border-2 border-border/80 shadow-lg bg-background overflow-hidden h-[600px]">
                    {tab.id === "feed" && <MockTeamFeed />}
                    {tab.id === "analytics" && <MockAnalytics />}
                    {tab.id === "leaderboard" && <MockLeaderboard />}
                  </div>
                )}
              </div>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Features;
