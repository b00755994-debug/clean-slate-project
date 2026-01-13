import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Activity, Zap } from 'lucide-react';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { AnalyticsTeamActivation } from '@/components/analytics/AnalyticsTeamActivation';
import { AnalyticsReachImpact } from '@/components/analytics/AnalyticsReachImpact';
export default function DashboardAnalytics() {
  return <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Analytics
            </h1>
            <p className="text-muted-foreground">
              Métriques agrégées de l'activité LinkedIn de votre équipe
            </p>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              30 derniers jours
            </span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
              <span className="sm:hidden">Aperçu</span>
            </TabsTrigger>
            <TabsTrigger value="activation" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Activation équipe</span>
              <span className="sm:hidden">Équipe</span>
            </TabsTrigger>
            <TabsTrigger value="reach" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Audience & Reach    </span>
              <span className="sm:hidden">Portée</span>
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
    </DashboardLayout>;
}