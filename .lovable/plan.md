
# Configurer le plan Free dans le Dashboard

## Contexte

Le plan Free existe deja sur la page Pricing (Individual, 0EUR, 1 user). Il faut maintenant que le Dashboard affiche dynamiquement le bon plan en fonction de la valeur `plan` du workspace (`'pro'` ou `'free'`), au lieu d'afficher "Pro" en dur.

## Ce qui change

### 1. `src/pages/Dashboard.tsx` -- Affichage dynamique du plan

Actuellement, le texte "Vous etes sur le plan **Pro**" est en dur dans les traductions. Il faut le rendre dynamique en fonction de `workspace.plan` :

- Si `plan === 'free'` : afficher "Individual" (cohérent avec la page Pricing) et adapter la description
- Si `plan === 'pro'` : garder le texte actuel

Concretement :
- Remplacer la string statique `planDescription` par une fonction qui prend le plan en parametre
- Afficher le nom du plan (Individual / Pro) en gras dans la description
- Adapter le message : Free = "Passez a Pro pour suivre plus de profils", Pro = texte actuel

### 2. Aucune migration SQL necessaire

Les colonnes `plan` et `max_billable_users` existent deja. Pour creer un workspace Free, il suffit de mettre `plan = 'free'` et `max_billable_users = 1` manuellement dans Supabase.

### 3. Aucun changement cote hooks

`useWorkspace` expose deja `plan` et `max_billable_users`. Le plan Free avec `max_billable_users = 1` sera automatiquement pris en compte par la verification existante dans `useLinkedInProfiles`.

## Fichiers modifies

- `src/pages/Dashboard.tsx` : rendre l'affichage du plan dynamique (Free/Pro) au lieu du texte "Pro" en dur

## Resume technique

```text
workspace.plan === 'free'  -->  Nom: "Individual", max_billable_users: 1
workspace.plan === 'pro'   -->  Nom: "Pro", max_billable_users: 10 (defaut)
```

Tout le reste (limite cote client, limite cote serveur via RPC) fonctionne deja grace aux colonnes existantes.
