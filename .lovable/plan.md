
# Plan: Restructuration du modèle de données multi-utilisateurs

## Architecture proposée

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

## Nouvelles tables

### 1. workspace_members (nouvelle table)

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | PK |
| profile_id | uuid | FK vers profiles |
| workspace_id | uuid | FK vers workspaces |
| role | enum | 'owner', 'admin', 'member' |
| invited_at | timestamp | Date d'invitation |
| joined_at | timestamp | Date d'acceptation |

### 2. Modifications aux tables existantes

**workspaces:**
- Supprimer `user_id` (remplacé par workspace_members)
- Garder les autres colonnes

**profiles:**
- Supprimer `workspace_id` (remplacé par workspace_members)
- Garder les autres colonnes

**billable_users:**
- Supprimer `user_id` (le lien se fait via workspace_id)
- Garder `workspace_id` comme référence principale

## Migrations SQL

### Etape 1: Créer l'enum et la table workspace_members

```sql
-- Créer l'enum pour les rôles workspace
CREATE TYPE public.workspace_role AS ENUM ('owner', 'admin', 'member');

-- Créer la table de jonction
CREATE TABLE public.workspace_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  role workspace_role NOT NULL DEFAULT 'member',
  invited_at timestamp with time zone DEFAULT now(),
  joined_at timestamp with time zone,
  UNIQUE(profile_id, workspace_id)
);

-- Activer RLS
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
```

### Etape 2: Migrer les données existantes

```sql
-- Migrer les propriétaires actuels vers workspace_members
INSERT INTO workspace_members (profile_id, workspace_id, role, joined_at)
SELECT user_id, id, 'owner', created_at
FROM workspaces
WHERE user_id IS NOT NULL;
```

### Etape 3: Politiques RLS pour workspace_members

```sql
-- Fonction pour vérifier l'appartenance au workspace
CREATE OR REPLACE FUNCTION public.is_workspace_member(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE profile_id = _user_id AND workspace_id = _workspace_id
  )
$$;

-- Fonction pour vérifier le rôle dans un workspace
CREATE OR REPLACE FUNCTION public.get_workspace_role(_user_id uuid, _workspace_id uuid)
RETURNS workspace_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM workspace_members
  WHERE profile_id = _user_id AND workspace_id = _workspace_id
$$;

-- Les membres peuvent voir leur workspace
CREATE POLICY "Members can view their workspaces"
ON workspace_members FOR SELECT
USING (profile_id = auth.uid() OR is_workspace_member(auth.uid(), workspace_id));

-- Les owners peuvent inviter des membres
CREATE POLICY "Owners can invite members"
ON workspace_members FOR INSERT
WITH CHECK (
  get_workspace_role(auth.uid(), workspace_id) = 'owner'
);
```

### Etape 4: Mettre à jour les RLS des autres tables

```sql
-- billable_users: accès basé sur workspace_members
DROP POLICY IF EXISTS "Users can view their own linkedin profiles" ON billable_users;
CREATE POLICY "Workspace members can view linkedin profiles"
ON billable_users FOR SELECT
USING (is_workspace_member(auth.uid(), workspace_id));

-- posts: accès basé sur workspace_members
DROP POLICY IF EXISTS "Users can view posts for their profiles" ON posts;
CREATE POLICY "Workspace members can view posts"
ON posts FOR SELECT
USING (is_workspace_member(auth.uid(), workspace_id));
```

## Hooks à modifier

| Hook | Modification |
|------|--------------|
| useWorkspace | Récupérer via workspace_members au lieu de workspaces.user_id |
| useLinkedInProfiles | Déjà OK (utilise workspace_id) |
| useTeamFeed | Déjà OK (utilise workspace_id) |
| useAnalyticsData | Déjà OK (utilise workspace_id) |

## Fonctionnalités futures activées

1. **Invitations d'équipe**: Un owner peut inviter d'autres utilisateurs
2. **Rôles différenciés**: owner, admin, member avec permissions différentes
3. **Multi-workspace**: Un utilisateur peut appartenir à plusieurs workspaces
4. **Slack partagé**: Possibilité de lier un Slack à plusieurs workspaces (optionnel)

## Impact

- Migration transparente des données existantes
- Les utilisateurs actuels deviennent automatiquement "owners"
- Préparation pour les fonctionnalités collaboratives futures
