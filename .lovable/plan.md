

## Problem

The analytics page uses its own query keys (`user-profile-ids` and `analytics-all-posts`) that are never invalidated when billable users are added or deleted. The `useLinkedInProfiles` hook invalidates `billable-users`, `billable-users-list`, `posts`, and `all-posts-leaderboard` on transitions and mutations, but not the analytics-specific keys.

## Plan

### File: `src/hooks/useLinkedInProfiles.ts`

Add `user-profile-ids` and `analytics-all-posts` to all three invalidation points:

1. **Transition detection** (line ~112-115): add invalidation for `user-profile-ids` and `analytics-all-posts`
2. **addProfile onSuccess** (line ~180): add invalidation for `user-profile-ids` and `analytics-all-posts`
3. **deleteProfile onSuccess** (line ~198-202): add invalidation for `user-profile-ids` and `analytics-all-posts`

This ensures analytics data refetches automatically whenever a profile is added, deleted, or finishes scraping.

