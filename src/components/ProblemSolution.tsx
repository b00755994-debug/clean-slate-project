import { X, CheckCircle2, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import InlineTestimonial from "@/components/InlineTestimonial";

const ProblemSolution = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title1: "Transformez chaque employé",
      title2: "en ambassadeur",
      subtitle: "Passez de l'ombre à l'impact collectif",
      problemTitle: "Le défi actuel",
      problemHeading: "Difficile de mobiliser vos équipes",
      problemDesc: "Vos collaborateurs ont un réseau précieux, mais mobiliser leur engagement sur LinkedIn reste un casse-tête quotidien.",
      problemPoints: [
        "Pas de process simple pour partager les contenus",
        "Manque de motivation et de visibilité sur l'impact",
        "Le potentiel de vos ambassadeurs reste inexploité"
      ],
      solutionTitle: "La solution",
      solutionHeading: "L'engagement d'équipe, orchestré depuis Slack",
      solutionDesc: "Chaque publication LinkedIn déclenche automatiquement une alerte Slack. Votre équipe réagit en temps réel, directement depuis vos canaux de travail.",
      solutionPoints: [
        "Alertes automatiques sur Slack à chaque post",
        "Boostez l'engagement grâce aux classements gamifiés",
        "Portée décuplée, notoriété amplifiée"
      ],
      metric: "d'impressions en moyenne"
    },
    en: {
      title1: "Turn every employee",
      title2: "into an ambassador",
      subtitle: "Accelerate from shadow to collective impact",
      problemTitle: "The Current Challenge",
      problemHeading: "Struggling to rally your teams",
      problemDesc: "Your employees have valuable networks, but mobilizing their LinkedIn engagement remains a daily challenge.",
      problemPoints: [
        "No simple process to share content",
        "Lack of motivation and visibility on impact",
        "Your ambassadors' potential remains untapped"
      ],
      solutionTitle: "The Solution",
      solutionHeading: "Team engagement, orchestrated from Slack",
      solutionDesc: "Slack becomes your employee advocacy hub. Automatic alerts, gamified leaderboards, and real-time engagement tracking turn your team into active brand ambassadors.",
      solutionPoints: [
        "Automatic Slack alerts for every post",
        "Boost engagement through gamified leaderboards",
        "Amplify reach and exposure to your target audience"
      ],
      metric: "average impressions"
    }
  };

  const t = translations[language];
  return (
    <section id="solution" className="pt-8 pb-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.title1}{" "}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              {t.title2}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Problem Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-muted/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-card border border-orange-200/30 dark:border-orange-900/30 rounded-2xl p-8 hover:border-orange-300/50 dark:hover:border-orange-800/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold text-primary">{t.problemTitle}</span>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {t.problemHeading}
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t.problemDesc}
              </p>

              <div className="space-y-4">
                {t.problemPoints.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 group/item">
                    <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="h-3.5 w-3.5 text-destructive" />
                    </div>
                    <span className="text-foreground/80 group-hover/item:text-foreground transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Solution Card */}
          <div className="group relative md:translate-y-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-card border border-primary/20 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                  {t.solutionTitle}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {t.solutionHeading}
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t.solutionDesc}
              </p>

              <div className="space-y-4">
                {t.solutionPoints.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 group/item">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-foreground/80 group-hover/item:text-foreground transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-primary">+350%</span> {t.metric}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Before/After Testimonial */}
        <InlineTestimonial
          quote={{
            fr: "Avant, quand un collègue publiait sur LinkedIn, personne ne le voyait. On ne passe pas notre journée à surveiller le feed ! Maintenant avec les alertes Slack, toute l'équipe réagit en 2 minutes. Le soutien est instantané.",
            en: "Before, when a colleague posted on LinkedIn, nobody saw it. We don't spend our day monitoring the feed! Now with Slack alerts, the whole team reacts within 2 minutes. Support is instant."
          }}
          author="Émilie Fontaine"
          role={{ fr: "Responsable Marque Employeur", en: "Employer Brand Manager" }}
          company="Axantis"
        />
      </div>
    </section>
  );
};

export default ProblemSolution;
