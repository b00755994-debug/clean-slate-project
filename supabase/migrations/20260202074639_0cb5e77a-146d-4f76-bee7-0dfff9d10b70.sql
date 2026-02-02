-- Politique permettant à un utilisateur de se créer comme premier membre (owner) d'un workspace vide
CREATE POLICY "Users can create initial workspace membership"
ON workspace_members
FOR INSERT
TO authenticated
WITH CHECK (
  -- L'utilisateur s'ajoute lui-même
  profile_id = auth.uid()
  -- En tant que owner
  AND role = 'owner'
  -- Sur un workspace qui n'a pas encore de membres
  AND NOT EXISTS (
    SELECT 1 FROM workspace_members wm 
    WHERE wm.workspace_id = workspace_members.workspace_id
  )
);