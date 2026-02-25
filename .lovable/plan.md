

## Plan: CTA Free plan → Dashboard ou Auth

### Comportement souhaité

Le bouton "Coming soon" du plan Free devient un vrai CTA :
- **Utilisateur connecté** → redirige vers `/dashboard` (le `ProtectedRoute` gère déjà la redirection vers `/onboarding` si l'onboarding n'est pas terminé)
- **Utilisateur non connecté** → redirige vers `/auth?mode=signup`

### Modifications dans `src/pages/Pricing.tsx`

1. **Importer `useAuthContext`** depuis `@/contexts/AuthContext`
2. **Récupérer `user`** via `const { user } = useAuthContext();`
3. **Remplacer le bouton disabled du plan Free** (ligne ~272) :

```tsx
// Avant
<Button disabled className="w-full mt-4 bg-gray-300 text-gray-700 font-semibold cursor-not-allowed hover:bg-gray-300">
  🥷 Coming soon
</Button>

// Après
<Button asChild variant="outline" className="w-full mt-4 font-semibold">
  <Link to={user ? "/dashboard" : "/auth?mode=signup"}>
    {t.getStarted}
  </Link>
</Button>
```

La logique existante du `ProtectedRoute` sur `/dashboard` s'occupe de tout : si l'utilisateur n'a pas terminé l'onboarding, il sera automatiquement redirigé vers `/onboarding`.

