import { useState, useMemo } from 'react';
import { Hash, Search, Check, Loader2, AlertCircle } from 'lucide-react';
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
    inviteAndSelect: 'Inviter et sélectionner',
    selectChannel: 'Sélectionner ce canal',
    saving: 'Enregistrement...',
    activeChannel: 'Canal actif',
    members: 'membres',
    error: 'Erreur',
    reconnectNeeded: 'Veuillez reconnecter Slack pour accéder aux canaux',
    legendActive: 'Canal actif',
    legendBotMember: 'Bot présent',
  },
  en: {
    searchPlaceholder: 'Search channels...',
    noChannelsFound: 'No channels found',
    loadingChannels: 'Loading channels...',
    inviteAndSelect: 'Invite and select',
    selectChannel: 'Select this channel',
    saving: 'Saving...',
    activeChannel: 'Active channel',
    members: 'members',
    error: 'Error',
    reconnectNeeded: 'Please reconnect Slack to access channels',
    legendActive: 'Active channel',
    legendBotMember: 'Bot present',
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

  const [joinError, setJoinError] = useState<string | null>(null);
  const [needsReconnect, setNeedsReconnect] = useState(false);

  const handleInviteBot = () => {
    if (!selectedChannelId) return;
    
    setJoinError(null);
    setNeedsReconnect(false);
    
    const channel = channels.find(c => c.id === selectedChannelId);
    joinChannel({ channelId: selectedChannelId }, {
      onSuccess: (data) => {
        if (channel && onChannelSelected) {
          onChannelSelected(selectedChannelId, channel.name);
        }
      },
      onError: (error: Error & { needsReconnect?: boolean }) => {
        setJoinError(error.message);
        if (error.needsReconnect) {
          setNeedsReconnect(true);
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
        <Input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 bg-muted/30 border-0 focus-visible:ring-1"
        />
      </div>

      {/* Channel List */}
      <ScrollArea className={cn(
        "rounded-lg border border-border/50",
        compact ? "h-[180px]" : "h-[260px]"
      )}>
        <div className="p-1.5">
          {filteredChannels.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              {t.noChannelsFound}
            </div>
          ) : (
            filteredChannels.map((channel) => {
              const isSelected = selectedChannelId === channel.id;
              const isCurrent = currentChannel === channel.id;
              const hasBot = channel.is_member;
              
              return (
                <button
                  key={channel.id}
                  onClick={() => handleSelectChannel(channel.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left transition-all",
                    "hover:bg-muted/60",
                    isSelected && "bg-primary/5 ring-1 ring-primary/20"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Status indicator dot */}
                    <div className="w-4 flex justify-center">
                      {isCurrent ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      ) : hasBot ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      ) : null}
                    </div>
                    
                    <Hash className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground/70"
                    )} />
                    <span className={cn(
                      "text-sm truncate",
                      isSelected ? "font-medium text-primary" : "text-foreground"
                    )}>
                      {channel.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted-foreground/50">
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

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span>{t.legendActive}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>{t.legendBotMember}</span>
        </div>
      </div>

      {/* Error Message */}
      {joinError && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-destructive font-medium">
              {needsReconnect ? t.reconnectNeeded : joinError}
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={handleInviteBot}
        disabled={!selectedChannelId || isJoiningChannel || isCurrentlySelected}
        className="w-full bg-[#4A154B] hover:bg-[#3a1039]"
        size="lg"
      >
        {isJoiningChannel ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t.saving}
          </>
        ) : isCurrentlySelected ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            {t.activeChannel}
          </>
        ) : selectedChannel?.is_member ? (
          t.selectChannel
        ) : (
          t.inviteAndSelect
        )}
      </Button>
    </div>
  );
}
