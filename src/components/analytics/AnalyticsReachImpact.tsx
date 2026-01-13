import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { KPICard } from './KPICard';
import { reachKPIs, impressionsTrendData, impressionsDistribution } from './mockData';

const impressionsConfig = {
  impressions: {
    label: 'Total impressions',
    color: 'hsl(263 70% 55%)',
  },
  withSupport: {
    label: 'Avec support interne',
    color: 'hsl(263 70% 75%)',
  },
};

const distributionConfig = {
  count: {
    label: 'Nombre de posts',
    color: 'hsl(263 70% 55%)',
  },
};

export function AnalyticsReachImpact() {
  return (
    <div className="space-y-6">
      {/* KPI Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          icon={Eye}
          label="Moy. impressions par post"
          value={reachKPIs.avgImpressionsPerPost.value}
          change={reachKPIs.avgImpressionsPerPost.change}
          tooltip="Average visibility generated per post during the period."
          color="violet"
        />
      </div>

      {/* Impressions Trend Chart */}
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Évolution des impressions totales
          </CardTitle>
          <CardDescription className="text-xs">
            Comparaison entre toutes les impressions et celles des posts ayant reçu du support interne
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={impressionsConfig} className="h-[280px] w-full">
            <LineChart
              data={impressionsTrendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                className="text-xs fill-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-xs fill-muted-foreground"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [Number(value).toLocaleString(), '']}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="impressions"
                stroke="var(--color-impressions)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-impressions)', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="withSupport"
                stroke="var(--color-withSupport)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--color-withSupport)', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Distribution Chart */}
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Distribution des impressions par post
          </CardTitle>
          <CardDescription className="text-xs">
            Répartition des posts par tranches de visibilité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={distributionConfig} className="h-[250px] w-full">
            <BarChart
              data={impressionsDistribution}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
              <XAxis
                dataKey="bucket"
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
                    formatter={(value) => [`${value} posts`, '']}
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
