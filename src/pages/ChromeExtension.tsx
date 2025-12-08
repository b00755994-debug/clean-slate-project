import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Chrome,
  TrendingUp,
  Share2,
  Users,
  ArrowRight,
  ThumbsUp,
  MessageSquare,
  Eye,
  Target,
  Trophy,
  Zap
} from "lucide-react";
import slackLogo from "@/assets/slack-logo.png";

const ChromeExtension = () => {
  const { language } = useLanguage();
  const [showSlackPreview, setShowSlackPreview] = useState(false);

  const translations = {
    fr: {
      hero: {
        badge: "Extension Chrome gratuite",
        title: "Votre LinkedIn,",
        titleHighlight: "visualisé",
        subtitle: "Suivez votre impact. Partagez vos réussites. Tout depuis une extension élégante.",
        ctaPrimary: "Installer l'extension - Gratuit",
        ctaSecondary: "Voir les plans équipe"
      },
      metrics: {
        posts: "Posts",
        likes: "Likes",
        comments: "Commentaires",
        impressions: "Impressions",
        icp: "ICP ciblé",
        growth: "vs mois dernier"
      },
      sections: {
        visualized: {
          title: "Votre LinkedIn, visualisé.",
          subtitle: "Voyez votre croissance en un coup d'œil – posts, portée et engagement, mis à jour automatiquement."
        },
        share: {
          title: "Partagez vos succès.",
          subtitle: "Un clic pour envoyer votre dernier post dans Slack et célébrer avec l'équipe.",
          button: "Partager sur Slack"
        },
        team: {
          title: "Passez en Mode Équipe.",
          subtitle: "Débloquez les classements complets et les analytics d'équipe. Multipliez les résultats ensemble.",
          feature1: "Classement équipe en temps réel",
          feature2: "Analytics multi-utilisateurs",
          feature3: "Canaux Slack dédiés",
          teamTag: "Fonctionnalité équipe"
        },
        cta: {
          title: "Prêt à booster votre impact LinkedIn ?",
          subtitle: "Gratuit pour toujours pour les contributeurs individuels.",
          button: "Installer l'extension Chrome",
          secondary: "Voir les plans équipe"
        }
      },
      slackMessage: {
        title: "🚀 Nouveau post de Alice",
        content: "Comment nous avons augmenté notre portée de 40% ce mois-ci",
        like: "J'aime",
        comment: "Commenter"
      }
    },
    en: {
      hero: {
        badge: "Free Chrome Extension",
        title: "Your LinkedIn,",
        titleHighlight: "visualized",
        subtitle: "Track your impact. Share your wins. All from an elegant extension.",
        ctaPrimary: "Get Extension - Free Forever",
        ctaSecondary: "See Team Plans"
      },
      metrics: {
        posts: "Posts",
        likes: "Likes",
        comments: "Comments",
        impressions: "Impressions",
        icp: "ICP Targeted",
        growth: "vs last month"
      },
      sections: {
        visualized: {
          title: "Your LinkedIn, visualized.",
          subtitle: "See your growth at a glance – posts, reach, and engagement, updated automatically."
        },
        share: {
          title: "Share your success.",
          subtitle: "One click to send your latest post to Slack and celebrate with the team.",
          button: "Share to Slack"
        },
        team: {
          title: "Go Team Mode.",
          subtitle: "Unlock full leaderboards and team analytics. Multiply results together.",
          feature1: "Real-time team leaderboard",
          feature2: "Multi-user analytics",
          feature3: "Dedicated Slack channels",
          teamTag: "Team feature"
        },
        cta: {
          title: "Ready to boost your LinkedIn impact?",
          subtitle: "Free forever for individual contributors.",
          button: "Get Chrome Extension",
          secondary: "See Team Plans"
        }
      },
      slackMessage: {
        title: "🚀 New post from Alice",
        content: "How we grew our reach by 40% this month",
        like: "Like",
        comment: "Comment"
      }
    }
  };

  const t = translations[language];

  // Mock data pour le graphique
  const monthlyData = [
    { month: 'Jan', impressions: 10200 },
    { month: 'Feb', impressions: 12800 },
    { month: 'Mar', impressions: 14500 },
    { month: 'Apr', impressions: 17200 },
    { month: 'May', impressions: 19800 },
    { month: 'Jun', impressions: 23400 },
    { month: 'Jul', impressions: 27900 },
    { month: 'Aug', impressions: 32600 },
    { month: 'Sep', impressions: 37200 }
  ];

  const leaderboardData = [
    { rank: 1, name: language === 'fr' ? 'Vous' : 'You', impressions: 5800, avatar: '🎯', isCurrentUser: true },
    { rank: 2, name: 'John Smith', impressions: 4200, avatar: '👨‍💼', isCurrentUser: false },
    { rank: 3, name: 'Sarah Chen', impressions: 3100, avatar: '👩‍🦰', isCurrentUser: false }
  ];

  const handleShareToSlack = () => {
    setShowSlackPreview(true);
    setTimeout(() => setShowSlackPreview(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Extension Mockup */}
      <section className="relative overflow-hidden pt-16 pb-24 min-h-screen flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                {t.hero.title}
                <br />
                <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                  {t.hero.titleHighlight}
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-muted-foreground">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="hero" size="lg" className="text-base h-12 px-8">
                  <Chrome className="mr-2 h-5 w-5" />
                  {t.hero.ctaPrimary}
                </Button>
                <Button variant="outline" size="lg" className="text-base h-12 px-8">
                  {t.hero.ctaSecondary}
                </Button>
              </div>
            </div>

            {/* Chrome Extension Mockup */}
            <div className="relative max-w-lg mx-auto">
              <Card className="p-6 shadow-2xl border-2 bg-card animate-fade-in">
                {/* Extension Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold">superpump</span>
                  </div>

                  {/* Send to Slack Button */}
                  <Button
                    className="bg-[#4A154B] hover:bg-[#4A154B]/90 text-primary-foreground transition-all shadow-md"
                    size="sm"
                    onClick={handleShareToSlack}
                  >
                    <img src={slackLogo} alt="Slack" className="h-4 w-4 mr-2" />
                    <span className="text-xs font-medium">Send latest post to Slack</span>
                  </Button>
                </div>

                 {/* Monthly Growth Chart */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {t.metrics.impressions}
                      </span>
                      <span className="text-xs text-muted-foreground/70 ml-2">
                        {language === 'fr' ? '• Année en cours 2025' : '• Current year 2025'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-success">
                      <TrendingUp className="h-3 w-3" />
                      <span>+265% {t.metrics.growth}</span>
                    </div>
                  </div>
                  <div className="h-32 flex items-end justify-between gap-1.5 px-2 bg-muted/20 rounded-lg p-3">
                    {monthlyData.map((data) => (
                      <div key={data.month} className="flex flex-col items-center gap-1.5 flex-1">
                        <div
                          className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-sm transition-all hover:from-primary hover:to-primary/70"
                          style={{
                            height: `${(data.impressions / 40000) * 100}%`,
                            minHeight: '16px'
                          }}
                        />
                        <span className="text-[9px] text-muted-foreground font-medium">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="mb-6">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {language === 'fr' ? 'Mois en cours - Octobre 2025' : 'Current month - October 2025'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-foreground">24</div>
                      <div className="text-xs text-muted-foreground">{t.metrics.posts}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-foreground">342</div>
                      <div className="text-xs text-muted-foreground">{t.metrics.likes}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-foreground">89</div>
                      <div className="text-xs text-muted-foreground">{t.metrics.comments}</div>
                    </div>
                  </div>
                </div>

                {/* Team Posts to Support */}
                <div className="mb-6 relative">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{language === 'fr' ? 'Posts à soutenir' : 'Team Posts to Support'}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-sm">👨‍💼</span>
                          <div className="flex-1">
                            <div className="text-xs font-medium mb-1">John Smith • 2h</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {language === 'fr' ? 'Comment nous avons transformé notre approche LinkedIn...' : 'How we transformed our LinkedIn approach...'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-sm">👩‍🦰</span>
                          <div className="flex-1">
                            <div className="text-xs font-medium mb-1">Sarah Chen • 5h</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {language === 'fr' ? '5 stratégies pour augmenter votre engagement...' : '5 strategies to boost your engagement...'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Unlock overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-[2px] rounded-lg">
                      <div className="text-center px-4 py-3 bg-card/90 rounded-lg border border-border/50 shadow-lg">
                        <div className="text-sm font-semibold mb-1 flex items-center justify-center gap-1.5 text-foreground">
                          <span className="text-base">🔒</span>
                          <span>
                            {language === 'fr' ? 'Débloquez le mode équipe' : 'Unlock team mode'}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {language === 'fr' ? 'Soutenez les posts de votre équipe' : 'Support your team posts'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leaderboard Preview */}
                <div className="mb-6 relative">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Leaderboard</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="space-y-2">
                      {leaderboardData.map((user) => (
                        <div
                          key={user.rank}
                          className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                            user.isCurrentUser
                              ? 'bg-primary/10 border border-primary/30'
                              : 'bg-muted/30'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{user.avatar}</span>
                            <div>
                              <div className={`text-sm font-medium ${user.isCurrentUser ? 'text-primary font-bold' : ''}`}>
                                #{user.rank} {user.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-primary">
                            {(user.impressions / 1000).toFixed(1)}k
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Unlock overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-[2px] rounded-lg">
                      <div className="text-center px-4 py-3 bg-card/90 rounded-lg border border-border/50 shadow-lg">
                        <div className="text-sm font-semibold mb-1 flex items-center justify-center gap-1.5 text-foreground">
                          <span className="text-base">🔒</span>
                          <span>
                            {language === 'fr' ? 'Débloquez le mode équipe' : 'Unlock team mode'}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {language === 'fr' ? 'Voir le classement complet' : 'See full leaderboard'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Slack Message Preview Animation */}
              {showSlackPreview && (
                <div className="absolute -right-8 top-1/2 transform translate-x-full -translate-y-1/2 animate-slide-in-right">
                  <Card className="w-80 p-4 shadow-xl border-2 bg-card">
                    <div className="flex items-start gap-3 mb-3">
                      <img src={slackLogo} alt="Slack" className="h-6 w-6" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">{t.slackMessage.title}</div>
                        <div className="text-sm text-muted-foreground mb-3">
                          {t.slackMessage.content}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {t.slackMessage.like}
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {t.slackMessage.comment}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visualized Section */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t.sections.visualized.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.sections.visualized.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-24 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Share2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t.sections.share.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.sections.share.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Team Mode Section */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t.sections.team.title}
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              {t.sections.team.subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-all">
              <Trophy className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.sections.team.feature1}</h3>
              <p className="text-sm text-muted-foreground">
                Track team performance with live rankings
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all">
              <Target className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.sections.team.feature2}</h3>
              <p className="text-sm text-muted-foreground">
                Aggregate insights across your entire team
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all">
              <img src={slackLogo} alt="Slack" className="h-8 w-8 mb-4" />
              <h3 className="font-semibold mb-2">{t.sections.team.feature3}</h3>
              <p className="text-sm text-muted-foreground">
                Centralize team communication and celebration
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t bg-gradient-to-br from-primary/5 via-destructive/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t.sections.cta.title}
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              {t.sections.cta.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-base h-14 px-8">
                <Chrome className="mr-2 h-5 w-5" />
                {t.sections.cta.button}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-base h-14 px-8">
                {t.sections.cta.secondary}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChromeExtension;
