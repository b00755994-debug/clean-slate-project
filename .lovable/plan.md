

## Analyse de la situation

Actuellement, le flow d'abonnement supporte :
- **Upgrade** : via `create-checkout` (nouveau abonnement Pro)
- **Annulation** : via `customer-portal` (portail Stripe)
- **Downgrade** : non implémenté

Le "downgrade" peut signifier deux choses dans votre modèle :
1. **Réduire le nombre de sièges** (ex: passer de 30 à 10 utilisateurs Pro)
2. **Revenir au plan Free** (annuler l'abonnement Pro)

Le cas 2 est déjà couvert par l'annulation via le portail Stripe — quand l'abonnement se termine, `check-subscription` remet automatiquement le workspace en `free` avec 3 utilisateurs max.

Le cas 1 (réduire les sièges) nécessite une modification de la `quantity` sur l'abonnement Stripe existant.

## Proposition

### Approche recommandée : mise à jour de la quantity via `update-subscription`

Créer une nouvelle edge function `update-subscription` qui modifie la quantity de l'abonnement actif. Côté frontend, ajouter un sélecteur de sièges dans les paramètres du dashboard ou sur la page Pricing pour les utilisateurs déjà abonnés.

### Step 1 — Nouvelle edge function `update-subscription`

**Fichier : `supabase/functions/update-subscription/index.ts`**

La fonction :
- Authentifie l'utilisateur
- Retrouve le customer Stripe par email
- Récupère l'abonnement actif
- Met à jour la `quantity` avec la nouvelle valeur (minimum 10, par incréments de 10)
- Synchronise le workspace (`max_billable_users`) dans Supabase
- Vérifie que la nouvelle quantity n'est pas inférieure au nombre actuel de `billable_users` dans le workspace (pour éviter qu'un utilisateur descende en dessous de ses profils actifs)

### Step 2 — Ajouter la logique frontend

**Fichier : `src/hooks/useSubscription.ts`**

Ajouter une fonction `updateQuantity(newQuantity: number)` qui appelle la nouvelle edge function et rafraîchit le cache.

### Step 3 — UI pour modifier les sièges

Ajouter un composant dans le dashboard (Settings ou Pricing) permettant à l'utilisateur abonné de :
- Voir son nombre de sièges actuel
- Choisir un nouveau nombre (slider ou sélecteur, min 10, incréments de 10)
- Voir le nouveau prix mensuel estimé
- Confirmer la modification

### Détails techniques

La edge function utilisera `stripe.subscriptions.update()` avec le paramètre `items` pour modifier la quantity :

```typescript
await stripe.subscriptions.update(subscriptionId, {
  items: [{
    id: subscriptionItemId,
    quantity: newQuantity,
  }],
  proration_behavior: 'create_prorations', // Stripe calcule le prorata automatiquement
});
```

La validation côté serveur vérifiera :
- `newQuantity >= 10`
- `newQuantity % 10 === 0`
- `newQuantity >= nombre actuel de billable_users dans le workspace`

Si l'utilisateur tente de descendre en dessous du nombre de profils LinkedIn actifs, la fonction renvoie une erreur explicite demandant de supprimer des profils d'abord.

