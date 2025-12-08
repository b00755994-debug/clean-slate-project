import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const BetaBanner = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      closedBeta: "Bêta privée",
      text1: "avec nos partenaires pilotes jusqu'en décembre 2025.",
      signUp: "Contactez-nous",
      text2: "pour en faire partie et avoir accès en priorité au nouvel outil."
    },
    en: {
      closedBeta: "Private Beta",
      text1: "with our pilot partners until December 2025.",
      signUp: "Book a call with us",
      text2: "to be part of it and get priority access to the new tool."
    }
  };

  const t = translations[language];

  return (
    <div className="border-b border-border bg-primary/5">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-sm">
          <Info className="h-4 w-4 flex-shrink-0 text-primary" />
          <p className="text-center text-foreground">
            <span className="font-semibold">{t.closedBeta}</span> {t.text1}
            <Link to="/beta" className="ml-1 no-underline transition-colors font-bold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent hover:opacity-80">
              {t.signUp}
            </Link>
            {" "}{t.text2}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BetaBanner;
