

# Replace "New Posts" Badge with Auto-Refresh

## Why the badge doesn't work
The `useNewPostsBadge` hook subscribes to Supabase Realtime `postgres_changes` on the `posts` table. This requires Realtime to be explicitly enabled for that table in the Supabase dashboard. If it's not enabled (which is the most likely case), the subscription silently does nothing — no errors, no events.

## Proposed change: Auto-refresh polling

Instead of relying on Realtime, we add a simple polling interval to the posts query so new posts appear automatically.

### Files to modify

**1. `src/hooks/useTeamFeed.ts`**
- Add `refetchInterval: 30_000` (30 seconds) to the posts query options
- This automatically re-fetches posts every 30s in the background
- Combined with `placeholderData`, the UI stays stable during refresh (no flicker)

**2. `src/hooks/useNewPostsBadge.ts`**
- Delete this file entirely (no longer needed)

**3. `src/components/content/TeamFeed.tsx`**
- Remove the `useNewPostsBadge` import and usage
- Remove the `scrollContainerRef` prop (only used for the badge scroll-to-top)
- Remove the floating "New posts" button JSX
- Remove `ArrowUp` icon import

**4. `src/pages/DashboardContent.tsx`**
- Remove the `feedScrollRef` and its `ref` prop on the scroll container
- Remove the `scrollContainerRef` prop passed to `TeamFeed`

**5. `src/hooks/useNewPostsNotification.ts`**
- Also uses Realtime on `posts` table and likely doesn't work for the same reason
- Replace with a simpler approach or remove (the auto-refresh covers this use case)

## Result
- New posts appear automatically within 30 seconds, no user action needed
- No dependency on Supabase Realtime configuration
- Simpler codebase with fewer moving parts

