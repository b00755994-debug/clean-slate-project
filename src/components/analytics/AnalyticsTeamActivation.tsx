import { Users, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { KPICard } from './KPICard';
import { activationData, activationKPIs } from './mockData';

const activeContributorsConfig = {
  activeContributors: {
    label: 'Contributeurs actifs',
    color: 'hsl(152 60% 45%)',
  },
};

const avgPostsConfig = {
  avgPosts: {
    label: 'Moy. posts/contributeur',
    color: 'hsl(152 60% 35%)',
  },
};

const supportRateConfig = {
  supportRate: {
    label: 'Taux de support',
    color: 'hsl(152 60% 50%)',
  },
};

export function AnalyticsTeamActivation() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICard
          icon={Users}
          label="Contributeurs actifs (30j)"
          value={activationKPIs.contributorsActivePercent.value}
          change={activationKPIs.contributorsActivePercent.change}
          tooltip="Share of connected users who posted at least once in the last 30 days."
          color="emerald"
          suffix="%"
        />
        <KPICard
          icon={MessageCircle}
          label="Moy. interactions internes/post"
          value={activationKPIs.avgInternalInteractions.value}
          change={activationKPIs.avgInternalInteractions.change}
          tooltip="Average number of internal likes or comments received per post (aggregated)."
          color="emerald"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Contributors Bar Chart */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Contributeurs actifs par semaine
            </CardTitle>
            <CardDescription className="text-xs">
              Nombre de membres ayant publié au moins une fois par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={activeContributorsConfig} className="h-[220px] w-full">
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
                  content={<ChartTooltipContent />}
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

        {/* Avg Posts per Contributor Line Chart */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Moy. publications par contributeur
            </CardTitle>
            <CardDescription className="text-xs">
              Régularité de publication au sein de l'équipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={avgPostsConfig} className="h-[220px] w-full">
              <LineChart data={activationData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  domain={[0, 5]}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="monotone"
                  dataKey="avgPosts"
                  stroke="var(--color-avgPosts)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-avgPosts)', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Support Rate Chart - Full Width */}
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Évolution du taux de support collectif
          </CardTitle>
          <CardDescription className="text-xs">
            Pourcentage d'interactions internes réalisées par rapport au potentiel total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={supportRateConfig} className="h-[220px] w-full">
            <LineChart data={activationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${value}%`, 'Taux de support']}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="supportRate"
                stroke="var(--color-supportRate)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-supportRate)', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
