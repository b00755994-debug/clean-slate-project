-- Supprimer la politique restrictive existante
DROP POLICY IF EXISTS "Authenticated users can create workspaces" ON workspaces;

-- Recréer en tant que politique PERMISSIVE (par défaut)
CREATE POLICY "Authenticated users can create workspaces"
ON workspaces
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);