
# Fix Slack Integration for New Multi-User Architecture

## Problem Analysis
The recent database cleanup removed `workspaces.user_id`, but the Slack edge functions still rely on this column to find user workspaces. This causes `database_error` when connecting or using Slack features.

**Affected Edge Functions:**
- `slack-callback` - Line ~127: Uses `workspaces.user_id` for fallback workspace creation
- `slack-members` - Line 59: Uses `.eq('user_id', user.id)` 
- `slack-channels` - Line 51: Uses `.eq('user_id', user.id)`
- `slack-join-channel` - Line 52: Uses `.eq('user_id', user.id)`

## Solution

Update all edge functions to find workspaces via the `workspace_members` junction table instead of the deleted `user_id` column.

### Changes Required

**1. slack-callback/index.ts**
Replace the workspace lookup logic:
```typescript
// OLD (broken)
const { data: existingWorkspace } = await supabase
  .from('workspaces')
  .select('id')
  .eq('user_id', userId)
  .maybeSingle();

// NEW (via junction table)
const { data: membership } = await supabase
  .from('workspace_members')
  .select('workspace_id, workspace:workspaces(id)')
  .eq('profile_id', userId)
  .maybeSingle();

const existingWorkspace = membership?.workspace_id 
  ? { id: membership.workspace_id } 
  : null;
```

Also update the fallback workspace creation to:
1. Create workspace without `user_id`
2. Create `workspace_members` entry with `owner` role

**2. slack-members/index.ts**
Replace workspace query:
```typescript
// OLD
.from('workspaces')
.eq('user_id', user.id)

// NEW
const { data: membership } = await supabase
  .from('workspace_members')
  .select('workspace:workspaces(id, slack_workspace_auth, is_connected, workspace_name)')
  .eq('profile_id', user.id)
  .maybeSingle();

const workspace = membership?.workspace;
```

**3. slack-channels/index.ts**
Same pattern - query via `workspace_members` first.

**4. slack-join-channel/index.ts**
Same pattern - query via `workspace_members` first.

## Technical Details

### New Query Pattern for All Functions
```typescript
// Step 1: Get workspace via membership
const { data: membership, error: membershipError } = await supabase
  .from('workspace_members')
  .select(`
    workspace_id,
    workspace:workspaces (
      id,
      slack_workspace_auth,
      is_connected,
      workspace_name
    )
  `)
  .eq('profile_id', user.id)
  .maybeSingle();

// Step 2: Extract workspace from nested result
const workspace = membership?.workspace;
```

### slack-callback Fallback Creation
When no workspace exists (edge case), create both records:
```typescript
// Create workspace
const { data: newWorkspace } = await supabase
  .from('workspaces')
  .insert({
    workspace_name: teamName || 'My Workspace',
    is_connected: true,
    connected_at: new Date().toISOString(),
  })
  .select('id')
  .single();

// Create owner membership
await supabase
  .from('workspace_members')
  .insert({
    workspace_id: newWorkspace.id,
    profile_id: userId,
    role: 'owner',
    joined_at: new Date().toISOString(),
  });
```

## Files to Modify

| File | Change |
|------|--------|
| `supabase/functions/slack-callback/index.ts` | Update workspace lookup + fallback creation |
| `supabase/functions/slack-members/index.ts` | Update workspace query pattern |
| `supabase/functions/slack-channels/index.ts` | Update workspace query pattern |
| `supabase/functions/slack-join-channel/index.ts` | Update workspace query pattern |

## Testing

After deployment:
1. Test Slack connection from onboarding flow
2. Test Slack connection from dashboard settings
3. Verify channel list loads correctly
4. Verify member list loads correctly
5. Test channel selection and bot invitation
