import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Library } from 'lucide-react';

export default function DashboardContent() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Library className="w-8 h-8 text-primary" />
            Content Library
          </h1>
          <p className="text-muted-foreground">
            Bibliothèque centralisée de tous les posts de votre équipe
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
              La Content Library vous permettra de parcourir, rechercher et analyser tous les posts 
              publiés par les membres de votre équipe. Filtrez par auteur, date, performance, 
              et exportez les meilleurs contenus.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
