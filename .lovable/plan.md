

## Problem

The `useFullLeaderboard` hook polls `billable-users-list` every 3s while scraping is pending, but the `all-posts-leaderboard` posts query has no polling at all. So profile info may update but post metrics stay stale. There's also no transition detection to cross-invalidate caches when scraping finishes.

Meanwhile, `useLinkedInProfiles` has full transition detection logic that invalidates all caches when a profile flips from scraping to done -- but this hook only runs on the Dashboard page.

## Plan

### 1. Add transition detection and cross-invalidation to `useFullLeaderboard.ts`

Add a `useRef` to track previous scraping states (same pattern as `useLinkedInProfiles`). In the `billable-users-list` `refetchInterval` callback, detect when any profile transitions from `scrapping_onboarding_done !== true` to `true`, and invalidate all four query keys plus `linkedin-profiles`.

### 2. Add polling to the posts query in `useFullLeaderboard.ts`

Add `refetchInterval` to the `all-posts-leaderboard` query that polls every 3s while any billable user has `scrapping_onboarding_done !== true`. This ensures posts data refreshes alongside profile data.

### 3. Files to edit

- `src/hooks/useFullLeaderboard.ts` -- add `useRef`, `useQueryClient`, transition detection in billable users refetchInterval, and polling on posts query.

No changes needed to `DashboardLeaderboard.tsx` (UI already handles `isScraping`).

