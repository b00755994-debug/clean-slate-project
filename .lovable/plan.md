
# Passer le plan par defaut a Free (3 URLs max)

## Modifications

### 1. Dashboard -- Renommer "Individual" en "Free"

Dans `src/pages/Dashboard.tsx`, remplacer "Individual" par "Free" dans les deux langues (FR et EN) des descriptions de plan.

### 2. Migration SQL -- Changer les defaults de la table `workspaces`

- Colonne `plan` : default passe de `'pro'` a `'free'`
- Colonne `max_billable_users` : default passe de `10` a `3`

### 3. Pricing page -- Renommer "Individual" en "Free"

Dans `src/pages/Pricing.tsx`, remplacer le nom du plan "Individual" par "Free" pour rester coherent.

## Resume

```text
Avant:  plan default = 'pro',  max_billable_users default = 10
Apres:  plan default = 'free', max_billable_users default = 3
```

Fichiers modifies :
- `src/pages/Dashboard.tsx` (renommer Individual -> Free)
- `src/pages/Pricing.tsx` (renommer Individual -> Free)
- Migration SQL (changer defaults de `workspaces`)
