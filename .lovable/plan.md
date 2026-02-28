

## Passer Stripe de Test a Live -- etape par etape

Ton compte Stripe `superpump.tech` est actuellement connecte avec une cle (probablement test). Voici ce qu'il faut faire :

---

### Etape 1 : Mettre a jour la cle secrete Stripe vers Live

J'utiliserai l'outil `update_stripe_secret_key` pour t'ouvrir une modale ou tu colleras ta cle **live** (`sk_live_...`).

Tu la trouves ici : [Stripe Dashboard > API Keys](https://dashboard.stripe.com/acct_1St55AEPoXPeqIKk/apikeys) -- assure-toi d'etre en mode **Live** (pas Test) en haut a droite du dashboard Stripe.

---

### Etape 2 : Creer les produits et prix en mode Live

Les produits test (`prod_U2u5D1O58TUiGO`, `prod_U2u5R33sL7CeRe`) n'existent pas en mode Live. Je les recreerai avec les memes parametres :

- **Superpump Pro (Monthly)** : 4.00 EUR/mois/user
- **Superpump Pro (Annual)** : 38.40 EUR/an/user (equivalent 3.20 EUR/mois)

---

### Etape 3 : Mettre a jour le code avec les nouveaux IDs Live

Fichiers a modifier :
- `src/lib/stripe.ts` -- les `priceId` et `productId`
- `supabase/functions/customer-portal/index.ts` -- les IDs hardcodes dans la config du portal

---

### Etape 4 : Deployer les edge functions

Les fonctions `create-checkout`, `check-subscription` et `customer-portal` seront automatiquement redeployees avec les nouveaux IDs.

---

### Important

- Aucun client test ne sera visible en mode Live (c'est normal)
- Les abonnements test disparaitront -- seuls les vrais paiements apparaitront
- La cle publishable (`pk_live_...`) n'est pas utilisee cote code (tout passe par les edge functions), donc pas de changement necessaire la

