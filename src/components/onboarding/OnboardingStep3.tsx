import { useState, useRef, useEffect } from 'react';
import { Linkedin, Plus, X, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    description: "1 profil = 1 personne dont vous suivez les posts LinkedIn",
    firstName: "Prénom",
    lastName: "Nom",
    url: "URL LinkedIn",
    slack: "Slack",
    noSlackUser: "Aucun",
    addProfile: "Ajouter un profil",
    complete: "Continuer",
    completing: "Configuration...",
    skip: "Passer",
    profilesReady: "profil(s) prêt(s)",
  },
  en: {
    title: "Add your team",
    description: "1 profile = 1 person whose LinkedIn posts you track",
    firstName: "First name",
    lastName: "Last name",
    url: "LinkedIn URL",
    slack: "Slack",
    noSlackUser: "None",
    addProfile: "Add a profile",
    complete: "Continue",
    completing: "Setting up...",
    skip: "Skip",
    profilesReady: "profile(s) ready",
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
    ? "grid-cols-[2fr_2fr_4fr_2fr_auto]" 
    : "grid-cols-[2fr_2fr_5fr_auto]";

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-[#0A66C2]/10 rounded-full flex items-center justify-center mb-4">
          <Linkedin className="h-6 w-6 text-[#0A66C2]" />
        </div>
        <CardTitle className="text-2xl">{t.title}</CardTitle>
        <CardDescription className="text-base">{t.description}</CardDescription>
        {validCount > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-2 text-green-600 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" />
            <span>{validCount} {t.profilesReady}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Header row */}
        <div className={cn("grid gap-2 text-xs text-muted-foreground px-1", gridCols)}>
          <span>{t.firstName}</span>
          <span>{t.lastName}</span>
          <span>{t.url}</span>
          {isSlackConnected && slackMembers.length > 0 && <span>{t.slack}</span>}
          <span className="w-8"></span>
        </div>

        {/* Profile rows */}
        <div className="space-y-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={cn(
                "grid gap-2 items-center py-1.5 px-1 rounded-md transition-colors",
                gridCols,
                isProfileComplete(profile) && "bg-green-50/50 dark:bg-green-950/20"
              )}
            >
              <Input
                ref={(el) => {
                  if (el) inputRefs.current.set(`firstName-${profile.id}`, el);
                }}
                className="h-9"
                placeholder="Jean"
                value={profile.firstName}
                onChange={(e) => updateProfile(profile.id, 'firstName', e.target.value)}
              />
              <Input
                className="h-9"
                placeholder="Dupont"
                value={profile.lastName}
                onChange={(e) => updateProfile(profile.id, 'lastName', e.target.value)}
              />
              <Input
                className="h-9"
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
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="—" />
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
                  "w-8 h-8 flex items-center justify-center rounded-md transition-colors",
                  profiles.length > 1 
                    ? "text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10" 
                    : "text-transparent cursor-default"
                )}
                onClick={() => removeProfile(profile.id)}
                disabled={profiles.length <= 1}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add button */}
        <button
          type="button"
          onClick={addProfile}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-1"
        >
          <Plus className="h-4 w-4" />
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
              t.complete
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
