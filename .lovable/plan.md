
# Plan : Correction des problèmes d'ajout de profils LinkedIn

## Diagnostic

### Probleme 1 : Profil non visible apres onboarding
L'utilisateur a deux workspaces (crees lors de tentatives successives). Le hook `useWorkspace` utilise `.maybeSingle()` qui retourne un seul workspace arbitraire. Le profil LinkedIn a ete ajoute dans un workspace different de celui affiche sur le dashboard.

### Probleme 2 : Erreur RLS lors de l'ajout via dashboard
C'est le meme probleme de cache PostgREST que pour les workspaces. La solution est identique : creer une fonction `SECURITY DEFINER` pour bypasser le cache.

## Solution

### Etape 1 : Migration SQL - Creer une fonction pour ajouter des billable_users

```sql
CREATE OR REPLACE FUNCTION public.add_billable_user(
  p_workspace_id UUID,
  p_profile_name TEXT,
  p_linkedin_url TEXT,
  p_slack_user_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_billable_user_id UUID;
BEGIN
  -- Verifier que l'utilisateur est membre du workspace
  IF NOT is_workspace_member(auth.uid(), p_workspace_id) THEN
    RAISE EXCEPTION 'User is not a member of this workspace';
  END IF;
  
  -- Inserer le billable_user
  INSERT INTO public.billable_users (
    workspace_id, 
    profile_name, 
    linkedin_url, 
    slack_user_id
  )
  VALUES (
    p_workspace_id, 
    p_profile_name, 
    p_linkedin_url, 
    p_slack_user_id
  )
  RETURNING id INTO v_billable_user_id;
  
  RETURN v_billable_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_billable_user TO authenticated;
```

### Etape 2 : Modifier useLinkedInProfiles.ts

Remplacer l'insert direct par un appel RPC :

```typescript
// Avant
const { error } = await supabase.from('billable_users').insert({
  workspace_id: workspace?.id,
  profile_name: trimmedName,
  linkedin_url: trimmedUrl,
  slack_user_id: slackUserId || null,
});

// Apres
const { error } = await supabase.rpc('add_billable_user', {
  p_workspace_id: workspace?.id,
  p_profile_name: trimmedName,
  p_linkedin_url: trimmedUrl,
  p_slack_user_id: slackUserId || null,
});
```

### Etape 3 : Modifier OnboardingFlow.tsx

Utiliser la meme fonction RPC pour l'insertion des profils pendant l'onboarding :

```typescript
const { error } = await supabase.rpc('add_billable_user', {
  p_workspace_id: workspaceId,
  p_profile_name: trimmedName,
  p_linkedin_url: trimmedUrl,
  p_slack_user_id: null,
});
```

### Etape 4 : Nettoyer les donnees de test

Supprimer les workspaces de test de l'utilisateur pour eviter les conflits :

```sql
-- Supprimer le workspace vide "Test" 
DELETE FROM workspace_members WHERE workspace_id = 'f4265f11-7c60-4cb8-8c12-77861384e1f3';
DELETE FROM workspaces WHERE id = 'f4265f11-7c60-4cb8-8c12-77861384e1f3';
```

## Avantages

1. **Contourne le cache PostgREST** : Les appels RPC ne sont pas affectes par le cache RLS
2. **Securite maintenue** : La fonction verifie que l'utilisateur est bien membre du workspace via `is_workspace_member()`
3. **Code unifie** : La meme fonction est utilisee pour l'onboarding et le dashboard
4. **Atomique et coherent** : Une seule source de verite pour l'ajout de profils

## Fichiers a modifier

1. **Migration SQL** : Nouvelle fonction `add_billable_user`
2. **src/hooks/useLinkedInProfiles.ts** : Utiliser `supabase.rpc()` au lieu de `supabase.from().insert()`
3. **src/components/onboarding/OnboardingFlow.tsx** : Utiliser `supabase.rpc()` pour l'ajout de profils
4. **Migration SQL** : Nettoyage des donnees de test
