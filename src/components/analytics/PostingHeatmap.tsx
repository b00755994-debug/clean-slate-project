import { useMemo, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeatmapCell {
  day: string;
  hour: string;
  count: number;
  impressions: number;
}

interface PostingHeatmapProps {
  data: HeatmapCell[];
}

const translations = {
  fr: {
    days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    hours: ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h'],
    less: 'Moins',
    more: 'Plus',
    post: 'post',
    posts: 'posts',
    bestPerformance: 'Meilleure performance',
  },
  en: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    hours: ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'],
    less: 'Less',
    more: 'More',
    post: 'post',
    posts: 'posts',
    bestPerformance: 'Best performance',
  },
};

// Map French day keys from data to day index
const dayKeyToIndex: Record<string, number> = {
  'Lun': 0, 'Mar': 1, 'Mer': 2, 'Jeu': 3, 'Ven': 4, 'Sam': 5, 'Dim': 6,
};

// Map French hour keys from data to hour index
const hourKeyToIndex: Record<string, number> = {
  '6h': 0, '8h': 1, '10h': 2, '12h': 3, '14h': 4, '16h': 5, '18h': 6, '20h': 7,
};

function getColorIntensity(count: number, maxCount: number): string {
  if (count === 0) return 'bg-muted';
  const intensity = count / maxCount;
  
  if (intensity < 0.25) return 'bg-primary/20';
  if (intensity < 0.5) return 'bg-primary/40';
  if (intensity < 0.75) return 'bg-primary/60';
  return 'bg-primary';
}

export function PostingHeatmap({ data }: PostingHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const { language } = useLanguage();
  const t = translations[language];

  // Use French keys for data lookup (since mock data uses French keys)
  const DAYS_KEYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const HOURS_KEYS = ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h'];

  const { grid, impressionsGrid, maxCount, topPerformingSlots } = useMemo(() => {
    const grid: Record<string, Record<string, number>> = {};
    const impressionsGrid: Record<string, Record<string, number>> = {};
    let maxCount = 0;

    // Initialize grids with French keys (matching data)
    DAYS_KEYS.forEach(day => {
      grid[day] = {};
      impressionsGrid[day] = {};
      HOURS_KEYS.forEach(hour => {
        grid[day][hour] = 0;
        impressionsGrid[day][hour] = 0;
      });
    });

    // Fill with data and collect all cells with impressions
    const allCells: { day: string; hour: string; count: number; impressions: number; avgImpressions: number }[] = [];
    data.forEach(cell => {
      if (grid[cell.day] && grid[cell.day][cell.hour] !== undefined) {
        grid[cell.day][cell.hour] = cell.count;
        impressionsGrid[cell.day][cell.hour] = cell.impressions;
        if (cell.count > maxCount) maxCount = cell.count;
        if (cell.count > 0) {
          const avgImpressions = cell.impressions / cell.count;
          allCells.push({ day: cell.day, hour: cell.hour, count: cell.count, impressions: cell.impressions, avgImpressions });
        }
      }
    });

    // Find top 3 performing slots by AVERAGE IMPRESSIONS PER POST
    const topPerformingSlots = new Set<string>();
    allCells
      .sort((a, b) => b.avgImpressions - a.avgImpressions)
      .slice(0, 3)
      .forEach(cell => {
        topPerformingSlots.add(`${cell.day}-${cell.hour}`);
      });

    return { grid, impressionsGrid, maxCount, topPerformingSlots };
  }, [data]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="w-full h-[225px] flex flex-col">
        {/* Grid */}
        <div className="flex flex-col gap-0.5 flex-1">
          {/* Header row - Days */}
          <div className="flex gap-0.5 ml-8">
            {t.days.map((day, index) => (
              <div
                key={day}
                className="flex-1 text-xs text-muted-foreground text-center font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {HOURS_KEYS.map((hourKey, hourIndex) => (
            <div key={hourKey} className="flex gap-0.5 items-center flex-1">
              {/* Hour label */}
              <div className="w-8 text-[10px] text-muted-foreground text-right pr-1">
                {t.hours[hourIndex]}
              </div>
              
              {/* Cells for each day */}
              {DAYS_KEYS.map((dayKey, dayIndex) => {
                const count = grid[dayKey][hourKey];
                const colorClass = getColorIntensity(count, maxCount);
                const isTopPerforming = topPerformingSlots.has(`${dayKey}-${hourKey}`);
                
                return (
                  <Tooltip key={`${dayKey}-${hourKey}`}>
                    <TooltipTrigger asChild>
                      <div
                        className={`flex-1 rounded-sm ${colorClass} transition-colors cursor-default min-h-[18px] ${
                          isTopPerforming ? 'ring-2 ring-orange-500 ring-offset-1 ring-offset-background' : ''
                        }`}
                        onMouseEnter={() => setHoveredCell({ day: dayKey, hour: hourKey, count, impressions: impressionsGrid[dayKey][hourKey] })}
                        onMouseLeave={() => setHoveredCell(null)}
                        role="gridcell"
                        aria-label={`${t.days[dayIndex]} ${t.hours[hourIndex]}: ${count} ${count !== 1 ? t.posts : t.post}${isTopPerforming ? ` - ${t.bestPerformance}` : ''}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm font-medium">{t.days[dayIndex]} {t.hours[hourIndex]}</p>
                      <p className="text-xs text-muted-foreground">{count} {count !== 1 ? t.posts : t.post}</p>
                      <p className="text-xs text-muted-foreground">{impressionsGrid[dayKey][hourKey].toLocaleString()} impressions</p>
                      {isTopPerforming && (
                        <p className="text-xs text-orange-500 font-medium mt-1">🔥 {t.bestPerformance}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{t.less}</span>
            <div className="flex gap-0.5">
              <div className="w-4 h-3 rounded-sm bg-muted" />
              <div className="w-4 h-3 rounded-sm bg-primary/20" />
              <div className="w-4 h-3 rounded-sm bg-primary/40" />
              <div className="w-4 h-3 rounded-sm bg-primary/60" />
              <div className="w-4 h-3 rounded-sm bg-primary" />
            </div>
            <span>{t.more}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded-sm bg-primary/40 ring-2 ring-orange-500 ring-offset-1 ring-offset-background" />
            <span className="text-orange-500 font-medium">{t.bestPerformance}</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
