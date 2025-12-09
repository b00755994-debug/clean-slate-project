import { Bell, Trophy, Lightbulb, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import InlineTestimonial from "@/components/InlineTestimonial";

const Features = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title1: "Tout ce dont vous avez besoin pour",
      title2: "réussir",
      subtitle: "Transformez LinkedIn en machine à générer des leads hautement qualifiés. L'engagement collectif de votre équipe, orchestré depuis Slack.",
      features: [
        {
          icon: Bell,
          title: "Alertes Slack Instantanées",
          description: "Notifications automatiques directement dans vos canaux Slack dès qu'un membre publie. Aperçu du post, lien direct et call-to-action pour maximiser l'engagement collectif en quelques secondes.",
          status: "live",
          statusText: "Disponible"
        },
        {
          icon: Trophy,
          title: "Leaderboard Gamifié & Analytics",
          description: "Classement en temps réel des membres par impressions générées, posts publiés et soutiens apportés. Rapports mensuels détaillés avec métriques d'engagement, performances individuelles, et analyse de l'audience ICP touchée.",
          status: "live",
          statusText: "Disponible"
        },
        {
          icon: Lightbulb,
          title: "Suggestions de Contenu",
          description: "Base de recommandations alimentée par vos admins pour aider l'équipe à publier du contenu pertinent et d'actualité.",
          status: "live",
          statusText: "Disponible"
        },
        {
          icon: Users,
          title: "Identification de Leads ICP",
          description: "Identification automatique des leads faisant partie de votre ICP ayant interagi avec vos publications. Extraction CSV ou intégration directe avec votre CRM préféré pour un suivi commercial immédiat.",
          status: "construction",
          statusText: "Prochainement"
        },
      ]
    },
    en: {
      title1: "Everything you need to",
      title2: "succeed",
      subtitle: "Transform LinkedIn into a highly qualified lead generation machine. Your team's collective engagement, orchestrated from Slack.",
      features: [
        {
          icon: Bell,
          title: "Instant Slack Alerts",
          description: "Automatic notifications directly in your Slack channels as soon as a member posts. Post preview, direct link and call-to-action to maximize collective engagement in seconds.",
          status: "live",
          statusText: "Available"
        },
        {
          icon: Trophy,
          title: "Gamified Leaderboard & Analytics",
          description: "Real-time ranking of members by impressions generated, posts published, and support provided. Detailed monthly reports with engagement metrics, individual performance, and ICP audience analysis.",
          status: "live",
          statusText: "Available"
        },
        {
          icon: Lightbulb,
          title: "Content Suggestions",
          description: "A curated recommendation library powered by your admins to help the team publish relevant and timely content.",
          status: "live",
          statusText: "Available"
        },
        {
          icon: Users,
          title: "ICP Lead Identification",
          description: "Automatic identification of ICP leads who engaged with your posts. CSV export or direct integration with your favorite CRM for immediate sales follow-up.",
          status: "construction",
          statusText: "Coming Soon"
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
              {feature.status === "construction" && (
                <div className="absolute -top-3 -right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge className="bg-background text-muted-foreground border border-border shadow-md px-2.5 py-1 flex items-center gap-1.5">
                    <span className="text-sm">🥷</span>
                    <span className="text-xs font-medium">{feature.statusText}</span>
                  </Badge>
                </div>
              )}
              {feature.status === "live" && (
                <div className="absolute -top-3 -right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge className="bg-primary text-primary-foreground border-0 shadow-md px-2.5 py-1 flex items-center gap-1.5">
                    <Zap className="h-3 w-3" />
                    <span className="text-xs font-medium">{feature.statusText}</span>
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary transition-all group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-card-foreground transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text" style={{ backgroundImage: 'none' }}>
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

        {/* Gamification Testimonial */}
        <InlineTestimonial
          quote={{
            fr: "On a instauré des récompenses pour le top 3 du leaderboard chaque mois : un week-end, un dîner au resto, des places de théâtre... L'équipe s'est prise au jeu, même les plus réticents à LinkedIn ! Le reach collectif a triplé et l'ambiance n'a jamais été aussi bonne.",
            en: "We set up rewards for the top 3 on the leaderboard each month: a weekend getaway, dinner at a restaurant, theater tickets... The team got into it, even the LinkedIn skeptics! Our collective reach tripled and team spirit has never been better."
          }}
          author="Thomas Renard"
          role={{ fr: "DRH", en: "HR Director" }}
          company="Kalypso Digital"
        />

        {/* ICP Leads Testimonial */}
        <InlineTestimonial
          quote={{
            fr: "En 3 mois, on a identifié 47 leads ICP grâce aux interactions sur nos posts. 12 ont accepté un call. C'est du pipe généré sans un euro de pub.",
            en: "In 3 months, we identified 47 ICP leads through interactions on our posts. 12 accepted a call. That's pipeline generated without a single euro in ads."
          }}
          author="Maxime Duval"
          role={{ fr: "Head of Sales", en: "Head of Sales" }}
          company="Proxima Tech"
        />
      </div>
    </section>
  );
};

export default Features;
