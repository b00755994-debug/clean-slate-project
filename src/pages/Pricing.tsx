import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Check, PlusCircle, Loader2, Crown } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import InlineTestimonial from "@/components/InlineTestimonial";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PLANS } from "@/lib/stripe";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";

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
        name: "Free",
        description: "Toutes les features, jusqu'à 3 utilisateurs",
        features: [
          "Alertes Slack pour mobiliser votre équipe",
          "Analyses avancées à l'échelle de votre équipe",
          "Feed des contenus de votre équipe",
          "Audience & brand insights",
          "Support prioritaire"
        ],
        limit: "3 utilisateurs max",
        valueProposition: "Profitez de toute l'expérience Superpump gratuitement. Passez à Pro quand votre équipe dépasse 3 membres."
      },
      pro: {
        name: "Pro",
        description: "Amplifiez la voix de votre équipe",
        features: [
          "Toutes les features incluses",
          "De 10 à 200 utilisateurs",
          "Support prioritaire"
        ]
      },
      business: {
        name: "Business",
        description: "De l'engagement aux opportunités",
        features: [
          "Tout ce qui est inclus dans Pro",
          "Audience analytics & ICP scoring",
          "Internal support insights",
          "Engaged prospects export (CSV/CRM)"
        ]
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
        name: "Free",
        description: "All features, up to 3 users",
        features: [
          "Slack alerts to rally your team",
          "Advanced team analytics",
          "Centralized team feed",
          "Monthly leaderboard",
          "Audience & brand insights"
        ],
        limit: "Up to 3 users",
        valueProposition: "Get the full Superpump experience for free. Upgrade to Pro when your team grows beyond 3 members."
      },
      pro: {
        name: "Pro",
        description: "Amplify your team's voice",
        features: [
          "All features included",
          "From 10 to 200 users",
          "Priority support"
        ]
      },
      business: {
        name: "Business",
        description: "From engagement to opportunities",
        features: [
          "Everything in Pro",
          "Audience analytics & ICP scoring",
          "Internal support insights",
          "Engaged prospects export (CSV/CRM)"
        ]
      }
    }
  }
};

