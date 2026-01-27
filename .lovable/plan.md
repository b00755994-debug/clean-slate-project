

## Mise à jour de la description Analytics

### Objectif
Remplacer la description actuelle de la feature Analytics par "Track reach, engagement & pipeline metrics".

### Modifications techniques

**Fichier** : `src/components/Hero.tsx`

**Changement dans les translations** :

| Langue | Avant | Après |
|--------|-------|-------|
| EN | "Measure your team's impact on your pipeline" | "Track reach, engagement & pipeline metrics" |
| FR | "Mesurez l'impact de votre équipe sur votre pipeline" | "Suivez reach, engagement & métriques pipeline" |

### Code modifié

```tsx
const translations = {
  fr: {
    // ...autres clés
    feature3Desc: "Suivez reach, engagement & métriques pipeline"
  },
  en: {
    // ...autres clés
    feature3Desc: "Track reach, engagement & pipeline metrics"
  }
};
```

### Rendu attendu

```
┌─────────────────┐
│   📈 Analytics  │
│                 │
│ Track reach,    │
│ engagement &    │
│ pipeline metrics│
└─────────────────┘
```

