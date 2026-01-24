import { useState, useMemo } from 'react';
import { Hash, Search, Check, Loader2, Users, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSlackChannels } from '@/hooks/useSlackChannels';

interface SlackChannelSelectorProps {
  isConnected: boolean;
  onChannelSelected?: (channelId: string, channelName: string) => void;
  language: 'fr' | 'en';
  compact?: boolean;
}

const translations = {
  fr: {
    searchPlaceholder: 'Rechercher un canal...',
    noChannelsFound: 'Aucun canal trouvé',
    loadingChannels: 'Chargement des canaux...',
    inviteBot: 'Inviter Superpump',
    inviting: 'Invitation...',
    botInvited: 'Superpump ajouté à',
    members: 'membres',
    error: 'Erreur',
    currentChannel: 'Canal actuel',
    selectChannel: 'Sélectionnez un canal',
    reconnectNeeded: 'Veuillez reconnecter Slack pour accéder aux canaux',
  },
  en: {
    searchPlaceholder: 'Search channels...',
    noChannelsFound: 'No channels found',
    loadingChannels: 'Loading channels...',
    inviteBot: 'Invite Superpump',
    inviting: 'Inviting...',
    botInvited: 'Superpump added to',
    members: 'members',
    error: 'Error',
    currentChannel: 'Current channel',
    selectChannel: 'Select a channel',
    reconnectNeeded: 'Please reconnect Slack to access channels',
  },
};

export function SlackChannelSelector({ 
  isConnected, 
  onChannelSelected, 
  language,
  compact = false 
}: SlackChannelSelectorProps) {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  
  const { 
    channels, 
    currentChannel, 
    isLoading, 
    error,
    joinChannel, 
    isJoiningChannel 
  } = useSlackChannels(isConnected);

  const filteredChannels = useMemo(() => {
    if (!searchQuery) return channels;
    const query = searchQuery.toLowerCase();
    return channels.filter(channel => 
      channel.name.toLowerCase().includes(query)
    );
  }, [channels, searchQuery]);

  const handleSelectChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
  };

  const handleInviteBot = () => {
    if (!selectedChannelId) return;
    
    joinChannel(selectedChannelId, {
      onSuccess: (data) => {
        const channel = channels.find(c => c.id === selectedChannelId);
        if (channel && onChannelSelected) {
          onChannelSelected(selectedChannelId, channel.name);
        }
      },
    });
  };

  const selectedChannel = channels.find(c => c.id === selectedChannelId);
  const isCurrentlySelected = selectedChannelId === currentChannel;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        {t.loadingChannels}
      </div>
    );
  }

  if (error) {
    const needsReconnect = error.message?.includes('channels:read') || 
                           error.message?.includes('missing_scope');
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
        <p className="text-sm text-muted-foreground">
          {needsReconnect ? t.reconnectNeeded : error.message}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Channel List */}
      <ScrollArea className={cn("border rounded-lg", compact ? "h-[200px]" : "h-[280px]")}>
        <div className="p-2 space-y-1">
          {filteredChannels.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              {t.noChannelsFound}
            </div>
          ) : (
            filteredChannels.map((channel) => {
              const isSelected = selectedChannelId === channel.id;
              const isCurrent = currentChannel === channel.id;
              
              return (
                <button
                  key={channel.id}
                  onClick={() => handleSelectChannel(channel.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left transition-colors",
                    isSelected 
                      ? "bg-primary/10 border border-primary/30" 
                      : "hover:bg-muted/50",
                    isCurrent && !isSelected && "bg-green-500/10 border border-green-500/30"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "font-medium truncate",
                      isSelected && "text-primary"
                    )}>
                      {channel.name}
                    </span>
                    {isCurrent && (
                      <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded">
                        {t.currentChannel}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {channel.num_members}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Action Button */}
      <Button
        onClick={handleInviteBot}
        disabled={!selectedChannelId || isJoiningChannel || isCurrentlySelected}
        className="w-full bg-[#4A154B] hover:bg-[#3a1039]"
      >
        {isJoiningChannel ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t.inviting}
          </>
        ) : isCurrentlySelected ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            {t.botInvited} #{selectedChannel?.name}
          </>
        ) : (
          <>
            {t.inviteBot}
            {selectedChannel && ` → #${selectedChannel.name}`}
          </>
        )}
      </Button>
    </div>
  );
}
