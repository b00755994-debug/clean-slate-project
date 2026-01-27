

## Option B : Micro-cards avec glassmorphism

### Objectif
Transformer les 3 piliers actuels en micro-cards élégantes avec bordures, padding, effet glassmorphism (backdrop-blur) et interactions hover inspirées de la section Features.

### Aperçu visuel

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│   │  ╭─────────────╮│   │  ╭─────────────╮│   │  ╭─────────────╮│          │
│   │  │  [Slack]    ││   │  │  [Book]     ││   │  │  [Trend]    ││          │
│   │  ╰─────────────╯│   │  ╰─────────────╯│   │  ╰─────────────╯│          │
│   │                 │   │                 │   │                 │          │
│   │  Slack Alerts   │   │  Team Feed      │   │  Pipeline       │          │
│   │  Description... │   │  Description... │   │  Analytics      │          │
│   └─────────────────┘   └─────────────────┘   └─────────────────┘          │
│         hover:              hover:              hover:                      │
│      ↑ translate-y       ↑ translate-y       ↑ translate-y                 │
│      + shadow            + shadow            + shadow                       │
│      + border-primary    + border-primary    + border-primary               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modifications techniques

**Fichier** : `src/components/Hero.tsx`

**1. Structure des micro-cards**

Chaque pilier passe de :
```tsx
<div className="text-center">
```

À :
```tsx
<div className="text-center p-6 rounded-2xl border border-border/50 
  bg-card/50 backdrop-blur-sm 
  hover:shadow-lg hover:-translate-y-2 hover:border-primary/50 
  transition-all duration-300 group">
```

**2. Effet sur les icônes au hover**

Ajout de `group-hover:scale-110 transition-transform duration-300` sur les containers d'icônes.

**3. Effet gradient sur les titres au hover**

Comme dans Features.tsx :
```tsx
<div className="text-xl font-bold mb-1" style={{ color: '#1B1B1B' }}>
  <span className="group-hover:hidden">{t.feature1Title}</span>
  <span className="hidden group-hover:inline bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
    {t.feature1Title}
  </span>
</div>
```

### Ce qui change visuellement

| Avant | Après |
|-------|-------|
| Éléments "flottants" sans délimitation | Cards avec bordures subtiles |
| Aucune interaction | Hover : élévation + ombre + bordure primary |
| Titres statiques | Titres en gradient au survol |
| Icônes statiques | Icônes qui grossissent au survol |
| Fond transparent | Fond semi-transparent avec blur (glassmorphism) |

### Propriétés CSS appliquées

- `p-6` : padding confortable
- `rounded-2xl` : coins arrondis (cohérent avec les icônes)
- `border border-border/50` : bordure subtile
- `bg-card/50` : fond semi-transparent
- `backdrop-blur-sm` : effet glassmorphism
- `hover:shadow-lg` : ombre portée au survol
- `hover:-translate-y-2` : légère élévation
- `hover:border-primary/50` : bordure colorée au survol
- `transition-all duration-300` : animation fluide
- `group` : pour propager le hover aux enfants

### Résultat attendu

Les 3 piliers deviennent des micro-cards interactives et modernes, cohérentes avec le design system de la section Features, tout en restant légères et adaptées à leur position dans le Hero.

