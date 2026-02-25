import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
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
import { Crown, Linkedin, Plus, Trash2, ExternalLink, CheckCircle2, XCircle, Settings, LogOut, User, Link, Unlink, Lock, RefreshCw, Hash, Info } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import slackLogo from '@/assets/slack-logo.png';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSlackMembers } from '@/hooks/useSlackMembers';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useLinkedInProfiles } from '@/hooks/useLinkedInProfiles';
import { useTeamFeedStats } from '@/components/content/TeamFeed';
import { useSlackChannels } from '@/hooks/useSlackChannels';
import { SlackChannelSelector } from '@/components/slack/SlackChannelSelector';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';

const translations = {
  fr: {
    greeting: 'Bonjour,',
    defaultUser: 'Utilisateur',
    manageAccount: 'Gérez votre compte et soutenez vos équipes sur LinkedIn',
    myPlan: 'Mon Plan',
    planDescription: (plan: string) => plan === 'free'
      ? 'Vous êtes sur le plan <strong>Free</strong>. Passez à Pro pour suivre plus de profils.'
      : 'Vous êtes sur le plan <strong>Pro</strong>. Profitez de toutes les fonctionnalités avancées.',
    manageSubscription: "Gérer l'abonnement",
    comingSoon: '🥷 Bientôt',
    connected: 'Connecté',
    notConnected: 'Non connecté',
    connectedTo: 'Connecté à',
    membersIdentified: 'membres identifiés',
    loadingMembers: 'Chargement des membres...',
    noMembersFound: 'Aucun membre trouvé. Essayez de reconnecter Slack.',
    connectSlackDescription: 'Connectez votre workspace Slack pour recevoir les notifications.',
    openSlack: 'Ouvrir Slack',
    disconnect: 'Déconnecter',
    connectSlack: 'Connecter Slack',
    summary: 'Résumé',
    last30Days: '30 derniers jours',
    followedProfiles: 'Profils suivis',
    posts: 'Posts',
    impressions: 'Impressions',
    linkedinProfilesTitle: 'Profils LinkedIn suivis',
    linkedinProfilesDescription: "Membres de votre équipe dont vous suivez l'activité LinkedIn",
    addUser: 'Ajouter un utilisateur',
    addLinkedinProfile: 'Ajouter un profil LinkedIn',
    addProfileDescription: 'Ajoutez un membre de votre équipe pour suivre son activité LinkedIn.',
    profileName: 'Nom du profil',
    profileNamePlaceholder: 'Jean Dupont',
    linkedinUrl: 'URL LinkedIn',
    linkedinUrlPlaceholder: 'https://linkedin.com/in/jeandupont',
    associatedSlackUser: 'Utilisateur Slack associé',
    optional: 'optionnel',
    selectSlackMember: 'Sélectionner un membre Slack',
    none: 'Aucun',
    autoTagDescription: "Permet de taguer automatiquement l'utilisateur dans les notifications Slack",
    connectSlackToUnlock: 'Connectez Slack pour débloquer',
    connectSlackTooltip: 'Connectez votre workspace Slack pour associer ce profil à un membre de votre équipe et le taguer automatiquement dans les notifications.',
    cancel: 'Annuler',
    add: 'Ajouter',
    adding: 'Ajout...',
    noProfilesYet: 'Aucun profil LinkedIn suivi pour le moment.',
    addTeamMembers: 'Ajoutez des membres de votre équipe pour commencer.',
    name: 'Nom',
    slackUser: 'Utilisateur Slack',
    followers_summary: 'Abonnés',
    followers_tooltip: 'Somme du nombre d\'abonnés de tous les profils LinkedIn suivis',
    followers: 'Abonnés',
    posts30d: 'Posts (30j)',
    actions: 'Actions',
    select: 'Sélectionner',
    error: 'Erreur',
    fillAllFields: "Veuillez renseigner l'URL LinkedIn",
    mustBeLoggedIn: 'Vous devez être connecté pour lier Slack',
    sessionExpired: 'Session expirée. Veuillez vous reconnecter.',
    slackConnectionError: 'Erreur lors de la connexion Slack',
    unableToConnectSlack: 'Impossible de connecter Slack',
    slackDisconnected: 'Slack déconnecté',
    slackDisconnectedDescription: 'Votre workspace Slack a été déconnecté',
    unableToDisconnectSlack: 'Impossible de déconnecter Slack',
    slackConnected: 'Slack connecté !',
    slackConnectedDescription: 'Votre workspace Slack a été connecté avec succès.',
    slackError: 'Erreur Slack',
    connectionFailed: 'La connexion a échoué:',
    connectSlackToAssociate: 'Connectez votre workspace Slack pour associer ce profil à un membre de votre équipe',
    // Channel configuration
    configureChannel: 'Aucun canal défini',
    channelNotFound: 'Canal introuvable',
    channelConfigured: 'Canal configuré',
    notificationsTo: 'Notifications vers',
    changeChannel: 'Modifier',
    chooseChannel: 'Choisir un canal',
    channelDialogTitle: 'Configurer le canal Slack',
    channelDialogDescription: 'Choisissez le canal où Superpump enverra les notifications',
    channelUpdated: 'Canal mis à jour',
    channelUpdatedDescription: 'Les notifications seront envoyées dans',
  },
  en: {
    greeting: 'Hello,',
    defaultUser: 'User',
    manageAccount: 'Manage your account and support your teams on LinkedIn',
    myPlan: 'My Plan',
    planDescription: (plan: string) => plan === 'free'
      ? "You're on the <strong>Free</strong> plan. Upgrade to Pro to follow more profiles."
      : "You're on the <strong>Pro</strong> plan. Enjoy all advanced features.",
    manageSubscription: 'Manage subscription',
    comingSoon: '🥷 Coming soon',
    connected: 'Connected',
    notConnected: 'Not connected',
    connectedTo: 'Connected to',
    membersIdentified: 'members identified',
    loadingMembers: 'Loading members...',
    noMembersFound: 'No members found. Try reconnecting Slack.',
    connectSlackDescription: 'Connect your Slack workspace to receive notifications.',
    openSlack: 'Open Slack',
    disconnect: 'Disconnect',
    connectSlack: 'Connect Slack',
    summary: 'Summary',
    last30Days: 'Last 30 days',
    followedProfiles: 'Followed profiles',
    posts: 'Posts',
    impressions: 'Impressions',
    linkedinProfilesTitle: 'Followed LinkedIn Profiles',
    linkedinProfilesDescription: "Team members whose LinkedIn activity you're following",
    addUser: 'Add user',
    addLinkedinProfile: 'Add LinkedIn Profile',
    addProfileDescription: "Add a team member to follow their LinkedIn activity.",
    profileName: 'Profile name',
    profileNamePlaceholder: 'John Doe',
    linkedinUrl: 'LinkedIn URL',
    linkedinUrlPlaceholder: 'https://linkedin.com/in/johndoe',
    associatedSlackUser: 'Associated Slack user',
    optional: 'optional',
    selectSlackMember: 'Select a Slack member',
    none: 'None',
    autoTagDescription: 'Automatically tag the user in Slack notifications',
    connectSlackToUnlock: 'Connect Slack to unlock',
    connectSlackTooltip: 'Connect your Slack workspace to associate this profile with a team member and tag them automatically in notifications.',
    cancel: 'Cancel',
    add: 'Add',
    adding: 'Adding...',
    noProfilesYet: 'No LinkedIn profiles followed yet.',
    addTeamMembers: 'Add team members to get started.',
    name: 'Name',
    slackUser: 'Slack User',
    followers_summary: 'Followers',
    followers_tooltip: 'Total number of followers across all followed LinkedIn profiles',
    followers: 'Followers',
    posts30d: 'Posts (30d)',
    actions: 'Actions',
    select: 'Select',
    error: 'Error',
    fillAllFields: 'Please provide a LinkedIn URL',
    mustBeLoggedIn: 'You must be logged in to connect Slack',
    sessionExpired: 'Session expired. Please log in again.',
    slackConnectionError: 'Error connecting to Slack',
    unableToConnectSlack: 'Unable to connect Slack',
    slackDisconnected: 'Slack disconnected',
    slackDisconnectedDescription: 'Your Slack workspace has been disconnected',
    unableToDisconnectSlack: 'Unable to disconnect Slack',
    slackConnected: 'Slack connected!',
    slackConnectedDescription: 'Your Slack workspace has been connected successfully.',
    slackError: 'Slack Error',
    connectionFailed: 'Connection failed:',
    connectSlackToAssociate: 'Connect your Slack workspace to associate this profile with a team member',
    // Channel configuration
    configureChannel: 'Configure channel',
    channelNotFound: 'Channel not found',
    channelConfigured: 'Channel configured',
    notificationsTo: 'Notifications to',
    changeChannel: 'Modify',
    chooseChannel: 'Choose channel',
    channelDialogTitle: 'Configure Slack channel',
    channelDialogDescription: 'Choose the channel where Superpump will send notifications',
    channelUpdated: 'Channel updated',
    channelUpdatedDescription: 'Notifications will be sent to',
  }
};

