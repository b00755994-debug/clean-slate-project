

## Refonte des 3 piliers Hero — Option A (Features-based)

### Objectif
Remplacer les métriques actuelles ("+350%", "5min", "10x") qui semblent être des "fake data" par une présentation des 3 fonctionnalités clés du produit, cohérente avec l'identité de superpump.

### Structure actuelle → Nouvelle structure

| Actuel | Nouveau |
|--------|---------|
| +350% LinkedIn Impressions | **Instant Slack Alerts** |
| 5min Complete Slack Setup | **Unified Team Feed** |
| 10x Team Engagement | **Audience Analytics** |

### Nouveau design visuel

Chaque pilier sera composé de :
- **Icône** dans un container arrondi (style existant conservé)
- **Titre de la feature** en gras (remplace la métrique)
- **Description courte** (1 ligne explicative)

### Détails techniques

**Fichier** : `src/components/Hero.tsx`

**1. Mise à jour des imports** (ajouter `Bell`, `Activity`, `BarChart3`)
```tsx
import { Bell, Activity, BarChart3 } from "lucide-react";
```

**2. Mise à jour des traductions**
```tsx
const translations = {
  fr: {
    // ...existing
    feature1Title: "Slack Alerts",
    feature1Desc: "Notification instantanée à chaque post LinkedIn",
    feature2Title: "Team Feed",
    feature2Desc: "Tous les posts de votre équipe en un seul endroit",
    feature3Title: "Analytics",
    feature3Desc: "Mesurez la portée globale de votre équipe"
  },
  en: {
    // ...existing
    feature1Title: "Slack Alerts",
    feature1Desc: "Instant notification for every LinkedIn post",
    feature2Title: "Team Feed",
    feature2Desc: "All your team's posts in one place",
    feature3Title: "Analytics",
    feature3Desc: "Measure your team's global reach"
  }
};
```

**3. Refonte de la grille des piliers**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
  {/* Feature 1 - Slack Alerts */}
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{...}}>
      <Bell className="h-7 w-7 text-primary" />
    </div>
    <div className="text-xl font-bold mb-1" style={{ color: '#1B1B1B' }}>
      {t.feature1Title}
    </div>
    <div className="text-sm" style={{ color: '#5A5A5A' }}>
      {t.feature1Desc}
    </div>
  </div>

  {/* Feature 2 - Team Feed */}
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{...}}>
      <Activity className="h-7 w-7 text-primary" />
    </div>
    <div className="text-xl font-bold mb-1" style={{ color: '#1B1B1B' }}>
      {t.feature2Title}
    </div>
    <div className="text-sm" style={{ color: '#5A5A5A' }}>
      {t.feature2Desc}
    </div>
  </div>

  {/* Feature 3 - Analytics */}
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{...}}>
      <BarChart3 className="h-7 w-7 text-primary" />
    </div>
    <div className="text-xl font-bold mb-1" style={{ color: '#1B1B1B' }}>
      {t.feature3Title}
    </div>
    <div className="text-sm" style={{ color: '#5A5A5A' }}>
      {t.feature3Desc}
    </div>
  </div>
</div>
```

### Ce qui change
- ❌ Plus de métriques "fake" (+350%, 10x)
- ❌ Plus de doublon "5min" avec le badge en haut
- ✅ Présentation claire des 3 fonctionnalités produit
- ✅ Cohérence avec la section Features plus bas
- ✅ Style visuel conservé (icônes, couleurs, spacing)

### Résultat attendu
Les 3 piliers deviennent une mini-preview des features clés, préparant le terrain pour la section Features détaillée plus bas dans la page.

