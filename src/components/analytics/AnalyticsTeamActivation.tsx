import { Users, UserCheck, FileText, HeartHandshake, MessageCircle, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { KPICard } from './KPICard';

// Mock data for Team Activation
const activationTimeData = [
  { period: 'S1', activeContributors: 8 },
  { period: 'S2', activeContributors: 10 },
  { period: 'S3', activeContributors: 9 },
  { period: 'S4', activeContributors: 12 },
  { period: 'S5', activeContributors: 11 },
  { period: 'S6', activeContributors: 14 },
  { period: 'S7', activeContributors: 13 },
  { period: 'S8', activeContributors: 15 },
];

const supportRateData = [
  { period: 'S1', supportRate: 42 },
  { period: 'S2', supportRate: 45 },
  { period: 'S3', supportRate: 48 },
  { period: 'S4', supportRate: 52 },
  { period: 'S5', supportRate: 55 },
  { period: 'S6', supportRate: 58 },
  { period: 'S7', supportRate: 61 },
  { period: 'S8', supportRate: 64 },
];

const activationChartConfig = {
  activeContributors: {
    label: 'Contributeurs actifs',
    color: 'hsl(221 83% 53%)',
  },
};

const supportChartConfig = {
  supportRate: {
    label: 'Taux de support',
    color: 'hsl(262 83% 58%)',
  },
};

export function AnalyticsTeamActivation() {
  return (
    <div className="space-y-6">
      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          icon={Users}
          label="Contributeurs actifs"
          value={15}
          change={12}
          tooltip="Nombre de membres connectés ayant publié au moins un post sur la période sélectionnée."
          color="blue"
        />
        <KPICard
          icon={Percent}
          label="% Contributeurs actifs"
          value={68}
          change={8}
          tooltip="Part des membres connectés ayant publié au moins un post sur la période."
          color="blue"
          suffix="%"
        />
        <KPICard
          icon={FileText}
          label="Moy. posts / contributeur"
          value="2.4"
          change={5}
          tooltip="Nombre moyen de posts publiés par contributeur actif."
          color="violet"
        />
        <KPICard
          icon={HeartHandshake}
          label="Taux de support collectif"
          value={64}
          change={6}
          tooltip="Pourcentage des interactions internes potentielles réellement effectuées. Calculé : (likes + commentaires internes) ÷ (nb posts × nb membres connectés)."
          color="violet"
          suffix="%"
        />
        <KPICard
          icon={UserCheck}
          label="Posts avec support interne"
          value={78}
          change={4}
          tooltip="Pourcentage des posts ayant reçu au moins un like ou commentaire interne."
          color="emerald"
          suffix="%"
        />
        <KPICard
          icon={MessageCircle}
          label="Interactions internes / post"
          value="3.2"
          change={9}
          tooltip="Nombre moyen de likes et commentaires internes par post (agrégé)."
          color="emerald"
        />
      </div>

      {/* 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 — Team Activation Over Time */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Activation de l'équipe
            </CardTitle>
            <CardDescription className="text-xs">
              Nombre de contributeurs actifs par semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={activationChartConfig} className="h-[240px] w-full">
              <BarChart data={activationTimeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                <XAxis
                  dataKey="period"
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
                      formatter={(value) => [`${value}`, 'Contributeurs']}
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

        {/* Chart 2 — Collective Support Over Time */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Évolution du support collectif
            </CardTitle>
            <CardDescription className="text-xs">
              Taux de support collectif par semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={supportChartConfig} className="h-[240px] w-full">
              <LineChart data={supportRateData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis
                  dataKey="period"
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
    </div>
  );
}
