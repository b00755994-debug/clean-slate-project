
# Plan: Restructuration du modèle de données multi-utilisateurs

## ✅ TERMINÉ

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

## Migrations effectuées

### 1. Création de `workspace_members` ✅
- Enum `workspace_role`: 'owner', 'admin', 'member'
- Table de jonction avec contrainte unique (profile_id, workspace_id)
- Données migrées automatiquement (propriétaires existants → role 'owner')

### 2. Fonctions helper sécurisées ✅
- `is_workspace_member(user_id, workspace_id)` → boolean
- `get_workspace_role(user_id, workspace_id)` → workspace_role

### 3. Politiques RLS mises à jour ✅
Toutes les tables utilisent `is_workspace_member()`:
- workspaces, billable_users, posts, slack_workspace_auth
- vetted_content, post_history, posts_activity, workspace_members

### 4. Nettoyage des colonnes obsolètes ✅
Colonnes supprimées:
- `profiles.workspace_id`
- `billable_users.user_id`
- `workspaces.user_id`

### 5. Code mis à jour ✅
- `useWorkspace.ts`: Récupère via `workspace_members`
- `OnboardingFlow.tsx`: Crée `workspace_members` avec rôle 'owner'
- `VettedLibrary.tsx`: Utilise `workspace_members`
- `Admin.tsx`: Utilise `workspace_members`

## Fonctionnalités activées

1. **Invitations d'équipe**: Un owner peut inviter d'autres utilisateurs
2. **Rôles différenciés**: owner, admin, member avec permissions différentes
3. **Multi-workspace**: Un utilisateur peut appartenir à plusieurs workspaces
