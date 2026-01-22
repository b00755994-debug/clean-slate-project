import { FileText, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    posts: 'Posts',
    members: 'Membres',
  },
  en: {
    posts: 'Posts',
    members: 'Members',
  }
};

interface TeamFeedStatsProps {
  totalPosts: number;
  totalImpressions?: number;
  engagementRate?: number;
  activeMembers: number;
  layout?: 'row' | 'grid';
}

export function TeamFeedStats({ 
  totalPosts, 
  activeMembers,
  layout = 'row'
}: TeamFeedStatsProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const stats = [
    {
      icon: FileText,
      value: totalPosts,
      label: t.posts,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Users,
      value: activeMembers,
      label: t.members,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className={layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex gap-3 justify-end'}>
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3 bg-card border-border/40 min-w-0 overflow-hidden"
        >
          <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${stat.bgColor}`}>
            <stat.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.color}`} />
          </div>
          <div className="min-w-0 overflow-hidden">
            <p className="text-base sm:text-lg font-bold text-foreground leading-none truncate">
              {stat.value}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
              {stat.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
