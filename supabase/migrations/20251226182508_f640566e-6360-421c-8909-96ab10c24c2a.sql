-- Create vetted_content table for validated company content
CREATE TABLE public.vetted_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  category text DEFAULT 'general',
  created_by uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on vetted_content
ALTER TABLE public.vetted_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vetted_content
-- Users can view vetted content from their workspace
CREATE POLICY "Users can view vetted content from their workspace"
ON public.vetted_content
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = vetted_content.workspace_id
    AND w.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin')
);

-- Admins can insert vetted content
CREATE POLICY "Admins can insert vetted content"
ON public.vetted_content
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update vetted content
CREATE POLICY "Admins can update vetted content"
ON public.vetted_content
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete vetted content
CREATE POLICY "Admins can delete vetted content"
ON public.vetted_content
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at on vetted_content
CREATE TRIGGER update_vetted_content_updated_at
BEFORE UPDATE ON public.vetted_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create bookmarks table for both posts and vetted content
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  vetted_content_id uuid REFERENCES public.vetted_content(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  -- Constraint: exactly one must be filled
  CONSTRAINT bookmarks_single_reference CHECK (
    (post_id IS NOT NULL AND vetted_content_id IS NULL) OR
    (post_id IS NULL AND vetted_content_id IS NOT NULL)
  )
);

-- Create unique partial indexes to prevent duplicates
CREATE UNIQUE INDEX bookmarks_unique_post ON public.bookmarks (user_id, post_id) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX bookmarks_unique_vetted ON public.bookmarks (user_id, vetted_content_id) WHERE vetted_content_id IS NOT NULL;

-- Enable RLS on bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON public.bookmarks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
ON public.bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
ON public.bookmarks
FOR DELETE
USING (auth.uid() = user_id);