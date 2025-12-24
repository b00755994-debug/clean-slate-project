import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Politique de confidentialité",
      lastUpdated: "Dernière mise à jour : [X]",
      sections: [
        {
          title: "1. Qui sommes-nous",
          content: `Superpump ("nous", "notre", "nos") est un produit SaaS B2B exploité par :

Nom de l'entreprise : [X]
Forme juridique : [X]
Adresse du siège : [X]
Numéro d'immatriculation : [X]
Email de contact : [privacy@X]

Superpump fournit des outils pour aider les entreprises à activer leurs employés et analyser leur présence LinkedIn grâce à des analyses agrégées et respectueuses de la vie privée.`
        },
        {
          title: "2. Données personnelles que nous traitons",
          content: `Nous ne traitons que les données personnelles strictement nécessaires à la fourniture de nos services.

**2.1 Données fournies directement par les utilisateurs**
• Prénom, nom
• Adresse email professionnelle
• Nom de l'entreprise et fonction
• Données d'authentification (identifiants hachés, tokens)

**2.2 Données relatives à l'utilisation du produit**
• Journaux d'utilisation de l'application
• Interactions avec les fonctionnalités
• Données techniques (adresse IP, type de navigateur, informations sur l'appareil)

**2.3 Données liées à LinkedIn**
Lorsqu'autorisé par l'utilisateur, Superpump peut accéder à des données LinkedIn limitées, strictement dans le cadre des conditions d'utilisation de l'API LinkedIn, notamment :
• Métriques de performance du contenu agrégées (ex. impressions, réactions, compteurs d'engagement)
• Insights d'audience agrégés (ex. distributions par secteur, fonction, niveau hiérarchique)

⚠️ Nous n'identifions pas, n'exposons pas et n'exportons pas les membres LinkedIn individuels qui interagissent avec le contenu.
⚠️ Nous ne stockons pas de données d'engagement LinkedIn au niveau individuel au-delà de ce qui est strictement nécessaire pour l'agrégation immédiate.`
        },
        {
          title: "3. Finalités du traitement",
          content: `Nous traitons les données personnelles aux fins suivantes :
• Fourniture et exploitation de la plateforme Superpump
• Activation des workflows internes (ex. notifications Slack)
• Fourniture d'analyses et d'insights de performance agrégés
• Amélioration des performances et de la fiabilité du produit
• Support client et communication
• Conformité légale et sécuritaire`
        },
        {
          title: "4. Base juridique (RGPD – Article 6)",
          content: `Nous traitons les données personnelles sur la base de :
• Exécution d'un contrat (Article 6.1.b RGPD)
• Intérêt légitime pour exploiter et améliorer un produit SaaS B2B (Article 6.1.f)
• Consentement, lorsque requis (Article 6.1.a)`
        },
        {
          title: "5. Conservation des données",
          content: `Nous conservons les données personnelles uniquement pour la durée nécessaire :
• Données de compte : pendant la durée de la relation contractuelle
• Journaux d'utilisation et techniques : jusqu'à [X] mois
• Données d'analyse agrégées : conservées sans identifiants personnels

Les données LinkedIn au niveau individuel, lorsqu'elles sont traitées de manière transitoire, ne sont pas stockées à long terme et sont agrégées ou supprimées rapidement.`
        },
        {
          title: "6. Partage des données et sous-traitants",
          content: `Nous ne vendons pas de données personnelles.

Les données peuvent être partagées avec des sous-traitants de confiance strictement nécessaires à l'exploitation du service, tels que :
• Fournisseurs d'hébergement et d'infrastructure : [X]
• Fournisseurs d'analyses : [X]
• Outils d'email et de communication : [X]
• Outils de support client : [X]

Tous les sous-traitants sont liés par des obligations contractuelles de protection des données.`
        },
        {
          title: "7. Transferts internationaux",
          content: `Si des données sont transférées en dehors de l'Union européenne, nous assurons des garanties appropriées, notamment :
• Clauses contractuelles types (CCT)
• Décisions d'adéquation lorsque applicables`
        },
        {
          title: "8. Mesures de sécurité",
          content: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données personnelles, notamment :
• Contrôles d'accès
• Chiffrement en transit et au repos
• Surveillance et journalisation
• Principe du moindre privilège`
        },
        {
          title: "9. Droits des utilisateurs",
          content: `Conformément au RGPD, les utilisateurs ont le droit de :
• Accéder à leurs données
• Rectifier les données inexactes
• Demander l'effacement
• Limiter ou s'opposer au traitement
• Portabilité des données

Les demandes peuvent être envoyées à : [privacy@X]`
        },
        {
          title: "10. Contact",
          content: `Pour toute question relative à la vie privée :
Email : [privacy@X]`
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: [X]",
      sections: [
        {
          title: "1. Who we are",
          content: `Superpump ("we", "our", "us") is a B2B SaaS product operated by:

Company name: [X]
Legal form: [X]
Registered address: [X]
Registration number: [X]
Contact email: [privacy@X]

Superpump provides tools to help companies activate employees and analyze their LinkedIn presence through aggregated, privacy-first analytics.`
        },
        {
          title: "2. Personal data we process",
          content: `We only process personal data that is strictly necessary to provide our services.

**2.1 Data provided directly by users**
• First name, last name
• Professional email address
• Company name and role
• Authentication data (hashed credentials, tokens)

**2.2 Data related to product usage**
• Application usage logs
• Feature interactions
• Technical data (IP address, browser type, device information)

**2.3 LinkedIn-related data**
When authorized by the user, Superpump may access limited LinkedIn data strictly within LinkedIn's API terms, including:
• Aggregated content performance metrics (e.g. impressions, reactions, engagement counts)
• Aggregated audience insights (e.g. industry, role, seniority distributions)

⚠️ We do not identify, expose, or export individual LinkedIn members who engage with content.
⚠️ We do not store individual-level LinkedIn engagement data beyond what is strictly required for immediate aggregation.`
        },
        {
          title: "3. Purpose of processing",
          content: `We process personal data for the following purposes:
• Providing and operating the Superpump platform
• Enabling internal activation workflows (e.g. Slack notifications)
• Delivering aggregated analytics and performance insights
• Improving product performance and reliability
• Customer support and communication
• Legal and security compliance`
        },
        {
          title: "4. Legal basis (GDPR – Article 6)",
          content: `We process personal data based on:
• Performance of a contract (Article 6.1.b GDPR)
• Legitimate interest to operate and improve a B2B SaaS product (Article 6.1.f)
• Consent, where required (Article 6.1.a)`
        },
        {
          title: "5. Data retention",
          content: `We retain personal data only for as long as necessary:
• Account data: for the duration of the contractual relationship
• Usage and technical logs: up to [X] months
• Aggregated analytics data: retained without personal identifiers

LinkedIn-related individual-level data, when transiently processed, is not stored long-term and is aggregated or deleted promptly.`
        },
        {
          title: "6. Data sharing & subprocessors",
          content: `We do not sell personal data.

Data may be shared with trusted subprocessors strictly necessary to operate the service, such as:
• Hosting and infrastructure providers: [X]
• Analytics providers: [X]
• Email and communication tools: [X]
• Customer support tools: [X]

All subprocessors are bound by contractual data protection obligations.`
        },
        {
          title: "7. International transfers",
          content: `If data is transferred outside the European Union, we ensure appropriate safeguards, including:
• Standard Contractual Clauses (SCCs)
• Adequacy decisions where applicable`
        },
        {
          title: "8. Security measures",
          content: `We implement appropriate technical and organizational measures to protect personal data, including:
• Access controls
• Encryption in transit and at rest
• Monitoring and logging
• Principle of least privilege`
        },
        {
          title: "9. User rights",
          content: `In accordance with GDPR, users have the right to:
• Access their data
• Rectify inaccurate data
• Request erasure
• Restrict or object to processing
• Data portability

Requests can be sent to: [privacy@X]`
        },
        {
          title: "10. Contact",
          content: `For any privacy-related questions:
Email: [privacy@X]`
        }
      ]
    }
  };

  const t = translations[language];

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-semibold text-foreground mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.startsWith('⚠️')) {
        return (
          <p key={index} className="text-amber-600 dark:text-amber-400 mt-2">
            {line}
          </p>
        );
      }
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

export default Privacy;
