import { useMemo, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapCell {
  day: string;
  hour: string;
  count: number;
}

interface PostingHeatmapProps {
  data: HeatmapCell[];
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const HOURS = ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h'];

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

  const { grid, maxCount } = useMemo(() => {
    const grid: Record<string, Record<string, number>> = {};
    let maxCount = 0;

    // Initialize grid
    DAYS.forEach(day => {
      grid[day] = {};
      HOURS.forEach(hour => {
        grid[day][hour] = 0;
      });
    });

    // Fill with data
    data.forEach(cell => {
      if (grid[cell.day] && grid[cell.day][cell.hour] !== undefined) {
        grid[cell.day][cell.hour] = cell.count;
        if (cell.count > maxCount) maxCount = cell.count;
      }
    });

    return { grid, maxCount };
  }, [data]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="w-full">
        {/* Grid */}
        <div className="flex flex-col gap-1">
          {/* Header row - Days */}
          <div className="flex gap-1 ml-10">
            {DAYS.map(day => (
              <div
                key={day}
                className="flex-1 text-xs text-muted-foreground text-center font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {HOURS.map(hour => (
            <div key={hour} className="flex gap-1 items-center">
              {/* Hour label */}
              <div className="w-10 text-xs text-muted-foreground text-right pr-2">
                {hour}
              </div>
              
              {/* Cells for each day */}
              {DAYS.map(day => {
                const count = grid[day][hour];
                const colorClass = getColorIntensity(count, maxCount);
                
                return (
                  <Tooltip key={`${day}-${hour}`}>
                    <TooltipTrigger asChild>
                      <div
                        className={`flex-1 aspect-[2/1] rounded-sm ${colorClass} transition-colors cursor-default min-h-[24px]`}
                        onMouseEnter={() => setHoveredCell({ day, hour, count })}
                        onMouseLeave={() => setHoveredCell(null)}
                        role="gridcell"
                        aria-label={`${day} ${hour}: ${count} posts`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm font-medium">{day} {hour}</p>
                      <p className="text-xs text-muted-foreground">{count} post{count !== 1 ? 's' : ''}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Moins</span>
          <div className="flex gap-0.5">
            <div className="w-4 h-3 rounded-sm bg-muted" />
            <div className="w-4 h-3 rounded-sm bg-primary/20" />
            <div className="w-4 h-3 rounded-sm bg-primary/40" />
            <div className="w-4 h-3 rounded-sm bg-primary/60" />
            <div className="w-4 h-3 rounded-sm bg-primary" />
          </div>
          <span>Plus</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
