import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const CTA = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      badge: "Rejoignez la bêta privée aujourd'hui",
      title1: "Prêt à décupler votre",
      title2: "impact LinkedIn",
      subtitle: "Rejoignez les entreprises qui boostent leur portée LinkedIn directement depuis Slack, sans effort supplémentaire",
      button: "Rejoindre la Beta",
      footer: "Pas de carte bancaire requise • Configuration Slack en 5 minutes • Support dédié"
    },
    en: {
      badge: "Join the private beta today",
      title1: "Ready to unleash your",
      title2: "LinkedIn impact",
      subtitle: "Join companies boosting their LinkedIn reach directly from Slack, with zero extra effort",
      button: "Join the Beta",
      footer: "No credit card required • 5-minute Slack setup • Dedicated support"
    }
  };

  const t = translations[language];
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{t.badge}</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            {t.title1}{" "}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              {t.title2}
            </span>
            {" "}?
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          <Link to="/beta">
            <Button variant="hero" size="lg" className="h-14 px-8 text-lg whitespace-nowrap">
              {t.button}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-8">
            {t.footer}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
