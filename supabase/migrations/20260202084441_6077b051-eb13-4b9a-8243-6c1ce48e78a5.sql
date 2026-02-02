-- Fonction SECURITY DEFINER pour créer un workspace et son membre owner
-- Contourne les problèmes de cache PostgREST sur les politiques RLS

CREATE OR REPLACE FUNCTION public.create_workspace_for_user(
  p_workspace_name TEXT,
  p_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_workspace_id UUID;
BEGIN
  -- Vérifier que l'utilisateur est authentifié
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Créer le workspace
  INSERT INTO public.workspaces (workspace_name, is_connected)
  VALUES (p_workspace_name, false)
  RETURNING id INTO v_workspace_id;
  
  -- Créer l'entrée workspace_members pour le propriétaire
  INSERT INTO public.workspace_members (profile_id, workspace_id, role, joined_at)
  VALUES (p_user_id, v_workspace_id, 'owner', NOW());
  
  RETURN v_workspace_id;
END;
$$;

-- Donner accès à la fonction aux utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION public.create_workspace_for_user TO authenticated;