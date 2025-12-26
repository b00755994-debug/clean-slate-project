-- Create storage bucket for vetted content images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vetted-content-images', 'vetted-content-images', true);

-- Policy: Admins can upload images
CREATE POLICY "Admins can upload vetted content images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'vetted-content-images' AND public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can update images
CREATE POLICY "Admins can update vetted content images" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'vetted-content-images' AND public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can delete images
CREATE POLICY "Admins can delete vetted content images" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'vetted-content-images' AND public.has_role(auth.uid(), 'admin'));

-- Policy: Anyone authenticated can view images
CREATE POLICY "Authenticated users can view vetted content images" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'vetted-content-images');