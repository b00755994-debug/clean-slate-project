

# Mise a jour du Free Plan -- Toutes les features Pro, limite a 3 users

## Changement de logique

Le Free plan n'est plus un plan "basique" avec des features limitees. Il offre desormais **toutes les features du Pro**, mais avec une limite de **3 utilisateurs/URLs max**. Le Pro se differencie uniquement par le nombre d'utilisateurs (10+).

## Modifications dans `src/pages/Pricing.tsx`

### 1. Mettre a jour les features du Free plan (FR + EN)

Remplacer la liste actuelle du Free (alertes Slack, analytics basiques, email support, Slack integration) par la meme liste que le Pro :

**EN :**
- Slack alerts to rally your team
- Advanced team analytics
- Content library to follow your team
- Monthly leaderboard
- Audience & brand insights

**FR :**
- Alertes Slack pour mobiliser votre equipe
- Analyses avancees a l'echelle de votre equipe
- Feed des contenus de votre equipe
- Audience & brand insights
- Support prioritaire

### 2. Mettre a jour la description et la value proposition

- **Description** : passer de "Get started for free" / "Demarrez gratuitement" a quelque chose comme "All features, up to 3 users" / "Toutes les features, jusqu'a 3 utilisateurs"
- **Value proposition** : adapter le texte pour expliquer que le Free donne acces a tout, et que le Pro est simplement pour scaler au-dela de 3 users. Ex: "Get the full Superpump experience for free. Upgrade to Pro when your team grows beyond 3 members."
- **Limit** reste "Up to 3 users" / "3 utilisateurs max"

### 3. Adapter la liste des features du Pro

Puisque Free = Pro en features, le Pro ne peut plus dire "Everything in Free" + des extras. A la place, la liste Pro devient :
- All features included (toutes les features incluses)
- From 10 to 200 users (de 10 a 200 utilisateurs)
- Priority support (support prioritaire)

Cela met l'accent sur le **scaling** comme seul differentiel.

### 4. Adapter la liste du Business

Le Business dit actuellement "Everything in Pro" -- cela reste valide. Pas de changement necessaire.

### 5. Style de la card Free

Optionnellement, mettre en valeur le Free davantage puisqu'il est maintenant tres genereux : ajouter un petit badge "All features" ou similaire. Mais cela reste optionnel et peut se faire apres.

## Fichiers concernes

- `src/pages/Pricing.tsx` uniquement -- les deux blocs de traductions (FR et EN) + pas de changement structurel dans le JSX

