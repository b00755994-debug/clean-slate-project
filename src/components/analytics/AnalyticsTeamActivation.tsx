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
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const translations = {
  fr: {
    kpis: {
      activeContributorsCount: 'Contributeurs actifs (#)',
      activeContributorsPercent: 'Contributeurs actifs (%)',
      postsPerContributor: 'Posts / contributeur',
      postingRegularity: 'Régularité de publication',
    },
    periodLabel: '30 derniers jours',
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
    periodLabel: 'Last 30 days',
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

export function AnalyticsTeamActivation() {
  const [activationPeriod, setActivationPeriod] = useState<'6' | '12'>('6');
  const { language } = useLanguage();
  const t = translations[language];
  const { teamActivationKPIs, activationTrendData, postingHeatmapData } = useAnalyticsData();

  const activationData = activationPeriod === '6' ? activationTrendData.slice(-6) : activationTrendData;

  const monthKeyToIndex: Record<string, number> = {
    'Jan': 0, 'Fév': 1, 'Mar': 2, 'Avr': 3, 'Mai': 4, 'Juin': 5,
    'Juil': 6, 'Août': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Déc': 11,
  };

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
          value={teamActivationKPIs.activeContributorsCount.value}
          change={teamActivationKPIs.activeContributorsCount.change}
          tooltip={t.tooltips.activeContributorsCount}
          color="blue"
          periodLabel={t.periodLabel}
        />
        <KPICard
          icon={Percent}
          label={t.kpis.activeContributorsPercent}
          value={teamActivationKPIs.activeContributorsPercent.value}
          change={teamActivationKPIs.activeContributorsPercent.change}
          tooltip={t.tooltips.activeContributorsPercent}
          color="blue"
          suffix="%"
          periodLabel={t.periodLabel}
        />
        <KPICard
          icon={FileText}
          label={t.kpis.postsPerContributor}
          value={teamActivationKPIs.postsPerContributor.value}
          change={teamActivationKPIs.postsPerContributor.change}
          tooltip={t.tooltips.postsPerContributor}
          color="violet"
          periodLabel={t.periodLabel}
        />
        <KPICard
          icon={CalendarCheck}
          label={t.kpis.postingRegularity}
          value={teamActivationKPIs.postingRegularity.value}
          change={teamActivationKPIs.postingRegularity.change}
          tooltip={t.tooltips.postingRegularity}
          color="emerald"
          suffix="%"
          periodLabel={t.periodLabel}
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
            <ChartContainer config={activationChartConfig} className="h-[225px] w-full">
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
                      formatter={(value) => (
                        <span className="flex items-center gap-1">
                          <span className="text-muted-foreground">{t.chart.contributors}:</span>
                          <span className="font-medium">{value}</span>
                        </span>
                      )}
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
