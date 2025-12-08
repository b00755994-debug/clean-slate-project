import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Testimonial = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title1: "Ils font confiance à",
      title2: "superpump",
      testimonials: [
        {
          quote: "superpump a transformé notre manière de collaborer autour des posts LinkedIn. Grâce aux alertes Slack et au suivi des performances, l'engagement de l'équipe a nettement progressé.",
          author: "Sophie Martin",
          role: "Responsable Communication, TechNova"
        },
        {
          quote: "Les gens font plus confiance à leurs pairs qu'aux marques sur les réseaux. Les prospects identifiés via notre présence sur LinkedIn ont un taux de closing bien plus important que la moyenne.",
          author: "Julien Dubois",
          role: "Directeur Marketing, Innovaris"
        },
        {
          quote: "superpump nous a aidés à structurer notre stratégie LinkedIn en interne. Le leaderboard et les suggestions de posts facilitent l'engagement quotidien, ce qui impacte positivement notre image de marque.",
          author: "Claire Lefèvre",
          role: "Chargée de Projet Digital, Nexidia"
        }
      ]
    },
    en: {
      title1: "They trust",
      title2: "superpump",
      testimonials: [
        {
          quote: "superpump has transformed the way we collaborate around LinkedIn posts. Thanks to Slack alerts and performance tracking, team engagement has significantly improved.",
          author: "Sophie Martin",
          role: "Communications Manager, TechNova"
        },
        {
          quote: "People trust peers more than brands on social networks. Prospects identified through our LinkedIn presence have a significantly higher closing rate than average.",
          author: "Julien Dubois",
          role: "Marketing Director, Innovaris"
        },
        {
          quote: "superpump has helped us structure our LinkedIn strategy internally. The leaderboard and post suggestions make daily engagement easier, which positively impacts our brand image.",
          author: "Claire Lefèvre",
          role: "Digital Project Manager, Nexidia"
        }
      ]
    }
  };

  const t = translations[language];
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {t.title1}{" "}
              <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                {t.title2}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.testimonials.map((testimonial, index) => (
              <Card key={index} className="group border-2 border-primary/20 bg-card shadow-lg hover:shadow-xl transition-shadow hover:border-primary/40">
                <CardContent className="p-6 md:p-8">
                  <div className="w-8 h-8 mb-4 flex items-center justify-center rounded-full bg-primary group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-destructive transition-all">
                    <Quote className="h-5 w-5 text-primary-foreground" />
                  </div>

                  <blockquote className="text-base font-medium text-card-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  <div>
                    <div className="font-semibold text-card-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
