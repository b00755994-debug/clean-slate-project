import { FileText, Eye, TrendingUp, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TeamFeedStatsProps {
  totalPosts: number;
  totalImpressions: number;
  engagementRate: number;
  activeMembers: number;
  layout?: 'row' | 'grid';
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

export function TeamFeedStats({ 
  totalPosts, 
  totalImpressions, 
  engagementRate, 
  activeMembers,
  layout = 'row'
}: TeamFeedStatsProps) {
  const stats = [
    {
      icon: FileText,
      value: totalPosts,
      label: 'Posts',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Eye,
      value: formatNumber(totalImpressions),
      label: 'Impressions',
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
    {
      icon: TrendingUp,
      value: `${engagementRate.toFixed(1)}%`,
      label: 'Engagement',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      icon: Users,
      value: activeMembers,
      label: 'Membres',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className={layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-2 md:grid-cols-4 gap-3'}>
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className="p-3 flex items-center gap-3 bg-card border-border/40"
        >
          <div className={`p-2 rounded-lg ${stat.bgColor}`}>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground leading-none">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {stat.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
