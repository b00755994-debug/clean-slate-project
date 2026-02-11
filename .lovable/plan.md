

# Audit complet de l'application Superpump

## 1. BUGS IDENTIFIES

### 1.1 Requetes N+1 dans `useLinkedInProfiles` (Impact: Performance)
**Fichier:** `src/hooks/useLinkedInProfiles.ts` (lignes 63-76)

Pour chaque profil LinkedIn, une requete separee est faite pour compter les posts (Promise.all avec N requetes individuelles). Avec 10 profils, cela genere 11 requetes au lieu d'une seule.

**Correction:** Recuperer tous les posts en une seule requete avec un GROUP BY ou filtrer cote client.

---

### 1.2 Requetes N+1 dans `Admin.tsx` (Impact: Performance)
**Fichier:** `src/pages/Admin.tsx` (lignes 78-104)

Pour chaque utilisateur, 2 requetes sont effectuees (workspace_members + billable_users count). Avec 50 utilisateurs, cela genere 100+ requetes.

**Correction:** Utiliser des jointures SQL ou une RPC dediee.

---

### 1.3 Donnees dupliquees entre hooks (Impact: Memoire/Reseau)
Les memes donnees `billable_users` sont fetchees par 4 hooks differents avec des query keys differentes :
- `useLinkedInProfiles` -> queryKey `['linkedin-profiles', workspace?.id]`
- `useTeamFeed` -> queryKey `['billable-users', workspace?.id]`
- `useFullLeaderboard` -> queryKey `['billable-users-list', workspace?.id]`
- `useAnalyticsData` -> queryKey `['user-profile-ids', workspace?.id]`

Les posts sont aussi dupliques entre :
- `useTeamFeed` -> queryKey `['posts', workspace?.id]`
- `useFullLeaderboard` -> queryKey `['all-posts-leaderboard', workspace?.id]`
- `useAnalyticsData` -> queryKey `['analytics-all-posts', workspace?.id]`

**Correction:** Centraliser dans un seul hook partage ou utiliser des query keys communes.

---

### 1.4 `useAnalyticsData` : Calculs synchrones dans des `useQuery` async (Impact: Architecture)
**Fichier:** `src/hooks/useAnalyticsData.ts`

Plusieurs queries (`overviewKPIs`, `trendData`, `teamActivationKPIs`, etc.) sont des fonctions `async` qui ne font aucun appel reseau -- elles filtrent simplement `allPosts` en memoire. Utiliser `useQuery` pour du calcul pur est un anti-pattern. Ces calculs devraient etre des `useMemo`.

**Correction:** Remplacer ces queries derivees par des `useMemo` bases sur `allPosts`.

---

### 1.5 Limite de 1000 lignes Supabase non geree (Impact: Donnees manquantes)
Aucun hook ne gere la pagination. Si un workspace a plus de 1000 posts, `useTeamFeed`, `useAnalyticsData` et `useFullLeaderboard` ne recupereront que les 1000 premiers.

**Correction:** Ajouter une pagination ou un `.range()` explicite, ou au minimum un `limit` suffisant.

---

### 1.6 `useLinkedInProfiles` utilise `created_at` au lieu de `linkedin_created_at` (Bug de donnees)
**Fichier:** `src/hooks/useLinkedInProfiles.ts` (ligne 69)

Le filtre des posts 30 jours utilise `.gte('created_at', ...)` alors que la date de publication LinkedIn est dans `linkedin_created_at`. Un post importe aujourd'hui mais publie il y a 2 mois serait compte a tort.

**Correction:** Remplacer `created_at` par `linkedin_created_at`.

---

### 1.7 `has_role` RPC appelee 3+ fois au chargement (Impact: Performance)
**Fichier:** `src/contexts/AuthContext.tsx`

Le `onAuthStateChange` et `getSession` s'executent tous les deux, generant des appels doubles a `fetchProfile` et `checkAdminRole`. Les network logs montrent 3 appels `has_role` et 3 appels `profiles` au demarrage.

**Correction:** Ajouter un guard pour eviter les appels doubles (ex: verifier si le profil est deja charge).

---

### 1.8 `useVettedLibrary` ne filtre pas par workspace (Bug de securite/donnees)
**Fichier:** `src/hooks/useVettedLibrary.ts` (ligne 23)

La query recupere tout le vetted_content sans filtrer par `workspace_id`. Le RLS protege cote serveur, mais la query key `['vetted-content']` ne contient pas le workspace_id, ce qui peut causer des problemes de cache si un utilisateur change de workspace.

