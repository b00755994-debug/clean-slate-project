import { useState } from 'react';
import { Building2, User, Users, Megaphone, ArrowRight } from 'lucide-react';
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

interface OnboardingStep1Props {
  onNext: (data: Step1Data) => void;
  onSkip: () => void;
  language: 'fr' | 'en';
}

export interface Step1Data {
  companyName: string;
  jobRole: string;
  teamSize: string;
  acquisitionChannel: string;
}

const translations = {
  fr: {
    title: "Parlez-nous de vous",
    description: "Ces informations nous aident à personnaliser votre expérience",
    companyLabel: "Nom de l'entreprise",
    companyPlaceholder: "Acme Corp",
    roleLabel: "Votre rôle",
    rolePlaceholder: "Sélectionnez votre rôle",
    roles: {
      founder: "Fondateur / CEO",
      marketing: "Marketing",
      sales: "Commercial",
      product: "Product / PM",
      communication: "Communication / RP",
      growth: "Growth / Acquisition",
      hr: "Ressources Humaines",
      other: "Autre",
    },
    teamSizeLabel: "Taille de l'équipe",
    teamSizePlaceholder: "Sélectionnez la taille",
    teamSizes: {
      solo: "1 (Solo)",
      small: "2-10",
      medium: "11-50",
      large: "51-200",
      enterprise: "200+",
    },
    channelLabel: "Comment avez-vous connu superpump ?",
    channelPlaceholder: "Sélectionnez une option",
    channels: {
      linkedin: "LinkedIn",
      twitter: "Twitter / X",
      wordOfMouth: "Bouche à oreille",
      google: "Recherche Google",
      newsletter: "Newsletter",
      podcast: "Podcast",
      event: "Événement / Conférence",
      other: "Autre",
    },
    next: "Continuer",
    skip: "Passer",
  },
  en: {
    title: "Tell us about yourself",
    description: "This helps us personalize your experience",
    companyLabel: "Company name",
    companyPlaceholder: "Acme Corp",
    roleLabel: "Your role",
    rolePlaceholder: "Select your role",
    roles: {
      founder: "Founder / CEO",
      marketing: "Marketing",
      sales: "Sales",
      product: "Product / PM",
      communication: "Communication / PR",
      growth: "Growth / Acquisition",
      hr: "Human Resources",
      other: "Other",
    },
    teamSizeLabel: "Team size",
    teamSizePlaceholder: "Select size",
    teamSizes: {
      solo: "1 (Solo)",
      small: "2-10",
      medium: "11-50",
      large: "51-200",
      enterprise: "200+",
    },
    channelLabel: "How did you hear about superpump?",
    channelPlaceholder: "Select an option",
    channels: {
      linkedin: "LinkedIn",
      twitter: "Twitter / X",
      wordOfMouth: "Word of mouth",
      google: "Google Search",
      newsletter: "Newsletter",
      podcast: "Podcast",
      event: "Event / Conference",
      other: "Other",
    },
    next: "Continue",
    skip: "Skip",
  },
};

export function OnboardingStep1({ onNext, onSkip, language }: OnboardingStep1Props) {
  const t = translations[language];
  const [formData, setFormData] = useState<Step1Data>({
    companyName: '',
    jobRole: '',
    teamSize: '',
    acquisitionChannel: '',
  });

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{t.title}</CardTitle>
        <CardDescription className="text-base">{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="space-y-2">
          <Label htmlFor="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            {t.companyLabel}
          </Label>
          <Input
            id="company"
            placeholder={t.companyPlaceholder}
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {t.roleLabel}
          </Label>
          <Select
            value={formData.jobRole}
            onValueChange={(value) => setFormData({ ...formData, jobRole: value })}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder={t.rolePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="founder">{t.roles.founder}</SelectItem>
              <SelectItem value="marketing">{t.roles.marketing}</SelectItem>
              <SelectItem value="sales">{t.roles.sales}</SelectItem>
              <SelectItem value="product">{t.roles.product}</SelectItem>
              <SelectItem value="communication">{t.roles.communication}</SelectItem>
              <SelectItem value="growth">{t.roles.growth}</SelectItem>
              <SelectItem value="hr">{t.roles.hr}</SelectItem>
              <SelectItem value="other">{t.roles.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="team-size" className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            {t.teamSizeLabel}
          </Label>
          <Select
            value={formData.teamSize}
            onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
          >
            <SelectTrigger id="team-size">
              <SelectValue placeholder={t.teamSizePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">{t.teamSizes.solo}</SelectItem>
              <SelectItem value="small">{t.teamSizes.small}</SelectItem>
              <SelectItem value="medium">{t.teamSizes.medium}</SelectItem>
              <SelectItem value="large">{t.teamSizes.large}</SelectItem>
              <SelectItem value="enterprise">{t.teamSizes.enterprise}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="channel" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-muted-foreground" />
            {t.channelLabel}
          </Label>
          <Select
            value={formData.acquisitionChannel}
            onValueChange={(value) => setFormData({ ...formData, acquisitionChannel: value })}
          >
            <SelectTrigger id="channel">
              <SelectValue placeholder={t.channelPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">{t.channels.linkedin}</SelectItem>
              <SelectItem value="twitter">{t.channels.twitter}</SelectItem>
              <SelectItem value="wordOfMouth">{t.channels.wordOfMouth}</SelectItem>
              <SelectItem value="google">{t.channels.google}</SelectItem>
              <SelectItem value="newsletter">{t.channels.newsletter}</SelectItem>
              <SelectItem value="podcast">{t.channels.podcast}</SelectItem>
              <SelectItem value="event">{t.channels.event}</SelectItem>
              <SelectItem value="other">{t.channels.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={handleSubmit} className="w-full" size="lg">
            {t.next}
            <ArrowRight className="ml-2 h-4 w-4" />
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
