import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function DashboardAnalytics() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Métriques détaillées et tendances de votre activité LinkedIn
          </p>
        </div>

        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle>En cours de développement</CardTitle>
            <CardDescription>
              Cette fonctionnalité sera bientôt disponible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Les analytics vous fourniront des graphiques et tableaux de bord pour analyser 
              les performances de votre équipe : évolution des impressions, engagement moyen, 
              meilleurs horaires de publication, et bien plus.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
