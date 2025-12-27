-- Add RLS policies for the history table

-- Policy: Users can view history for posts they own (through billable_users)
CREATE POLICY "Users can view history for their posts"
ON public.history FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.posts p
    JOIN public.billable_users bu ON p.linkedin_profiles = bu.id
    WHERE p.id = history.post_id
    AND bu.user_id = auth.uid()
  )
);

-- Policy: Admins can view all history
CREATE POLICY "Admins can view all history"
ON public.history FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Policy: Admins can insert history records
CREATE POLICY "Admins can insert history"
ON public.history FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Policy: Admins can update history records
CREATE POLICY "Admins can update history"
ON public.history FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Policy: Admins can delete history records
CREATE POLICY "Admins can delete history"
ON public.history FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));