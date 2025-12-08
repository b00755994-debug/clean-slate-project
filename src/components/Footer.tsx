import { Linkedin, Twitter, Youtube, Slack } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      product: "Produit",
      features: "Fonctionnalités",
      pricing: "Tarifs",
      integrations: "Intégrations",
      resources: "Ressources",
      blog: "Blog",
      faq: "FAQ",
      company: "Entreprise",
      about: "À propos",
      contact: "Contact",
      legal: "Légal",
      privacy: "Confidentialité",
      terms: "CGU",
      legalNotice: "Mentions légales",
      copyright: "© 2025 superpump. Tous droits réservés."
    },
    en: {
      product: "Product",
      features: "Features",
      pricing: "Pricing",
      integrations: "Integrations",
      resources: "Resources",
      blog: "Blog",
      faq: "FAQ",
      company: "Company",
      about: "About",
      contact: "Contact",
      legal: "Legal",
      privacy: "Privacy",
      terms: "Terms",
      legalNotice: "Legal Notice",
      copyright: "© 2025 superpump. All rights reserved."
    }
  };

  const t = translations[language];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t.product}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#features" className="hover:text-foreground transition-colors">{t.features}</a></li>
              <li><a href="/pricing" className="hover:text-foreground transition-colors">{t.pricing}</a></li>
              <li><a href="/#slack-integration" className="hover:text-foreground transition-colors">{t.integrations}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t.resources}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">{t.blog}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t.faq}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t.company}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-foreground transition-colors">{t.about}</a></li>
              <li><a href="/beta" className="hover:text-foreground transition-colors">{t.contact}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t.legal}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/privacy" className="hover:text-foreground transition-colors">{t.privacy}</a></li>
              <li><a href="/terms" className="hover:text-foreground transition-colors">{t.terms}</a></li>
              <li><a href="/legal-notice" className="hover:text-foreground transition-colors">{t.legalNotice}</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">{t.copyright}</div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-primary hover:opacity-80 transition-opacity"><Linkedin className="h-5 w-5" /></a>
            <a href="/#slack-integration" className="text-primary hover:opacity-80 transition-opacity"><Slack className="h-5 w-5" /></a>
            <a href="#" className="text-primary hover:opacity-80 transition-opacity"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-primary hover:opacity-80 transition-opacity"><Youtube className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
