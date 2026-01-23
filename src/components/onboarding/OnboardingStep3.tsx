import { useState } from 'react';
import { Linkedin, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    title: "Ajoutez des profils LinkedIn",
    description: "Suivez les posts de votre équipe et recevez des alertes",
    firstNameLabel: "Prénom",
    firstNamePlaceholder: "Jean",
    lastNameLabel: "Nom",
    lastNamePlaceholder: "Dupont",
    urlLabel: "URL LinkedIn",
    urlPlaceholder: "https://linkedin.com/in/jean-dupont",
    slackUserLabel: "Utilisateur Slack associé",
    slackUserPlaceholder: "Sélectionner un membre",
    noSlackUser: "Aucun",
    addAnother: "Ajouter un autre profil",
    complete: "Terminer la configuration",
    completing: "Configuration en cours...",
    skip: "Passer",
    profileAdded: "profil(s) ajouté(s)",
  },
  en: {
    title: "Add LinkedIn profiles",
    description: "Track your team's posts and receive alerts",
    firstNameLabel: "First name",
    firstNamePlaceholder: "John",
    lastNameLabel: "Last name",
    lastNamePlaceholder: "Doe",
    urlLabel: "LinkedIn URL",
    urlPlaceholder: "https://linkedin.com/in/john-doe",
    slackUserLabel: "Associated Slack user",
    slackUserPlaceholder: "Select a member",
    noSlackUser: "None",
    addAnother: "Add another profile",
    complete: "Complete setup",
    completing: "Setting up...",
    skip: "Skip",
    profileAdded: "profile(s) added",
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

  const addProfile = () => {
    setProfiles([
      ...profiles,
      { id: crypto.randomUUID(), firstName: '', lastName: '', linkedinUrl: '', slackUserId: null },
    ]);
  };

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

  const handleComplete = async () => {
    const validProfiles = profiles.filter(
      (p) => p.firstName.trim() && p.lastName.trim() && p.linkedinUrl.trim()
    );
    
    setIsSubmitting(true);
    try {
      await onComplete(validProfiles);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validCount = profiles.filter(
    (p) => p.firstName.trim() && p.lastName.trim() && p.linkedinUrl.trim()
  ).length;

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-[#0A66C2]/10 rounded-full flex items-center justify-center mb-4">
          <Linkedin className="h-6 w-6 text-[#0A66C2]" />
        </div>
        <CardTitle className="text-2xl">{t.title}</CardTitle>
        <CardDescription className="text-base">{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {profiles.map((profile, index) => (
            <div
              key={profile.id}
              className="border rounded-lg p-4 space-y-4 bg-muted/30 relative"
            >
              {profiles.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeProfile(profile.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${index}`}>{t.firstNameLabel}</Label>
                  <Input
                    id={`firstName-${index}`}
                    placeholder={t.firstNamePlaceholder}
                    value={profile.firstName}
                    onChange={(e) => updateProfile(profile.id, 'firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`lastName-${index}`}>{t.lastNameLabel}</Label>
                  <Input
                    id={`lastName-${index}`}
                    placeholder={t.lastNamePlaceholder}
                    value={profile.lastName}
                    onChange={(e) => updateProfile(profile.id, 'lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`url-${index}`}>{t.urlLabel}</Label>
                <Input
                  id={`url-${index}`}
                  placeholder={t.urlPlaceholder}
                  value={profile.linkedinUrl}
                  onChange={(e) => updateProfile(profile.id, 'linkedinUrl', e.target.value)}
                />
              </div>

              {isSlackConnected && slackMembers.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor={`slack-${index}`}>{t.slackUserLabel}</Label>
                  <Select
                    value={profile.slackUserId || 'none'}
                    onValueChange={(value) =>
                      updateProfile(profile.id, 'slackUserId', value === 'none' ? null : value)
                    }
                  >
                    <SelectTrigger id={`slack-${index}`}>
                      <SelectValue placeholder={t.slackUserPlaceholder} />
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
                            <span>{member.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addProfile}
          className="w-full border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t.addAnother}
        </Button>

        <div className="flex flex-col gap-3 pt-2">
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
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t.complete}
                {validCount > 0 && (
                  <span className="ml-2 text-xs opacity-75">
                    ({validCount} {t.profileAdded})
                  </span>
                )}
              </>
            )}
          </Button>
          <div className="flex justify-center mt-2">
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
