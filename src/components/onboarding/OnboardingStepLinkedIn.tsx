import { useState, useRef, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LinkedInProfileInput {
  id: string;
  firstName: string;
  lastName: string;
  linkedinUrl: string;
}

interface OnboardingStepLinkedInProps {
  onComplete: (profiles: LinkedInProfileInput[]) => Promise<void>;
  onSkip: () => void;
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    title: "Ajoutez votre équipe",
    firstName: "Prénom",
    lastName: "Nom",
    url: "URL LinkedIn",
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
    addProfile: "Add a profile",
    complete: "Continue",
    completing: "Setting up...",
    skip: "Skip",
  },
};

export function OnboardingStepLinkedIn({ 
  onComplete, 
  onSkip, 
  language 
}: OnboardingStepLinkedInProps) {
  const t = translations[language];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profiles, setProfiles] = useState<LinkedInProfileInput[]>([
    { id: crypto.randomUUID(), firstName: '', lastName: '', linkedinUrl: '' },
  ]);
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null);
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const addProfile = () => {
    const newId = crypto.randomUUID();
    setProfiles([
      ...profiles,
      { id: newId, firstName: '', lastName: '', linkedinUrl: '' },
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

  const updateProfile = (id: string, field: keyof LinkedInProfileInput, value: string) => {
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
              className="group grid gap-3 items-center py-2 px-2 rounded-lg transition-all grid-cols-[1fr_1fr_2fr_auto]"
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
