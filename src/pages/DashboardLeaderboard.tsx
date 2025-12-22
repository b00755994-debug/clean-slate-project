import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export default function DashboardLeaderboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Classement de votre équipe basé sur l'engagement LinkedIn
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
              Le leaderboard vous permettra de visualiser les performances de chaque membre de votre équipe, 
              avec des métriques comme le nombre de posts, les impressions totales, et l'engagement généré.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
