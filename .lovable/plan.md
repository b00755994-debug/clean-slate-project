

# Sauvegarder le bot_user_id dans slack_workspace_auth

## Probleme

La table `slack_workspace_auth` a une colonne `bot_user_id` mais elle n'est jamais remplie. Lors du callback OAuth Slack, la reponse contient `bot_user_id` mais le code l'ignore.

## Solution

Modifier `supabase/functions/slack-callback/index.ts` pour extraire `bot_user_id` de la reponse OAuth et l'inclure dans les operations INSERT et UPDATE sur `slack_workspace_auth`.

## Fichier modifie

- `supabase/functions/slack-callback/index.ts`

## Detail technique

La reponse Slack OAuth v2 (`oauth.v2.access`) retourne :

```text
{
  "ok": true,
  "access_token": "xoxb-...",
  "bot_user_id": "U12345678",
  "team": { "id": "T...", "name": "..." },
  "scope": "..."
}
```

Modifications :

1. Extraire `bot_user_id` depuis `tokenData.bot_user_id` (a cote de `accessToken`, `teamId`, etc.)
2. L'ajouter dans l'objet `.update()` (mise a jour d'un auth existant)
3. L'ajouter dans l'objet `.insert()` (creation d'un nouvel auth)

Aucune migration SQL necessaire -- la colonne existe deja.
