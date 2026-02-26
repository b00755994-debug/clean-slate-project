

## Problem

The leaderboard maintains its own separate query (`billable-users-list`) with its own polling and transition detection, duplicating and potentially conflicting with `useLinkedInProfiles` (which uses `linkedin-profiles` query key). These two parallel caches can get out of sync -- the dashboard profile list updates but the leaderboard's copy stays stale, leaving photo and title stuck in loading.

## Plan

### Replace the duplicate billable-users query with `useLinkedInProfiles` in `useFullLeaderboard.ts`

Instead of maintaining a parallel `billable-users-list` query with its own polling and transition detection, import and use `useLinkedInProfiles()` directly. This ensures both the Dashboard and Leaderboard share the exact same cache, polling logic, and transition detection.

**File: `src/hooks/useFullLeaderboard.ts`**

1. Import `useLinkedInProfiles` and remove `useRef`, `useQueryClient` (no longer needed for transition detection)
2. Replace the entire `billable-users-list` query (lines 97-139) with: `const { linkedinProfiles: billableUsers, isLoading: loadingUsers, hasPendingScraping } = useLinkedInProfiles();`
3. Remove `prevScrapingStatesRef` and all transition detection code (now handled by `useLinkedInProfiles`)
4. Update the posts query's `refetchInterval` to use `hasPendingScraping` instead of manually checking `billableUsers`
5. In the `useMemo` mapping, adapt field access to match `useLinkedInProfiles` data shape (same `billable_users` table, just using `select('*')`)

This eliminates ~50 lines of duplicated polling/transition code and guarantees both views are always in sync.

