

# Plan: Refonte de la logique d'onboarding

## Objectif
Réorganiser l'onboarding pour que le workspace Superpump soit créé en premier, que les billable_users soient correctement liés au workspace_id, et que la connexion Slack soit une étape finale optionnelle.

## Changements

### 1. Modifier OnboardingStep1 pour créer le workspace Superpump

Après la saisie des infos (company, role, etc.), créer immédiatement un workspace Superpump:

```typescript
// Dans handleStep1Next (OnboardingFlow.tsx)
const { data: newWorkspace } = await supabase
  .from('workspaces')
  .insert({
    user_id: user.id,
    workspace_name: data.companyName || `${user.email}'s Workspace`,
    is_connected: false, // Pas encore connecté à Slack
  })
  .select('id')
  .single();

setWorkspaceId(newWorkspace.id);
```

### 2. Inverser l'ordre des étapes 2 et 3

| Avant | Après |
|-------|-------|
| Step 1: Infos | Step 1: Infos + création workspace |
| Step 2: Slack | Step 2: Profils LinkedIn |
| Step 3: Profils | Step 3: Slack (optionnel) |

### 3. Lier billable_users au workspace_id

```typescript
// Dans handleStep2Complete (nouveau Step 2 = profils)
await supabase.from('billable_users').insert({
  user_id: user?.id,
  workspace_id: workspaceId, // Ajouté
  profile_name: trimmedName,
  linkedin_url: trimmedUrl,
  slack_user_id: null, // Sera mis à jour après connexion Slack
});
```

### 4. Adapter slack-callback pour mettre à jour le workspace existant

Le callback Slack ne créera plus de workspace, il mettra à jour celui existant:

```typescript
// slack-callback/index.ts - modification
const { data: existingWorkspace } = await supabase
  .from('workspaces')
  .select('id')
  .eq('user_id', userId)
  .maybeSingle();

if (!existingWorkspace) {
  // Erreur: le workspace devrait déjà exister
  return redirect(`${dashboardUrl}?slack_error=workspace_not_found`);
}

// Mettre à jour le workspace existant
await supabase
  .from('workspaces')
  .update({
    is_connected: true,
    connected_at: new Date().toISOString(),
  })
  .eq('id', existingWorkspace.id);
```

### 5. Supprimer le mapping Slack depuis OnboardingStep3

L'association Slack user sera faite dans le dashboard après connexion, pas pendant l'onboarding.

## Fichiers à modifier

| Fichier | Modification |
|---------|--------------|
| `src/components/onboarding/OnboardingFlow.tsx` | Réorganiser les étapes, créer workspace en Step 1, ajouter workspace_id aux billable_users |
| `src/components/onboarding/OnboardingStep2.tsx` | Renommer en OnboardingStepLinkedIn (ajout profils) |
| `src/components/onboarding/OnboardingStep3.tsx` | Renommer en OnboardingStepSlack (connexion Slack) |
| `supabase/functions/slack-callback/index.ts` | Ne plus créer de workspace, seulement mettre à jour |

## Nouveau flux de données

```text
+------------------+     +-------------------+     +-------------------+
|     Step 1       |     |      Step 2       |     |      Step 3       |
|   Infos user     | --> | Profils LinkedIn  | --> |   Slack (opt.)    |
+------------------+     +-------------------+     +-------------------+
        |                        |                         |
        v                        v                         v
+------------------+     +-------------------+     +-------------------+
|    profiles      |     |  billable_users   |     |    workspaces     |
|  (company, etc.) |     | (avec workspace_  |     |  (is_connected    |
+------------------+     |      id)          |     |    = true)        |
        |                +-------------------+     +-------------------+
        v                        ^                         |
+------------------+             |                         v
|   workspaces     |-------------+              +-------------------+
| (workspace_name  |                            | slack_workspace_  |
|  = company_name) |                            |      auth         |
+------------------+                            +-------------------+
```

## Section technique

### Gestion du cas "skip Step 1"
Si l'utilisateur skip Step 1, on crée quand même un workspace avec un nom par défaut (`${email}'s Workspace`).

### Gestion du cas "workspace existant"
Si le useWorkspace() retourne déjà un workspace (reconnexion après déconnexion Slack), on le réutilise au lieu d'en créer un nouveau.

### Migration des données existantes
Une requête SQL sera nécessaire pour remplir les `workspace_id` manquants dans `billable_users`:

```sql
UPDATE billable_users bu
SET workspace_id = w.id
FROM workspaces w
WHERE bu.user_id = w.user_id
AND bu.workspace_id IS NULL;
```

