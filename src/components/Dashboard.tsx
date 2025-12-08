import dashboardImage from "@/assets/dashboard-mockup.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title1: "Une interface pensée pour la",
      title2: "performance",
      subtitle: "Dashboard intuitif, métriques en temps réel, et vue d'ensemble de l'impact collectif de votre équipe",
      altText: "Dashboard de LinkedIn Engagement Automation montrant les analytics, le leaderboard et les posts de l'équipe"
    },
    en: {
      title1: "An interface designed to",
      title2: "accelerate performance",
      subtitle: "Intuitive dashboard with real-time metrics to unleash your team's full potential",
      altText: "LinkedIn Engagement Automation Dashboard showing analytics, leaderboard and team posts"
    }
  };

  const t = translations[language];
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.title1}{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t.title2}
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 pointer-events-none" />
            <img
              src={dashboardImage}
              alt={t.altText}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
