
# Plan: Correction de l'ajout de profils LinkedIn sans workspace_id

## Problème

Le hook `useLinkedInProfiles.ts` (utilisé dans le dashboard pour ajouter des profils) n'inclut pas le `workspace_id` lors de l'insertion dans `billable_users`.

## Correction

### Fichier: src/hooks/useLinkedInProfiles.ts

| Avant | Après |
|-------|-------|
| N'utilise pas `useWorkspace` | Import et utilise `useWorkspace` |
| Insert sans `workspace_id` | Insert avec `workspace_id: workspace?.id` |
| Query par `user_id` | Query par `workspace_id` (cohérence) |

**Code actuel (lignes 105-110):**
```typescript
const { error } = await supabase.from('billable_users').insert({
  user_id: user?.id,
  profile_name: trimmedName,
  linkedin_url: trimmedUrl,
  slack_user_id: slackUserId || null,
});
```

**Code corrigé:**
```typescript
const { error } = await supabase.from('billable_users').insert({
  user_id: user?.id,
  workspace_id: workspace?.id,  // AJOUT
  profile_name: trimmedName,
  linkedin_url: trimmedUrl,
  slack_user_id: slackUserId || null,
});
```

## Changements complets

1. Ajouter `import { useWorkspace } from '@/hooks/useWorkspace'`
2. Ajouter `const { workspace } = useWorkspace()` dans le hook
3. Inclure `workspace_id: workspace?.id` dans l'insert
4. Mettre à jour la query pour filtrer par `workspace_id` au lieu de `user_id` (cohérence)
5. Mettre à jour les query keys pour inclure `workspace?.id`

## Migration de données

Aussi corriger le profil existant avec une requête SQL :
```sql
UPDATE billable_users bu
SET workspace_id = w.id
FROM workspaces w
WHERE bu.user_id = w.user_id AND bu.workspace_id IS NULL;
```

## Impact

- Les nouveaux profils LinkedIn seront correctement associés au workspace
- Le feed et les analytics afficheront les données correctement
