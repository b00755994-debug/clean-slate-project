-- Supprimer la politique existante
DROP POLICY IF EXISTS "Authenticated users can create workspaces" ON public.workspaces;

-- La recreer avec une syntaxe explicite qui force le rechargement
CREATE POLICY "Authenticated users can create workspaces" 
ON public.workspaces 
AS PERMISSIVE
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Force schema reload
NOTIFY pgrst, 'reload schema';