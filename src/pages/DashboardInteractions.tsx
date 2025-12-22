import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function DashboardInteractions() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Interactions
          </h1>
          <p className="text-muted-foreground">
            Découvrez tous les profils ayant interagi avec vos posts
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
              La page Interactions vous permettra de voir tous les profils LinkedIn qui ont 
              commenté, liké ou partagé vos posts. Utilisez le système de recherche avancé 
              pour filtrer par mots-clés, entreprise, poste, ou nombre de connexions.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
