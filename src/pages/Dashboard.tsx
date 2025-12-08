import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Zap,
  LogOut,
  Crown,
  Slack,
  Linkedin,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Settings,
} from 'lucide-react';

interface SlackWorkspace {
  id: string;
  workspace_name: string;
  workspace_id: string | null;
  is_connected: boolean;
  connected_at: string | null;
}

interface LinkedInProfile {
  id: string;
  linkedin_url: string;
  profile_name: string;
  avatar_url: string | null;
  posts_count?: number;
}

export default function Dashboard() {
  const { user, profile, isAdmin, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [slackWorkspace, setSlackWorkspace] = useState<SlackWorkspace | null>(null);
  const [linkedinProfiles, setLinkedinProfiles] = useState<LinkedInProfile[]>([]);
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileUrl, setNewProfileUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSlackWorkspace();
      fetchLinkedInProfiles();
    }
  }, [user]);

  const fetchSlackWorkspace = async () => {
    const { data, error } = await supabase
      .from('slack_workspaces')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();
    
    if (!error && data) {
      setSlackWorkspace(data);
    }
  };

  const fetchLinkedInProfiles = async () => {
    const { data: profiles, error } = await supabase
      .from('linkedin_profiles')
      .select('*')
      .eq('user_id', user?.id);
    
    if (!error && profiles) {
      // Get posts count for each profile in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const profilesWithPosts = await Promise.all(
        profiles.map(async (profile) => {
          const { count } = await supabase
            .from('Posts')
            .select('*', { count: 'exact', head: true })
            .eq('linkedin_profile_id', profile.id)
            .gte('created_at', thirtyDaysAgo.toISOString());
          
          return { ...profile, posts_count: count || 0 };
        })
      );
      
      setLinkedinProfiles(profilesWithPosts);
    }
  };

  const handleAddProfile = async () => {
    if (!newProfileName.trim() || !newProfileUrl.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingProfile(true);
    
    const { error } = await supabase
      .from('linkedin_profiles')
      .insert({
        user_id: user?.id,
        profile_name: newProfileName.trim(),
        linkedin_url: newProfileUrl.trim(),
      });
    
    if (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter le profil",
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profil ajouté',
        description: 'Le profil LinkedIn a été ajouté avec succès',
      });
      setNewProfileName('');
      setNewProfileUrl('');
      setIsDialogOpen(false);
      fetchLinkedInProfiles();
    }
    
    setIsAddingProfile(false);
  };

  const handleDeleteProfile = async (profileId: string) => {
    const { error } = await supabase
      .from('linkedin_profiles')
      .delete()
      .eq('id', profileId);
    
    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le profil',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profil supprimé',
        description: 'Le profil LinkedIn a été supprimé',
      });
      fetchLinkedInProfiles();
    }
  };

  const handleConnectSlack = () => {
    // Placeholder - will be replaced with actual Slack OAuth flow
    toast({
      title: 'Slack App',
      description: "L'application Slack est en cours de développement. Revenez bientôt!",
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">superpump</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {profile?.email || user?.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">
            Bonjour, {profile?.full_name || 'Utilisateur'} 👋
          </h1>
          <p className="text-muted-foreground">
            Gérez votre compte et suivez vos équipes sur LinkedIn
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Plan Section */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-accent" />
                  Mon Plan
                </CardTitle>
                <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                  {profile?.plan?.toUpperCase() || 'PRO'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Vous êtes sur le plan <strong>Pro</strong>. Profitez de toutes les fonctionnalités avancées.
              </p>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Gérer l'abonnement (bientôt)
              </Button>
            </CardContent>
          </Card>

          {/* Slack Integration */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Slack className="w-5 h-5 text-[#4A154B]" />
                  Slack
                </CardTitle>
                {slackWorkspace?.is_connected ? (
                  <Badge variant="outline" className="text-success border-success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connecté
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <XCircle className="w-3 h-3 mr-1" />
                    Non connecté
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {slackWorkspace?.is_connected ? (
                <p className="text-sm text-muted-foreground mb-4">
                  Connecté à <strong>{slackWorkspace.workspace_name}</strong>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  Connectez votre workspace Slack pour recevoir les notifications.
                </p>
              )}
              <Button
                variant={slackWorkspace?.is_connected ? 'outline' : 'default'}
                size="sm"
                className="w-full gap-2"
                onClick={handleConnectSlack}
              >
                {slackWorkspace?.is_connected ? (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Ouvrir l'app Slack
                  </>
                ) : (
                  <>
                    <Slack className="w-4 h-4 text-[#4A154B]" />
                    Connecter Slack
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                Résumé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profils suivis</span>
                  <span className="font-semibold">{linkedinProfiles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Posts (30j)</span>
                  <span className="font-semibold">
                    {linkedinProfiles.reduce((acc, p) => acc + (p.posts_count || 0), 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LinkedIn Profiles Section */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                  Profils LinkedIn suivis
                </CardTitle>
                <CardDescription>
                  Membres de votre équipe dont vous suivez l'activité LinkedIn
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter un profil
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un profil LinkedIn</DialogTitle>
                    <DialogDescription>
                      Ajoutez un membre de votre équipe pour suivre son activité LinkedIn.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileName">Nom du profil</Label>
                      <Input
                        id="profileName"
                        placeholder="Jean Dupont"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileUrl">URL LinkedIn</Label>
                      <Input
                        id="profileUrl"
                        placeholder="https://linkedin.com/in/jeandupont"
                        value={newProfileUrl}
                        onChange={(e) => setNewProfileUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleAddProfile}
                      disabled={isAddingProfile}
                    >
                      {isAddingProfile ? 'Ajout...' : 'Ajouter'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {linkedinProfiles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Linkedin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun profil LinkedIn suivi pour le moment.</p>
                <p className="text-sm">Ajoutez des membres de votre équipe pour commencer.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>URL LinkedIn</TableHead>
                      <TableHead className="text-center">Posts (30j)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linkedinProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">
                          {profile.profile_name}
                        </TableCell>
                        <TableCell>
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            {profile.linkedin_url.replace('https://linkedin.com/in/', '')}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{profile.posts_count || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProfile(profile.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
