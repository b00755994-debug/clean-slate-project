import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Conditions Générales d'Utilisation",
      lastUpdated: "Dernière mise à jour : [X]",
      sections: [
        {
          title: "1. Objet",
          content: `Les présentes Conditions Générales d'Utilisation ("CGU") régissent l'accès et l'utilisation de la plateforme Superpump, une solution SaaS B2B conçue pour soutenir l'activation des employés et les analyses LinkedIn agrégées.`
        },
        {
          title: "2. Éligibilité",
          content: `Superpump est destiné uniquement aux utilisateurs professionnels.
Les utilisateurs doivent être autorisés par leur organisation pour accéder et utiliser la plateforme.`
        },
        {
          title: "3. Obligations des utilisateurs",
          content: `Les utilisateurs s'engagent à :
• Utiliser la plateforme conformément aux lois et réglementations applicables
• Respecter les conditions et politiques de LinkedIn lors de la connexion de comptes tiers
• Ne pas utiliser la plateforme à des fins de collecte de données non autorisée ou de surveillance

Les utilisateurs s'engagent expressément à ne pas :
• Scraper ou tenter de scraper LinkedIn ou toute plateforme tierce
• Exporter ou revendre des données personnelles
• Identifier ou profiler des membres LinkedIn individuels
• Utiliser la plateforme pour du spam, de la collecte de prospects ou de la prospection non sollicitée

Superpump est conçu pour fonctionner en conformité avec les conditions et politiques API applicables de LinkedIn.`
        },
        {
          title: "4. Limitations de la plateforme",
          content: `Superpump fournit :
• Des analyses agrégées
• Des outils d'activation internes
• Des insights de performance privés et visibles uniquement par l'utilisateur

Superpump ne garantit pas :
• Des résultats spécifiques de portée, impressions ou engagement
• Des résultats commerciaux ou de performance des ventes`
        },
        {
          title: "5. Données et confidentialité",
          content: `Les données personnelles sont traitées conformément à notre Politique de Confidentialité, qui fait partie intégrante des présentes CGU.`
        },
        {
          title: "6. Disponibilité",
          content: `Nous nous efforçons de fournir une disponibilité raisonnable de la plateforme mais ne garantissons pas un service ininterrompu.
La maintenance ou les mises à jour peuvent temporairement limiter l'accès.`
        },
        {
          title: "7. Responsabilité",
          content: `Dans les limites permises par la loi :
• Superpump ne pourra être tenu responsable des dommages indirects ou consécutifs
• La responsabilité est limitée aux montants payés par le client au cours des [X] mois précédents`
        },
        {
          title: "8. Résiliation",
          content: `Nous nous réservons le droit de suspendre ou de résilier l'accès en cas de :
• Violation des présentes CGU
• Utilisation abusive de la plateforme
• Exigences légales ou de conformité`
        },
        {
          title: "9. Droit applicable",
          content: `Les présentes CGU sont régies par le droit français.
Tout litige relèvera de la compétence exclusive des tribunaux de [X].`
        }
      ]
    },
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated: [X]",
      sections: [
        {
          title: "1. Purpose",
          content: `These Terms of Service ("Terms") govern access to and use of the Superpump platform, a B2B SaaS solution designed to support employee activation and aggregated LinkedIn analytics.`
        },
        {
          title: "2. Eligibility",
          content: `Superpump is intended for business users only.
Users must be authorized by their organization to access and use the platform.`
        },
        {
          title: "3. User obligations",
          content: `Users agree to:
• Use the platform in compliance with applicable laws and regulations
• Respect LinkedIn's terms and policies when connecting third-party accounts
• Not misuse the platform for unauthorized data collection or surveillance

Users expressly agree not to:
• Scrape or attempt to scrape LinkedIn or any third-party platform
• Export or resell personal data
• Identify or profile individual LinkedIn members
• Use the platform for spam, lead harvesting, or unsolicited outreach

Superpump is designed to operate in compliance with LinkedIn's applicable API terms and policies.`
        },
        {
          title: "4. Platform limitations",
          content: `Superpump provides:
• Aggregated analytics
• Internal activation tools
• Private, self-visible performance insights

Superpump does not guarantee:
• Specific reach, impressions, or engagement outcomes
• Commercial results or sales performance`
        },
        {
          title: "5. Data and privacy",
          content: `Personal data is processed in accordance with our Privacy Policy, which forms an integral part of these Terms.`
        },
        {
          title: "6. Availability",
          content: `We aim to provide reasonable availability of the platform but do not guarantee uninterrupted service.
Maintenance or updates may temporarily limit access.`
        },
        {
          title: "7. Liability",
          content: `To the extent permitted by law:
• Superpump shall not be liable for indirect or consequential damages
• Liability is limited to the amounts paid by the customer over the previous [X] months`
        },
        {
          title: "8. Termination",
          content: `We reserve the right to suspend or terminate access in case of:
• Breach of these Terms
• Misuse of the platform
• Legal or compliance requirements`
        },
        {
          title: "9. Governing law",
          content: `These Terms are governed by French law.
Any dispute shall fall under the exclusive jurisdiction of the courts of [X].`
        }
      ]
    }
  };

  const t = translations[language];

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('•')) {
        return (
          <p key={index} className="text-muted-foreground ml-4">
            {line}
          </p>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-muted-foreground">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t.title}</h1>
          <p className="text-muted-foreground mb-12">{t.lastUpdated}</p>
          
          <div className="space-y-10">
            {t.sections.map((section, index) => (
              <section key={index} className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                <div className="space-y-1">
                  {formatContent(section.content)}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
