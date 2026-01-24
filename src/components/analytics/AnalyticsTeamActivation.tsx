import { useState } from 'react';
import { Users, FileText, Percent, CalendarCheck } from 'lucide-react';
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
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    kpis: {
      activeContributorsCount: 'Contributeurs actifs (#)',
      activeContributorsPercent: 'Contributeurs actifs (%)',
      postsPerContributor: 'Posts / contributeur',
      postingRegularity: 'Régularité de publication',
    },
    tooltips: {
      activeContributorsCount: 'Nombre de membres connectés ayant publié au moins un post sur la période sélectionnée.',
      activeContributorsPercent: 'Part des membres connectés ayant publié au moins un post sur la période.',
      postsPerContributor: 'Nombre moyen de posts publiés par contributeur actif.',
      postingRegularity: 'Pourcentage de contributeurs actifs publiant au moins une fois par semaine (sur les 4 dernières semaines).',
    },
    chart: {
      title: "Activation de l'équipe",
      description: 'Nombre de contributeurs actifs par mois',
      contributors: 'Contributeurs',
    },
    heatmap: {
      title: 'Moments de publication',
      description: 'Répartition des posts par jour et heure',
    },
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  },
  en: {
    kpis: {
      activeContributorsCount: 'Active Contributors (#)',
      activeContributorsPercent: 'Active Contributors (%)',
      postsPerContributor: 'Posts / Contributor',
      postingRegularity: 'Posting Regularity',
    },
    tooltips: {
      activeContributorsCount: 'Number of connected members who published at least one post during the selected period.',
      activeContributorsPercent: 'Percentage of connected members who published at least one post during the period.',
      postsPerContributor: 'Average number of posts published per active contributor.',
      postingRegularity: 'Percentage of active contributors posting at least once per week (over the last 4 weeks).',
    },
    chart: {
      title: 'Team Activation',
      description: 'Number of active contributors per month',
      contributors: 'Contributors',
    },
    heatmap: {
      title: 'Posting Times',
      description: 'Distribution of posts by day and hour',
    },
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
};

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

const monthKeyToIndex: Record<string, number> = {
  'Jan': 0, 'Fév': 1, 'Mar': 2, 'Avr': 3, 'Mai': 4, 'Juin': 5,
  'Juil': 6, 'Août': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Déc': 11,
};

export function AnalyticsTeamActivation() {
  const [activationPeriod, setActivationPeriod] = useState<'6' | '12'>('6');
  const { language } = useLanguage();
  const t = translations[language];

  const activationData = activationPeriod === '6' ? activationTimeData.slice(-6) : activationTimeData;

  const translateMonth = (month: string) => {
    const index = monthKeyToIndex[month];
    return index !== undefined ? t.months[index] : month;
  };

  const activationChartConfig = {
    activeContributors: {
      label: t.chart.contributors,
      color: 'hsl(221 83% 53%)',
    },
  };

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Users}
          label={t.kpis.activeContributorsCount}
          value={15}
          change={12}
          tooltip={t.tooltips.activeContributorsCount}
          color="blue"
        />
        <KPICard
          icon={Percent}
          label={t.kpis.activeContributorsPercent}
          value={68}
          change={8}
          tooltip={t.tooltips.activeContributorsPercent}
          color="blue"
          suffix="%"
        />
        <KPICard
          icon={FileText}
          label={t.kpis.postsPerContributor}
          value="2.4"
          change={5}
          tooltip={t.tooltips.postsPerContributor}
          color="violet"
        />
        <KPICard
          icon={CalendarCheck}
          label={t.kpis.postingRegularity}
          value={42}
          change={6}
          tooltip={t.tooltips.postingRegularity}
          color="emerald"
          suffix="%"
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
                  {t.chart.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t.chart.description}
                </CardDescription>
              </div>
              <PeriodSelector value={activationPeriod} onChange={setActivationPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={activationChartConfig} className="h-[235px] w-full">
              <BarChart data={activationData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
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
                      formatter={(value) => [`${value} `, t.chart.contributors]}
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
                {t.heatmap.title}
              </CardTitle>
              <CardDescription className="text-xs">
                {t.heatmap.description}
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
