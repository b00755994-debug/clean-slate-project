-- Créer la fonction SECURITY DEFINER pour ajouter des billable_users
CREATE OR REPLACE FUNCTION public.add_billable_user(
  p_workspace_id UUID,
  p_profile_name TEXT,
  p_linkedin_url TEXT,
  p_slack_user_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_billable_user_id UUID;
BEGIN
  -- Vérifier que l'utilisateur est membre du workspace
  IF NOT is_workspace_member(auth.uid(), p_workspace_id) THEN
    RAISE EXCEPTION 'User is not a member of this workspace';
  END IF;
  
  -- Insérer le billable_user
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
$$;

-- Accorder les permissions aux utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION public.add_billable_user TO authenticated;

-- Nettoyer le workspace de test vide
DELETE FROM workspace_members WHERE workspace_id = 'f4265f11-7c60-4cb8-8c12-77861384e1f3';
DELETE FROM workspaces WHERE id = 'f4265f11-7c60-4cb8-8c12-77861384e1f3';