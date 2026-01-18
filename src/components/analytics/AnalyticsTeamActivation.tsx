import { useState } from 'react';
import { Users, UserCheck, FileText, HeartHandshake, MessageCircle, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { KPICard } from './KPICard';
import { PeriodSelector } from './PeriodSelector';

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

// 12 months of support rate data
const supportRateData = [
  { month: 'Jan', supportRate: 38 },
  { month: 'Fév', supportRate: 40 },
  { month: 'Mar', supportRate: 42 },
  { month: 'Avr', supportRate: 44 },
  { month: 'Mai', supportRate: 47 },
  { month: 'Juin', supportRate: 50 },
  { month: 'Juil', supportRate: 48 },
  { month: 'Août', supportRate: 45 },
  { month: 'Sep', supportRate: 52 },
  { month: 'Oct', supportRate: 56 },
  { month: 'Nov', supportRate: 60 },
  { month: 'Déc', supportRate: 64 },
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
  const [activationPeriod, setActivationPeriod] = useState<'6' | '12'>('6');
  const [supportPeriod, setSupportPeriod] = useState<'6' | '12'>('6');

  const activationData = activationPeriod === '6' ? activationTimeData.slice(-6) : activationTimeData;
  const supportData = supportPeriod === '6' ? supportRateData.slice(-6) : supportRateData;

  return (
    <div className="space-y-6">
      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

        {/* Chart 2 — Collective Support Over Time */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Évolution du support collectif
                </CardTitle>
                <CardDescription className="text-xs">
                  Taux de support collectif par mois
                </CardDescription>
              </div>
              <PeriodSelector value={supportPeriod} onChange={setSupportPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={supportChartConfig} className="h-[240px] w-full">
              <LineChart data={supportData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                      formatter={(value) => [`${value} %`, 'Taux de support']}
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
