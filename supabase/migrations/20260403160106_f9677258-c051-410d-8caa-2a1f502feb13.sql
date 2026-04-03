
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for profile pictures"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Service role can manage profile pictures"
ON storage.objects
FOR ALL
USING (bucket_id = 'profile-pictures' AND auth.role() = 'service_role')
WITH CHECK (bucket_id = 'profile-pictures' AND auth.role() = 'service_role');
