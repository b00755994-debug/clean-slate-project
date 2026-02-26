

## Problem

The `useLinkedInProfiles` hook (which polls and detects scraping transitions) only runs on the `/dashboard` page. When the user is on the leaderboard page, no polling happens, so the leaderboard never detects that scraping finished and keeps showing "Utilisateur inconnu" until a manual reload.

The dashboard's "Followed LinkedIn Profiles" table works because it directly uses `useLinkedInProfiles` which polls every 3s and shows loading states for pending profiles.

## Plan

### 1. Add `scrapping_onboarding_done` to leaderboard query (`src/hooks/useFullLeaderboard.ts`)

In the `billable-users-list` query (line 100), add `scrapping_onboarding_done` to the select. Add `refetchInterval` that polls every 3s while any profile has `scrapping_onboarding_done !== true`, mirroring the dashboard behavior. Add `placeholderData` to prevent flickering.

### 2. Show scraping state in leaderboard entries (`src/hooks/useFullLeaderboard.ts`)

Add `isScraping: boolean` to `LeaderboardEntry`. Set it based on `scrapping_onboarding_done`. Use "En attente..." instead of "Utilisateur inconnu" when scraping is pending.

### 3. Show loading UI in leaderboard table (`src/pages/DashboardLeaderboard.tsx`)

For entries where `isScraping === true`, show a pulsing avatar and "En attente..." text (same pattern as the dashboard profiles table), so the user sees consistent loading feedback across both views.

### 4. Add cache stability settings (`src/hooks/useFullLeaderboard.ts`)

Add `staleTime`, `gcTime`, and `placeholderData` to both queries to match the team feed's stability pattern and prevent UI flashes during background refetches.

