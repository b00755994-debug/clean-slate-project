

# Plan : Resolution definitive de l'erreur RLS sur workspaces

## Diagnostic confirme

L'investigation a revele :

1. **La politique RLS est correctement configuree** :
   - Type : PERMISSIVE
   - Commande : INSERT
   - Role : authenticated
   - Condition : `auth.uid() IS NOT NULL`
   - Aucune politique RESTRICTIVE presente

2. **Le probleme est le cache PostgREST** :
   - La migration a ete executee a 08:17:58 UTC
   - Les erreurs persistent jusqu'a 08:19:21 UTC (1m23s apres)
   - Le `NOTIFY pgrst, 'reload schema'` n'a pas fonctionne

## Cause racine

PostgREST utilise un cache interne pour les politiques RLS. La commande `NOTIFY pgrst, 'reload schema'` devrait forcer un rechargement, mais dans certains cas (notamment sur Supabase Cloud), ce mecanisme peut etre retarde ou ne pas fonctionner immediatement.

## Solution proposee

### Etape 1 : Forcer un rechargement complet via recreation de la politique

Supprimer et recreer la politique avec une syntaxe legerement differente force PostgreSQL a regenerer tous les plans d'execution caches.

```sql
-- Supprimer la politique existante
DROP POLICY IF EXISTS "Authenticated users can create workspaces" ON public.workspaces;

-- La recreer avec une syntaxe explicite qui force le rechargement
CREATE POLICY "Authenticated users can create workspaces" 
ON public.workspaces 
AS PERMISSIVE
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Force schema reload
NOTIFY pgrst, 'reload schema';
```

Changements cles :
- Ajout de `AS PERMISSIVE` explicite
- Simplification de la condition a `true` (un utilisateur authentifie PEUT creer un workspace - la verification `auth.uid() IS NOT NULL` est redondante car le role `authenticated` implique deja cela)

### Etape 2 : Test en navigateur prive

Apres la migration, l'utilisateur doit :
1. Fermer TOUS les onglets du navigateur
2. Ouvrir une fenetre de navigation privee
3. Aller sur la preview Lovable
4. Se connecter et tester l'onboarding

### Etape 3 : Alternative si echec

Si le probleme persiste, la seule solution restante est d'aller dans le **Dashboard Supabase** :
1. Settings > API
2. Redemarrer le projet Supabase (cela forcera un redemarrage complet de PostgREST)

## Fichiers a modifier

Aucune modification de code n'est necessaire. Seule une migration SQL est requise.

## Section technique

### Pourquoi `WITH CHECK (true)` est sur

La politique s'applique uniquement au role `authenticated`, ce qui signifie :
- Les utilisateurs non connectes (anon) ne peuvent PAS creer de workspace
- Seuls les utilisateurs avec un JWT valide peuvent inserer

La condition `auth.uid() IS NOT NULL` est donc redondante car le role `authenticated` garantit deja que `auth.uid()` retourne une valeur.

### Verification post-migration

```sql
SELECT polname, polpermissive, pg_get_expr(polwithcheck, polrelid) 
FROM pg_policy 
WHERE polrelid = 'public.workspaces'::regclass 
AND polcmd = 'a';
```

Resultat attendu :
- `polpermissive: true`
- `with_check: true`