**Correction:** Ajouter le filtre `.eq('workspace_id', workspace.id)` et inclure le workspace_id dans la query key.

---

### 1.9 Auth page non traduite (Bug UI)
**Fichier:** `src/pages/Auth.tsx`

Tout le texte est en francais uniquement (titres, labels, messages d'erreur) alors que l'app supporte FR/EN. Le `useLanguage` n'est pas utilise.

**Correction:** Ajouter le support bilingue comme dans les autres pages.

---

### 1.10 `useNewPostsNotification` demande un rechargement complet de la page
**Fichier:** `src/hooks/useNewPostsNotification.ts` (ligne 29)

Quand un nouveau post arrive, le toast propose `window.location.reload()` au lieu d'invalider les queries React Query. Cela detruit tout l'etat de l'application.

**Correction:** Invalider les query keys pertinentes (`['posts']`, `['analytics-all-posts']`, etc.).

---

## 2. INEFFICIENCES IDENTIFIEES

### 2.1 Dashboard.tsx est un fichier monolithique de 816 lignes
Le fichier contient toute la logique du dashboard principal (Plan, Slack, LinkedIn profiles, dialogs). Difficile a maintenir.

**Recommandation:** Extraire en sous-composants (`SlackCard`, `PlanCard`, `LinkedInProfilesTable`, etc.).

---

### 2.2 Traductions inline dans chaque fichier
Chaque page definit ses propres objets `translations` (100+ lignes dans Dashboard.tsx). Pattern fragile et difficile a maintenir.

**Recommandation:** Centraliser les traductions dans des fichiers dedies par feature ou utiliser une lib i18n.

---

### 2.3 `useLeaderboards` depend de `useTeamFeed` (couplage inutile)
**Fichier:** `src/hooks/useLeaderboards.ts`

Ce hook importe et utilise les posts + profiles de `useTeamFeed` juste pour calculer le top 3 posts et contributeurs. Il beneficie du cache commun mais cree un couplage logique fort.

---

### 2.4 `DashboardContent` fait un fetch independant des auteurs (billable_users)
**Fichier:** `src/pages/DashboardContent.tsx` (lignes 79-88)

La query `['authors']` recupere `billable_users` sans filtre workspace, ce qui est a la fois un probleme de securite (RLS protege, mais donnees inutiles en cache) et une duplication avec les autres hooks.

---

### 2.5 SessionStorage pour persister le formulaire d'ajout de profil
**Fichier:** `src/pages/Dashboard.tsx` (lignes 207-246)

6 useEffects pour persister le formulaire d'ajout d'utilisateur dans sessionStorage. Approche lourde pour un simple formulaire -- un state manager ou un hook custom serait plus propre.

---

## 3. RESUME DES PRIORITES

| Priorite | Issue | Impact |
|----------|-------|--------|
| HAUTE | 1.5 - Limite 1000 lignes | Donnees manquantes |
| HAUTE | 1.6 - created_at vs linkedin_created_at | KPIs faux |
| HAUTE | 1.3 - Donnees dupliquees (3x posts, 4x users) | 3x la bande passante |
| MOYENNE | 1.1 - N+1 useLinkedInProfiles | Performance |
| MOYENNE | 1.2 - N+1 Admin | Performance |
| MOYENNE | 1.4 - useQuery pour calculs purs | Architecture |
| MOYENNE | 1.7 - has_role appele 3x | Requetes inutiles |
| MOYENNE | 1.10 - Reload au lieu d'invalidate | UX |
| BASSE | 1.8 - Vetted content sans workspace filter | Cache |
| BASSE | 1.9 - Auth non traduite | i18n |
| BASSE | 2.1-2.5 | Maintenabilite |

## 4. PLAN DE CORRECTION PROPOSE

### Phase 1 - Bugs critiques
1. Corriger `created_at` -> `linkedin_created_at` dans useLinkedInProfiles
2. Centraliser les queries posts et billable_users avec des query keys communes
3. Ajouter `.limit(10000)` ou pagination sur les queries posts

### Phase 2 - Performance
4. Eliminer les requetes N+1 (useLinkedInProfiles, Admin)
5. Remplacer les `useQuery` de calcul pur par des `useMemo` dans useAnalyticsData
6. Dedupliquer les appels `has_role` et `fetchProfile` au demarrage

### Phase 3 - Qualite
7. Remplacer `window.location.reload()` par l'invalidation React Query
8. Ajouter les traductions pour Auth.tsx
9. Refactorer Dashboard.tsx en sous-composants

