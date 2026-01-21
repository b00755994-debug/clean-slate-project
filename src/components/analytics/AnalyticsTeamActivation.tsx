import { useState } from 'react';
import { Users, FileText, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { KPICard } from './KPICard';
import { PeriodSelector } from './PeriodSelector';
import { PostingHeatmap } from './PostingHeatmap';
import { postingHeatmapData } from './mockData';

// 12 months of mock data for Team Activation
const activationTimeData = [
  { month: 'Jan', activeContributors: 6 },
  { month: 'Fév', activeContributors: 7 },
  { month: 'Mar', activeContributors: 8 },
  { month: 'Avr', activeContributors: 8 },
  { month: 'Mai', activeContributors: 9 },
  { month: 'Juin', activeContributors: 10 },
  { month: 'Juil', activeContributors: 9 },
  { month: 'Août', activeContributors: 8 },
  { month: 'Sep', activeContributors: 11 },
  { month: 'Oct', activeContributors: 12 },
  { month: 'Nov', activeContributors: 14 },
  { month: 'Déc', activeContributors: 15 },
];

const activationChartConfig = {
  activeContributors: {
    label: 'Contributeurs actifs',
    color: 'hsl(221 83% 53%)',
  },
};

export function AnalyticsTeamActivation() {
  const [activationPeriod, setActivationPeriod] = useState<'6' | '12'>('6');

  const activationData = activationPeriod === '6' ? activationTimeData.slice(-6) : activationTimeData;

  return (
    <div className="space-y-6">
      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          icon={Users}
          label="Contributeurs actifs (#)"
          value={15}
          change={12}
          tooltip="Nombre de membres connectés ayant publié au moins un post sur la période sélectionnée."
          color="blue"
        />
        <KPICard
          icon={Percent}
          label="Contributeurs actifs (%)"
          value={68}
          change={8}
          tooltip="Part des membres connectés ayant publié au moins un post sur la période."
          color="blue"
          suffix="%"
        />
        <KPICard
          icon={FileText}
          label="Posts / contributeur"
          value="2.4"
          change={5}
          tooltip="Nombre moyen de posts publiés par contributeur actif."
          color="violet"
        />
      </div>

      {/* 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 — Team Activation Over Time */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Activation de l'équipe
                </CardTitle>
                <CardDescription className="text-xs">
                  Nombre de contributeurs actifs par mois
                </CardDescription>
              </div>
              <PeriodSelector value={activationPeriod} onChange={setActivationPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={activationChartConfig} className="h-[240px] w-full">
              <BarChart data={activationData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs fill-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs fill-muted-foreground"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [`${value} `, 'Contributeurs']}
                    />
                  }
                />
                <Bar
                  dataKey="activeContributors"
                  fill="var(--color-activeContributors)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Chart 2 — Posting Heatmap */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Moments de publication
              </CardTitle>
              <CardDescription className="text-xs">
                Répartition des posts par jour et heure
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <PostingHeatmap data={postingHeatmapData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
