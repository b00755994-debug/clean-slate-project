import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Crown,
  Linkedin,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Settings,
  Link,
  Unlink,
  MessageSquare,
  Lock,
  User,
} from 'lucide-react';
import slackLogo from '@/assets/slack-logo.png';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  slack_user_id: string | null;
  posts_count?: number;
}

interface SlackMember {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
}

export default function Dashboard() {
  const { user, profile, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [slackWorkspace, setSlackWorkspace] = useState<SlackWorkspace | null>(null);
  const [linkedinProfiles, setLinkedinProfiles] = useState<LinkedInProfile[]>([]);
  const [slackMembers, setSlackMembers] = useState<SlackMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileUrl, setNewProfileUrl] = useState('');
  const [selectedSlackUserId, setSelectedSlackUserId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editSlackUserId, setEditSlackUserId] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchSlackWorkspace();
      fetchLinkedInProfiles();
    }
  }, [user]);

  // Fetch Slack members when workspace is connected
  useEffect(() => {
    if (slackWorkspace?.is_connected) {
      fetchSlackMembers();
    }
  }, [slackWorkspace?.is_connected]);

  const fetchSlackWorkspace = async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();
    
    if (!error && data) {
      setSlackWorkspace({
        id: data.id,
        workspace_name: data.workspace_name,
        workspace_id: null,
        is_connected: data.is_connected || false,
        connected_at: data.connected_at,
      });
    }
  };

  const fetchLinkedInProfiles = async () => {
    const { data: profiles, error } = await supabase
      .from('billable_users')
      .select('*')
      .eq('user_id', user?.id);
    
    if (!error && profiles) {
      // Get posts count for each profile in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const profilesWithPosts = await Promise.all(
        profiles.map(async (p) => {
          const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('linkedin_profiles', p.id)
            .gte('created_at', thirtyDaysAgo.toISOString());
          
          return { ...p, posts_count: count || 0 };
        })
      );
      
      setLinkedinProfiles(profilesWithPosts);
    }
  };

  const fetchSlackMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const { data, error } = await supabase.functions.invoke('slack-members');
      
      if (error) {
        console.error('Error fetching Slack members:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de récupérer les membres Slack',
          variant: 'destructive',
        });
        return;
      }

      if (data?.members) {
        setSlackMembers(data.members);
      }
    } catch (err) {
      console.error('Error invoking slack-members:', err);
    } finally {
      setIsLoadingMembers(false);
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
      .from('billable_users')
      .insert({
        user_id: user?.id,
        profile_name: newProfileName.trim(),
        linkedin_url: newProfileUrl.trim(),
        slack_user_id: selectedSlackUserId || null,
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
      setSelectedSlackUserId('');
      setIsDialogOpen(false);
      fetchLinkedInProfiles();
    }
    
    setIsAddingProfile(false);
  };

  const handleDeleteProfile = async (profileId: string) => {
    const { error } = await supabase
      .from('billable_users')
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

  const handleUpdateSlackUser = async (profileId: string, slackUserId: string | null) => {
    const { error } = await supabase
      .from('billable_users')
      .update({ slack_user_id: slackUserId })
      .eq('id', profileId);
    
    if (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour l'association Slack",
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Association mise à jour',
        description: slackUserId 
          ? 'Le profil a été associé à un utilisateur Slack'
          : "L'association Slack a été supprimée",
      });
      setEditingProfileId(null);
      setEditSlackUserId('');
      fetchLinkedInProfiles();
    }
  };

  const handleConnectSlack = () => {
    if (!user?.id) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour lier Slack',
        variant: 'destructive',
      });
      return;
    }
    
    // Get current URL origin + path for redirect after OAuth
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    // Redirect to Slack OAuth via edge function with redirect URL
    window.location.href = `https://hvmrjymweajxxkoiupzf.supabase.co/functions/v1/slack-auth?user_id=${user.id}&redirect_url=${encodeURIComponent(redirectUrl)}`;
  };

  const handleDisconnectSlack = async () => {
    if (!slackWorkspace?.id) return;
    
    const { error } = await supabase
      .from('workspaces')
      .update({
        is_connected: false,
        slack_workspace_auth: null,
      })
      .eq('id', slackWorkspace.id);
    
    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de déconnecter Slack',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Slack déconnecté',
        description: 'Votre workspace Slack a été déconnecté',
      });
      setSlackWorkspace(prev => prev ? { ...prev, is_connected: false } : null);
      setSlackMembers([]);
    }
  };

  // Handle Slack OAuth callback messages
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const slackSuccess = urlParams.get('slack_success');
    const slackError = urlParams.get('slack_error');

    if (slackSuccess) {
      toast({
        title: 'Slack connecté !',
        description: 'Votre workspace Slack a été connecté avec succès.',
      });
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
      fetchSlackWorkspace();
    }

    if (slackError) {
      toast({
        title: 'Erreur Slack',
        description: `La connexion a échoué: ${slackError}`,
        variant: 'destructive',
      });
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  // Find Slack member name by id
  const getSlackMemberName = (slackUserId: string) => {
    const member = slackMembers.find(m => m.id === slackUserId);
    return member?.name || slackUserId;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">
            Bonjour, {profile?.full_name?.split(' ')[0] || 'Utilisateur'} 👋
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
                <Badge className="bg-card border border-foreground/20 px-4 py-1.5 text-sm font-semibold shadow-lg cursor-default hover:bg-card">
                  <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                    {profile?.plan?.toUpperCase() || 'PRO'}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Vous êtes sur le plan <strong>Pro</strong>. Profitez de toutes les fonctionnalités avancées.
              </p>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted/50 border border-dashed border-border text-muted-foreground text-sm">
                <Settings className="w-4 h-4" />
                <span>Gérer l'abonnement</span>
                <Badge variant="secondary" className="ml-auto text-[10px] px-2 py-0.5">
                  Bientôt
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Slack Integration */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <img src={slackLogo} alt="Slack" className="w-5 h-5" />
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
                  {slackMembers.length > 0 ? (
                    <span className="block text-xs mt-1">
                      {slackMembers.length} membre(s) disponible(s)
                    </span>
                  ) : isLoadingMembers ? (
                    <span className="block text-xs mt-1 text-muted-foreground">
                      Chargement des membres...
                    </span>
                  ) : (
                    <span className="block text-xs mt-1 text-amber-500">
                      Aucun membre trouvé. Essayez de reconnecter Slack.
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  Connectez votre workspace Slack pour recevoir les notifications.
                </p>
              )}
              {slackWorkspace?.is_connected ? (
                <div className="flex gap-2 mt-auto pt-2">
                  <Button
                    size="sm"
                    className="gap-2 flex-1 bg-[#4A154B] hover:bg-[#3a1039] text-white"
                    asChild
                  >
                    <a href="slack://open" target="_blank" rel="noopener noreferrer">
                      <img src={slackLogo} alt="Slack" className="w-4 h-4" />
                      Ouvrir Slack
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 flex-1 border-red-400/50 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                    onClick={handleDisconnectSlack}
                  >
                    <Unlink className="w-4 h-4" />
                    Déconnecter
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="w-full gap-2 bg-[#4A154B] hover:bg-[#3a1039] text-white"
                  onClick={handleConnectSlack}
                >
                  <img src={slackLogo} alt="Slack" className="w-4 h-4" />
                  Connecter Slack
                </Button>
              )}
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
                    Ajouter un utilisateur
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
                    {/* Slack User Association Field */}
                    <div className="space-y-2">
                      <Label htmlFor="slackUser" className="flex items-center gap-2">
                        <img src={slackLogo} alt="Slack" className="w-4 h-4" />
                        Utilisateur Slack associé
                        <span className="text-muted-foreground text-xs">(optionnel)</span>
                      </Label>
                      {slackWorkspace?.is_connected && slackMembers.length > 0 ? (
                        <>
                          <Select
                            value={selectedSlackUserId}
                            onValueChange={setSelectedSlackUserId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner un membre Slack" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border border-border">
                              <SelectItem value="">
                                <span className="text-muted-foreground">Aucun</span>
                              </SelectItem>
                              {slackMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  <div className="flex items-center gap-2">
                                    {member.avatar_url ? (
                                      <img 
                                        src={member.avatar_url} 
                                        alt={member.name} 
                                        className="w-5 h-5 rounded-full"
                                      />
                                    ) : (
                                      <User className="w-5 h-5 text-muted-foreground" />
                                    )}
                                    <span>{member.name}</span>
                                    {member.email && (
                                      <span className="text-xs text-muted-foreground">
                                        ({member.email})
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Link className="w-3 h-3" />
                            Permet de taguer automatiquement l'utilisateur dans les notifications Slack
                          </p>
                        </>
                      ) : slackWorkspace?.is_connected && isLoadingMembers ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          Chargement des membres...
                        </div>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="relative">
                                <Input
                                  id="slackUser"
                                  disabled
                                  placeholder="Connectez Slack pour débloquer"
                                  className="bg-muted/50 cursor-not-allowed pr-10"
                                />
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p>Connectez votre workspace Slack pour associer ce profil à un membre de votre équipe et le taguer automatiquement dans les notifications.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
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
                      <TableHead>Utilisateur Slack</TableHead>
                      <TableHead className="text-center">Posts (30j)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linkedinProfiles.map((linkedinProfile) => (
                      <TableRow key={linkedinProfile.id}>
                        <TableCell className="font-medium">
                          {linkedinProfile.profile_name}
                        </TableCell>
                        <TableCell>
                          <a
                            href={linkedinProfile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            {linkedinProfile.linkedin_url.replace('https://linkedin.com/in/', '')}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </TableCell>
                        <TableCell>
                          {slackWorkspace?.is_connected ? (
                            editingProfileId === linkedinProfile.id ? (
                              <div className="flex items-center gap-2">
                                <Select
                                  value={editSlackUserId}
                                  onValueChange={setEditSlackUserId}
                                >
                                  <SelectTrigger className="min-w-[180px]">
                                    <SelectValue placeholder="Sélectionner" />
                                  </SelectTrigger>
                                  <SelectContent 
                                    className="bg-popover border border-border shadow-lg z-[100] max-h-60 overflow-auto"
                                    position="popper"
                                    sideOffset={4}
                                  >
                                    <SelectItem value="none">
                                      <span className="text-muted-foreground">Aucun</span>
                                    </SelectItem>
                                    {slackMembers.map((member) => (
                                      <SelectItem key={member.id} value={member.id}>
                                        {member.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateSlackUser(
                                    linkedinProfile.id, 
                                    editSlackUserId === 'none' ? null : editSlackUserId || null
                                  )}
                                >
                                  OK
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingProfileId(null);
                                    setEditSlackUserId('');
                                  }}
                                >
                                  ✕
                                </Button>
                              </div>
                            ) : linkedinProfile.slack_user_id ? (
                              <Badge 
                                variant="outline" 
                                className="text-success border-success gap-1 cursor-pointer hover:bg-success/10"
                                onClick={() => {
                                  setEditingProfileId(linkedinProfile.id);
                                  setEditSlackUserId(linkedinProfile.slack_user_id || '');
                                }}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                {getSlackMemberName(linkedinProfile.slack_user_id)}
                              </Badge>
                            ) : (
                              <Badge 
                                variant="outline" 
                                className="cursor-pointer hover:bg-primary/10 hover:border-primary gap-1 transition-colors"
                                onClick={() => {
                                  setEditingProfileId(linkedinProfile.id);
                                  setEditSlackUserId('');
                                }}
                              >
                                <Link className="w-3 h-3" />
                                Lier au profil Slack
                              </Badge>
                            )
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge 
                                    variant="secondary" 
                                    className="text-muted-foreground gap-1 cursor-help opacity-60"
                                  >
                                    <Lock className="w-3 h-3" />
                                    Connecter Slack
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>Connectez votre workspace Slack pour associer ce profil à un membre de votre équipe</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{linkedinProfile.posts_count || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProfile(linkedinProfile.id)}
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
      </div>
    </DashboardLayout>
  );
}
