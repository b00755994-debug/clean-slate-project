import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    newPost: 'nouveau post',
    newPosts: 'nouveaux posts',
    show: 'Afficher',
  },
  en: {
    newPost: 'new post',
    newPosts: 'new posts',
    show: 'Show',
  }
};

interface NewPostsBannerProps {
  count: number;
  onRefresh: () => void;
}

export function NewPostsBanner({ count, onRefresh }: NewPostsBannerProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (count === 0) return null;

  const postLabel = count > 1 ? t.newPosts : t.newPost;

  return (
    <button
      onClick={onRefresh}
      className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/20 
                 text-primary text-sm font-medium rounded-lg 
                 flex items-center justify-center gap-2 
                 transition-all duration-200 mb-3
                 border border-primary/20 hover:border-primary/30
                 shadow-sm hover:shadow-md"
    >
      <RefreshCw className="h-4 w-4" />
      <span>{count} {postLabel}</span>
      <span className="text-primary/70">—</span>
      <span>{t.show}</span>
    </button>
  );
}
