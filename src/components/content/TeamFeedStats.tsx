import { FileText, Users, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    posts: 'Posts',
    postsTooltip: 'Nombre total de posts publiés sur les 30 derniers jours glissants',
    contributors: 'Contributeurs',
    contributorsTooltip: 'Nombre de membres ayant publié au moins un post sur les 30 derniers jours glissants',
    last30Days: '30 derniers jours',
  },
  en: {
    posts: 'Posts',
    postsTooltip: 'Total posts published over the last rolling 30 days',
    contributors: 'Contributors',
    contributorsTooltip: 'Members who published at least one post over the last rolling 30 days',
    last30Days: 'Last 30 days',
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
      tooltip: t.postsTooltip,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Users,
      value: activeMembers,
      label: t.contributors,
      tooltip: t.contributorsTooltip,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className={layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex items-start gap-3 justify-end'}>
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3 bg-card border-border/40 w-[145px] sm:w-[176px]"
        >
          <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${stat.bgColor}`}>
            <stat.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.color}`} />
          </div>
          <div className="min-w-0 overflow-hidden">
            <p className="text-base sm:text-lg font-bold text-foreground leading-none truncate">
              {stat.value}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {stat.label}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px] text-xs">
                    {stat.tooltip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
