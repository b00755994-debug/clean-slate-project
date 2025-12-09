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
          role: "Responsable Communication",
          company: "TechNova"
        },
        {
          quote: "On a mis en place des récompenses pour le top 3 du leaderboard chaque mois : un week-end, un dîner au restaurant, des places de théâtre... L'équipe s'est prise au jeu, même les sceptiques de LinkedIn !",
          author: "Claire Lefèvre",
          role: "DRH",
          company: "Nexidia"
        },
        {
          quote: "Les gens font plus confiance à leurs pairs qu'aux marques sur les réseaux. Les prospects identifiés via notre présence sur LinkedIn ont un taux de closing bien plus important que la moyenne. Le ROI est significatif pour nos équipes commerciales.",
          author: "Julien Dubois",
          role: "Directeur Marketing",
          company: "Innovaris"
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
          role: "Communications Manager",
          company: "TechNova"
        },
        {
          quote: "We set up rewards for the top 3 on the leaderboard each month: a weekend getaway, dinner at a restaurant, theater tickets... The team got into it, even the LinkedIn skeptics!",
          author: "Claire Lefèvre",
          role: "HR Director",
          company: "Nexidia"
        },
        {
          quote: "People trust peers more than brands on social networks. Prospects identified through our LinkedIn presence have a significantly higher closing rate than average. The ROI is significant for our sales teams.",
          author: "Julien Dubois",
          role: "Marketing Director",
          company: "Innovaris"
        }
      ]
    }
  };

  const t = translations[language];
  
  return (
    <section id="temoignages" className="py-16 bg-background">
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
              <div key={index} className="relative group">
                {/* Decorative gradient blur */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="relative bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-full flex flex-col">
                  {/* Quote icon */}
                  <div className="absolute -top-4 left-6">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                      <Quote className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Quote text */}
                  <blockquote className="text-foreground text-base leading-relaxed pt-4 pb-4 italic flex-grow">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-destructive flex items-center justify-center shadow-sm">
                      <span className="text-xs font-bold text-primary-foreground">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                      <p className="text-muted-foreground text-xs">
                        {testimonial.role} <span className="text-primary">@</span> {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
