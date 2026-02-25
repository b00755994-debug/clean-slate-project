

## Root Cause Analysis

### Problem 1: "Utilisateur inconnu" in Team Feed
The `useTeamFeed` hook builds a `profiles` map from `billable_users`. When a post's `linkedin_profiles` UUID maps to a billable_user whose `profile_name` is still `null` (scraper not finished), `PostCard` line 156 renders "Utilisateur inconnu" and shows a `??` avatar fallback.

The profiles query in `useTeamFeed` does NOT check if scraping is still pending -- it just returns whatever data exists.

### Problem 2: 3rd LinkedIn profile stuck loading
The profile `valentin-orru` (id: `1b222213`) has been stuck at `scrapping_onboarding_done: null` across multiple poll cycles. The `useLinkedInProfiles` hook stops polling after 60 seconds (`elapsed < 60_000`). After that, the profile remains stuck with no name, no picture, no data, and the UI shows no indication of failure or option to retry.

---

## Plan

### Step A -- Show "En attente..." instead of "Utilisateur inconnu" during scraping

**File: `src/components/content/PostCard.tsx`**

When `author` exists but `profile_name` is null, and there's no avatar/picture, show "En attente..." instead of "Utilisateur inconnu". This handles the case where the scraper created the billable_user record and posts, but hasn't populated the profile info yet.

- Line 156: Change fallback from `'Utilisateur inconnu'` to check if author has no name and no picture, then show `'En attente...'` with a subtle animated skeleton style
- Line 143-145: When no avatar available, show a pulsing placeholder instead of static `??`

### Step B -- Extend polling timeout and add retry mechanism

**File: `src/hooks/useLinkedInProfiles.ts`**

- Line 109: Increase polling timeout from `60_000` (60s) to `180_000` (3 minutes) to give the scraper more time
- After polling expires, profiles still stuck in `onboarding` should be flagged as potentially failed

### Step C -- Show retry button for stuck profiles on Dashboard

**File: `src/pages/Dashboard.tsx`**

- For profiles where `scrapping_onboarding_done` is still `null` after polling stops, show a "Retry" or "Le scraping a pris trop de temps" indicator with an option to delete and re-add the profile
- This replaces the current skeleton that just stops updating after 60s

### Step D -- Invalidate team feed profiles after scraping completes

**File: `src/hooks/useLinkedInProfiles.ts`**

When polling detects a profile transitioning from `scrapping_onboarding_done: null/false` to `true`, invalidate the `billable-users` query key used by `useTeamFeed` so the feed immediately picks up the new author names and photos.

- Add `queryClient.invalidateQueries({ queryKey: ['billable-users'] })` when scraping completes
- Also invalidate `['posts']` to ensure new posts from the scraper appear

---

## Technical Details

**PostCard fallback logic (Step A):**
```text
if author exists but profile_name is null:
  → Show "En attente..." with animate-pulse class
  → Show pulsing circle avatar instead of "??"
if no author at all:
  → Keep "Utilisateur inconnu" (this means the post has no linkedin_profiles link)
```

**Polling change (Step B):**
```text
Current:  if (elapsed < 60_000) return 3_000;
Proposed: if (elapsed < 180_000) return 3_000;
```

**Cache invalidation (Step D):**
```text
In refetchInterval callback, track previous scraping states.
When a profile transitions to scrapping_onboarding_done === true,
call queryClient.invalidateQueries for ['billable-users', workspace.id] and ['posts', workspace.id]
```

**File changes summary:**
| File | Change |
|------|--------|
| `src/components/content/PostCard.tsx` | Show "En attente..." + pulsing avatar for null profile_name |
| `src/hooks/useLinkedInProfiles.ts` | Extend polling to 180s, invalidate team feed caches on scrape completion |
| `src/pages/Dashboard.tsx` | Show "scraping timeout" indicator with retry hint for stuck profiles |

