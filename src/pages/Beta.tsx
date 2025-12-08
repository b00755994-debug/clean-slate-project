import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar } from "lucide-react";

const Beta = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      titleStart: "Accès anticipé",
      titleHighlight: "à la Beta",
      titleEnd: "",
      subtitleStart: "Réservez un créneau pour configurer",
      subtitleHighlight: "superpump",
      subtitleEnd: "dans votre Slack et commencer à booster votre présence LinkedIn en équipe"
    },
    en: {
      titleStart: "Get",
      titleHighlight: "early access",
      titleEnd: "to the Beta",
      subtitleStart: "Book a time slot to set up",
      subtitleHighlight: "superpump",
      subtitleEnd: "with our team and start boosting your LinkedIn presence, directly from Slack"
    }
  };

  const t = translations[language];

  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 relative group">
              <div className="absolute inset-0 rounded-full bg-primary opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[2px] bg-background rounded-full" />
              <Calendar className="h-4 w-4 relative z-10 text-primary" />
              <span className="text-sm font-bold relative z-10 text-primary">Beta</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t.titleStart}{" "}
              <span className="text-primary">
                {t.titleHighlight}
              </span>
              {t.titleEnd && ` ${t.titleEnd}`}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.subtitleStart}{" "}
              <a href="/" className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity">
                {t.subtitleHighlight}
              </a>
              {" "}{t.subtitleEnd}
            </p>
          </div>

          {/* Cal.com Inline Widget */}
          <div className="w-full">
            <iframe
              src="https://cal.com/gaultierbr/superpumpintro"
              className="w-full rounded-lg border border-border shadow-lg"
              style={{ height: '700px', minHeight: '700px' }}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Beta;
