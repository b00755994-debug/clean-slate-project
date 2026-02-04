import { LucideIcon, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: number;
  tooltip: string;
  color?: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose';
  suffix?: string;
  periodLabel?: string;
}

const colorVariants = {
  blue: 'bg-blue-500/10 text-blue-600',
  violet: 'bg-violet-500/10 text-violet-600',
  emerald: 'bg-emerald-500/10 text-emerald-600',
  amber: 'bg-amber-500/10 text-amber-600',
  rose: 'bg-rose-500/10 text-rose-600',
};

export function KPICard({
  icon: Icon,
  label,
  value,
  change,
  tooltip,
  color = 'blue',
  suffix = '',
  periodLabel,
}: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;
  
  // Format value: round large numbers to nearest 100, smaller to integer
  const formatValue = (val: number | string): string => {
    if (typeof val !== 'number') return val;
    if (val >= 1000) {
      return (Math.round(val / 100) * 100).toLocaleString();
    }
    return Math.round(val).toLocaleString();
  };
  
  const formattedValue = formatValue(value);

  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className={cn('p-2 rounded-lg', colorVariants[color])}>
            <Icon className="w-4 h-4" />
          </div>
          {change !== undefined && (
            <div
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded',
                isPositive
                  ? 'text-emerald-600 bg-emerald-500/10'
                  : 'text-rose-600 bg-rose-500/10'
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-foreground">
            {formattedValue}{suffix}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {periodLabel && (
            <span className="text-[10px] text-muted-foreground/70 mt-0.5">
              {periodLabel}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
