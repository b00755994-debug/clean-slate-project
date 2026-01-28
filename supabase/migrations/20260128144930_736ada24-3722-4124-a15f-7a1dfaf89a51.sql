-- Link orphaned billable_users to their corresponding workspace
UPDATE billable_users bu
SET workspace_id = w.id
FROM workspaces w
WHERE bu.user_id = w.user_id
AND bu.workspace_id IS NULL;