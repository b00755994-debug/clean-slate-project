import { Zap, BarChart3, Rss, Trophy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import SlackIntegration from "@/components/SlackIntegration";
import { MockTeamFeed } from "@/components/mockups/MockTeamFeed";
import { MockAnalytics } from "@/components/mockups/MockAnalytics";
import { MockLeaderboard } from "@/components/mockups/MockLeaderboard";

const Features = () => {
  const { language } = useLanguage();

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
          description: "Notification instantanée dans Slack dès qu'un membre publie. Aperçu du post, lien direct, et call-to-action clair pour engager en quelques secondes."
        },
        {
          id: "feed",
          icon: Rss,
          label: "Team Feed",
          description: "Centralisez tous les posts LinkedIn de votre équipe dans un flux unique. Suivez les performances en temps réel, identifiez les meilleurs contenus et inspirez-vous en pour créer de nouveaux posts."
        },
        {
          id: "analytics",
          icon: BarChart3,
          label: "Analytics",
          description: "Obtenez une vue claire de la présence LinkedIn de votre équipe avec des données agrégées et anonymisées. Suivez les métriques globales et analysez la qualité de l'audience."
        },
        {
          id: "leaderboard",
          icon: Trophy,
          label: "Leaderboard",
          description: "Classez et récompensez vos ambassadeurs les plus actifs. Visualisez les top contributeurs et stimulez une émulation positive au sein de votre équipe."
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
          description: "Instantly notify the right Slack channels when a team member posts on LinkedIn. Each alert includes a post preview, direct link, and clear actions to drive fast, coordinated engagement."
        },
        {
          id: "feed",
          icon: Rss,
          label: "Team Feed",
          description: "Centralize all your team's LinkedIn posts in a single feed. Track performance in real-time, identify top-performing content, and get inspired to remix winning formats."
        },
        {
          id: "analytics",
          icon: BarChart3,
          label: "Analytics",
          description: "Understand how your team's LinkedIn activity translates into real visibility and engagement. Get insights on your reach, audience, engagement dynamics, and post performances."
        },
        {
          id: "leaderboard",
          icon: Trophy,
          label: "Leaderboard",
          description: "Rank and reward your most active ambassadors. Visualize top contributors and foster healthy competition within your team."
        },
      ]
    }
  };

  const t = translations[language];
  
  return (
    <section className="py-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.title1}{" "}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              {t.title2}
            </span>
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#5A5A5A' }}>
            {t.subtitle}{" "}
            <span className="bg-primary/15 text-primary rounded-sm font-medium px-1">
              {t.subtitleHighlight}
            </span>
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="slack" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1.5 bg-muted/50 backdrop-blur-sm">
              {t.tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 py-3 px-4 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {t.tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
                  {tab.description}
                </p>
                <div className="rounded-xl overflow-hidden">
                  {tab.id === "slack" && <SlackIntegration embedded />}
                  {tab.id === "feed" && <MockTeamFeed />}
                  {tab.id === "analytics" && <MockAnalytics />}
                  {tab.id === "leaderboard" && <MockLeaderboard />}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Features;
