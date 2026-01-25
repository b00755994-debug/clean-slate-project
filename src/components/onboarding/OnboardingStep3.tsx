import { useState, useRef, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SlackMember {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
}

interface LinkedInProfileInput {
  id: string;
  firstName: string;
  lastName: string;
  linkedinUrl: string;
  slackUserId: string | null;
}

interface OnboardingStep3Props {
  onComplete: (profiles: LinkedInProfileInput[]) => Promise<void>;
  onSkip: () => void;
  slackMembers: SlackMember[];
  isSlackConnected: boolean;
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    title: "Ajoutez votre équipe",
    firstName: "Prénom",
    lastName: "Nom",
    url: "URL LinkedIn",
    slack: "Slack",
    noSlackUser: "Aucun",
    addProfile: "Ajouter un profil",
    complete: "Continuer",
    completing: "Configuration...",
    skip: "Passer",
  },
  en: {
    title: "Add your team",
    firstName: "First name",
    lastName: "Last name",
    url: "LinkedIn URL",
    slack: "Slack",
    noSlackUser: "None",
    addProfile: "Add a profile",
    complete: "Continue",
    completing: "Setting up...",
    skip: "Skip",
  },
};

export function OnboardingStep3({ 
  onComplete, 
  onSkip, 
  slackMembers, 
  isSlackConnected, 
  language 
}: OnboardingStep3Props) {
  const t = translations[language];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profiles, setProfiles] = useState<LinkedInProfileInput[]>([
    { id: crypto.randomUUID(), firstName: '', lastName: '', linkedinUrl: '', slackUserId: null },
  ]);
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null);
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const addProfile = () => {
    const newId = crypto.randomUUID();
    setProfiles([
      ...profiles,
      { id: newId, firstName: '', lastName: '', linkedinUrl: '', slackUserId: null },
    ]);
    setFocusedRowId(newId);
  };

  useEffect(() => {
    if (focusedRowId) {
      const input = inputRefs.current.get(`firstName-${focusedRowId}`);
      if (input) {
        input.focus();
        setFocusedRowId(null);
      }
    }
  }, [focusedRowId, profiles]);

  const removeProfile = (id: string) => {
    if (profiles.length > 1) {
      setProfiles(profiles.filter((p) => p.id !== id));
    }
  };

  const updateProfile = (id: string, field: keyof LinkedInProfileInput, value: string | null) => {
    setProfiles(
      profiles.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const isProfileComplete = (profile: LinkedInProfileInput) => {
    return profile.firstName.trim() && profile.lastName.trim() && profile.linkedinUrl.trim();
  };

  const handleComplete = async () => {
    const validProfiles = profiles.filter(isProfileComplete);
    
    setIsSubmitting(true);
    try {
      await onComplete(validProfiles);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validCount = profiles.filter(isProfileComplete).length;

  // Calculate grid columns based on Slack connection
  const gridCols = isSlackConnected && slackMembers.length > 0 
    ? "grid-cols-[1fr_1fr_2fr_1fr_auto]" 
    : "grid-cols-[1fr_1fr_2fr_auto]";

  return (
    <Card className="border shadow-sm max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2 px-6">
        {/* Profile rows */}
        <div className="space-y-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={cn(
                "group grid gap-3 items-center py-2 px-2 rounded-lg transition-all",
                gridCols
              )}
            >
              <Input
                ref={(el) => {
                  if (el) inputRefs.current.set(`firstName-${profile.id}`, el);
                }}
                className="h-10"
                placeholder={t.firstName}
                value={profile.firstName}
                onChange={(e) => updateProfile(profile.id, 'firstName', e.target.value)}
              />
              <Input
                className="h-10"
                placeholder={t.lastName}
                value={profile.lastName}
                onChange={(e) => updateProfile(profile.id, 'lastName', e.target.value)}
              />
              <Input
                className="h-10"
                placeholder="linkedin.com/in/..."
                value={profile.linkedinUrl}
                onChange={(e) => updateProfile(profile.id, 'linkedinUrl', e.target.value)}
              />
              {isSlackConnected && slackMembers.length > 0 && (
                <Select
                  value={profile.slackUserId || 'none'}
                  onValueChange={(value) =>
                    updateProfile(profile.id, 'slackUserId', value === 'none' ? null : value)
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={t.noSlackUser} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t.noSlackUser}</SelectItem>
                    {slackMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={member.avatar_url || undefined} />
                            <AvatarFallback className="text-[10px]">
                              {member.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{member.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <button
                type="button"
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-md transition-all",
                  profiles.length > 1 
                    ? "opacity-0 group-hover:opacity-100 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10" 
                    : "opacity-0 pointer-events-none"
                )}
                onClick={() => removeProfile(profile.id)}
                disabled={profiles.length <= 1}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add profile link */}
        <button
          type="button"
          onClick={addProfile}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors py-1 px-2"
        >
          <Plus className="h-3.5 w-3.5" />
          {t.addProfile}
        </button>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4 border-t">
          <Button
            onClick={handleComplete}
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.completing}
              </>
            ) : (
              <>
                {t.complete}
                {validCount > 0 && (
                  <span className="ml-1.5 text-primary-foreground/80">
                    ({validCount})
                  </span>
                )}
              </>
            )}
          </Button>
          <div className="flex justify-center">
            <button 
              onClick={onSkip} 
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground hover:underline transition-colors"
            >
              {t.skip}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
