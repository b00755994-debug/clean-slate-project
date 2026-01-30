

# Plan: Ajouter le pilier Leaderboard à la carte Solution

## Contexte

La carte "Solution" dans `ProblemSolution.tsx` liste actuellement 3 points :
1. Automatic Slack alerts for every post
2. Centralize all posts in a unified Team Feed
3. Advanced team & audience analytics

Il manque le 4ème pilier **Leaderboard** pour être cohérent avec le reste de la landing page.

---

## Modification

### Fichier: `src/components/ProblemSolution.tsx`

Ajouter un 4ème point dans `solutionPoints` (lignes 42-46 pour EN, lignes 27-31 pour FR) :

**Français :**
```tsx
solutionPoints: [
  "Alertes automatiques sur Slack à chaque post",
  "Centralisez tous les posts dans un Team Feed unique",
  "Leaderboard mensuel pour motiver vos ambassadeurs",
  "Portée décuplée, notoriété amplifiée"
]
```

**Anglais :**
```tsx
solutionPoints: [
  "Automatic Slack alerts for every post",
  "Centralize all posts in a unified Team Feed",
  "Monthly leaderboard to motivate your ambassadors",
  "Advanced team & audience analytics"
]
```

---

## Résumé

| Fichier | Modification |
|---------|--------------|
| `src/components/ProblemSolution.tsx` | +1 point "Leaderboard" dans solutionPoints (FR + EN) |