const Pricing = () => {
  // Force English only for pricing page
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const t = translations.en;
  const { subscribed, quantity: currentQuantity, openCustomerPortal, isLoading: isSubLoading } = useSubscription();

  const [isAnnual, setIsAnnual] = useState(true);
  const [proUsers, setProUsers] = useState([10]);
  const [businessUsers, setBusinessUsers] = useState([10]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  


  // Initialize slider to current quantity when subscription data loads
  useEffect(() => {
    if (subscribed && currentQuantity) {
      setProUsers([currentQuantity]);
    }
  }, [subscribed, currentQuantity]);

  // Pricing constants - per user
  const PRO_PRICE_PER_USER = 4;
  const BUSINESS_PRICE_PER_USER = 6;

  const MIN_USERS = 10;
  const MAX_USERS = 200;
  const ANNUAL_DISCOUNT = 0.20;

  // Calculate prices
  const proPerUser = isAnnual ? PRO_PRICE_PER_USER * (1 - ANNUAL_DISCOUNT) : PRO_PRICE_PER_USER;
  const businessPerUser = isAnnual ? BUSINESS_PRICE_PER_USER * (1 - ANNUAL_DISCOUNT) : BUSINESS_PRICE_PER_USER;

  const proMonthlyTotal = proPerUser * proUsers[0];
  const businessMonthlyTotal = businessPerUser * businessUsers[0];

  const proAnnualTotal = proPerUser * proUsers[0] * 12;
  const businessAnnualTotal = businessPerUser * businessUsers[0] * 12;

  const proSavings = isAnnual ? PRO_PRICE_PER_USER * proUsers[0] * 12 - proAnnualTotal : 0;
  const businessSavings = isAnnual ? BUSINESS_PRICE_PER_USER * businessUsers[0] * 12 - businessAnnualTotal : 0;

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',');
  };

  const roundToStep = (n: number) => Math.round(n / 10) * 10;

  const handleProCheckout = async () => {
    if (!user) {
      navigate("/auth?mode=signup");
      return;
    }
    setIsCheckoutLoading(true);
    try {
      const priceId = isAnnual ? STRIPE_PLANS.pro.annual.priceId : STRIPE_PLANS.pro.monthly.priceId;
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, quantity: proUsers[0] },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleProInputChange = (value: string) => {
    const num = parseInt(value) || MIN_USERS;
    const clamped = Math.min(Math.max(roundToStep(num), MIN_USERS), MAX_USERS);
    setProUsers([clamped]);
  };

  const handleBusinessInputChange = (value: string) => {
    const num = parseInt(value) || MIN_USERS;
    const clamped = Math.min(Math.max(roundToStep(num), MIN_USERS), MAX_USERS);
    setBusinessUsers([clamped]);
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
          <Card className="relative border border-border transition-all flex flex-col">
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
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.plans.free.valueProposition}
                </p>
              </div>
              </div>

              {/* CTA */}
              <Button asChild variant="outline" className="w-full mt-4 font-semibold">
                <Link to={user ? "/dashboard" : "/auth?mode=signup"}>
                  Start for free
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan - Featured */}
          <Card className="relative border border-border bg-gradient-to-b from-slack/5 to-transparent transition-all flex flex-col">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <Badge className="bg-card border border-foreground/20 px-4 py-1.5 text-sm font-semibold shadow-lg cursor-default hover:bg-card">
                <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                  {subscribed ? 'Your Plan' : t.mostPopular}
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
                      {formatPrice(proPerUser)}€
                    </span>
                    <span className="text-muted-foreground">
                      /user{t.perMonth}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatPrice(proMonthlyTotal)}€/month for {proUsers[0]} users
                  </p>
                  {isAnnual && proSavings > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed {formatPrice(proAnnualTotal)}€{t.perYear} <span className="text-success font-medium">(save {formatPrice(proSavings)}€)</span>
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
                  <span className="text-sm text-muted-foreground">Number of users</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={proUsers[0]}
                      onChange={(e) => handleProInputChange(e.target.value)}
                      min={MIN_USERS}
                      max={MAX_USERS}
                      step={10}
                      className="w-20 h-8 text-center text-sm bg-background border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Enhanced slider */}
                <div className="space-y-2">
                  <Slider
                    value={proUsers}
                    onValueChange={setProUsers}
                    min={MIN_USERS}
                    max={MAX_USERS}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{MIN_USERS}</span>
                    <span className="text-muted-foreground/60">50</span>
                    <span className="text-muted-foreground/60">100</span>
                    <span className="text-muted-foreground/60">150</span>
                    <span>{MAX_USERS}+</span>
                  </div>
                </div>

              </div>

              {/* CTA */}
              {subscribed ? (
                <div className="mt-4">
                  <Button
                    onClick={openCustomerPortal}
                    variant={currentQuantity && proUsers[0] !== currentQuantity ? "default" : "outline"}
                    className={`w-full font-semibold gap-2 ${
                      currentQuantity && proUsers[0] !== currentQuantity
                        ? proUsers[0] > currentQuantity
                          ? 'bg-success hover:bg-success/90 text-white'
                          : 'bg-destructive hover:bg-destructive/90 text-white'
                        : ''
                    }`}
                  >
                    {currentQuantity && proUsers[0] !== currentQuantity ? (
                      <>
                        {proUsers[0] > currentQuantity ? 'Upgrade' : 'Downgrade'} to {proUsers[0]} seats
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4" />
                        Manage billing
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button onClick={handleProCheckout} disabled={isCheckoutLoading} variant="hero" className="w-full mt-4">
                  {isCheckoutLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {user ? 'Subscribe to Pro' : 'Sign up to subscribe'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Business Plan */}
          <Card className="relative border border-border flex flex-col transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">{t.plans.business.name}</CardTitle>
              <CardDescription>{t.plans.business.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              {/* Price + Features container */}
              <div className="flex-grow">
                {/* Price display */}
                <div className="min-h-[100px]">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-4xl font-bold text-foreground">
                      {formatPrice(businessPerUser)}€
                    </span>
                    <span className="text-muted-foreground">
                      /user{t.perMonth}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatPrice(businessMonthlyTotal)}€/month for {businessUsers[0]} users
                  </p>
                  {isAnnual && businessSavings > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed {formatPrice(businessAnnualTotal)}€{t.perYear} <span className="text-success font-medium">(save {formatPrice(businessSavings)}€)</span>
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mt-4">
                  {t.plans.business.features.map((feature, i) => (
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
                  <span className="text-sm text-muted-foreground">Number of users</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={businessUsers[0]}
                      onChange={(e) => handleBusinessInputChange(e.target.value)}
                      min={MIN_USERS}
                      max={MAX_USERS}
                      step={10}
                      className="w-20 h-8 text-center text-sm bg-background border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Enhanced slider */}
                <div className="space-y-2">
                  <Slider
                    value={businessUsers}
                    onValueChange={setBusinessUsers}
                    min={MIN_USERS}
                    max={MAX_USERS}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{MIN_USERS}</span>
                    <span className="text-muted-foreground/60">50</span>
                    <span className="text-muted-foreground/60">100</span>
                    <span className="text-muted-foreground/60">150</span>
                    <span>{MAX_USERS}+</span>
                  </div>
                </div>

              </div>

              {/* CTA */}
              <div className="mt-4">
                <Button disabled className="w-full bg-muted text-muted-foreground font-semibold cursor-not-allowed hover:bg-muted">
                  🥷 Coming soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROI Testimonial */}
        <div className="mt-16">
          <InlineTestimonial
            quote={{
              fr: "À 4€ par utilisateur, c'est ridicule comparé à ce qu'on paye en ads. Un seul lead qualifié généré via LinkedIn d'un collègue rembourse 1 an d'abonnement de toute l'équipe !",
              en: "At €4 per user, it's ridiculous compared to what we pay in ads. A single qualified lead generated via a colleague's LinkedIn post pays for 1 year of the whole team's subscription!"
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
