import { cn } from '@/lib/utils';

interface PeriodSelectorProps {
  value: '6' | '12';
  onChange: (value: '6' | '12') => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-1 gap-1">
      <button
        onClick={() => onChange('6')}
        className={cn(
          "text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200",
          value === '6'
            ? "bg-background text-foreground shadow-sm border border-border/50"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        6 months
      </button>
      <button
        onClick={() => onChange('12')}
        className={cn(
          "text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200",
          value === '12'
            ? "bg-background text-foreground shadow-sm border border-border/50"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        12 months
      </button>
    </div>
  );
}
