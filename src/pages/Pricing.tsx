import { useState } from "react";
import { Check, PlusCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import InlineTestimonial from "@/components/InlineTestimonial";

const translations = {
  fr: {
    title: "Tarifs transparents.",
    titleHighlight: "Payez selon vos besoins.",
    subtitle: "Choisissez le plan adapté à vos besoins",
    monthly: "Mensuel",
    annual: "Annuel",
    annualDiscount: "-20%",
    perMonth: "/mois",
    perYear: "/an",
    equivalentMonth: "soit",
    perMonthLabel: "/mois",
    users: "utilisateurs",
    perUser: "par utilisateur",
    mostPopular: "Le plus populaire",
    getStarted: "Démarrer",
    contactUs: "Nous contacter",
    customQuote: "Sur devis",
    save: "Économisez",
    simulatorTitle: "Simulez le prix selon le nombre d'utilisateurs",
    plans: {
      free: {
        name: "Individual",
        description: "Démarrez gratuitement",
        features: [
          "Alertes Slack pour mobiliser votre équipe",
          "Analytics basiques",
          "Support email",
          "Intégration Slack"
        ],
        limit: "1 utilisateur",
        valueProposition: "Testez Superpump en solo et passez à Pro quand vous voulez embarquer votre équipe."
      },
      pro: {
        name: "Pro",
        description: "Amplifiez la voix de votre équipe",
        features: [
          "Tout ce qui est inclus dans Individual",
          "Banque de contenu validé par l'entreprise",
          "Analyses complètes de la performance de votre équipe",
          "Classements gamifiés",
          "Détection de leads ICP",
          "Export vers votre CRM",
          "Support prioritaire"
        ]
      },
      enterprise: {
        name: "Enterprise",
        description: "Pour les grandes organisations",
        features: [
          "Tout ce qui est inclus dans Pro",
          "Intégration CRM native",
          "SSO / SAML",
          "Account Manager dédié",
          "SLA garanti",
          "Formation personnalisée"
        ],
        valueProposition: "Transformez chaque employé en ambassadeur de marque. Bénéficiez d'un accompagnement personnalisé et d'une intégration fluide avec vos outils existants."
      }
    }
  },
  en: {
    title: "Transparent pricing.",
    titleHighlight: "Pay as you grow.",
    subtitle: "Choose the plan that fits your needs",
    monthly: "Monthly",
    annual: "Yearly",
    annualDiscount: "-20%",
    perMonth: "/month",
    perYear: "/year",
    equivalentMonth: "equivalent to",
    perMonthLabel: "/month",
    users: "users",
    perUser: "per user",
    mostPopular: "Most popular",
    getStarted: "Get started",
    contactUs: "Contact us",
    customQuote: "Custom quote",
    save: "save",
    simulatorTitle: "Simulate the price based on the number of users",
    plans: {
      free: {
        name: "Individual",
        description: "Get started for free",
        features: [
          "Slack alerts to rally your team",
          "Basic individual analytics",
          "Email support",
          "Slack integration"
        ],
        limit: "1 user",
        valueProposition: "Try Superpump solo and switch to Pro when you want to bring your team onboard."
      },
      pro: {
        name: "Pro",
        description: "Amplify your team's voice",
        features: [
          "Everything in Individual",
          "Content library + AI suggestions",
          "Team-scale advanced analytics",
          "Gamified leaderboards",
          "ICP lead detection",
          "Export data to your CRM",
          "Priority support"
        ]
      },
      enterprise: {
        name: "Enterprise",
        description: "For large organizations",
        features: [
          "Everything in Pro",
          "Native CRM integration",
          "SSO / SAML",
          "Dedicated Account Manager",
          "Guaranteed SLA",
          "Custom training"
        ],
        valueProposition: "Turn every employee into a brand ambassador. Get personalized support and seamless integration with your existing tools."
      }
    }
  }
};

const Pricing = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [isAnnual, setIsAnnual] = useState(true);
  const [proUsers, setProUsers] = useState([10]);

  // Pricing constants - simple per-user pricing
  const PRO_PRICE_PER_USER = 3.00;
  const MIN_USERS = 1;
  const PRO_MAX = 200;
  const ANNUAL_DISCOUNT = 0.20;

  // Calculate price based on users and period
  const calculatePrice = (pricePerUser: number, users: number, annual: boolean) => {
    const monthlyPrice = users * pricePerUser;
    return annual ? monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT) : monthlyPrice;
  };

  const calculateMonthlyEquivalent = (annualPrice: number) => {
    return annualPrice / 12;
  };

  const proPrice = calculatePrice(PRO_PRICE_PER_USER, proUsers[0], isAnnual);

  const proSavings = isAnnual ? calculatePrice(PRO_PRICE_PER_USER, proUsers[0], false) * 12 - proPrice : 0;

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',');
  };

  const handleProInputChange = (value: string) => {
    const num = parseInt(value) || MIN_USERS;
    const clamped = Math.min(Math.max(num, MIN_USERS), PRO_MAX);
    setProUsers([clamped]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">{t.title}</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Billing toggle - Segmented Control */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-muted p-1 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !isAnnual
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.monthly}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isAnnual
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.annual}
              <span className="text-xs bg-success/15 text-success px-2 py-0.5 rounded-full font-semibold">
                {t.annualDiscount}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="relative border border-border hover:border-primary/50 hover:shadow-lg transition-all flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">{t.plans.free.name}</CardTitle>
              <CardDescription>{t.plans.free.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              {/* Price + Features container */}
              <div className="flex-grow">
                {/* Price display */}
                <div className="min-h-[100px]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">0€</span>
                    <span className="text-muted-foreground">{t.perMonth}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.plans.free.limit}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mt-4">
                  {t.plans.free.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <PlusCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Separator */}
              <div className="border-t border-border/50 my-4" />

              {/* Value proposition */}
              <div className="min-h-[140px]">
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  {t.plans.free.valueProposition}
                </p>
              </div>

              {/* CTA */}
              <Button asChild variant="hero" className="w-full mt-4">
                <Link to="/beta">{t.getStarted}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan - Featured */}
          <Card className="relative border border-border bg-gradient-to-b from-slack/5 to-transparent hover:border-primary/50 hover:shadow-lg transition-all flex flex-col">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <Badge className="bg-card border border-foreground/20 px-4 py-1.5 text-sm font-semibold shadow-lg cursor-default hover:bg-card">
                <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                  {t.mostPopular}
                </span>
              </Badge>
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">{t.plans.pro.name}</CardTitle>
              <CardDescription>{t.plans.pro.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              {/* Price + Features container - grows to align divider */}
              <div className="flex-grow">
                {/* Price display */}
                <div className="min-h-[100px]">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-4xl font-bold text-foreground">
                      {formatPrice(isAnnual ? calculateMonthlyEquivalent(proPrice) : proPrice)}€
                    </span>
                    <span className="text-muted-foreground">
                      {t.perMonth}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isAnnual
                      ? formatPrice(PRO_PRICE_PER_USER * (1 - ANNUAL_DISCOUNT))
                      : PRO_PRICE_PER_USER.toFixed(2).replace('.', ',')}€ {t.perUser}
                  </p>
                  {isAnnual && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPrice(proPrice)}€ {t.perYear}
                      {proSavings > 0 && (
                        <span className="text-success ml-2">({t.save} {formatPrice(proSavings)}€)</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mt-4">
                  {t.plans.pro.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {i === 0 ? (
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      ) : (
                        <PlusCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      )}
                      <span className={i === 0 ? 'font-semibold text-primary' : 'text-muted-foreground'}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Separator */}
              <div className="border-t border-border/50 my-4" />

              {/* Simulator section */}
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50 min-h-[140px]">
                {/* Simulator header */}
                <p className="text-sm font-semibold text-foreground mb-4">
                  {t.simulatorTitle}
                </p>

                {/* User input */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{language === 'fr' ? 'Nombre d\'utilisateurs' : 'Number of users'}</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={proUsers[0]}
                      onChange={(e) => handleProInputChange(e.target.value)}
                      min={MIN_USERS}
                      max={PRO_MAX}
                      className="w-16 h-8 text-center text-sm bg-background border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Enhanced slider */}
                <div className="space-y-2">
                  <Slider
                    value={proUsers}
                    onValueChange={setProUsers}
                    min={MIN_USERS}
                    max={PRO_MAX}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{MIN_USERS}</span>
                    <span className="text-muted-foreground/60">50</span>
                    <span className="text-muted-foreground/60">100</span>
                    <span className="text-muted-foreground/60">150</span>
                    <span>{PRO_MAX}+</span>
                  </div>
                </div>

              </div>

              {/* CTA */}
              <Button asChild variant="hero" className="w-full mt-4">
                <Link to="/beta">{t.getStarted}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative border border-border hover:border-primary/50 hover:shadow-lg transition-all flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">{t.plans.enterprise.name}</CardTitle>
              <CardDescription>{t.plans.enterprise.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              {/* Price + Features container */}
              <div className="flex-grow">
                {/* Price display */}
                <div className="min-h-[100px]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {t.customQuote}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'fr' ? 'Adapté à vos besoins' : 'Tailored to your needs'}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mt-4">
                  {t.plans.enterprise.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {i === 0 ? (
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      ) : (
                        <PlusCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      )}
                      <span className={i === 0 ? 'font-semibold text-primary' : 'text-muted-foreground'}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Separator */}
              <div className="border-t border-border/50 my-4" />

              {/* Value proposition */}
              <div className="min-h-[140px]">
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  {t.plans.enterprise.valueProposition}
                </p>
              </div>

              {/* CTA */}
              <Button asChild variant="outline" className="w-full mt-4 border-2 border-primary bg-card text-primary hover:bg-primary/10 hover:scale-105 transition-all">
                <Link to="/beta">{t.contactUs}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ROI Testimonial */}
        <div className="mt-16">
          <InlineTestimonial
            quote={{
              fr: "À 3€ par utilisateur, c'est ridicule comparé à ce qu'on paye en ads. Un seul lead qualifié généré via LinkedIn d'un collègue rembourse 1 an d'abonnement de toute l'équipe !",
              en: "At €3 per user, it's ridiculous compared to what we pay in ads. A single qualified lead generated via a colleague's LinkedIn post pays for 1 year of the whole team's subscription!"
            }}
            author="Marc Lefebvre"
            role={{ fr: "Sales Director", en: "Sales Director" }}
            company="Enterprise SaaS"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
