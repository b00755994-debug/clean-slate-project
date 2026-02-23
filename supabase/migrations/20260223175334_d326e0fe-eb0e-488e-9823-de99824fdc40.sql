-- Change default plan from 'pro' to 'free'
ALTER TABLE public.workspaces ALTER COLUMN plan SET DEFAULT 'free';

-- Change default max_billable_users from 10 to 3
ALTER TABLE public.workspaces ALTER COLUMN max_billable_users SET DEFAULT 3;