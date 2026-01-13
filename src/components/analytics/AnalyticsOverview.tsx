import { FileText, Eye, Users, TrendingUp, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { KPICard } from './KPICard';
import { overviewKPIs, trendData } from './mockData';

const chartConfig = {
  posts: {
    label: 'Posts',
    color: 'hsl(210 90% 40%)',
  },
  impressions: {
    label: 'Impressions',
    color: 'hsl(263 70% 55%)',
  },
};

export function AnalyticsOverview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
        <KPICard
          icon={Heart}
          label="Taux de support collectif"
          value={overviewKPIs.collectiveSupportRate.value}
          change={overviewKPIs.collectiveSupportRate.change}
          tooltip="Percentage of potential internal support interactions that actually occurred. Calculated as: (Total internal likes and comments) ÷ (Number of posts × Number of connected team members)."
          color="rose"
          suffix="%"
        />
      </div>

      {/* Trend Chart */}
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Évolution des publications et impressions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
                tickFormatter={(value) => `${value}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                className="text-xs fill-muted-foreground"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === 'impressions') {
                        return [`${Number(value).toLocaleString()}`, 'Impressions'];
                      }
                      return [value, 'Posts'];
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="posts"
                stroke="var(--color-posts)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-posts)', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
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
  );
}
