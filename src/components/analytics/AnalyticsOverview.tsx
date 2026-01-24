import { useState } from 'react';
import { FileText, Eye, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { KPICard } from './KPICard';
import { PeriodSelector } from './PeriodSelector';
import { overviewKPIs, trendData } from './mockData';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    totalPosts: 'Total Posts',
    totalImpressions: 'Total Impressions',
    activeContributors: 'Contributeurs actifs',
    avgPostsPerContributor: 'Moy. posts/contributeur',
    tooltips: {
      totalPosts: 'Nombre total de posts LinkedIn publiés par les membres connectés pendant la période sélectionnée.',
      totalImpressions: 'Nombre total de fois où ces posts ont été affichés sur LinkedIn (agrégé).',
      activeContributors: 'Nombre de membres connectés ayant publié au moins un post pendant la période.',
      avgPostsPerContributor: 'Nombre moyen de posts publiés par contributeur actif.',
    },
    chartTitles: {
      postsTrend: 'Évolution des publications',
      impressionsTrend: 'Évolution des impressions',
    },
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  },
  en: {
    totalPosts: 'Total Posts',
    totalImpressions: 'Total Impressions',
    activeContributors: 'Active Contributors',
    avgPostsPerContributor: 'Avg. Posts/Contributor',
    tooltips: {
      totalPosts: 'Total number of LinkedIn posts published by connected team members during the selected period.',
      totalImpressions: 'Total number of times these posts were displayed on LinkedIn (aggregated).',
      activeContributors: 'Number of connected team members who published at least one post during the period.',
      avgPostsPerContributor: 'Average number of posts published per active contributor.',
    },
    chartTitles: {
      postsTrend: 'Posts Trend',
      impressionsTrend: 'Impressions Trend',
    },
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
};

const monthKeyToIndex: Record<string, number> = {
  'Jan': 0, 'Fév': 1, 'Mar': 2, 'Avr': 3, 'Mai': 4, 'Juin': 5,
  'Juil': 6, 'Août': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Déc': 11,
};

export function AnalyticsOverview() {
  const [postsPeriod, setPostsPeriod] = useState<'6' | '12'>('6');
  const [impressionsPeriod, setImpressionsPeriod] = useState<'6' | '12'>('6');
  const { language } = useLanguage();
  const t = translations[language];

  const postsData = postsPeriod === '6' ? trendData.slice(-6) : trendData;
  const impressionsData = impressionsPeriod === '6' ? trendData.slice(-6) : trendData;

  // Translate month labels
  const translateMonth = (month: string) => {
    const index = monthKeyToIndex[month];
    return index !== undefined ? t.months[index] : month;
  };

  const postsChartConfig = {
    posts: {
      label: 'Posts',
      color: 'hsl(210 90% 40%)',
    },
  };

  const impressionsChartConfig = {
    impressions: {
      label: 'Impressions',
      color: 'hsl(263 70% 55%)',
    },
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={FileText}
          label={t.totalPosts}
          value={overviewKPIs.totalPosts.value}
          change={overviewKPIs.totalPosts.change}
          tooltip={t.tooltips.totalPosts}
          color="blue"
        />
        <KPICard
          icon={Eye}
          label={t.totalImpressions}
          value={overviewKPIs.totalImpressions.value}
          change={overviewKPIs.totalImpressions.change}
          tooltip={t.tooltips.totalImpressions}
          color="violet"
        />
        <KPICard
          icon={Users}
          label={t.activeContributors}
          value={overviewKPIs.activeContributors.value}
          change={overviewKPIs.activeContributors.change}
          tooltip={t.tooltips.activeContributors}
          color="emerald"
        />
        <KPICard
          icon={TrendingUp}
          label={t.avgPostsPerContributor}
          value={overviewKPIs.avgPostsPerContributor.value}
          change={overviewKPIs.avgPostsPerContributor.change}
          tooltip={t.tooltips.avgPostsPerContributor}
          color="amber"
        />
      </div>

      {/* Trend Charts - Two separate charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts Trend Chart */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                {t.chartTitles.postsTrend}
              </CardTitle>
              <PeriodSelector value={postsPeriod} onChange={setPostsPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={postsChartConfig} className="h-[250px] w-full">
              <LineChart
                data={postsData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
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
                  tickLine={false}
                  axisLine={false}
                  className="text-xs fill-muted-foreground"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [`${value} `, 'Posts']}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="posts"
                  stroke="var(--color-posts)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-posts)', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Impressions Trend Chart */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4 text-violet-600" />
                {t.chartTitles.impressionsTrend}
              </CardTitle>
              <PeriodSelector value={impressionsPeriod} onChange={setImpressionsPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={impressionsChartConfig} className="h-[250px] w-full">
              <LineChart
                data={impressionsData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
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
                  tickLine={false}
                  axisLine={false}
                  className="text-xs fill-muted-foreground"
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [`${Number(value).toLocaleString()} `, 'Impressions']}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="var(--color-impressions)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-impressions)', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
