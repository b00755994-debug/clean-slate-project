import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar } from 'lucide-react';

interface PeriodSelectorProps {
  value: '6' | '12';
  onChange: (value: '6' | '12') => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as '6' | '12')}
        className="border rounded-md p-0.5 bg-muted/50"
      >
        <ToggleGroupItem
          value="6"
          className="text-xs px-2.5 py-1 h-auto data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          6 derniers mois
        </ToggleGroupItem>
        <ToggleGroupItem
          value="12"
          className="text-xs px-2.5 py-1 h-auto data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          12 derniers mois
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
