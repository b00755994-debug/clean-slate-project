import { Zap, Sparkles, BarChart3, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title1: "Activez. Coachez.",
      title2: "Mesurez.",
      subtitle: "Transformez chaque collaborateur en ambassadeur LinkedIn.",
      features: [
        {
          icon: Zap,
          title: "Alertes Slack Intelligentes",
          description: "Notification instantanée dans Slack dès qu'un membre publie. Aperçu du post, lien direct, et call-to-action clair pour engager en quelques secondes."
        },
        {
          icon: Sparkles,
          title: "Rapports Personnels & Coach IA",
          description: "Chaque collaborateur accède à son propre tableau de bord : tendances de visibilité, évolution de l'engagement, recommandations personnalisées. L'IA suggère quand poster et quels formats privilégier, en s'appuyant sur la Content Library curatée par vos admins."
        },
        {
          icon: BarChart3,
          title: "Vue Globale & Activation",
          description: "Pilotez votre présence LinkedIn : nombre de posts, taille d'audience cumulée, collaborateurs actifs, taux de participation. Analysez les tendances par équipe ou région avec des données agrégées."
        },
        {
          icon: Target,
          title: "Insights Audience & Marque",
          description: "Comprenez qui réagit à vos contenus : secteur, fonction, séniorité, taille d'entreprise. Mesurez l'alignement avec votre ICP et suivez l'évolution de la qualité de votre audience."
        },
      ]
    },
    en: {
      title1: "Activate. Coach.",
      title2: "Measure.",
      subtitle: "Turn every employee into a LinkedIn ambassador.",
      features: [
        {
          icon: Zap,
          title: "Smart Slack Alerts",
          description: "Instant Slack notification when a team member posts. Post preview, direct link, and clear call-to-action to engage in seconds."
        },
        {
          icon: Sparkles,
          title: "Personal AI Coach",
          description: "Private performance insights and AI guidance for every employee. See your visibility trends, get clear recommendations on when to post, and receive content suggestions from your team's shared content library."
        },
        {
          icon: BarChart3,
          title: "Advocacy & Activation Dashboard",
          description: "Get a clear, aggregated view of how your team shows up on LinkedIn. Track participation, active contributors, and visibility trends across teams and regions, without individual tracking."
        },
        {
          icon: Target,
          title: "Audience & Brand Insights",
          description: "Understand who engages with your content: industry, role, seniority, company size. Measure ICP alignment and track audience quality evolution over time."
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
