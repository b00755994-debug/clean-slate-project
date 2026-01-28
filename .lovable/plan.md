# Plan: Refonte de la logique d'onboarding

## ✅ IMPLÉMENTÉ

### Nouveau flux d'onboarding

| Étape | Contenu | Données créées |
|-------|---------|----------------|
| Step 1 | Infos utilisateur | `profiles` (company, role, etc.) + `workspaces` (workspace_id) |
| Step 2 | Profils LinkedIn | `billable_users` (avec `workspace_id` !) |
| Step 3 | Slack (optionnel) | `workspaces.is_connected = true` + `slack_workspace_auth` |

### Fichiers modifiés/créés

- ✅ `src/components/onboarding/OnboardingFlow.tsx` - Réorganisé avec création workspace en Step 1
- ✅ `src/components/onboarding/OnboardingStepLinkedIn.tsx` - Nouveau composant (Step 2)
- ✅ `src/components/onboarding/OnboardingStepSlack.tsx` - Nouveau composant (Step 3)
- ✅ `supabase/functions/slack-callback/index.ts` - Met à jour le workspace existant (ne crée plus)
- 🗑️ `OnboardingStep2.tsx` et `OnboardingStep3.tsx` - Supprimés (remplacés)

### Corrections apportées

1. **workspace_id** est maintenant correctement passé lors de l'insertion des `billable_users`
2. **Workspace créé en premier** (Step 1) avant les profils LinkedIn
3. **Slack en dernier** (Step 3) - optionnel, ne bloque plus le flux
4. **slack-callback** ne crée plus de workspace, il met à jour celui existant

## Migration des données existantes

Pour corriger les `billable_users` existants sans `workspace_id`:

```sql
UPDATE billable_users bu
SET workspace_id = w.id
FROM workspaces w
WHERE bu.user_id = w.user_id
AND bu.workspace_id IS NULL;
```
