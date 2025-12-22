-- Add RLS policies for the posts table
-- Users can view posts linked to their LinkedIn profiles
CREATE POLICY "Users can view posts for their profiles"
ON public.posts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.billable_users
    WHERE billable_users.id = posts.linkedin_profiles
    AND billable_users.user_id = auth.uid()
  )
);

-- Admins can view all posts
CREATE POLICY "Admins can view all posts"
ON public.posts FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));