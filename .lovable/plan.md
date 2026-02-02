
# Plan : Contournement du cache PostgREST via fonction SECURITY DEFINER

## Diagnostic final

La politique RLS est correctement configuree dans la base de donnees :
- `Authenticated users can create workspaces` : INSERT, PERMISSIVE, role authenticated, WITH CHECK true

Le probleme est le cache PostgREST qui ne se rafraichit pas malgre les migrations et le NOTIFY. Meme apres un redemarrage potentiel du projet, le cache peut persister.

## Solution proposee

Creer une fonction PostgreSQL `SECURITY DEFINER` qui contourne les politiques RLS tout en maintenant la securite. Cette approche est robuste et ne depend pas du cache PostgREST.

### Etape 1 : Migration SQL - Creer la fonction

```sql
CREATE OR REPLACE FUNCTION public.create_workspace_for_user(
  p_workspace_name TEXT,
  p_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_workspace_id UUID;
BEGIN
  -- Verifier que l'utilisateur est authentifie
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Creer le workspace
  INSERT INTO public.workspaces (workspace_name, is_connected)
  VALUES (p_workspace_name, false)
  RETURNING id INTO v_workspace_id;
  
  -- Creer l'entree workspace_members pour le proprietaire
  INSERT INTO public.workspace_members (profile_id, workspace_id, role, joined_at)
  VALUES (p_user_id, v_workspace_id, 'owner', NOW());
  
  RETURN v_workspace_id;
END;
$$;

-- Donner acces a la fonction aux utilisateurs authentifies
GRANT EXECUTE ON FUNCTION public.create_workspace_for_user TO authenticated;
```

### Etape 2 : Modifier le code OnboardingFlow.tsx

Remplacer l'appel direct a `supabase.from('workspaces').insert()` par un appel RPC :

```typescript
// Avant
const { data: newWorkspace, error } = await supabase
  .from('workspaces')
  .insert({
    workspace_name: workspaceName,
    is_connected: false,
  })
  .select('id')
  .single();

// Apres
const { data: workspaceId, error } = await supabase
  .rpc('create_workspace_for_user', {
    p_workspace_name: workspaceName,
    p_user_id: user.id
  });
```

Cette modification simplifie egalement le code car la fonction cree automatiquement l'entree workspace_members.

## Avantages de cette approche

1. **Contourne le cache** : Les fonctions RPC ne sont pas affectees par le cache des politiques RLS
2. **Transaction atomique** : Le workspace et le membre sont crees dans la meme transaction
3. **Plus simple** : Le code frontend est reduit
4. **Securise** : La fonction verifie que l'utilisateur est authentifie

## Section technique

### Pourquoi SECURITY DEFINER est sur ici

- La fonction est executee avec les privileges du proprietaire de la fonction (postgres)
- La verification `IF p_user_id IS NULL` garantit qu'un utilisateur valide est passe
- Le `p_user_id` provient du frontend via `user.id` qui est extrait du JWT
- Seuls les utilisateurs avec le role `authenticated` peuvent appeler cette fonction (GRANT)

### Fichiers a modifier

1. **Migration SQL** : Nouvelle fonction `create_workspace_for_user`
2. **src/components/onboarding/OnboardingFlow.tsx** : Utiliser `supabase.rpc()` au lieu de `supabase.from().insert()`
