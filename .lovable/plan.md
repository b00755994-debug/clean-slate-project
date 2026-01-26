

# Plan : Refonte V2 des messages Slack — Section #superpump-posts

## Objectif
Rendre les messages de notification dans le mockup Slack plus sobres et professionnels, avec une structure claire en 3 points et un encouragement bref variable.

---

## Structure finale des messages

### Format V2 :

```text
New post — @Nom publie sur [sujet du post]

"[Extrait du post LinkedIn]"

[Encouragement bref] → Voir sur LinkedIn
```

### Exemples d'encouragements variables :
- "Time to support!"
- "Show some love!"
- "Your turn to engage!"
- "Let's amplify this!"
- "Rally the team!"

---

## Modifications techniques

### Fichier : `src/components/SlackIntegration.tsx`

#### 1. Mise à jour des messages FR (lignes ~83-205)

**Message 1 (Sarah Martin)** :
```tsx
content: "New post — *@Sarah Martin* publie sur l'onboarding client",
preview: "Après 3 mois de travail acharné, notre équipe a réussi à réduire le temps d'onboarding client de 40%. Voici les 5 stratégies clés...",
cta: "Time to support! → Voir sur LinkedIn",
```

**Message 2 (Marc Laurent)** :
```tsx
content: "New post — *@Marc Laurent* publie sur une success story client",
preview: "Comment notre client TechCorp a augmenté son taux de conversion de 156% en 6 mois. Une histoire inspirante...",
cta: "Show some love! → Voir sur LinkedIn",
```

**Message 3 (Julie Chen)** :
```tsx
content: "New post — *@Julie Chen* lance un débat sur l'IA et le SaaS",
preview: "Question pour les leaders tech : Pensez-vous que l'IA va remplacer les équipes commerciales traditionnelles d'ici 5 ans ?",
cta: "Your turn to engage! → Voir sur LinkedIn",
```

**Message 4 (Claire Bernard)** :
```tsx
content: "New post — *@Claire Bernard* partage sur la Product-Led Growth",
preview: "Les 7 erreurs fatales que nous avons évitées en passant à une stratégie Product-Led Growth. Thread complet...",
cta: "Let's amplify this! → Voir sur LinkedIn",
```

#### 2. Mise à jour des messages EN (lignes ~400+)

Même structure avec les mêmes encouragements (déjà en anglais) :
- "Time to support!"
- "Show some love!"
- "Your turn to engage!"
- "Let's amplify this!"
- "Rally the team!"

---

## Éléments conservés

- **Stats** : views, likes, comments (affichés sous le message)
- **Réactions Slack** : 🔥👏💯 etc.
- **Réponses utilisateurs** : "Excellent post Sarah !" etc.

---

## Éléments supprimés

- Emojis d'ouverture (🎯💪✨📢💡)
- Phrase motivationnelle longue ("L'équipe, c'est le moment de briller...")
- Emoji dans le CTA (👉)

---

## Résultat attendu

### Avant :
```text
🎯 *@Sarah Martin* vient de publier sur LinkedIn !

💪 L'équipe, c'est le moment de briller ! Un like, un commentaire 
ou un partage de votre part peut multiplier l'impact de ce post 
par 10. Ensemble, on va plus loin ! 🚀

"Après 3 mois de travail acharné..."

👉 Liker et commenter sur LinkedIn
```

### Après (V2) :
```text
New post — @Sarah Martin publie sur l'onboarding client

"Après 3 mois de travail acharné, notre équipe a réussi à réduire 
le temps d'onboarding client de 40%. Voici les 5 stratégies clés..."

Time to support! → Voir sur LinkedIn
```

---

## Complexité
- **Fichier impacté** : 1 seul (`SlackIntegration.tsx`)
- **Temps estimé** : Modification de 8 blocs de messages (4 FR + 4 EN)
- **Risque** : Aucun — changements de contenu textuel uniquement

