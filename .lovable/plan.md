

# Plan: Amélioration de la landing page

## Vue d'ensemble

Mise à jour des titres, sous-titres et ajout de la feature Leaderboard sur l'ensemble de la landing page.

---

## 1. Features Section (`src/components/Features.tsx`)

### 1.1 Ajouter la 4ème carte "Monthly Leaderboard"

```tsx
// Ajouter dans les imports
import { Zap, Sparkles, BarChart3, Rss, Trophy } from "lucide-react";

// Ajouter dans features array (FR)
{
  icon: Trophy,
  title: "Leaderboard Mensuel",
  description: "Classez et récompensez vos ambassadeurs les plus actifs. Visualisez les top contributeurs et stimulez une émulation positive au sein de votre équipe."
}

// Ajouter dans features array (EN)
{
  icon: Trophy,
  title: "Monthly Leaderboard",
  description: "Rank and reward your most active ambassadors. Visualize top contributors and foster healthy competition within your team."
}
```

### 1.2 Mettre à jour le sous-titre (sans "unified/unifié")

```tsx
// FR
subtitle: "Alertes Slack pour chaque post, Team Feed, leaderboards et analytics d'audience avancés. Tout-en-un."

// EN
subtitle: "Slack alerts, Team Feed, leaderboards and advanced audience analytics. All in one."
```

### 1.3 Passer la grille à 4 colonnes

```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
```

---

## 2. ProblemSolution Section (`src/components/ProblemSolution.tsx`)

### 2.1 Nouveau titre principal (Option A)

```tsx
// FR
title1: "Faites de LinkedIn",
title2: "un sport d'équipe."

// EN
title1: "Turn LinkedIn into",
title2: "a team sport."
```

### 2.2 Nouveau sous-titre avec "Activate it" surligné

```tsx
// FR
subtitle1: "Vos équipes ont un réseau. ",
subtitleHighlight: "Activez-le."

// EN
subtitle1: "Your employees have a network. ",
subtitleHighlight: "Activate it."
```

### 2.3 Nouveau titre de solution

```tsx
// FR
solutionHeading: "Votre équipe devient votre meilleur canal d'acquisition."

// EN
solutionHeading: "Your team becomes your best acquisition channel."
```

---

## 3. SlackIntegration Section (`src/components/SlackIntegration.tsx`)

### Nouveau titre (sans le dash)

```tsx
// FR
title: "Activez votre équipe, sans quitter Slack"

// EN  
title: "Activate your team, right from Slack"
```

---

## 4. Testimonial Section (`src/components/Testimonial.tsx`)

### Nouveau titre

```tsx
// FR
title: "Ce qu'en disent nos utilisateurs"

// EN
title: "What our users say"
```

---

## 5. Hero Section (`src/components/Hero.tsx`)

### Ajouter le 4ème pilier Leaderboard

```tsx
// Ajouter dans les imports
import { Trophy } from "lucide-react";

// Ajouter les traductions
feature4Title: "Leaderboard",
feature4Desc: "Classez et récompensez vos meilleurs ambassadeurs" // FR
feature4Desc: "Rank and reward your top ambassadors" // EN

// Passer la grille à 4 colonnes
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">

// Ajouter le 4ème pilier
<div className="text-center">
  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{
    backgroundColor: 'color-mix(in srgb, hsl(210 90% 40%) 5%, hsl(340 100% 99%))'
  }}>
    <Trophy className="h-7 w-7 text-primary" />
  </div>
  <div className="text-2xl font-bold mb-1 tracking-tight" style={{ color: '#1B1B1B' }}>
    {t.feature4Title}
  </div>
  <div className="text-base" style={{ color: '#4A4A4A' }}>
    {t.feature4Desc}
  </div>
</div>
```

---

## Résumé des fichiers modifiés

| Fichier | Modifications |
|---------|---------------|
| `src/components/Features.tsx` | +1 carte, nouveau subtitle, grille 4 cols |
| `src/components/ProblemSolution.tsx` | Nouveau titre, subtitle, solution heading |
| `src/components/SlackIntegration.tsx` | Nouveau titre |
| `src/components/Testimonial.tsx` | Nouveau titre |
| `src/components/Hero.tsx` | +1 pilier, grille 4 cols |

