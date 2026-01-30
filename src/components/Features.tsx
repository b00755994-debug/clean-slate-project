import { Zap, BarChart3, Rss, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title1: "Tout ce qu'il faut pour transformer",
      title2: "le contenu en pipeline.",
      subtitle: "Alertes Slack pour chaque post, Team Feed, leaderboards et analytics d'audience.",
      subtitleHighlight: "Tout-en-un.",
      features: [
        {
          icon: Zap,
          title: "Alertes Slack Intelligentes",
          description: "Notification instantanée dans Slack dès qu'un membre publie. Aperçu du post, lien direct, et call-to-action clair pour engager en quelques secondes."
        },
        {
          icon: Rss,
          title: "Team Feed",
          description: "Centralisez tous les posts LinkedIn de votre équipe dans un flux unique. Suivez les performances en temps réel, identifiez les meilleurs contenus et inspirez-vous en pour créer de nouveaux posts."
        },
        {
          icon: BarChart3,
          title: "Audience & Brand Analytics",
          description: "Obtenez une vue claire de la présence LinkedIn de votre équipe avec des données agrégées et anonymisées. Suivez les métriques globales (impressions, réactions, commentaires) et analysez la qualité de l'audience par secteur, fonction, séniorité et taille d'entreprise."
        },
        {
          icon: Trophy,
          title: "Leaderboard Mensuel",
          description: "Classez et récompensez vos ambassadeurs les plus actifs. Visualisez les top contributeurs et stimulez une émulation positive au sein de votre équipe."
        },
      ],
      // FEATURE À REMETTRE PLUS TARD:
      // {
      //   icon: Sparkles,
      //   title: "Rapports Individuels & Coaching",
      //   description: "Chaque collaborateur accède à son propre tableau de bord : tendances de visibilité, évolution de l'engagement, recommandations personnalisées. Découvrez quand poster et quels formats privilégier."
      // },
    },
    en: {
      title1: "Everything you need to turn",
      title2: "content into pipeline.",
      subtitle: "Slack alerts, Team Feed, leaderboards and audience analytics.",
      subtitleHighlight: "All in one.",
      features: [
        {
          icon: Zap,
          title: "Smart Slack Activation Alerts",
          description: "Instantly notify the right Slack channels when a team member posts on LinkedIn. Each alert includes a post preview, direct link, and clear actions to drive fast, coordinated engagement."
        },
        {
          icon: Rss,
          title: "Team Feed",
          description: "Centralize all your team's LinkedIn posts in a single feed. Track performance in real-time, identify top-performing content, and get inspired to remix winning formats."
        },
        {
          icon: BarChart3,
          title: "Audience & Brand Analytics",
          description: "Understand how your team's LinkedIn activity translates into real visibility and engagement. Get insights on your reach and audience, engagement dynamics, and post performances."
        },
        {
          icon: Trophy,
          title: "Monthly Leaderboard",
          description: "Rank and reward your most active ambassadors. Visualize top contributors and foster healthy competition within your team."
        },
      ]
      // FEATURE TO ADD BACK LATER:
      // {
      //   icon: Sparkles,
      //   title: "Individual Reports & Coaching",
      //   description: "Provide private performance insights and guidance for every employee, including performance trends, sharing recommendations, and more."
      // },
    }
  };

  const t = translations[language];
  
  return (
    <section className="py-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {t.features.map((feature, index) => (
            <Card
              key={index}
              className="border border-border bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 group relative"
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary transition-all group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-card-foreground transition-all duration-300">
                  <span className="group-hover:hidden">{feature.title}</span>
                  <span className="hidden group-hover:inline bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                    {feature.title}
                  </span>
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
