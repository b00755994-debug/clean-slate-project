import { Zap, Rss, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ProblemSolution = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      narrative: "Vos employés ont un réseau précieux. Sans process simple, leur potentiel LinkedIn reste inexploité.",
      solutionLabel: "La solution",
      pillars: [
        {
          icon: Zap,
          title: "Alertes Slack",
          description: "Notification instantanée quand un membre poste"
        },
        {
          icon: Rss,
          title: "Team Feed",
          description: "Tous les posts de l'équipe en un flux"
        },
        {
          icon: BarChart3,
          title: "Analytics",
          description: "Analytics d'audience intégrés"
        }
      ]
    },
    en: {
      narrative: "Your employees have a valuable network. Without a simple process, their LinkedIn potential remains untapped.",
      solutionLabel: "The solution",
      pillars: [
        {
          icon: Zap,
          title: "Slack Alerts",
          description: "Instant alerts when a team member posts"
        },
        {
          icon: Rss,
          title: "Team Feed",
          description: "All team posts in one unified feed"
        },
        {
          icon: BarChart3,
          title: "Analytics",
          description: "Built-in audience insights"
        }
      ]
    }
  };

  const t = translations[language];

  return (
    <section id="solution" className="py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Narrative intro */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            {t.narrative}
          </p>
        </div>

        {/* Solution separator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {t.solutionLabel}
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
        </div>

        {/* 3 Pillars */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {t.pillars.map((pillar, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4 group-hover:scale-110 transition-transform">
                <pillar.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
