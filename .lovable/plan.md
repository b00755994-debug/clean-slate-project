

## Effet surligné uniquement sur "Grow your pipeline."

### Objectif
Appliquer l'effet surligné inversé (fond Primary Blue + texte blanc) uniquement sur "Grow your pipeline." et laisser le reste du subtitle en texte normal.

### Modifications techniques

**Fichier** : `src/components/Hero.tsx`

**1. Séparer le subtitle en deux parties dans les translations**

```tsx
const translations = {
  fr: {
    // ...
    subtitleStart: "Rally your team. Amplify your reach. ",
    subtitleHighlight: "Grow your pipeline.",
    // ...
  },
  en: {
    // ...
    subtitleStart: "Rally your team. Amplify your reach. ",
    subtitleHighlight: "Grow your pipeline.",
    // ...
  }
};
```

**2. Modifier le rendu du paragraphe**

De :
```tsx
<p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md">
    {t.subtitle}
  </span>
</p>
```

À :
```tsx
<p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: '#5A5A5A' }}>
  {t.subtitleStart}
  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md">
    {t.subtitleHighlight}
  </span>
</p>
```

### Rendu visuel attendu

```text
Rally your team. Amplify your reach. [Grow your pipeline.]
                                       ↑
                                  Fond bleu + texte blanc
```

### Récapitulatif des changements

| Élément | Avant | Après |
|---------|-------|-------|
| "Rally your team. Amplify your reach." | Fond bleu, texte blanc | Texte gris (#5A5A5A), sans fond |
| "Grow your pipeline." | Fond bleu, texte blanc | Fond bleu, texte blanc (inchangé) |

