
# Plan : Nouvelle structure tarifaire par paliers de 10 utilisateurs

## Nouvelle logique de prix

| Plan | Base mensuelle | Inclus | Par tranche de 10 suppl. |
|------|---------------|--------|--------------------------|
| Pro | 39€/mois | 10 utilisateurs | +25€ |
| Business | 69€/mois | 10 utilisateurs | +50€ |

La remise annuelle de -20% reste inchangee.

**Exemples :**
- Pro, 10 users : 39€/mois
- Pro, 20 users : 39€ + 25€ = 64€/mois
- Pro, 50 users : 39€ + 4x25€ = 139€/mois
- Business, 30 users : 69€ + 2x50€ = 169€/mois

## Modifications dans `src/pages/Pricing.tsx`

### 1. Constantes de prix

Remplacer les constantes actuelles (`PRO_PRICE_PER_USER`, `BUSINESS_PRICE_PER_USER`) par :

```typescript
const PRO_BASE_PRICE = 39;
const PRO_BASE_USERS = 10;
const PRO_EXTRA_PER_10 = 25;

const BUSINESS_BASE_PRICE = 69;
const BUSINESS_BASE_USERS = 10;
const BUSINESS_EXTRA_PER_10 = 50;

const MIN_USERS = 10;
const MAX_USERS = 200;
```

### 2. Fonction de calcul de prix

Remplacer `calculatePrice` par une logique par paliers :

```typescript
const calculateTieredPrice = (basePrice, baseUsers, extraPer10, users, annual) => {
  const extraBlocks = Math.max(0, (users - baseUsers) / 10);
  const monthly = basePrice + extraBlocks * extraPer10;
  return annual ? monthly * 12 * (1 - ANNUAL_DISCOUNT) : monthly;
};
```

### 3. Slider et input : pas de 10

- `step={10}` sur le Slider
- `min={10}`, valeurs par defaut a `[10]`
- Input arrondi au multiple de 10 le plus proche
- Graduations du slider : 10, 50, 100, 150, 200+

### 4. Affichage du prix

- Prix principal : montant mensuel total (ou equivalent mensuel si annuel)
- Sous-titre : "10 users included, then +25€ per 10 users" (Pro) / "+50€ per 10 users" (Business)
- Ligne annuelle avec economies conservee

### 5. Calcul des economies annuelles

Adapte a la nouvelle formule (compare mensuel x12 vs annuel).
