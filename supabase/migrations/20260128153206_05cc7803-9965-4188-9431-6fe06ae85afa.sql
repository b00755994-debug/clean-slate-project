-- Supprimer les anciennes politiques RLS qui dépendent de user_id
DROP POLICY IF EXISTS "Users can insert their own slack workspaces" ON public.workspaces;

-- Créer la nouvelle politique pour INSERT basée sur workspace_members
-- Les owners peuvent créer de nouveaux workspaces (première création via onboarding)
CREATE POLICY "Authenticated users can create workspaces"
ON public.workspaces FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Maintenant supprimer les colonnes obsolètes
ALTER TABLE public.profiles DROP COLUMN IF EXISTS workspace_id;
ALTER TABLE public.billable_users DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.workspaces DROP COLUMN IF EXISTS user_id;