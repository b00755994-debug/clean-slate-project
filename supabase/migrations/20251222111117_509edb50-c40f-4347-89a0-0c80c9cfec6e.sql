-- Corriger la liaison workspace ↔ token Slack
UPDATE workspaces 
SET slack_workspace_auth = '91b5415b-584e-4c5d-835b-9b85bce81707' 
WHERE id = '5ddc8487-69b4-4a12-93cf-590edd5be9bc';

-- Nettoyer le slack_user_id manuel
UPDATE billable_users 
SET slack_user_id = NULL 
WHERE id = '36eec4e3-101e-4afa-a9bb-512c1ab5526f';