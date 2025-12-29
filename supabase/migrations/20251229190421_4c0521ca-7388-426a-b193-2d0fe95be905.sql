-- Add RLS policies for posts_activity table
-- Users can view activity for posts they own
CREATE POLICY "Users can view activity for their posts"
ON public.posts_activity FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.posts p
    JOIN public.billable_users bu ON p.linkedin_profiles = bu.id
    WHERE p.id = posts_activity.post_id
    AND bu.user_id = auth.uid()
  )
);

-- Admins can view all activity
CREATE POLICY "Admins can view all activity"
ON public.posts_activity FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert activity records (for data import/sync)
CREATE POLICY "Admins can insert activity"
ON public.posts_activity FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update activity records
CREATE POLICY "Admins can update activity"
ON public.posts_activity FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can delete activity records
CREATE POLICY "Admins can delete activity"
ON public.posts_activity FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));