import { Button } from "@/components/ui/button";
import { Zap, Languages } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const translations = {
    fr: {
      solution: "Notre solution",
      slackIntegration: "Slack App",
      testimonials: "Témoignages",
      pricing: "Tarifs",
      login: "Se connecter",
      joinBeta: "Rejoindre la Beta"
    },
    en: {
      solution: "Our solution",
      slackIntegration: "Slack App",
      testimonials: "Testimonials",
      pricing: "Pricing",
      login: "Sign in",
      joinBeta: "Join the Beta"
    }
  };

  const t = translations[language];

  const handleNavClick = (sectionId: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">superpump</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => handleNavClick('solution')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.solution}</button>
            <button onClick={() => handleNavClick('slack-integration')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.slackIntegration}</button>
            <button onClick={() => handleNavClick('temoignages')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.testimonials}</button>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.pricing}</Link>
          </nav>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary transition-all">
                  <Languages className="h-4 w-4" />
                  <span className="text-sm font-medium">{language.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('fr')}>Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/auth">
              <Button variant="ghost" className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary transition-all">{t.login}</Button>
            </Link>
            <Link to="/beta">
              <Button variant="hero">{t.joinBeta}</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
