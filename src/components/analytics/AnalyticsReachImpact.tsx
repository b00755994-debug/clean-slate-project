import { useState } from 'react';
import { Eye, TrendingUp, MousePointerClick, MessageCircle } from 'lucide-react';
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
import { PeriodSelector } from './PeriodSelector';
import { reachKPIs, reachEngagementTrendData, impressionsDistribution } from './mockData';

const trendConfig = {
  impressions: {
    label: 'Impressions',
    color: 'hsl(263 70% 55%)',
  },
  engagementRate: {
    label: "Taux d'engagement (%)",
    color: 'hsl(199 89% 48%)',
  },
};

const distributionConfig = {
  count: {
    label: 'Nombre de posts',
    color: 'hsl(263 70% 55%)',
  },
};

export function AnalyticsReachImpact() {
  const [trendPeriod, setTrendPeriod] = useState<'6' | '12'>('6');
  
  const trendData = trendPeriod === '6' ? reachEngagementTrendData.slice(-6) : reachEngagementTrendData;

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Eye}
          label="Impressions totales"
          value={reachKPIs.totalImpressions.value.toLocaleString()}
          change={reachKPIs.totalImpressions.change}
          tooltip="Nombre total de fois où les posts ont été affichés sur LinkedIn pendant la période sélectionnée (agrégé)."
          color="violet"
        />
        <KPICard
          icon={TrendingUp}
          label="Moy. impressions / post"
          value={reachKPIs.avgImpressionsPerPost.value.toLocaleString()}
          change={reachKPIs.avgImpressionsPerPost.change}
          tooltip="Nombre moyen d'impressions générées par post."
          color="blue"
        />
        <KPICard
          icon={MousePointerClick}
          label="Taux d'engagement"
          value={reachKPIs.engagementRate.value}
          change={reachKPIs.engagementRate.change}
          tooltip="Ratio entre le total des interactions (likes et commentaires) et le total des impressions sur la période."
          color="emerald"
          suffix="%"
        />
        <KPICard
          icon={MessageCircle}
          label="Taux de commentaires"
          value={reachKPIs.commentRate.value}
          change={reachKPIs.commentRate.change}
          tooltip="Ratio entre le nombre total de commentaires et le total des interactions (likes + commentaires) sur la période sélectionnée."
          color="amber"
          suffix="%"
        />
      </div>

      {/* 2 Charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 — Reach & Engagement Over Time */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Portée & engagement dans le temps
                </CardTitle>
                <CardDescription className="text-xs">
                  Évolution mensuelle des impressions et du taux d'engagement
                </CardDescription>
              </div>
              <PeriodSelector value={trendPeriod} onChange={setTrendPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-[280px] w-full">
              <LineChart
                data={trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs fill-muted-foreground"
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs fill-muted-foreground"
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs fill-muted-foreground"
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        if (name === 'impressions') {
                          return [`${Number(value).toLocaleString()} `, 'Impressions'];
                        }
                        return [`${value} %`, "Taux d'engagement"];
                      }}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="impressions"
                  stroke="var(--color-impressions)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-impressions)', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="engagementRate"
                  stroke="var(--color-engagementRate)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'var(--color-engagementRate)', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Chart 2 — Posts Distribution by Impressions */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Distribution des posts par impressions
            </CardTitle>
            <CardDescription className="text-xs">
              Répartition des posts selon leur niveau de visibilité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={distributionConfig} className="h-[280px] w-full">
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
                      formatter={(value) => [`${value} `, 'posts']}
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
    </div>
  );
}
