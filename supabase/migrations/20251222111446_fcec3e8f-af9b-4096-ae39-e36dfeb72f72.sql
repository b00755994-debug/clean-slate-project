-- Déconnecter le workspace (supprimer la liaison Slack)
UPDATE workspaces 
SET is_connected = false,
    slack_workspace_auth = NULL,
    connected_at = NULL
WHERE id = '5ddc8487-69b4-4a12-93cf-590edd5be9bc';

-- Supprimer le token Slack de test
DELETE FROM slack_workspace_auth 
WHERE id = '91b5415b-584e-4c5d-835b-9b85bce81707';