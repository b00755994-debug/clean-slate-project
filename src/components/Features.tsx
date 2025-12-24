import { Zap, Sparkles, BarChart3, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title1: "Activez. Coachez.",
      title2: "Mesurez.",
      subtitle: "Transformez chaque collaborateur en ambassadeur LinkedIn. Sans surveillance, sans classement, sans friction.",
      features: [
        {
          icon: Zap,
          title: "Alertes Slack Intelligentes",
          description: "Notification instantanée dans Slack dès qu'un membre publie. Aperçu du post, lien direct, et call-to-action clair pour engager en quelques secondes.",
          microCopy: "Zéro bruit. Zéro spam. Juste de l'impact."
        },
        {
          icon: Sparkles,
          title: "Coach Personnel IA",
          description: "Chaque collaborateur dispose d'un tableau de bord privé : tendances de visibilité, évolution de l'engagement, et recommandations personnalisées. L'IA suggère quand poster, quels formats fonctionnent, et puise dans la Content Library curatée par vos admins.",
          microCopy: "Pas de classement. Pas de pression. Juste du coaching."
        },
        {
          icon: BarChart3,
          title: "Dashboard Activation Admins",
          description: "Vue stratégique de l'activation interne : taux de participation, engagement interne vs externe, tendances par équipe ou région. Données agrégées pour piloter, pas pour surveiller.",
          microCopy: "Conçu pour décider, pas pour surveiller."
        },
        {
          icon: Target,
          title: "Insights Audience & Marque",
          description: "Comprenez qui réagit à vos contenus : secteur, fonction, séniorité, taille d'entreprise. Mesurez l'alignement avec votre ICP et suivez l'évolution de la qualité de votre audience dans le temps.",
          microCopy: "Brand intent, pas sales intent."
        },
      ]
    },
    en: {
      title1: "Activate. Coach.",
      title2: "Measure.",
      subtitle: "Turn every employee into a LinkedIn ambassador. No surveillance, no rankings, no friction.",
      features: [
        {
          icon: Zap,
          title: "Smart Slack Alerts",
          description: "Instant Slack notification when a team member posts. Post preview, direct link, and clear call-to-action to engage in seconds.",
          microCopy: "Zero noise. Zero spam. Just impact."
        },
        {
          icon: Sparkles,
          title: "Personal AI Coach",
          description: "Each employee gets a private dashboard: visibility trends, engagement evolution, and personalized recommendations. AI suggests when to post, what formats work, and pulls from the admin-curated Content Library.",
          microCopy: "No rankings. No pressure. Just guidance."
        },
        {
          icon: BarChart3,
          title: "Admin Activation Dashboard",
          description: "Strategic view of internal activation: participation rates, internal vs external engagement, trends by team or region. Aggregated data for decision-making, not surveillance.",
          microCopy: "Built to decide, not to monitor."
        },
        {
          icon: Target,
          title: "Audience & Brand Insights",
          description: "Understand who engages with your content: industry, role, seniority, company size. Measure ICP alignment and track audience quality evolution over time.",
          microCopy: "Brand intent, not sales intent."
        },
      ]
    }
  };

  const t = translations[language];
  
  return (
    <section className="py-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.title1}{" "}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              {t.title2}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {t.features.map((feature, index) => (
            <Card
              key={index}
              className="border-border bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 group relative"
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
                <p className="text-muted-foreground text-base leading-relaxed mb-3">
                  {feature.description}
                </p>
                <p className="text-sm italic text-muted-foreground/70">
                  {feature.microCopy}
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
