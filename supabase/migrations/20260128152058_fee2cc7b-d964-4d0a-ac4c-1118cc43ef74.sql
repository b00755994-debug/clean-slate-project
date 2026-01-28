-- Étape 1: Créer l'enum pour les rôles workspace
CREATE TYPE public.workspace_role AS ENUM ('owner', 'admin', 'member');

-- Étape 2: Créer la table de jonction workspace_members
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

-- Étape 3: Migrer les propriétaires actuels vers workspace_members
INSERT INTO public.workspace_members (profile_id, workspace_id, role, joined_at)
SELECT user_id, id, 'owner', created_at
FROM public.workspaces
WHERE user_id IS NOT NULL;

-- Étape 4: Fonction pour vérifier l'appartenance au workspace
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

-- Étape 5: Politiques RLS pour workspace_members
-- Les membres peuvent voir leurs propres memberships
CREATE POLICY "Members can view their own memberships"
ON public.workspace_members FOR SELECT
USING (profile_id = auth.uid());

-- Les membres peuvent voir les autres membres de leurs workspaces
CREATE POLICY "Members can view workspace memberships"
ON public.workspace_members FOR SELECT
USING (is_workspace_member(auth.uid(), workspace_id));

-- Les owners peuvent inviter des membres
CREATE POLICY "Owners can invite members"
ON public.workspace_members FOR INSERT
WITH CHECK (
  get_workspace_role(auth.uid(), workspace_id) = 'owner'
);

-- Les owners peuvent modifier les rôles
CREATE POLICY "Owners can update member roles"
ON public.workspace_members FOR UPDATE
USING (get_workspace_role(auth.uid(), workspace_id) = 'owner');

-- Les owners peuvent retirer des membres
CREATE POLICY "Owners can remove members"
ON public.workspace_members FOR DELETE
USING (get_workspace_role(auth.uid(), workspace_id) = 'owner');

-- Admins peuvent voir tous les workspace_members
CREATE POLICY "Admins can view all workspace members"
ON public.workspace_members FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Étape 6: Mettre à jour les RLS des autres tables pour utiliser workspace_members

-- workspaces: accès basé sur workspace_members
DROP POLICY IF EXISTS "Users can view their own slack workspaces" ON public.workspaces;
CREATE POLICY "Workspace members can view workspaces"
ON public.workspaces FOR SELECT
USING (is_workspace_member(auth.uid(), id) OR has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can update their own slack workspaces" ON public.workspaces;
CREATE POLICY "Workspace owners can update workspaces"
ON public.workspaces FOR UPDATE
USING (get_workspace_role(auth.uid(), id) = 'owner');

DROP POLICY IF EXISTS "Users can delete their own slack workspaces" ON public.workspaces;
CREATE POLICY "Workspace owners can delete workspaces"
ON public.workspaces FOR DELETE
USING (get_workspace_role(auth.uid(), id) = 'owner');

-- billable_users: accès basé sur workspace_members
DROP POLICY IF EXISTS "Users can view their own linkedin profiles" ON public.billable_users;
CREATE POLICY "Workspace members can view linkedin profiles"
ON public.billable_users FOR SELECT
USING (is_workspace_member(auth.uid(), workspace_id) OR has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can insert their own linkedin profiles" ON public.billable_users;
CREATE POLICY "Workspace members can insert linkedin profiles"
ON public.billable_users FOR INSERT
WITH CHECK (is_workspace_member(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Users can update their own linkedin profiles" ON public.billable_users;
CREATE POLICY "Workspace members can update linkedin profiles"
ON public.billable_users FOR UPDATE
USING (is_workspace_member(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Users can delete their own linkedin profiles" ON public.billable_users;
CREATE POLICY "Workspace members can delete linkedin profiles"
ON public.billable_users FOR DELETE
USING (is_workspace_member(auth.uid(), workspace_id));

-- posts: accès basé sur workspace_members
DROP POLICY IF EXISTS "Users can view posts for their profiles" ON public.posts;
CREATE POLICY "Workspace members can view posts"
ON public.posts FOR SELECT
USING (is_workspace_member(auth.uid(), workspace_id) OR has_role(auth.uid(), 'admin'));

-- slack_workspace_auth: accès basé sur workspace_members
DROP POLICY IF EXISTS "Users can view their own slack workspace auth" ON public.slack_workspace_auth;
CREATE POLICY "Workspace members can view slack auth"
ON public.slack_workspace_auth FOR SELECT
USING (is_workspace_member(auth.uid(), superpump_workspace_id) OR has_role(auth.uid(), 'admin'));

-- vetted_content: accès basé sur workspace_members
DROP POLICY IF EXISTS "Users can view vetted content from their workspace" ON public.vetted_content;
CREATE POLICY "Workspace members can view vetted content"
ON public.vetted_content FOR SELECT
USING (is_workspace_member(auth.uid(), workspace_id) OR has_role(auth.uid(), 'admin'));

-- post_history: accès basé sur workspace_members
DROP POLICY IF EXISTS "Users can view history for their posts" ON public.post_history;
CREATE POLICY "Workspace members can view post history"
ON public.post_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts p
    WHERE p.id = post_history.post_id
    AND is_workspace_member(auth.uid(), p.workspace_id)
  )
  OR has_role(auth.uid(), 'admin')
);

-- posts_activity: accès basé sur workspace_members
DROP POLICY IF EXISTS "Users can view activity for their posts" ON public.posts_activity;
CREATE POLICY "Workspace members can view posts activity"
ON public.posts_activity FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts p
    WHERE p.id = posts_activity.post_id
    AND is_workspace_member(auth.uid(), p.workspace_id)
  )
  OR has_role(auth.uid(), 'admin')
);