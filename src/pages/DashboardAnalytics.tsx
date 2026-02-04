import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Activity, Zap } from 'lucide-react';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { AnalyticsTeamActivation } from '@/components/analytics/AnalyticsTeamActivation';
import { AnalyticsReachImpact } from '@/components/analytics/AnalyticsReachImpact';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    subtitle: "Métriques agrégées de l'activité LinkedIn de votre équipe",
    periodBadge: '30 derniers jours',
    tabs: {
      overview: "Vue d'ensemble",
      overviewMobile: 'Aperçu',
      activation: 'Activation équipe',
      activationMobile: 'Équipe',
      reach: 'Audience & Reach',
      reachMobile: 'Portée',
    },
  },
  en: {
    subtitle: "Aggregated metrics from your team's LinkedIn activity",
    periodBadge: 'Last 30 days',
    tabs: {
      overview: 'Overview',
      overviewMobile: 'Overview',
      activation: 'Team Activation',
      activationMobile: 'Team',
      reach: 'Audience & Reach',
      reachMobile: 'Reach',
    },
  },
};

export default function DashboardAnalytics() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Analytics
            </h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2 uppercase tracking-wide text-xs">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">{t.tabs.overview}</span>
              <span className="sm:hidden">{t.tabs.overviewMobile}</span>
            </TabsTrigger>
            <TabsTrigger value="activation" className="flex items-center gap-2 uppercase tracking-wide text-xs">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">{t.tabs.activation}</span>
              <span className="sm:hidden">{t.tabs.activationMobile}</span>
            </TabsTrigger>
            <TabsTrigger value="reach" className="flex items-center gap-2 uppercase tracking-wide text-xs">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">{t.tabs.reach}</span>
              <span className="sm:hidden">{t.tabs.reachMobile}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="activation" className="mt-6">
            <AnalyticsTeamActivation />
          </TabsContent>

          <TabsContent value="reach" className="mt-6">
            <AnalyticsReachImpact />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
