-- Enable Row Level Security on slack_workspace_auth
ALTER TABLE public.slack_workspace_auth ENABLE ROW LEVEL SECURITY;

-- Users can view slack auth for their own workspaces
CREATE POLICY "Users can view their own slack workspace auth"
ON public.slack_workspace_auth
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE workspaces.id = slack_workspace_auth.superpump_workspace_id
    AND workspaces.user_id = auth.uid()
  )
);

-- Admins can view all slack workspace auth
CREATE POLICY "Admins can view all slack workspace auth"
ON public.slack_workspace_auth
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Note: INSERT, UPDATE, DELETE should only be done via edge functions with service role
-- No direct client access for modifications to protect tokens