-- Add slack_user_id column to linkedin_profiles for future Slack user association
ALTER TABLE public.linkedin_profiles 
ADD COLUMN slack_user_id TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.linkedin_profiles.slack_user_id IS 'Slack user ID to tag in notifications when this LinkedIn profile posts';