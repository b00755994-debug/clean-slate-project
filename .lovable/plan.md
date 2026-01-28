
# Plan: Restructuration du modèle de données multi-utilisateurs

## ✅ IMPLÉMENTÉ

### Architecture finale

```text
┌─────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│    profiles     │       │  workspace_members   │       │     workspaces      │
│  (auth users)   │◄──────│   (junction table)   │──────►│ (superpump spaces)  │
│                 │       │                      │       │                     │
│ - id (auth.uid) │       │ - profile_id         │       │ - id                │
│ - email         │       │ - workspace_id       │       │ - workspace_name    │
│ - full_name     │       │ - role (owner/member)│       │ - created_at        │
└─────────────────┘       └──────────────────────┘       └─────────────────────┘
                                                                   │
                                    ┌──────────────────────────────┼──────────────────┐
                                    │                              │                  │
                                    ▼                              ▼                  ▼
                          ┌─────────────────┐           ┌──────────────────┐  ┌──────────────┐
                          │ billable_users  │           │slack_workspace_  │  │    posts     │
                          │(LinkedIn profs) │           │     auth         │  │              │
                          │                 │           │                  │  │              │
                          │ - workspace_id  │           │ - superpump_     │  │- workspace_id│
                          │ - linkedin_url  │           │   workspace_id   │  │- linkedin_   │
                          │ - profile_name  │           │ - token          │  │  profiles    │
                          └─────────────────┘           └──────────────────┘  └──────────────┘
```

## Ce qui a été fait

### 1. Nouvelle table `workspace_members`
- Enum `workspace_role` créé: 'owner', 'admin', 'member'
- Table de jonction créée avec contrainte unique (profile_id, workspace_id)
- Données existantes migrées (propriétaires actuels)

### 2. Fonctions helper sécurisées
- `is_workspace_member(user_id, workspace_id)` → boolean
- `get_workspace_role(user_id, workspace_id)` → workspace_role

### 3. Politiques RLS mises à jour
Toutes les tables utilisent maintenant `is_workspace_member()` pour l'accès:
- `workspaces`
- `billable_users`
- `posts`
- `slack_workspace_auth`
- `vetted_content`
- `post_history`
- `posts_activity`

### 4. Code mis à jour
- `useWorkspace.ts`: Récupère via `workspace_members` au lieu de `workspaces.user_id`
- `OnboardingFlow.tsx`: Crée une entrée `workspace_members` avec rôle 'owner' lors de la création

## Fonctionnalités futures activées

1. **Invitations d'équipe**: Un owner peut inviter d'autres utilisateurs
2. **Rôles différenciés**: owner, admin, member avec permissions différentes
3. **Multi-workspace**: Un utilisateur peut appartenir à plusieurs workspaces

## TODO (optionnel)
- [ ] Supprimer `workspaces.user_id` après période de transition
- [ ] Supprimer `profiles.workspace_id` après période de transition
- [ ] Supprimer `billable_users.user_id` après période de transition
- [ ] Interface d'invitation de membres
