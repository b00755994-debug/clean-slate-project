
## Plan : Simplifier les messages Slack dans le mockup

### Objectif
Transformer les notifications de posts LinkedIn en messages minimalistes et directs, suivant cette structure :
```
New post !! XX a posté sur XX sujet. Allez le soutenir !
→ Liker et commenter
```

### Fichier concerné
`src/components/SlackIntegration.tsx`

### Changements proposés

#### 1. Simplifier le contenu des messages (FR)

**Avant** (verbeux) :
```
🎯 *@Sarah Martin* vient de publier sur LinkedIn !

💪 L'équipe, c'est le moment de briller ! Un like, un commentaire 
ou un partage de votre part peut multiplier l'impact de ce post 
par 10. Ensemble, on va plus loin ! 🚀
```

**Après** (minimaliste) :
```
*@Sarah Martin* a posté sur l'onboarding client.
Allez le soutenir !
```

#### 2. Simplifier le CTA

**Avant** :
```
👉 Liker et commenter sur LinkedIn
```

**Après** :
```
→ Liker + Commenter
```

#### 3. Réduire les emojis

- Garder uniquement 1 emoji par message maximum (ou aucun)
- Supprimer les emojis dans le CTA
- Garder les réactions Slack (🔥, 👏, 💯) car elles sont natives à Slack

#### 4. Exemples de messages simplifiés

| Auteur | Sujet (variable) | Message complet |
|--------|------------------|-----------------|
| Sarah Martin | onboarding client | *@Sarah Martin* a posté sur l'onboarding client. Allez le soutenir ! |
| Marc Laurent | success story | *@Marc Laurent* a posté une success story. Allez le soutenir ! |
| Julie Chen | l'IA et le SaaS | *@Julie Chen* a posté sur l'IA et le SaaS. Allez le soutenir ! |
| Claire Bernard | Product-Led Growth | *@Claire Bernard* a posté sur la PLG. Allez le soutenir ! |

#### 5. Structure finale d'un message

```tsx
{
  user: "superpump",
  avatar: "🚀",
  time: "il y a 2min",
  content: "*@Sarah Martin* a posté sur l'onboarding client.\nAllez le soutenir !",
  preview: "Après 3 mois de travail acharné...", // optionnel, peut être retiré
  cta: "→ Liker + Commenter",
  stats: { views: "847", likes: "34", comments: "8" },
  reactions: [...] // garder les réactions Slack
}
```

#### 6. Option : Retirer le preview

Pour être encore plus minimaliste, on peut aussi supprimer le champ `preview` (l'aperçu du post LinkedIn) et ne garder que :
- Le message court
- Le CTA
- Les stats (optionnel)

---

### Résumé des modifications

| Élément | Avant | Après |
|---------|-------|-------|
| Longueur du message | ~4 lignes + emojis | 2 lignes max |
| Emojis dans le texte | 4-5 par message | 0-1 |
| CTA | "👉 Liker et commenter sur LinkedIn" | "→ Liker + Commenter" |
| Preview du post | Présent | Optionnel (à discuter) |
| Réponses d'équipe | Présentes | À garder ou retirer ? |

### Questions pour affiner

Souhaites-tu également :
1. **Retirer les previews** (aperçu du contenu du post LinkedIn) ?
2. **Retirer les réponses d'équipe** (ex: "Excellent post Sarah !") ?
3. **Retirer les stats** (vues, likes, commentaires) ?
