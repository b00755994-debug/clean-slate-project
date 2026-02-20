
# Structure de paywall — Limite de billable users par workspace

## Contexte

Actuellement, il n'existe aucune limite sur le nombre de profils LinkedIn (billable users) qu'un workspace peut ajouter. L'objectif est de poser l'infrastructure d'un paywall futur, sans bloquer les paiements pour l'instant. Tout est gérable manuellement dans le backend.

## Architecture choisie

Ajouter deux colonnes à la table `workspaces` :
- `plan` — le plan actuel du workspace (`'pro'` par défaut)
- `max_billable_users` — la limite de profils LinkedIn (`10` par défaut)

Ce sont les deux seules valeurs nécessaires pour piloter la limite. Elles seront modifiables manuellement dans Supabase pour chaque client.

## Ce qui change

### 1. Migration SQL — table `workspaces`

Ajout des deux colonnes avec valeurs par défaut :

```sql
ALTER TABLE workspaces
  ADD COLUMN plan text NOT NULL DEFAULT 'pro',
  ADD COLUMN max_billable_users integer NOT NULL DEFAULT 10;

-- Mettre à jour les workspaces existants
UPDATE workspaces SET plan = 'pro', max_billable_users = 10;
```

### 2. `src/hooks/useWorkspace.ts`

- Ajouter `plan` et `max_billable_users` à l'interface `Workspace`
- Les exposer via le hook

### 3. `src/hooks/useLinkedInProfiles.ts`

Dans `addProfileMutation`, avant d'appeler le RPC `add_billable_user`, vérifier côté client :

```
if (linkedinProfiles.length >= workspace.max_billable_users) {
  throw new Error(limitReachedMessage)
}
```

Note : c'est une vérification côté client (UX). La vraie protection est au niveau de la fonction RPC `add_billable_user` dans Supabase (step 4).

### 4. Fonction RPC `add_billable_user` — protection côté serveur

Modifier la fonction pour qu'elle vérifie la limite avant d'insérer :

```sql
-- Vérifier la limite
IF (SELECT COUNT(*) FROM billable_users WHERE workspace_id = p_workspace_id) >= 
   (SELECT max_billable_users FROM workspaces WHERE id = p_workspace_id) THEN
  RAISE EXCEPTION 'Workspace has reached its LinkedIn profile limit';
END IF;
```

C'est la protection réelle, côté base de données, qui ne peut pas être contournée.

### 5. `src/pages/Dashboard.tsx` — UI du paywall

Dans la section "Profils LinkedIn suivis", afficher :

- Un compteur `X / Y profils` à côté du titre (ex: `3 / 10`)
- Une barre de progression fine montrant l'utilisation
- Quand la limite est atteinte : le bouton "Ajouter un utilisateur" est désactivé et affiche un tooltip explicatif
- Un message d'upgrade discret sous la barre (ex: "Limite atteinte — contactez-nous pour augmenter votre quota")

### 6. `src/pages/Dashboard.tsx` — Carte "Mon Plan"

Enrichir la carte plan avec :
- Affichage du quota : `X / Y profils LinkedIn`
- Mini barre de progression

## Flux complet

```text
Utilisateur clique "Ajouter"
        |
        v
[Vérification client] linkedinProfiles.length >= max_billable_users ?
        |                         |
       OUI                       NON
        |                         |
Toast "Limite atteinte"     Appel RPC add_billable_user()
                                  |
                    [Vérification serveur dans la fonction SQL]
                          |                   |
                   Limite atteinte      OK → insertion
                          |
                  RAISE EXCEPTION → toast d'erreur
```

## Fichiers modifiés

- Migration SQL (`workspaces` table) — 2 nouvelles colonnes
- Mise à jour de la fonction RPC `add_billable_user` — guard côté serveur
- `src/hooks/useWorkspace.ts` — expose `plan` et `max_billable_users`
- `src/hooks/useLinkedInProfiles.ts` — vérification côté client avant insertion
- `src/pages/Dashboard.tsx` — compteur, barre de progression, bouton désactivé

## Ce qui ne change PAS

- Aucun paiement, aucun Stripe, aucune redirection
- Tous les workspaces existants restent sur Pro avec limite à 10
- Modifiable manuellement dans Supabase à tout moment
