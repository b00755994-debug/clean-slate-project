
# Loading indicators tied to `scrapping_onboarding_done`

## What the user wants

- The "Followed LinkedIn Profiles" table in Dashboard.tsx: **no change to the skeleton logic** (keep as-is, using `profile_name` and `followers == null` as today)
- The **Team Feed**: when scraping is still in progress for any profile, show skeleton post cards instead of "No posts found"
- The polling in `useLinkedInProfiles`: use `scrapping_onboarding_done` as the authoritative signal (not `!profile_name`)

## Current state

| Area | Current behavior | Problem |
|---|---|---|
| `useLinkedInProfiles` polling | Polls while `!p.profile_name` | Weak heuristic — name might be null after scraping, or populated before done |
| Dashboard table skeletons | Skeletons for `profile_picture` and `profile_name` when `!profile_name`, skeleton for `followers` when `followers == null` | Stays as-is per user request |
| Team Feed empty state | Shows "No posts found" immediately | No way to distinguish "no posts yet" from "scraping in progress" |

## Changes

### 1. `src/hooks/useLinkedInProfiles.ts`

- Add `scrapping_onboarding_done: boolean | null` to the `LinkedInProfile` interface (internal only, not displayed in the table)
- Update polling condition: `!p.scrapping_onboarding_done` instead of `!p.profile_name`
- Export `hasPendingScraping: boolean` — true when at least one profile has `scrapping_onboarding_done` not true

The polling already resets properly (stops after 60s), so only the trigger condition changes.

### 2. `src/components/content/TeamFeed.tsx`

- Add optional prop: `hasPendingScraping?: boolean`
- When `filteredAndSortedPosts.length === 0`:
  - If `hasPendingScraping` is `true`: show 3 skeleton post cards (ghost cards identical to the loading state)
  - If `hasPendingScraping` is `false` or undefined: show "No posts found" as today

This means after scraping completes (`scrapping_onboarding_done = true`), if there are still no posts, the feed shows "No posts found" normally.

### 3. `src/pages/DashboardContent.tsx`

- Import `useLinkedInProfiles` and destructure `hasPendingScraping`
- Pass `hasPendingScraping` as a prop to `<TeamFeed />`

## What does NOT change

- Dashboard.tsx LinkedIn Profiles table skeleton logic — untouched
- Polling timing (3s for first minute, then stops)
- All other components

## Files modified

- `src/hooks/useLinkedInProfiles.ts` — interface + polling condition + `hasPendingScraping` export
- `src/components/content/TeamFeed.tsx` — conditional skeleton vs "no posts" state
- `src/pages/DashboardContent.tsx` — consume and pass `hasPendingScraping` to `<TeamFeed />`