interface SlackMember {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
}

export default function Dashboard() {
  const { user, profile, isLoading } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];

  // Use React Query hooks for caching
  const { workspace: slackWorkspace, isLoading: isWorkspaceLoading, isFetching: isWorkspaceFetching, refetch: refetchWorkspace, disconnect: disconnectSlack } = useWorkspace();
  const { linkedinProfiles, addProfile, isAddingProfile, deleteProfile, updateSlackUser, pollingTimedOut } = useLinkedInProfiles();
  const { data: slackMembers = [], isLoading: isLoadingMembers, isFetching: isSlackMembersFetching } = useSlackMembers(slackWorkspace?.is_connected || false);
  const { stats: teamStats } = useTeamFeedStats();
  const { channels, currentChannel, isLoading: isLoadingChannels, isFetching: isChannelsFetching } = useSlackChannels(slackWorkspace?.is_connected || false);
  const { subscribed, openCustomerPortal } = useSubscription();
  
  // Show syncing indicator only when fetching in background (not initial load)
  const isSyncing = (isWorkspaceFetching && !isWorkspaceLoading) || (isSlackMembersFetching && !isLoadingMembers) || (isChannelsFetching && !isLoadingChannels);

  // Paywall helpers
  const maxBillableUsers = slackWorkspace?.max_billable_users ?? 10;
  const usedBillableUsers = linkedinProfiles.length;
  const isAtLimit = usedBillableUsers >= maxBillableUsers;
  const usagePercent = Math.min((usedBillableUsers / maxBillableUsers) * 100, 100);
  
  const [newProfileUrl, setNewProfileUrl] = useState(() => {
    return sessionStorage.getItem('add_user_url') || '';
  });
  const [selectedSlackUserId, setSelectedSlackUserId] = useState<string>(() => {
    return sessionStorage.getItem('add_user_slack_id') || '';
  });
  const [isDialogOpen, setIsDialogOpen] = useState(() => {
    return sessionStorage.getItem('add_user_dialog_open') === 'true';
  });
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editSlackUserId, setEditSlackUserId] = useState<string>('');
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  
  // Clear sessionStorage for add user form
  const clearAddUserForm = () => {
    sessionStorage.removeItem('add_user_dialog_open');
    sessionStorage.removeItem('add_user_url');
    sessionStorage.removeItem('add_user_slack_id');
  };

  // Persist add user dialog state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('add_user_dialog_open', isDialogOpen.toString());
  }, [isDialogOpen]);

  useEffect(() => {
    sessionStorage.setItem('add_user_url', newProfileUrl);
  }, [newProfileUrl]);

  useEffect(() => {
    sessionStorage.setItem('add_user_slack_id', selectedSlackUserId);
  }, [selectedSlackUserId]);

  // Get current channel name
  const currentChannelName = channels.find(c => c.id === currentChannel)?.name;

  const handleAddProfile = async () => {
    if (!newProfileUrl.trim()) {
      toast({
        title: t.error,
        description: t.fillAllFields,
        variant: 'destructive'
      });
      return;
    }
    try {
      await addProfile({
        profileName: '',
        linkedinUrl: newProfileUrl,
        slackUserId: selectedSlackUserId || undefined
      });
      setNewProfileUrl('');
      setSelectedSlackUserId('');
      setIsDialogOpen(false);
      clearAddUserForm();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    deleteProfile(profileId);
  };

  const handleUpdateSlackUser = (profileId: string, slackUserId: string | null) => {
    updateSlackUser({ profileId, slackUserId });
    setEditingProfileId(null);
    setEditSlackUserId('');
  };

  const handleConnectSlack = async () => {
    if (!user?.id) {
      toast({
        title: t.error,
        description: t.mustBeLoggedIn,
        variant: 'destructive'
      });
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: t.error,
          description: t.sessionExpired,
          variant: 'destructive'
        });
        return;
      }

      const redirectUrl = `${window.location.origin}/dashboard`;
      const response = await fetch(`https://hvmrjymweajxxkoiupzf.supabase.co/functions/v1/slack-auth?redirect_url=${encodeURIComponent(redirectUrl)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t.slackConnectionError);
      }

      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Slack connection error:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : t.unableToConnectSlack,
        variant: 'destructive'
      });
    }
  };

  const handleDisconnectSlack = async () => {
    if (!slackWorkspace?.id) return;
    try {
      disconnectSlack(slackWorkspace.id);
      toast({
        title: t.slackDisconnected,
        description: t.slackDisconnectedDescription
      });
    } catch (error) {
      toast({
        title: t.error,
        description: t.unableToDisconnectSlack,
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
        title: t.slackConnected,
        description: t.slackConnectedDescription
      });
      window.history.replaceState({}, '', '/dashboard');
      refetchWorkspace();
    }
    if (slackError) {
      toast({
        title: t.slackError,
        description: `${t.connectionFailed} ${slackError}`,
        variant: 'destructive'
      });
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  const getSlackMember = (slackUserId: string): SlackMember | undefined => {
    return slackMembers.find(m => m.id === slackUserId);
  };

  const getSlackMemberName = (slackUserId: string) => {
    const member = getSlackMember(slackUserId);
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
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              {t.greeting} {profile?.full_name?.split(' ')[0] || t.defaultUser} 👋
            </h1>
            {isSyncing && (
              <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" />
            )}
          </div>
          <p className="text-muted-foreground">{t.manageAccount}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Plan Section */}
          <Card className="border-border/50 shadow-md flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-accent" />
                {t.myPlan}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <p className="text-sm text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: t.planDescription(slackWorkspace?.plan || 'pro') }} />
              {/* Quota display */}
              <div className="mb-4 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{language === 'fr' ? 'Profils LinkedIn suivis' : 'LinkedIn profiles followed'}</span>
                  <span className={`font-semibold tabular-nums ${isAtLimit ? 'text-destructive' : 'text-foreground'}`}>
                    {usedBillableUsers} / {maxBillableUsers}
                  </span>
                </div>
                
              </div>
              {slackWorkspace?.plan === 'pro' ? (
                <Button
                  variant="outline"
                  className="w-full mt-auto gap-2"
                  onClick={openCustomerPortal}
                >
                  <Settings className="w-4 h-4" />
                  {t.manageSubscription}
                </Button>
              ) : (
                <Button
                  variant="hero"
                  className="w-full mt-auto gap-2"
                  asChild
                >
                  <a href="/pricing">
                    <Crown className="w-4 h-4" />
                    {language === 'fr' ? 'Passer à Pro' : 'Upgrade to Pro'}
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Slack Integration */}
          <Card id="slack-integration-card" className="border-border/50 shadow-md transition-all duration-300 flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <img src={slackLogo} alt="Slack" className="w-5 h-5" />
                <CardTitle className="text-lg">Slack</CardTitle>
                {slackWorkspace?.is_connected && (
                  <div className="flex items-center gap-1.5 ml-auto">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">{t.connected}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow pt-0">
              {slackWorkspace?.is_connected ? (
                <div className="flex flex-col flex-grow">
                  {/* Workspace info */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Workspace</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-sm font-medium">{slackWorkspace.workspace_name}</p>
                        <button 
                          onClick={handleDisconnectSlack}
                          className="text-xs text-muted-foreground hover:text-destructive underline-offset-2 hover:underline transition-colors"
                        >
                          {t.disconnect}
                        </button>
                      </div>
                    </div>
                    
                    <div className="h-px bg-border/50" />
                    
                    {/* Channel config */}
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">{t.notificationsTo.replace(' :', '')}</span>
                      <div className="flex items-center justify-between mt-1">
                        {currentChannel ? (
                          <div className="flex items-center gap-1.5">
                            <Hash className="w-4 h-4 text-muted-foreground" />
                            <span className={`text-sm font-medium ${!isLoadingChannels && !currentChannelName ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                              {isLoadingChannels ? '...' : (currentChannelName || t.channelNotFound)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">{t.configureChannel}</span>
                        )}
                        <Dialog open={isChannelDialogOpen} onOpenChange={setIsChannelDialogOpen}>
                          <DialogTrigger asChild>
                            <button className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors">
                              {currentChannel ? t.changeChannel : t.chooseChannel}
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t.channelDialogTitle}</DialogTitle>
                              <DialogDescription>{t.channelDialogDescription}</DialogDescription>
                            </DialogHeader>
                            <SlackChannelSelector
                              isConnected={slackWorkspace?.is_connected || false}
                              onChannelSelected={(channelId, channelName) => {
                                setIsChannelDialogOpen(false);
                                toast({
                                  title: t.channelUpdated,
                                  description: `${t.channelUpdatedDescription} #${channelName}`
                                });
                              }}
                              language={language}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col flex-grow">
                  <p className="text-sm text-muted-foreground">
                    {t.connectSlackDescription}
                  </p>
                  <div className="mt-auto pt-6">
                    <Button size="sm" className="w-full gap-2 bg-[#4A154B] hover:bg-[#3a1039] text-white" onClick={handleConnectSlack}>
                      <img src={slackLogo} alt="" className="w-4 h-4" />
                      {t.connectSlack}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                  {t.summary}
                </CardTitle>
                <span className="text-xs text-muted-foreground">{t.last30Days}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t.followedProfiles}</span>
                  <span className="font-semibold">{linkedinProfiles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t.posts}</span>
                  <span className="font-semibold">
                    {linkedinProfiles.reduce((acc, p) => acc + (p.posts_count || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    {t.followers_summary}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>{t.followers_tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', { notation: 'compact' }).format(
                      linkedinProfiles.reduce((acc, p) => acc + (p.followers || 0), 0)
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LinkedIn Profiles Section */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                  {t.linkedinProfilesTitle}
                  <span className={`ml-1 text-sm font-medium tabular-nums ${isAtLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {usedBillableUsers}/{maxBillableUsers}
                  </span>
                  {slackWorkspace?.plan !== 'pro' && (
                    <a href="/pricing" className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-primary/80 hover:text-primary bg-primary/10 hover:bg-primary/15 px-2 py-0.5 rounded-md transition-colors">
                      <Crown className="w-3 h-3" />
                      Upgrade
                    </a>
                  )}
                </CardTitle>
                <CardDescription className="mt-1.5">
                  {t.linkedinProfilesDescription}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={isAtLimit ? 0 : undefined}>
                        <Dialog open={isDialogOpen} onOpenChange={isAtLimit ? undefined : setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="gap-2" disabled={isAtLimit}>
                              <Plus className="w-4 h-4" />
                              {t.addUser}
                            </Button>
                          </DialogTrigger>
                        <DialogContent onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()} onFocusOutside={(e) => e.preventDefault()}>
                          <DialogHeader>
                            <DialogTitle>{t.addLinkedinProfile}</DialogTitle>
                            <DialogDescription>{t.addProfileDescription}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="profileUrl">{t.linkedinUrl}</Label>
                              <Input id="profileUrl" placeholder={t.linkedinUrlPlaceholder} value={newProfileUrl} onChange={e => setNewProfileUrl(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="slackUser" className="flex items-center gap-2">
                                <img src={slackLogo} alt="Slack" className="w-4 h-4" />
                                {t.associatedSlackUser}
                                <span className="text-muted-foreground text-xs">({t.optional})</span>
                              </Label>
                              {slackWorkspace?.is_connected && slackMembers.length > 0 ? (
                                <>
                                  <Select value={selectedSlackUserId || 'none'} onValueChange={(value) => setSelectedSlackUserId(value === 'none' ? '' : value)}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder={t.selectSlackMember} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border border-border">
                                      <SelectItem value="none">
                                        <span className="text-muted-foreground">{t.none}</span>
                                      </SelectItem>
                                      {slackMembers.map(member => (
                                        <SelectItem key={member.id} value={member.id}>
                                          <div className="flex items-center gap-2">
                                            {member.avatar_url ? (
                                              <img src={member.avatar_url} alt={member.name} className="w-5 h-5 rounded-full" />
                                            ) : (
                                              <User className="w-5 h-5 text-muted-foreground" />
                                            )}
                                            <span>{member.name}</span>
                                            {member.email && (
                                              <span className="text-xs text-muted-foreground">({member.email})</span>
                                            )}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Link className="w-3 h-3" />
                                    {t.autoTagDescription}
                                  </p>
                                </>
                              ) : slackWorkspace?.is_connected && isLoadingMembers ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                  {t.loadingMembers}
                                </div>
                              ) : (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="relative">
                                        <Input id="slackUser" disabled placeholder={t.connectSlackToUnlock} className="bg-muted/50 cursor-not-allowed pr-10" />
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs">
                                      <p>{t.connectSlackTooltip}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {
                              setIsDialogOpen(false);
                              clearAddUserForm();
                            }}>
                              {t.cancel}
                            </Button>
                            <Button onClick={handleAddProfile} disabled={isAddingProfile}>
                              {isAddingProfile ? t.adding : t.add}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </span>
                  </TooltipTrigger>
                  {isAtLimit && (
                    <TooltipContent side="left" className="max-w-xs">
                      <p>
                        {language === 'fr'
                          ? `Limite de ${maxBillableUsers} profils atteinte.`
                          : `${maxBillableUsers} profile limit reached.`}
                        {' '}
                        <a href="/pricing" className="underline font-semibold">
                          {language === 'fr' ? 'Passez à Pro →' : 'Upgrade to Pro →'}
                        </a>
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {linkedinProfiles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Linkedin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t.noProfilesYet}</p>
                <p className="text-sm">{t.addTeamMembers}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="text-xs table-fixed w-full">
                  <TableHeader>
                    <TableRow className="h-5">
                      <TableHead className="py-0.5 text-[11px] w-[18%] uppercase tracking-wide">{t.name}</TableHead>
                      <TableHead className="py-0.5 text-[11px] w-[30%] uppercase tracking-wide">{t.linkedinUrl}</TableHead>
                      <TableHead className="py-0.5 text-[11px] w-[20%] uppercase tracking-wide">{t.slackUser}</TableHead>
                      <TableHead className="py-0.5 text-[11px] w-[12%] text-right uppercase tracking-wide">{t.followers}</TableHead>
                      <TableHead className="text-center py-0.5 text-[11px] w-[12%] uppercase tracking-wide">{t.posts30d}</TableHead>
                      <TableHead className="text-right py-0.5 text-[11px] w-[10%] uppercase tracking-wide">{t.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
                <div className="max-h-[200px] overflow-y-auto">
                  <Table className="text-xs table-fixed w-full">
                    <TableBody>
                      {linkedinProfiles.map(linkedinProfile => (
                        <TableRow key={linkedinProfile.id} className="h-5">
                          <TableCell className="font-medium py-0.5 w-[18%]">
                            <div className="flex items-center gap-2 truncate">
                              {linkedinProfile.profile_picture ? (
                                <img src={linkedinProfile.profile_picture} alt={linkedinProfile.profile_name || ''} className="w-6 h-6 rounded-full object-cover shrink-0" />
                              ) : linkedinProfile.profile_name ? (
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                  <span className="text-[10px] font-medium">{linkedinProfile.profile_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                                </div>
                              ) : (
                                <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                              )}
                              {linkedinProfile.profile_name ? (
                                <span>{linkedinProfile.profile_name}</span>
                              ) : pollingTimedOut && (linkedinProfile.scrapping_onboarding_done === null || linkedinProfile.scrapping_onboarding_done === false) ? (
                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                  {language === 'fr' ? 'Scraping échoué' : 'Scraping failed'}
                                </span>
                              ) : (
                                <Skeleton className="h-3 w-20" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-0.5 w-[30%]">
                            <a href={linkedinProfile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 truncate">
                              {linkedinProfile.linkedin_url.replace('https://linkedin.com/in/', '')}
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </TableCell>
                          <TableCell className="py-0.5 w-[20%]">
                            {slackWorkspace?.is_connected ? (
                              <Select value={linkedinProfile.slack_user_id || 'none'} onValueChange={value => {
                                handleUpdateSlackUser(linkedinProfile.id, value === 'none' ? null : value);
                              }}>
                                <SelectTrigger className="border-0 bg-transparent p-0 h-auto w-auto shadow-none focus:ring-0 [&>svg]:hidden">
                                  {linkedinProfile.slack_user_id ? (() => {
                                    const slackMember = getSlackMember(linkedinProfile.slack_user_id);
                                    return (
                                      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                        {slackMember?.avatar_url ? (
                                          <img src={slackMember.avatar_url} alt={slackMember.name} className="w-5 h-5 rounded" />
                                        ) : (
                                          <div className="w-5 h-5 rounded bg-[#4A154B] flex items-center justify-center">
                                            <span className="text-white text-[10px] font-medium">
                                              {getSlackMemberName(linkedinProfile.slack_user_id).charAt(0).toUpperCase()}
                                            </span>
                                          </div>
                                        )}
                                        <span className="text-xs text-foreground">{getSlackMemberName(linkedinProfile.slack_user_id)}</span>
                                      </div>
                                    );
                                  })() : (
                                    <Badge variant="outline" className="cursor-pointer hover:bg-[#4A154B]/10 hover:border-[#4A154B]/30 gap-1.5 transition-colors py-1 px-2 text-xs border-dashed border-muted-foreground/30 text-muted-foreground">
                                      <img src={slackLogo} alt="Slack" className="w-3.5 h-3.5 opacity-60" />
                                      {t.select}
                                    </Badge>
                                  )}
                                </SelectTrigger>
                                <SelectContent className="bg-popover border border-border shadow-lg z-[100] max-h-60 overflow-auto" position="popper" sideOffset={4}>
                                  <SelectItem value="none">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                                        <Unlink className="w-3 h-3 text-muted-foreground" />
                                      </div>
                                      <span className="text-muted-foreground">{t.none}</span>
                                    </div>
                                  </SelectItem>
                                  {slackMembers.map(member => (
                                    <SelectItem key={member.id} value={member.id}>
                                      <div className="flex items-center gap-2">
                                        {member.avatar_url ? (
                                          <img src={member.avatar_url} alt={member.name} className="w-6 h-6 rounded" />
                                        ) : (
                                          <div className="w-6 h-6 rounded bg-[#4A154B] flex items-center justify-center">
                                            <span className="text-white text-xs font-medium">
                                              {member.name.charAt(0).toUpperCase()}
                                            </span>
                                          </div>
                                        )}
                                        <span>{member.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="secondary" className="text-muted-foreground gap-1.5 cursor-pointer opacity-50 hover:opacity-70 transition-opacity" onClick={() => {
                                      const slackCard = document.getElementById('slack-integration-card');
                                      if (slackCard) {
                                        slackCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        slackCard.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                                        setTimeout(() => {
                                          slackCard.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
                                        }, 2000);
                                      }
                                    }}>
                                      <Lock className="w-3 h-3" />
                                      {t.connectSlack}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>{t.connectSlackToAssociate}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </TableCell>
                          <TableCell className="py-0.5 w-[12%] text-right text-sm">
                            {linkedinProfile.followers != null ? `${(linkedinProfile.followers / 1000).toFixed(1)}k` : <Skeleton className="h-3 w-10 ml-auto" />}
                          </TableCell>
                          <TableCell className="text-center py-0.5 w-[12%]">

                            <Badge variant="secondary">{linkedinProfile.posts_count || 0}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-0.5 w-[10%]">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProfile(linkedinProfile.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
