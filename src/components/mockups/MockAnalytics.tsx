import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Activity, Zap, FileText, Eye, Users, TrendingUp } from 'lucide-react';
import { KPICard } from '@/components/analytics/KPICard';
import { PeriodSelector } from '@/components/analytics/PeriodSelector';
import { PostingHeatmap } from '@/components/analytics/PostingHeatmap';
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import {
  overviewKPIs, trendData, activationKPIs, activationData,
  reachKPIs, reachEngagementTrendData, impressionsDistribution, postingHeatmapData,
} from '@/components/analytics/mockData';

function MockOverview() {
  const [postsPeriod, setPostsPeriod] = useState<'6' | '12'>('6');
  const [impressionsPeriod, setImpressionsPeriod] = useState<'6' | '12'>('6');
  const postsData = postsPeriod === '6' ? trendData.slice(-6) : trendData;
  const impressionsData = impressionsPeriod === '6' ? trendData.slice(-6) : trendData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={FileText} label="Total Posts" value={overviewKPIs.totalPosts.value} change={overviewKPIs.totalPosts.change} tooltip="" color="blue" periodLabel="30 derniers jours" />
        <KPICard icon={Eye} label="Total Impressions" value={overviewKPIs.totalImpressions.value} change={overviewKPIs.totalImpressions.change} tooltip="" color="violet" periodLabel="30 derniers jours" />
        <KPICard icon={Users} label="Contributeurs actifs" value={overviewKPIs.activeContributors.value} change={overviewKPIs.activeContributors.change} tooltip="" color="emerald" periodLabel="30 derniers jours" />
        <KPICard icon={TrendingUp} label="Moy. posts/contributeur" value={overviewKPIs.avgPostsPerContributor.value} change={overviewKPIs.avgPostsPerContributor.change} tooltip="" color="amber" periodLabel="30 derniers jours" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />Évolution des publications
              </CardTitle>
              <PeriodSelector value={postsPeriod} onChange={setPostsPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ posts: { label: 'Posts', color: 'hsl(210 90% 40%)' } }} className="h-[225px] w-full">
              <LineChart data={postsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
                <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="posts" stroke="var(--color-posts)" strokeWidth={2} dot={{ fill: 'var(--color-posts)', strokeWidth: 2 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4 text-violet-600" />Évolution des impressions
              </CardTitle>
              <PeriodSelector value={impressionsPeriod} onChange={setImpressionsPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ impressions: { label: 'Impressions', color: 'hsl(263 70% 55%)' } }} className="h-[225px] w-full">
              <LineChart data={impressionsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
                <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="impressions" stroke="var(--color-impressions)" strokeWidth={2} dot={{ fill: 'var(--color-impressions)', strokeWidth: 2 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MockTeamActivation() {
  const [period, setPeriod] = useState<'6' | '12'>('6');
  const data = period === '6' ? activationData.slice(-6) : activationData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Contributeurs actifs" value={overviewKPIs.activeContributors.value} change={overviewKPIs.activeContributors.change} tooltip="" color="emerald" periodLabel="30 derniers jours" />
        <KPICard icon={Activity} label="Taux d'activation" value={activationKPIs.contributorsActivePercent.value} change={activationKPIs.contributorsActivePercent.change} tooltip="" color="blue" periodLabel="30 derniers jours" suffix="%" />
        <KPICard icon={TrendingUp} label="Moy. posts/contributeur" value={overviewKPIs.avgPostsPerContributor.value} change={overviewKPIs.avgPostsPerContributor.change} tooltip="" color="amber" periodLabel="30 derniers jours" />
        <KPICard icon={Activity} label="Interactions internes" value={activationKPIs.avgInternalInteractions.value} change={activationKPIs.avgInternalInteractions.change} tooltip="" color="violet" periodLabel="30 derniers jours" />
      </div>
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />Contributeurs actifs / mois
            </CardTitle>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ activeContributors: { label: 'Contributeurs', color: 'hsl(160 60% 45%)' } }} className="h-[225px] w-full">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
              <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="activeContributors" fill="var(--color-activeContributors)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function MockReachImpact() {
  const [period, setPeriod] = useState<'6' | '12'>('6');
  const data = period === '6' ? reachEngagementTrendData.slice(-6) : reachEngagementTrendData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Eye} label="Total Impressions" value={reachKPIs.totalImpressions.value} change={reachKPIs.totalImpressions.change} tooltip="" color="violet" periodLabel="30 derniers jours" />
        <KPICard icon={Eye} label="Moy. Impressions/post" value={reachKPIs.avgImpressionsPerPost.value} change={reachKPIs.avgImpressionsPerPost.change} tooltip="" color="blue" periodLabel="30 derniers jours" />
        <KPICard icon={Activity} label="Taux d'engagement" value={reachKPIs.engagementRate.value} change={reachKPIs.engagementRate.change} tooltip="" color="emerald" periodLabel="30 derniers jours" suffix="%" />
        <KPICard icon={Activity} label="Taux de commentaire" value={reachKPIs.commentRate.value} change={reachKPIs.commentRate.change} tooltip="" color="amber" periodLabel="30 derniers jours" suffix="%" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4 text-violet-600" />Impressions & Engagement
              </CardTitle>
              <PeriodSelector value={period} onChange={setPeriod} />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ impressions: { label: 'Impressions', color: 'hsl(263 70% 55%)' }, engagementRate: { label: 'Engagement %', color: 'hsl(160 60% 45%)' } }} className="h-[225px] w-full">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" tickFormatter={(v) => `${v}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="var(--color-impressions)" strokeWidth={2} dot={{ fill: 'var(--color-impressions)', strokeWidth: 2 }} />
                <Line yAxisId="right" type="monotone" dataKey="engagementRate" stroke="var(--color-engagementRate)" strokeWidth={2} dot={{ fill: 'var(--color-engagementRate)', strokeWidth: 2 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />Distribution des impressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ count: { label: 'Posts', color: 'hsl(210 90% 40%)' } }} className="h-[225px] w-full">
              <BarChart data={impressionsDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="bucket" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
                <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <PostingHeatmap data={postingHeatmapData} />
    </div>
  );
}

export function MockAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-primary" />
          Analytics
        </h2>
        <p className="text-muted-foreground text-sm">Métriques agrégées de l'activité LinkedIn de votre équipe</p>
      </div>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="flex items-center gap-2 uppercase tracking-wide text-xs">
            <BarChart3 className="w-4 h-4" />Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="activation" className="flex items-center gap-2 uppercase tracking-wide text-xs">
            <Activity className="w-4 h-4" />Activation équipe
          </TabsTrigger>
          <TabsTrigger value="reach" className="flex items-center gap-2 uppercase tracking-wide text-xs">
            <Zap className="w-4 h-4" />Audience & Reach
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><MockOverview /></TabsContent>
        <TabsContent value="activation"><MockTeamActivation /></TabsContent>
        <TabsContent value="reach"><MockReachImpact /></TabsContent>
      </Tabs>
    </div>
  );
}
