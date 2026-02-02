

# Plan : Forcer le rafraîchissement du cache PostgREST

## Diagnostic final

Après investigation approfondie :
- La politique RLS INSERT sur `workspaces` EST correcte et PERMISSIVE
- Elle s'applique au rôle `authenticated` avec la condition `auth.uid() IS NOT NULL`
- Les migrations ont été appliquées dans la base de données
- L'erreur persiste malgré tout

## Cause probable

PostgREST (le service qui expose l'API REST de Supabase) maintient un cache du schema et des politiques RLS. Apres une migration, ce cache n'est pas automatiquement rafraichi. C'est pourquoi l'ancienne politique (potentiellement mal configuree) continue d'etre utilisee.

## Solution

Executer une commande SQL pour forcer PostgREST a recharger son schema :

```sql
-- Notifier PostgREST de recharger le schema
NOTIFY pgrst, 'reload schema';
```

Cette commande envoie un signal a PostgREST pour qu'il recharge toutes les definitions de tables, vues et politiques RLS.

## Migration SQL a executer

```sql
-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
```

## Verification

Apres l'execution :
1. Attendre quelques secondes
2. Retester l'onboarding
3. L'erreur RLS devrait disparaitre

## Alternative si ca ne fonctionne pas

Si le probleme persiste, la solution de secours est de :
1. Aller dans Supabase Dashboard > Settings > API
2. Cliquer sur "Restart API" (ou redemarrer le projet)

Cela forcera un rechargement complet de tous les services.

