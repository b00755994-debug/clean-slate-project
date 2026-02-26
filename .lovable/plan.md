

## Problem Analysis

When a LinkedIn profile finishes scraping, the `useLinkedInProfiles` hook invalidates only 2 of 4 relevant query keys:

| Query Key | Hook | Invalidated on scrape done? |
|---|---|---|
| `billable-users` | useTeamFeed | Yes |
| `posts` | useTeamFeed | Yes |
| `billable-users-list` | useFullLeaderboard | **No** |
| `all-posts-leaderboard` | useFullLeaderboard | **No** |

This causes the feed to update while the leaderboard still shows stale data (or vice versa depending on timing).

Additionally, the TeamFeed renders posts with `content === null` — these are empty posts that should be filtered out.

## Plan

### 1. Centralize cache invalidation in `useLinkedInProfiles.ts`

In the `refetchInterval` callback (around line 93), where `anyTransitioned` is detected, add the two missing invalidation calls:

```typescript
if (anyTransitioned && workspace?.id) {
  queryClient.invalidateQueries({ queryKey: ['billable-users', workspace.id] });
  queryClient.invalidateQueries({ queryKey: ['billable-users-list', workspace.id] });
  queryClient.invalidateQueries({ queryKey: ['posts', workspace.id] });
  queryClient.invalidateQueries({ queryKey: ['all-posts-leaderboard', workspace.id] });
}
```

### 2. Filter out empty posts in `useTeamFeed.ts`

In the posts query (around line 67), add a filter to exclude posts with null/empty content:

```typescript
return (data as Post[]).filter(post => post.content && post.content.trim().length > 0);
```

### 3. Filter out empty posts in `TeamFeed.tsx` (defense in depth)

In the `filteredAndSortedPosts` useMemo, add a content filter as the first filter to ensure no empty posts slip through:

```typescript
.filter(post => post.content && post.content.trim().length > 0)
```

### Technical Detail

The root cause is that React Query caches are isolated by key. The leaderboard page uses separate query keys (`billable-users-list`, `all-posts-leaderboard`) to avoid format conflicts with the team feed cache (object map vs array). Both sets of keys must be invalidated when scraping completes to keep all views in sync.

