

# Afficher le prix mensuel de reference + badge savings

## Principe

Toujours afficher le prix mensuel plein (39€, 69€, etc.) comme prix principal, quel que soit le toggle mensuel/annuel. Quand l'utilisateur selectionne "annuel", un badge vert apparait a cote du prix pour indiquer les economies realisees.

## Changements dans `src/pages/Pricing.tsx`

### 1. Prix principal : toujours le mensuel

Le prix affiche en grand (text-4xl) sera toujours le prix mensuel sans remise :
- Pro 10 users : **39€/mois**
- Pro 20 users : **64€/mois**
- Business 10 users : **69€/mois**

Ce prix ne change pas quand on bascule entre mensuel et annuel.

### 2. Badge savings en mode annuel

Quand le toggle est sur "Annuel", un badge vert s'affiche a cote ou en dessous du prix :
- Texte : "Save X€/year" (ou X = economies annuelles, ex: 93,60€ pour Pro 10 users)
- Style : badge vert (`bg-success/15 text-success`) similaire au badge "-20%" du toggle

### 3. Sous-titre annuel

La ligne sous le prix indiquera le total annuel facture :
- "Billed 374,40€/year" (au lieu d'afficher l'equivalent mensuel reduit)

### 4. Detail technique

- `calculateTieredPrice` reste inchange
- Le prix affiche en grand = toujours `calculateTieredPrice(..., users, false)` (mensuel)
- Le badge savings = `mensuel * 12 - annuel`
- La ligne secondaire en mode annuel = total annuel facture

