-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Authenticated users can create workspaces" ON public.workspaces;

-- Create as PERMISSIVE (this is the default, but being explicit)
CREATE POLICY "Authenticated users can create workspaces" 
ON public.workspaces 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Force schema reload
NOTIFY pgrst, 'reload schema';