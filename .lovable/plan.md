

## Audit complet du produit -- Vulnérabilites et inefficiences

---

### 1. SECURITE : Edge Functions sans verification JWT

**Probleme** : `create-checkout`, `check-subscription`, `customer-portal`, `slack-members`, `slack-channels`, `slack-join-channel` ont `verify_jwt = false` dans `config.toml`. Bien que ces fonctions verifient manuellement le token `Authorization`, le fait de desactiver le JWT au niveau gateway signifie que n'importe qui peut appeler ces endpoints sans token valide -- le code gere l'erreur mais cela genere du trafic inutile et expose la surface d'attaque.

**`slack-members`** et **`slack-channels`** : pas de verification d'auth visible dans le code fourni. A verifier qu'ils valident bien le token. Si non, n'importe qui pourrait lister les membres Slack d'un workspace.

**Recommandation** : Activer `verify_jwt = true` pour `create-checkout`, `check-subscription` et `customer-portal` (toutes ces fonctions necessitent un user authentifie). Garder `verify_jwt = false` uniquement pour `slack-callback` (OAuth callback).

---

### 2. SECURITE : dangerouslySetInnerHTML dans Dashboard.tsx

**Probleme** (ligne 425) : `dangerouslySetInnerHTML={{ __html: t.planDescription(...) }}` -- bien que les donnees proviennent de traductions statiques (pas d'input utilisateur), c'est un anti-pattern. Si un jour `slackWorkspace?.plan` contenait du HTML malicieux, ce serait une faille XSS.

**Recommandation** : Remplacer par du JSX conditionnel avec `<strong>` inline.

---

### 3. LOGIQUE PAIEMENT : Desynchronisation plan front/back

**Probleme critique** : Le Dashboard determine le plan affiche via `slackWorkspace?.plan` (table `workspaces`), mais cette valeur n'est mise a jour que lorsque `check-subscription` est appele. Si l'utilisateur annule son abonnement sur Stripe sans revenir dans l'app, le workspace reste en `pro` jusqu'au prochain appel.

**Recommandation** : 
- Le hook `useSubscription` a un `staleTime` de 5 minutes -- c'est correct mais il n'y a pas de refetch periodique (`refetchInterval`). Ajouter un `refetchInterval` de 60 secondes pour les pages dashboard.
- S'assurer que `check-subscription` est appele au login (actuellement il ne l'est pas -- il depend de `useSubscription` monte dans le composant).

---

### 4. LOGIQUE PAIEMENT : Pas de verification de doublons checkout

**Probleme** : `create-checkout` ne verifie pas si l'utilisateur a deja un abonnement actif avant de creer une session checkout. Un utilisateur Pro peut souscrire un second abonnement.

**Recommandation** : Dans `create-checkout`, ajouter une verification : si le customer a deja une subscription active, retourner une erreur ou rediriger vers le Customer Portal.

---

### 5. LOGIQUE PAIEMENT : Fallback plan par defaut = 'pro'

**Probleme** (Dashboard.tsx ligne 425, useWorkspace.ts ligne 78) : `plan: ws.plan || 'pro'` -- le fallback est `'pro'` au lieu de `'free'`. Si le champ `plan` est `null` en base, l'utilisateur voit "Pro" et a potentiellement acces a des fonctionnalites payantes.

**Recommandation** : Changer le fallback en `'free'` : `plan: ws.plan || 'free'`.

---

### 6. LOGIQUE PAIEMENT : max_billable_users fallback = 10

**Probleme** (useWorkspace.ts ligne 79) : `max_billable_users: ws.max_billable_users ?? 10`. Le plan free donne 3 users. Si le champ est null, l'utilisateur free recoit 10 slots au lieu de 3.

**Recommandation** : Changer en `ws.max_billable_users ?? 3` pour correspondre au plan free par defaut.

---

### 7. LOGIQUE PAIEMENT : Pricing page -- checkout sans verification abonnement existant

**Probleme** : Sur la page Pricing, si `isSubError` est true (erreur reseau), le fallback affiche "Manage billing" qui ouvre le portal. Mais si l'erreur est transitoire et que l'utilisateur n'est pas abonne, cliquer sur "Manage billing" echouera ("No Stripe customer found").

**Recommandation** : Ajouter un try/catch avec un message explicite dans ce cas.

---

### 8. SECURITE : Pages de test exposees en production

**Probleme** : `/mockups` et `/test` (TestSlackBadge) sont accessibles sans authentification en production.

**Recommandation** : Supprimer ces routes ou les proteger derriere `requireAdmin`.

---

### 9. PERFORMANCE : Requete posts sans limite dans useLinkedInProfiles

**Probleme** (useLinkedInProfiles.ts lignes 70-74) : La requete `posts` pour compter les posts par profil ne specifie pas de `.limit()`. Avec le default Supabase de 1000 rows, un workspace avec plus de 1000 posts sur 30 jours aura des compteurs incorrects.

**Recommandation** : Soit ajouter `.limit(10000)`, soit utiliser un `count` agrege cote serveur via une RPC.

---

### 10. SECURITE : Suppression de profil sans confirmation

**Probleme** (Dashboard.tsx ligne 901) : Le bouton de suppression de profil LinkedIn appelle directement `handleDeleteProfile` sans dialog de confirmation. Un clic accidentel supprime le profil et toutes les donnees associees.

**Recommandation** : Ajouter un `AlertDialog` de confirmation avant suppression.

---

### 11. INTEGRITE : `check-subscription` subscriptionEnd peut etre null

**Probleme** : Les logs montrent `"subscriptionEnd":null` pour un abonnement actif. Le code gere `typeof endValue === 'number'` et `typeof endValue === 'string'` mais Stripe peut retourner un objet ou undefined selon la version API. Cela signifie que `subscriptionEnd` n'est jamais synchronise correctement.

**Recommandation** : Debugger la valeur reelle de `subscription.current_period_end` dans les logs et ajuster le parsing.

---

### 12. ADMIN : Pas de filtre ni pagination

**Probleme** : La page Admin charge tous les profils en une seule requete sans pagination. Avec la croissance, cela deviendra lent.

**Recommandation** : A court terme, ajouter `.limit(100)` et un bouton "Load more". A moyen terme, une vraie pagination.

---

## Resume des actions prioritaires

| Priorite | Action | Fichier(s) |
|----------|--------|------------|
| CRITIQUE | Changer fallback plan `'pro'` → `'free'` | `useWorkspace.ts` |
| CRITIQUE | Changer fallback max_billable_users `10` → `3` | `useWorkspace.ts` |
| CRITIQUE | Verifier abonnement existant dans `create-checkout` | `supabase/functions/create-checkout/index.ts` |
| HAUTE | Activer `verify_jwt = true` pour checkout/subscription/portal | `supabase/config.toml` |
| HAUTE | Verifier auth dans `slack-members` et `slack-channels` | Edge functions |
| MOYENNE | Supprimer routes `/test` et `/mockups` en prod | `src/App.tsx` |
| MOYENNE | Remplacer `dangerouslySetInnerHTML` par du JSX | `src/pages/Dashboard.tsx` |
| MOYENNE | Ajouter confirmation suppression profil | `src/pages/Dashboard.tsx` |
| MOYENNE | Ajouter `refetchInterval` au hook subscription | `src/hooks/useSubscription.ts` |
| BASSE | Ajouter `.limit(10000)` a la requete posts | `src/hooks/useLinkedInProfiles.ts` |
| BASSE | Debugger `subscriptionEnd: null` | `supabase/functions/check-subscription/index.ts` |
| BASSE | Pagination Admin | `src/pages/Admin.tsx` |

