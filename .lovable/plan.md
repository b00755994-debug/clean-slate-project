

## Problem

The leaderboard determines loading state via `scrapping_onboarding_done !== true` (line 157 of `useFullLeaderboard.ts`). The Dashboard instead checks `profile_name` directly -- if it exists, it shows it. When `scrapping_onboarding_done` remains `null` or `false` in the database even though profile data (name, photo) is already populated, the leaderboard stays stuck showing "En attente..." with a pulsing avatar while the Dashboard displays the profile correctly.

## Plan

### File: `src/hooks/useFullLeaderboard.ts` (line 157)

Change the `isScraping` logic to match what the Dashboard does: consider a profile as "scraping" only if it has no `profile_name` AND `scrapping_onboarding_done` is not true. This way, as soon as the name is available, the leaderboard shows it regardless of the scraping flag.

```typescript
// Before:
const isScraping = user.scrapping_onboarding_done !== true;

// After:
const isScraping = !user.profile_name && user.scrapping_onboarding_done !== true;
```

This single-line change aligns the leaderboard's loading behavior with the Dashboard's, so profiles appear as soon as their data is available.

