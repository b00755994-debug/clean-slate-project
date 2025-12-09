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
    <div className="relative bg-muted/30 border-l-4 border-primary rounded-lg p-6 my-8 max-w-3xl mx-auto">
      <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
      <blockquote className="text-foreground/90 italic leading-relaxed mb-4 pr-10">
        "{quote[language]}"
      </blockquote>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">
            {author.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{author}</p>
          <p className="text-muted-foreground text-xs">{role[language]}, {company}</p>
        </div>
      </div>
    </div>
  );
};

export default InlineTestimonial;