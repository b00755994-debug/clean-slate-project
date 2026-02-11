
-- Make profile_name nullable
ALTER TABLE billable_users ALTER COLUMN profile_name DROP NOT NULL;

-- Update RPC to make p_profile_name optional (default NULL)
CREATE OR REPLACE FUNCTION public.add_billable_user(p_workspace_id uuid, p_profile_name text DEFAULT NULL, p_linkedin_url text DEFAULT NULL, p_slack_user_id text DEFAULT NULL)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_billable_user_id UUID;
BEGIN
  IF NOT is_workspace_member(auth.uid(), p_workspace_id) THEN
    RAISE EXCEPTION 'User is not a member of this workspace';
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
