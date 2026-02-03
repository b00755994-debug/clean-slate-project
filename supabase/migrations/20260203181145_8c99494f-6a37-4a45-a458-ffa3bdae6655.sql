-- Étape 1 : Corriger les posts existants avec workspace_id NULL
UPDATE posts p
SET workspace_id = bu.workspace_id
FROM billable_users bu
WHERE p.linkedin_profiles = bu.id
  AND p.workspace_id IS NULL;

-- Étape 2 : Créer la fonction pour auto-remplir workspace_id
CREATE OR REPLACE FUNCTION public.set_post_workspace_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si workspace_id n'est pas fourni, le récupérer depuis billable_users
  IF NEW.workspace_id IS NULL AND NEW.linkedin_profiles IS NOT NULL THEN
    SELECT workspace_id INTO NEW.workspace_id
    FROM billable_users
    WHERE id = NEW.linkedin_profiles;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Étape 3 : Créer le trigger sur INSERT
CREATE TRIGGER trigger_set_post_workspace_id
  BEFORE INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_post_workspace_id();