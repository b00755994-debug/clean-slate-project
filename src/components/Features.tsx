import { Zap, Sparkles, BarChart3, Rss } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

// Highlight component for key phrases
const Highlight = ({ children }: { children: ReactNode }) => (
  <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded-md font-medium">
    {children}
  </span>
);

const Features = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title1: "Activez. Soutenez.",
      title2: "Mesurez.",
      subtitle: "Transformez chaque collaborateur en ambassadeur LinkedIn.",
      features: [
        {
          icon: Zap,
          title: "Alertes Slack Intelligentes",
          description: (
            <>
              <Highlight>Notification instantanée</Highlight> dans Slack dès qu'un membre publie. Aperçu du post, lien direct, et <Highlight>call-to-action clair</Highlight> pour engager en quelques secondes.
            </>
          )
        },
        {
          icon: Rss,
          title: "Team Feed",
          description: (
            <>
              Centralisez <Highlight>tous les posts LinkedIn</Highlight> de votre équipe dans un flux unique. Suivez les <Highlight>performances en temps réel</Highlight>, identifiez les meilleurs contenus et inspirez-vous en pour créer de nouveaux posts.
            </>
          )
        },
        {
          icon: BarChart3,
          title: "Audience & Brand Analytics",
          description: (
            <>
              Obtenez une vue claire de la présence LinkedIn de votre équipe avec des <Highlight>données agrégées</Highlight>. Suivez les métriques globales et analysez la <Highlight>qualité de l'audience</Highlight> par secteur, fonction et séniorité.
            </>
          )
        },
      ],
    },
    en: {
      title1: "Activate. Support.",
      title2: "Measure.",
      subtitle: "Turn every employee into a LinkedIn ambassador.",
      features: [
        {
          icon: Zap,
          title: "Smart Slack Activation Alerts",
          description: (
            <>
              <Highlight>Instantly notify</Highlight> the right Slack channels when a team member posts on LinkedIn. Each alert includes a post preview, direct link, and <Highlight>clear actions</Highlight> to drive fast, coordinated engagement.
            </>
          )
        },
        {
          icon: Rss,
          title: "Team Feed",
          description: (
            <>
              Centralize <Highlight>all your team's LinkedIn posts</Highlight> in a single feed. Track <Highlight>performance in real-time</Highlight>, identify top-performing content, and get inspired to remix winning formats.
            </>
          )
        },
        {
          icon: BarChart3,
          title: "Audience & Brand Analytics",
          description: (
            <>
              Understand how your team's LinkedIn activity translates into <Highlight>real visibility</Highlight> and engagement. Track reach trends, engagement dynamics, and post performance - all through <Highlight>anonymized analytics</Highlight>.
            </>
          )
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.title1}{" "}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              {t.title2}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
