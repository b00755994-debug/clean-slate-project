

## Activer les codes promo sur le checkout Stripe

Actuellement, la session de checkout ne permet pas de saisir de code promo. Il suffit d'ajouter l'option `allow_promotion_codes: true` dans la creation de la session Stripe.

### Modification

**Fichier** : `supabase/functions/create-checkout/index.ts`

Ajouter `allow_promotion_codes: true` dans l'objet passe a `stripe.checkout.sessions.create()` :

```typescript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  customer_email: customerId ? undefined : user.email,
  allow_promotion_codes: true,  // <-- ajout
  line_items: [...],
  mode: "subscription",
  success_url: ...,
  cancel_url: ...,
});
```

Cela affichera un champ "Add promotion code" directement sur la page de checkout Stripe.

### Pre-requis

Les codes promo doivent etre crees dans le [dashboard Stripe > Coupons](https://dashboard.stripe.com/coupons) en mode **Live**. Chaque coupon peut etre configure avec un pourcentage ou montant fixe, une duree, et un nombre max d'utilisations.

### Deploiement

La fonction `create-checkout` sera redeployee apres modification.

