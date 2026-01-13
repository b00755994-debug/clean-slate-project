import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Linkedin, Plus, Trash2, ExternalLink, CheckCircle2, XCircle, Settings, LogOut, User, Link, Unlink, Lock, MessageSquare } from 'lucide-react';
import slackLogo from '@/assets/slack-logo.png';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSlackMembers } from '@/hooks/useSlackMembers';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useLinkedInProfiles } from '@/hooks/useLinkedInProfiles';
import { useTeamFeedStats } from '@/components/content/TeamFeed';
import { supabase } from '@/integrations/supabase/client';
interface SlackMember {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
}
export default function Dashboard() {
  const {
    user,
    profile,
    isLoading
  } = useAuth();
  const {
    toast
  } = useToast();

  // Use React Query hooks for caching
  const {
    workspace: slackWorkspace,
    refetch: refetchWorkspace,
    disconnect: disconnectSlack
  } = useWorkspace();
  const {
    linkedinProfiles,
    addProfile,
    isAddingProfile,
    deleteProfile,
    updateSlackUser
  } = useLinkedInProfiles();
  const {
    data: slackMembers = [],
    isLoading: isLoadingMembers
  } = useSlackMembers(slackWorkspace?.is_connected || false);
  const { stats: teamStats } = useTeamFeedStats();
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileUrl, setNewProfileUrl] = useState('');
  const [selectedSlackUserId, setSelectedSlackUserId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editSlackUserId, setEditSlackUserId] = useState<string>('');
  const handleAddProfile = async () => {
    if (!newProfileName.trim() || !newProfileUrl.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive'
      });
      return;
    }
    try {
      await addProfile({
        profileName: newProfileName,
        linkedinUrl: newProfileUrl,
        slackUserId: selectedSlackUserId || undefined
      });
      setNewProfileName('');
      setNewProfileUrl('');
      setSelectedSlackUserId('');
      setIsDialogOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };
  const handleDeleteProfile = (profileId: string) => {
    deleteProfile(profileId);
  };
  const handleUpdateSlackUser = (profileId: string, slackUserId: string | null) => {
    updateSlackUser({
      profileId,
      slackUserId
    });
    setEditingProfileId(null);
    setEditSlackUserId('');
  };
  const handleConnectSlack = async () => {
    if (!user?.id) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour lier Slack',
        variant: 'destructive'
      });
      return;
    }
    try {
      // Get current session for auth token
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Erreur',
          description: 'Session expirée. Veuillez vous reconnecter.',
          variant: 'destructive'
        });
        return;
      }

      // Get current URL origin + path for redirect after OAuth
      const redirectUrl = `${window.location.origin}/dashboard`;

      // Call the authenticated edge function
      const response = await fetch(`https://hvmrjymweajxxkoiupzf.supabase.co/functions/v1/slack-auth?redirect_url=${encodeURIComponent(redirectUrl)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la connexion Slack');
      }
      const {
        authUrl
      } = await response.json();

      // Redirect to Slack OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Slack connection error:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de connecter Slack',
        variant: 'destructive'
      });
    }
  };
  const handleDisconnectSlack = async () => {
    if (!slackWorkspace?.id) return;
    try {
      disconnectSlack(slackWorkspace.id);
      toast({
        title: 'Slack déconnecté',
        description: 'Votre workspace Slack a été déconnecté'
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de déconnecter Slack',
        variant: 'destructive'
      });
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
        description: 'Votre workspace Slack a été connecté avec succès.'
      });
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
      refetchWorkspace();
    }
    if (slackError) {
      toast({
        title: 'Erreur Slack',
        description: `La connexion a échoué: ${slackError}`,
        variant: 'destructive'
      });
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  // Find Slack member by id
  const getSlackMember = (slackUserId: string): SlackMember | undefined => {
    return slackMembers.find(m => m.id === slackUserId);
  };
  const getSlackMemberName = (slackUserId: string) => {
    const member = getSlackMember(slackUserId);
    return member?.name || slackUserId;
  };
  if (isLoading) {
    return <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>;
  }
  return <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">
            Bonjour, {profile?.full_name?.split(' ')[0] || 'Utilisateur'} 👋
          </h1>
          <p className="text-muted-foreground">
            Gérez votre compte et soutenez vos équipes sur LinkedIn
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
          <Card id="slack-integration-card" className="border-border/50 shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <img src={slackLogo} alt="Slack" className="w-5 h-5" />
                  Slack
                </CardTitle>
                {slackWorkspace?.is_connected ? <Badge variant="outline" className="text-success border-success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connecté
                  </Badge> : <Badge variant="outline" className="text-muted-foreground">
                    <XCircle className="w-3 h-3 mr-1" />
                    Non connecté
                  </Badge>}
              </div>
            </CardHeader>
            <CardContent>
              {slackWorkspace?.is_connected ? <p className="text-sm text-muted-foreground mb-4">
                  Connecté à <strong>{slackWorkspace.workspace_name}</strong>
                  {slackMembers.length > 0 ? <span className="block text-xs mt-1">
                      {slackMembers.length} membres identifiés
                    </span> : isLoadingMembers ? <span className="block text-xs mt-1 text-muted-foreground">
                      Chargement des membres...
                    </span> : <span className="block text-xs mt-1 text-amber-500">
                      Aucun membre trouvé. Essayez de reconnecter Slack.
                    </span>}
                </p> : <p className="text-sm text-muted-foreground mb-4">
                  Connectez votre workspace Slack pour recevoir les notifications.
                </p>}
              {slackWorkspace?.is_connected ? <div className="flex gap-2 mt-auto pt-4">
                  <Button size="sm" className="gap-2 flex-1 bg-[#4A154B] hover:bg-[#3a1039] text-white" asChild>
                    <a href="slack://open" target="_blank" rel="noopener noreferrer">
                      <img src={slackLogo} alt="Slack" className="w-4 h-4" />
                      Ouvrir Slack
                    </a>
                  </Button>
                  <Button size="sm" className="gap-1.5 flex-1 bg-red-100 border border-red-200 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-950/30 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-900/40" onClick={handleDisconnectSlack}>
                    <LogOut className="w-3.5 h-3.5" />
                    Déconnecter
                  </Button>
                </div> : <Button size="sm" className="w-full gap-2 bg-[#4A154B] hover:bg-[#3a1039] text-white" onClick={handleConnectSlack}>
                  <img src={slackLogo} alt="Slack" className="w-4 h-4" />
                  Connecter Slack
                </Button>}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                  Résumé
                </CardTitle>
                <span className="text-xs text-muted-foreground">30 derniers jours</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profils suivis</span>
                  <span className="font-semibold">{linkedinProfiles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Posts</span>
                  <span className="font-semibold">
                    {linkedinProfiles.reduce((acc, p) => acc + (p.posts_count || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Impressions</span>
                  <span className="font-semibold">
                    {teamStats.totalImpressions.toLocaleString()}
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
              <CardDescription className="mt-1.5">
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
                      <Input id="profileName" placeholder="Jean Dupont" value={newProfileName} onChange={e => setNewProfileName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileUrl">URL LinkedIn</Label>
                      <Input id="profileUrl" placeholder="https://linkedin.com/in/jeandupont" value={newProfileUrl} onChange={e => setNewProfileUrl(e.target.value)} />
                    </div>
                    {/* Slack User Association Field */}
                    <div className="space-y-2">
                      <Label htmlFor="slackUser" className="flex items-center gap-2">
                        <img src={slackLogo} alt="Slack" className="w-4 h-4" />
                        Utilisateur Slack associé
                        <span className="text-muted-foreground text-xs">(optionnel)</span>
                      </Label>
                      {slackWorkspace?.is_connected && slackMembers.length > 0 ? <>
                          <Select value={selectedSlackUserId} onValueChange={setSelectedSlackUserId}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner un membre Slack" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border border-border">
                              <SelectItem value="">
                                <span className="text-muted-foreground">Aucun</span>
                              </SelectItem>
                              {slackMembers.map(member => <SelectItem key={member.id} value={member.id}>
                                  <div className="flex items-center gap-2">
                                    {member.avatar_url ? <img src={member.avatar_url} alt={member.name} className="w-5 h-5 rounded-full" /> : <User className="w-5 h-5 text-muted-foreground" />}
                                    <span>{member.name}</span>
                                    {member.email && <span className="text-xs text-muted-foreground">
                                        ({member.email})
                                      </span>}
                                  </div>
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Link className="w-3 h-3" />
                            Permet de taguer automatiquement l'utilisateur dans les notifications Slack
                          </p>
                        </> : slackWorkspace?.is_connected && isLoadingMembers ? <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          Chargement des membres...
                        </div> : <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="relative">
                                <Input id="slackUser" disabled placeholder="Connectez Slack pour débloquer" className="bg-muted/50 cursor-not-allowed pr-10" />
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p>Connectez votre workspace Slack pour associer ce profil à un membre de votre équipe et le taguer automatiquement dans les notifications.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddProfile} disabled={isAddingProfile}>
                      {isAddingProfile ? 'Ajout...' : 'Ajouter'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {linkedinProfiles.length === 0 ? <div className="text-center py-12 text-muted-foreground">
                <Linkedin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun profil LinkedIn suivi pour le moment.</p>
                <p className="text-sm">Ajoutez des membres de votre équipe pour commencer.</p>
              </div> : <div className="overflow-x-auto">
                <Table className="text-sm table-fixed w-full">
                  <TableHeader>
                    <TableRow className="h-5">
                      <TableHead className="py-0.5 text-xs w-[18%]">Nom</TableHead>
                      <TableHead className="py-0.5 text-xs w-[40%]">URL LinkedIn</TableHead>
                      <TableHead className="py-0.5 text-xs w-[20%]">Utilisateur Slack</TableHead>
                      <TableHead className="text-center py-0.5 text-xs w-[10%]">Posts (30j)</TableHead>
                      <TableHead className="text-right py-0.5 text-xs w-[12%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
                <div className="max-h-[200px] overflow-y-auto">
                  <Table className="text-sm table-fixed w-full">
                    <TableBody>
                    {linkedinProfiles.map(linkedinProfile => <TableRow key={linkedinProfile.id} className="h-5">
                        <TableCell className="font-medium py-0.5 w-[18%]">
                          {linkedinProfile.profile_name}
                        </TableCell>
                        <TableCell className="py-0.5 w-[40%]">
                          <a href={linkedinProfile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                            {linkedinProfile.linkedin_url.replace('https://linkedin.com/in/', '')}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </TableCell>
                        <TableCell className="py-0.5 w-[20%]">
                          {slackWorkspace?.is_connected ? <Select value={linkedinProfile.slack_user_id || 'none'} onValueChange={value => {
                        handleUpdateSlackUser(linkedinProfile.id, value === 'none' ? null : value);
                      }}>
                              <SelectTrigger className="border-0 bg-transparent p-0 h-auto w-auto shadow-none focus:ring-0 [&>svg]:hidden">
                                <Badge variant="outline" className={linkedinProfile.slack_user_id ? "bg-[#4A154B]/10 border-[#4A154B]/30 text-[#4A154B] dark:text-[#E01E5A] dark:border-[#E01E5A]/30 dark:bg-[#E01E5A]/10 gap-2 cursor-pointer hover:bg-[#4A154B]/20 dark:hover:bg-[#E01E5A]/20 py-1 px-2 text-xs" : "cursor-pointer hover:bg-[#4A154B]/10 hover:border-[#4A154B]/30 gap-2 transition-colors py-1 px-2 text-xs border-[#4A154B]/20"}>
                                  {linkedinProfile.slack_user_id ? (() => {
                              const slackMember = getSlackMember(linkedinProfile.slack_user_id);
                              return <>
                                          {slackMember?.avatar_url ? <img src={slackMember.avatar_url} alt={slackMember.name} className="w-5 h-5 rounded" /> : <div className="w-5 h-5 rounded bg-[#4A154B] flex items-center justify-center">
                                              <span className="text-white text-xs font-medium">
                                                {getSlackMemberName(linkedinProfile.slack_user_id).charAt(0).toUpperCase()}
                                              </span>
                                            </div>}
                                          {getSlackMemberName(linkedinProfile.slack_user_id)}
                                        </>;
                            })() : <>
                                      <img src={slackLogo} alt="Slack" className="w-4 h-4" />
                                      Sélectionner
                                    </>}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent className="bg-popover border border-border shadow-lg z-[100] max-h-60 overflow-auto" position="popper" sideOffset={4}>
                                <SelectItem value="none">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                                      <Unlink className="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <span className="text-muted-foreground">Aucun</span>
                                  </div>
                                </SelectItem>
                                {slackMembers.map(member => <SelectItem key={member.id} value={member.id}>
                                    <div className="flex items-center gap-2">
                                      {member.avatar_url ? <img src={member.avatar_url} alt={member.name} className="w-6 h-6 rounded" /> : <div className="w-6 h-6 rounded bg-[#4A154B] flex items-center justify-center">
                                          <span className="text-white text-xs font-medium">
                                            {member.name.charAt(0).toUpperCase()}
                                          </span>
                                        </div>}
                                      <span>{member.name}</span>
                                    </div>
                                  </SelectItem>)}
                              </SelectContent>
                            </Select> : <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="secondary" className="text-muted-foreground gap-1.5 cursor-pointer opacity-50 hover:opacity-70 transition-opacity" onClick={() => {
                              const slackCard = document.getElementById('slack-integration-card');
                              if (slackCard) {
                                slackCard.scrollIntoView({
                                  behavior: 'smooth',
                                  block: 'center'
                                });
                                slackCard.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                                setTimeout(() => {
                                  slackCard.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
                                }, 2000);
                              }
                            }}>
                                    <Lock className="w-3 h-3" />
                                    Connecter Slack
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>Connectez votre workspace Slack pour associer ce profil à un membre de votre équipe</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>}
                        </TableCell>
                        <TableCell className="text-center py-0.5 w-[10%]">
                          <Badge variant="secondary">{linkedinProfile.posts_count || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-0.5 w-[12%]">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteProfile(linkedinProfile.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
                </div>
              </div>}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>;
}