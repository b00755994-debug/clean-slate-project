-- Add plan and max_billable_users columns to workspaces
ALTER TABLE workspaces
  ADD COLUMN plan text NOT NULL DEFAULT 'pro',
  ADD COLUMN max_billable_users integer NOT NULL DEFAULT 10;

-- Update existing workspaces (already handled by DEFAULT but explicit for clarity)
UPDATE workspaces SET plan = 'pro', max_billable_users = 10;

-- Update the add_billable_user RPC to enforce the limit server-side
CREATE OR REPLACE FUNCTION public.add_billable_user(
  p_workspace_id uuid,
  p_profile_name text DEFAULT NULL::text,
  p_linkedin_url text DEFAULT NULL::text,
  p_slack_user_id text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_billable_user_id UUID;
  v_current_count INTEGER;
  v_max_users INTEGER;
BEGIN
  IF NOT is_workspace_member(auth.uid(), p_workspace_id) THEN
    RAISE EXCEPTION 'User is not a member of this workspace';
  END IF;

  -- Check billable user limit
  SELECT COUNT(*) INTO v_current_count
  FROM billable_users
  WHERE workspace_id = p_workspace_id;

  SELECT max_billable_users INTO v_max_users
  FROM workspaces
  WHERE id = p_workspace_id;

  IF v_current_count >= v_max_users THEN
    RAISE EXCEPTION 'Workspace has reached its LinkedIn profile limit';
  END IF;

  INSERT INTO public.billable_users (
    workspace_id,
    profile_name,
    linkedin_url,
    slack_user_id
  )
  VALUES (
    p_workspace_id,
    p_profile_name,
    p_linkedin_url,
    p_slack_user_id
  )
  RETURNING id INTO v_billable_user_id;

  RETURN v_billable_user_id;
END;
$function$;