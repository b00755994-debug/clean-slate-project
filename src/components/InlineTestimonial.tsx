import { Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InlineTestimonialProps {
  quote: {
    fr: string;
    en: string;
  };
  author: string;
  role: {
    fr: string;
    en: string;
  };
  company: string;
}

const InlineTestimonial = ({ quote, author, role, company }: InlineTestimonialProps) => {
  const { language } = useLanguage();

  return (
    <div className="relative max-w-2xl mx-auto my-10">
      {/* Decorative gradient blur */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-2xl blur-lg opacity-60" />
      
      <div className="relative bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        {/* Quote icon */}
        <div className="absolute -top-4 left-6">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
            <Quote className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>

        {/* Quote text */}
        <blockquote className="text-foreground text-base leading-relaxed pt-4 pb-4 italic">
          "{quote[language]}"
        </blockquote>

        {/* Author info */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-destructive flex items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-primary-foreground">
              {author.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{author}</p>
            <p className="text-muted-foreground text-xs">
              {role[language]} <span className="text-primary">@</span> {company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineTestimonial;