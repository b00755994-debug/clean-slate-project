
# Plan : Corriger l'insertion des profils LinkedIn

## Probleme identifie

L'erreur `PGRST204` indique que le code tente d'inserer un champ `user_id` qui n'existe plus dans la table `billable_users`.

**Schema actuel de billable_users** (pas de user_id) :
- id, workspace_id, linkedin_url, profile_name, slack_user_id, avatar_url, profile_picture, urn, linkedin_title, connections, followers, user_status, etc.

## Modifications a effectuer

### 1. Fichier `src/hooks/useLinkedInProfiles.ts`

**Ligne 109-115** - Supprimer `user_id` de l'insert :

```typescript
// AVANT
const { error } = await supabase.from('billable_users').insert({
  user_id: user?.id,           // <- A SUPPRIMER
  workspace_id: workspace?.id,
  profile_name: trimmedName,
  linkedin_url: trimmedUrl,
  slack_user_id: slackUserId || null,
});

// APRES
const { error } = await supabase.from('billable_users').insert({
  workspace_id: workspace?.id,
  profile_name: trimmedName,
  linkedin_url: trimmedUrl,
  slack_user_id: slackUserId || null,
});
```

### 2. Fichier `src/components/onboarding/OnboardingFlow.tsx`

**Ligne 236-242** - Supprimer `user_id` de l'insert :

```typescript
// AVANT
const { error } = await supabase.from('billable_users').insert({
  user_id: user?.id,           // <- A SUPPRIMER
  workspace_id: workspaceId,
  profile_name: trimmedName,
  linkedin_url: trimmedUrl,
  slack_user_id: null,
});

// APRES
const { error } = await supabase.from('billable_users').insert({
  workspace_id: workspaceId,
  profile_name: trimmedName,
  linkedin_url: trimmedUrl,
  slack_user_id: null,
});
```

## Explication

Dans l'architecture multi-workspace actuelle :
- Les profils LinkedIn (`billable_users`) sont lies au **workspace**, pas a l'utilisateur
- L'acces est controle via les politiques RLS qui verifient `is_workspace_member(auth.uid(), workspace_id)`
- La colonne `user_id` a ete supprimee car elle n'est plus necessaire

## Impact

Ces modifications permettront :
- D'ajouter des profils LinkedIn depuis le dashboard
- D'ajouter des profils LinkedIn pendant l'onboarding
- De conserver la securite via les politiques RLS existantes
