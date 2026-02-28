

## Probleme

Les logs edge function montrent que `check-subscription` retourne souvent `"Auth session missing!"`, ce qui met `isError: true` dans le hook `useSubscription`. Cela affiche le bouton "Manage billing" d'erreur (ligne 455-474 de Pricing.tsx) au lieu du bouton "Subscribe to Pro". Quand l'utilisateur clique sur ce bouton, il appelle `openCustomerPortal()` qui echoue aussi (meme erreur auth), affiche un toast d'erreur, et l'UI reste dans cet etat.

## Cause racine

Le token d'authentification n'est parfois pas transmis a l'edge function (session expirée ou race condition). Le fallback UI actuel est mal concu : il montre "Manage billing" meme quand l'utilisateur n'a pas de customer Stripe.

## Solution

1. **Pricing.tsx** : Quand `isSubError` est true, afficher le bouton "Subscribe to Pro" (checkout) comme fallback au lieu du bouton "Manage billing" casse. Supprimer le toast d'erreur automatique.

2. **useSubscription.ts** : Augmenter le `retry` a 3 et ajouter `retryDelay` exponentiel pour gerer les problemes de session transitoires.

### Modification 1 - `src/pages/Pricing.tsx` (lignes 455-474)

Remplacer le bloc `isSubError` par un fallback vers le bouton checkout :

```tsx
) : (
  <Button onClick={handleProCheckout} disabled={isCheckoutLoading} variant="hero" className="w-full mt-4">
    {isCheckoutLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
    {user ? 'Subscribe to Pro' : 'Sign up to subscribe'}
  </Button>
)}
```

Le bloc conditionnel `(user && isSubError)` est supprime. Le else final couvre deja le cas non-abonne et non-erreur.

### Modification 2 - `src/hooks/useSubscription.ts` (ligne 28-29)

```typescript
retry: 3,
retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
```

