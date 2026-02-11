
# Corriger workspace_name pour qu'il reste le nom Slack

## Constat

- `profiles.company_name` stocke deja le nom d'entreprise saisi pendant l'onboarding -- c'est correct.
- Le probleme : `OnboardingFlow.ensureWorkspace()` ecrit aussi ce nom d'entreprise dans `workspaces.workspace_name`, qui devrait etre reserve au nom du workspace Slack.

## Solution (aucune migration necessaire)

### 1. `src/components/onboarding/OnboardingFlow.tsx` - `ensureWorkspace()`

Ne plus passer le nom d'entreprise comme `workspace_name`. Utiliser un nom generique par defaut (ex: "My Workspace") en attendant la connexion Slack.

Avant :
```text
const workspaceName = companyName?.trim() || `${user.email}'s Workspace`;
```

Apres :
```text
const workspaceName = `${user.email}'s Workspace`;
```

Le parametre `companyName` est supprime de `ensureWorkspace()` puisqu'il n'est plus utilise. Les appels dans `handleStep1Next` et `handleSkipStep1` sont simplifies.

### 2. `supabase/functions/slack-callback/index.ts`

Dans le bloc d'update du workspace existant (vers la ligne 161), ajouter `workspace_name: teamName` pour que le vrai nom Slack soit enregistre des la connexion OAuth :

```text
.update({
  workspace_name: teamName || 'My Workspace',
  is_connected: true,
  connected_at: new Date().toISOString(),
})
```

Idem dans le bloc fallback de creation de workspace (deja le cas avec `teamName || 'My Workspace'`).

### 3. Dashboard (`src/pages/Dashboard.tsx`)

Aucun changement necessaire -- il affiche deja `workspace_name`, qui sera maintenant le vrai nom Slack.

## Resume

- `profiles.company_name` = nom de l'entreprise (onboarding step 1) -- deja en place
- `workspaces.workspace_name` = nom du workspace Slack (rempli au callback OAuth)
- Pas de nouvelle colonne, pas de migration
