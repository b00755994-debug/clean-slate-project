-- Drop the restrictive DELETE policy and recreate it as PERMISSIVE
DROP POLICY IF EXISTS "Workspace members can delete linkedin profiles" ON public.billable_users;

CREATE POLICY "Workspace members can delete linkedin profiles"
ON public.billable_users
FOR DELETE
TO authenticated
USING (is_workspace_member(auth.uid(), workspace_id));