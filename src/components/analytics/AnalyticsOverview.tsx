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

export function AnalyticsOverview() {
  const [postsPeriod, setPostsPeriod] = useState<'6' | '12'>('6');
  const [impressionsPeriod, setImpressionsPeriod] = useState<'6' | '12'>('6');

  const postsData = postsPeriod === '6' ? trendData.slice(-6) : trendData;
  const impressionsData = impressionsPeriod === '6' ? trendData.slice(-6) : trendData;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={FileText}
          label="Total Posts"
          value={overviewKPIs.totalPosts.value}
          change={overviewKPIs.totalPosts.change}
          tooltip="Total number of LinkedIn posts published by connected team members during the selected period."
          color="blue"
        />
        <KPICard
          icon={Eye}
          label="Total Impressions"
          value={overviewKPIs.totalImpressions.value}
          change={overviewKPIs.totalImpressions.change}
          tooltip="Total number of times these posts were displayed on LinkedIn (aggregated)."
          color="violet"
        />
        <KPICard
          icon={Users}
          label="Contributeurs actifs"
          value={overviewKPIs.activeContributors.value}
          change={overviewKPIs.activeContributors.change}
          tooltip="Number of connected team members who published at least one post during the period."
          color="emerald"
        />
        <KPICard
          icon={TrendingUp}
          label="Moy. posts/contributeur"
          value={overviewKPIs.avgPostsPerContributor.value}
          change={overviewKPIs.avgPostsPerContributor.change}
          tooltip="Average number of posts published per active contributor."
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
                Évolution des publications
              </CardTitle>
              <PeriodSelector value={postsPeriod} onChange={setPostsPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={postsChartConfig} className="h-[220px] w-full">
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
                Évolution des impressions
              </CardTitle>
              <PeriodSelector value={impressionsPeriod} onChange={setImpressionsPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={impressionsChartConfig} className="h-[220px] w-full">
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
