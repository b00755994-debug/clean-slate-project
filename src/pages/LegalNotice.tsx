import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const LegalNotice = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Mentions légales",
      sections: [
        {
          title: "Éditeur du site et de la plateforme Superpump",
          content: `Nom de l'entreprise : [X]
Forme juridique : [X]
Capital social : [X]
Adresse du siège : [X]
Numéro d'immatriculation : [X]
Numéro de TVA : [X]
Email : [contact@X]`
        },
        {
          title: "Hébergement",
          content: `Fournisseur d'hébergement : [X]
Adresse : [X]`
        },
        {
          title: "Propriété intellectuelle",
          content: `Tous les contenus disponibles sur le site et la plateforme Superpump (textes, visuels, logos, logiciels, marques) sont protégés par les lois sur la propriété intellectuelle et restent la propriété exclusive de Superpump ou de ses concédants de licence.

Toute reproduction ou utilisation non autorisée est interdite.`
        }
      ]
    },
    en: {
      title: "Legal Notice",
      sections: [
        {
          title: "Publisher of the website and the Superpump platform",
          content: `Company name: [X]
Legal form: [X]
Share capital: [X]
Registered address: [X]
Registration number: [X]
VAT number: [X]
Email: [contact@X]`
        },
        {
          title: "Hosting",
          content: `Hosting provider: [X]
Address: [X]`
        },
        {
          title: "Intellectual property",
          content: `All content available on the Superpump website and platform (text, visuals, logos, software, trademarks) is protected by intellectual property laws and remains the exclusive property of Superpump or its licensors.

Any unauthorized reproduction or use is prohibited.`
        }
      ]
    }
  };

  const t = translations[language];

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
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
          <h1 className="text-4xl font-bold text-foreground mb-12">{t.title}</h1>
          
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

export default LegalNotice;
