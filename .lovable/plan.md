
## Modifications du mockup Slack - CTA et aperçu LinkedIn

### Objectif
1. Transformer le bouton "Like & comment" en lien hypertexte simple (texte bleu souligné)
2. Ajouter un aperçu du post LinkedIn (4-5 lignes max avec "Show more")

### Fichier concerné
`src/components/SlackIntegration.tsx`

---

### Modifications prévues

#### 1. Transformer le CTA en lien hypertexte

**Avant :**
```tsx
<a 
  href={...} 
  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#0A66C2] text-white text-[12px] font-medium rounded hover:bg-[#004182] transition-colors"
>
  👉 Liker et commenter
  <svg>...</svg>
</a>
```

**Après :**
```tsx
<a 
  href={...}
  className="text-[#1264A3] hover:underline underline text-[13px]"
>
  → Liker et commenter
</a>
```

Style : texte bleu Slack (#1264A3), souligné, sans fond ni bordure.

---

#### 2. Ajouter un aperçu du post LinkedIn

Ajouter un champ `linkedinPreview` aux messages de type "New post" avec un contenu réaliste limité à 4-5 lignes, suivi d'un lien "Voir plus".

**Structure du preview :**
```tsx
{/* Aperçu LinkedIn */}
<div className="mt-2 pl-3 border-l-2 border-[#E0E0E0] text-[13px] text-[#616061]">
  <p className="whitespace-pre-line">
    ✨ Une année de plus aux côtés du Delta Festival !

    Du 27 au 31 août, Marseille vibrera au rythme de la musique...
  </p>
  <a href="#" className="text-[#1264A3] hover:underline text-[13px]">
    Voir plus
  </a>
</div>
```

**Exemple de contenu pour Sarah Martin :**
```
Après 3 mois de travail acharné avec notre équipe, nous avons réussi à réduire le temps d'onboarding client de 40%.

Voici les 3 leviers principaux qui ont fait la différence :
➡️ Automatisation des workflows...
```

---

#### 3. Données à modifier

Ajouter un champ `linkedinPreview` pour chaque message "New post" dans les deux langues (FR et EN) :

| Message | Contenu du preview |
|---------|-------------------|
| Sarah Martin (onboarding) | "Après 3 mois de travail acharné avec notre équipe, nous avons réussi à réduire le temps d'onboarding client de 40%.\n\nVoici les 3 leviers principaux qui ont fait la différence :\n➡️ Automatisation des workflows de..." |
| Marc Laurent (success story) | "Retour d'expérience incroyable : TechCorp est passé de 50 à 500 clients en 18 mois.\n\n🎯 Le secret ? Une stratégie LinkedIn coordonnée avec toute l'équipe commerciale.\n\nLes 3 piliers de leur..." |
| Julie Chen (IA) | "L'IA va-t-elle remplacer les équipes commerciales d'ici 5 ans ? C'est la question que tout le monde se pose.\n\n🤖 Après avoir analysé 50+ entreprises SaaS, voici mon..." |
| Claire Bernard (PLG) | "7 erreurs fatales qui tuent votre stratégie Product-Led Growth.\n\nAprès avoir accompagné 30+ startups, j'ai identifié les patterns récurrents d'échec :\n\n❌ Erreur #1 : Ne pas..." |

---

#### 4. Rendu final attendu

```text
┌────────────────────────────────────────────────────┐
│ ⚡ New post! @Sarah Martin vient de publier un     │
│ article sur comment réduire le temps d'onboarding │
│ client de 40%.                                     │
│ Allez la soutenir !                               │
│                                                    │
│ ┃ Après 3 mois de travail acharné avec notre      │
│ ┃ équipe, nous avons réussi à réduire le temps    │
│ ┃ d'onboarding client de 40%.                     │
│ ┃                                                  │
│ ┃ Voici les 3 leviers principaux...               │
│ ┃ Voir plus                                        │
│                                                    │
│ → Liker et commenter                              │
│                                                    │
│ 🔥 8  👏 5                                         │
└────────────────────────────────────────────────────┘
```

---

### Détails techniques

1. **Nouveau champ de données** : Ajouter `linkedinPreview?: string` aux objets messages dans les traductions FR et EN

2. **Style du preview** :
   - Bordure gauche grise (`border-l-2 border-[#E0E0E0]`)
   - Padding gauche (`pl-3`)
   - Texte gris Slack (`text-[#616061]`)
   - Taille 13px

3. **Lien "Voir plus"** :
   - Texte bleu Slack (`text-[#1264A3]`)
   - Souligné au survol

4. **Ordre d'affichage** :
   - Message principal
   - Preview LinkedIn (avec "Voir plus")
   - Lien CTA
   - Réactions

5. **Scope** : Uniquement les messages du canal `#superpump-posts` qui ont un CTA
