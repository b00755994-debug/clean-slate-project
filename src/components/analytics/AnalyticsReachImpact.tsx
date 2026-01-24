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
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const translations = {
  fr: {
    kpis: {
      totalImpressions: 'Impressions totales',
      avgImpressionsPerPost: 'Moy. impressions / post',
      engagementRate: "Taux d'engagement",
      commentRate: 'Taux de commentaires',
    },
    tooltips: {
      totalImpressions: "Nombre total de fois où les posts ont été affichés sur LinkedIn pendant la période sélectionnée (agrégé).",
      avgImpressionsPerPost: "Nombre moyen d'impressions générées par post.",
      engagementRate: "Ratio entre le total des interactions (likes et commentaires) et le total des impressions sur la période.",
      commentRate: "Ratio entre le nombre total de commentaires et le total des interactions (likes + commentaires) sur la période sélectionnée.",
    },
    charts: {
      trendTitle: 'Portée & engagement dans le temps',
      trendDescription: "Évolution mensuelle des impressions et du taux d'engagement",
      distributionTitle: 'Distribution des posts par impressions',
      distributionDescription: 'Répartition des posts selon leur niveau de visibilité',
    },
    labels: {
      impressions: 'Impressions',
      engagementRate: "Taux d'engagement (%)",
      numberOfPosts: 'Nombre de posts',
      posts: 'posts',
    },
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  },
  en: {
    kpis: {
      totalImpressions: 'Total Impressions',
      avgImpressionsPerPost: 'Avg. Impressions / Post',
      engagementRate: 'Engagement Rate',
      commentRate: 'Comment Rate',
    },
    tooltips: {
      totalImpressions: "Total number of times posts were displayed on LinkedIn during the selected period (aggregated).",
      avgImpressionsPerPost: "Average number of impressions generated per post.",
      engagementRate: "Ratio between total interactions (likes and comments) and total impressions during the period.",
      commentRate: "Ratio between total comments and total interactions (likes + comments) during the selected period.",
    },
    charts: {
      trendTitle: 'Reach & Engagement Over Time',
      trendDescription: 'Monthly evolution of impressions and engagement rate',
      distributionTitle: 'Posts Distribution by Impressions',
      distributionDescription: 'Distribution of posts by visibility level',
    },
    labels: {
      impressions: 'Impressions',
      engagementRate: 'Engagement Rate (%)',
      numberOfPosts: 'Number of posts',
      posts: 'posts',
    },
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
};

const monthKeyToIndex: Record<string, number> = {
  'Jan': 0, 'Fév': 1, 'Mar': 2, 'Avr': 3, 'Mai': 4, 'Juin': 5,
  'Juil': 6, 'Août': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Déc': 11,
};

export function AnalyticsReachImpact() {
  const [trendPeriod, setTrendPeriod] = useState<'6' | '12'>('6');
  const { language } = useLanguage();
  const t = translations[language];
  const { reachKPIs, reachTrendData, impressionsDistribution } = useAnalyticsData();
  
  const trendData = trendPeriod === '6' ? reachTrendData.slice(-6) : reachTrendData;

  const translateMonth = (month: string) => {
    const index = monthKeyToIndex[month];
    return index !== undefined ? t.months[index] : month;
  };

  const trendConfig = {
    impressions: {
      label: t.labels.impressions,
      color: 'hsl(263 70% 55%)',
    },
    engagementRate: {
      label: t.labels.engagementRate,
      color: 'hsl(199 89% 48%)',
    },
  };

  const distributionConfig = {
    count: {
      label: t.labels.numberOfPosts,
      color: 'hsl(263 70% 55%)',
    },
  };

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Eye}
          label={t.kpis.totalImpressions}
          value={reachKPIs.totalImpressions.value}
          change={reachKPIs.totalImpressions.change}
          tooltip={t.tooltips.totalImpressions}
          color="violet"
        />
        <KPICard
          icon={TrendingUp}
          label={t.kpis.avgImpressionsPerPost}
          value={reachKPIs.avgImpressionsPerPost.value}
          change={reachKPIs.avgImpressionsPerPost.change}
          tooltip={t.tooltips.avgImpressionsPerPost}
          color="blue"
        />
        <KPICard
          icon={MousePointerClick}
          label={t.kpis.engagementRate}
          value={reachKPIs.engagementRate.value}
          change={reachKPIs.engagementRate.change}
          tooltip={t.tooltips.engagementRate}
          color="emerald"
          suffix="%"
        />
        <KPICard
          icon={MessageCircle}
          label={t.kpis.commentRate}
          value={reachKPIs.commentRate.value}
          change={reachKPIs.commentRate.change}
          tooltip={t.tooltips.commentRate}
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
                  {t.charts.trendTitle}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t.charts.trendDescription}
                </CardDescription>
              </div>
              <PeriodSelector value={trendPeriod} onChange={setTrendPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-[220px] w-full">
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
                  tickFormatter={translateMonth}
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
                      formatter={(value, name) => (
                        <span className="flex items-center gap-1">
                          <span className="text-muted-foreground">
                            {name === 'impressions' ? t.labels.impressions : t.kpis.engagementRate}:
                          </span>
                          <span className="font-medium">
                            {name === 'impressions' ? (Math.round(Number(value) / 100) * 100).toLocaleString() : `${value} %`}
                          </span>
                        </span>
                      )}
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
              {t.charts.distributionTitle}
            </CardTitle>
            <CardDescription className="text-xs">
              {t.charts.distributionDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={distributionConfig} className="h-[220px] w-full">
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
                      formatter={(value) => (
                        <span className="flex items-center gap-1">
                          <span className="text-muted-foreground">{t.labels.numberOfPosts}:</span>
                          <span className="font-medium">{value}</span>
                        </span>
                      )}
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
