-- Add unique constraint on slack_id for upsert operations
ALTER TABLE public.slack_workspace_auth 
ADD CONSTRAINT slack_workspace_auth_slack_id_key UNIQUE (slack_id);