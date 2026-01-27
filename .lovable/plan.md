

## Mise à jour du sous-titre Hero

### Changement demandé
Remplacer le sous-titre actuel par :
**"Rally your team. Amplify your reach. Grow your pipeline."**

### Modification technique

**Fichier** : `src/components/Hero.tsx`

Dans l'objet `translations`, mettre à jour la propriété `subtitle` pour les deux langues :

```typescript
const translations = {
  fr: {
    // ...
    subtitle: "Rally your team. Amplify your reach. Grow your pipeline.",
    // ...
  },
  en: {
    // ...
    subtitle: "Rally your team. Amplify your reach. Grow your pipeline.",
    // ...
  }
};
```

### Résultat attendu

Le Hero affichera :
- **Titre** : "Your team." / "One LinkedIn engine."
- **Sous-titre** : "Rally your team. Amplify your reach. Grow your pipeline."

Ce sous-titre en trois temps crée un rythme impactant qui suit la progression logique : mobilisation → amplification → résultats business.

