-- Add onboarding tracking and user info columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_role text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS acquisition_channel text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_size text;