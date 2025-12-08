import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Politique de confidentialité",
      content: "Le contenu sera fourni prochainement."
    },
    en: {
      title: "Privacy Policy",
      content: "Content will be provided soon."
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">{t.title}</h1>
          <p className="text-muted-foreground">{t.content}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
