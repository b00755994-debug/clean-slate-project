import { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLinkedInProfiles } from '@/hooks/useLinkedInProfiles';
import { toast } from 'sonner';

interface OnboardingStepLinkedInProps {
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    title: "Ajoutez votre équipe",
    subtitle: "Collez les URLs LinkedIn des profils à suivre",
    urlPlaceholder: "https://www.linkedin.com/in/...",
    add: "Ajouter",
    adding: "Ajout...",
    complete: "Continuer",
    skip: "Passer",
    back: "Retour",
    name: "Nom",
    url: "URL LinkedIn",
    followers: "Followers",
    actions: "",
    loading: "En attente...",
  },
  en: {
    title: "Add your team",
    subtitle: "Paste the LinkedIn URLs of profiles to track",
    urlPlaceholder: "https://www.linkedin.com/in/...",
    add: "Add",
    adding: "Adding...",
    complete: "Continue",
    skip: "Skip",
    back: "Back",
    name: "Name",
    url: "LinkedIn URL",
    followers: "Followers",
    actions: "",
    loading: "Loading...",
  },
};

export function OnboardingStepLinkedIn({ onComplete, onSkip, onBack, language }: OnboardingStepLinkedInProps) {
  const t = translations[language];
  const { linkedinProfiles, isLoading, addProfile, isAddingProfile, deleteProfile } = useLinkedInProfiles();
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    try {
      await addProfile({ profileName: '', linkedinUrl: trimmed });
      setUrlInput('');
      setUrlError(null);
    } catch (e) {
      if (e instanceof Error) {
        setUrlError(e.message);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAddingProfile) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Card className="border shadow-sm max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">{t.title}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-2 px-6">
        {/* URL input */}
        <div className="flex gap-2">
          <Input
            placeholder={t.urlPlaceholder}
            value={urlInput}
            onChange={(e) => { setUrlInput(e.target.value); setUrlError(null); }}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            onClick={handleAdd}
            disabled={isAddingProfile || !urlInput.trim()}
            size="default"
            variant="outline"
          >
            {isAddingProfile ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span className="ml-1.5">{isAddingProfile ? t.adding : t.add}</span>
          </Button>
        </div>
        {urlError && (
          <p className="text-destructive text-xs -mt-2">{urlError}</p>
        )}

        {/* Profiles table */}
        {linkedinProfiles.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs h-9">{t.name}</TableHead>
                  <TableHead className="text-xs h-9">{t.url}</TableHead>
                  <TableHead className="text-xs h-9 text-right">{t.followers}</TableHead>
                  <TableHead className="text-xs h-9 w-10">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkedinProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    {/* Avatar + Name */}
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        {profile.profile_picture || profile.avatar_url ? (
                          <img
                            src={profile.profile_picture || profile.avatar_url || ''}
                            alt=""
                            className="h-7 w-7 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
                        )}
                        {profile.profile_name ? (
                          <span className="text-sm truncate max-w-[140px]">{profile.profile_name}</span>
                        ) : (
                          <Skeleton className="h-4 w-24" />
                        )}
                      </div>
                    </TableCell>
                    {/* URL */}
                    <TableCell className="py-2">
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground truncate max-w-[200px] inline-flex items-center gap-1"
                      >
                        <span className="truncate">{profile.linkedin_url.replace('https://www.linkedin.com', '').replace('https://linkedin.com', '')}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </TableCell>
                    {/* Followers */}
                    <TableCell className="py-2 text-right">
                      {profile.followers != null ? (
                        <span className="text-sm">{profile.followers.toLocaleString()}</span>
                      ) : (
                        <Skeleton className="h-4 w-12 ml-auto" />
                      )}
                    </TableCell>
                    {/* Delete */}
                    <TableCell className="py-2">
                      <button
                        onClick={() => deleteProfile(profile.id)}
                        className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col gap-3 pt-4 border-t">
          <Button onClick={onComplete} className="w-full" size="lg">
            {t.complete}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t.back}
            </button>
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
