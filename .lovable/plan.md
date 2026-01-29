
# Plan: Leaderboard Page

## Overview
Create a new "Leaderboard" page as the 4th item in the dashboard sidebar. This page will display a complete ranking of all team members (billable_users) with their LinkedIn performance metrics in a stylized table format.

## Features
- Full ranking table of all billable_users in the workspace
- Rank 1-2-3 visual distinction (gold/silver/bronze medals)
- Month filter with "All time" option
- Metrics: Posts count, Impressions, Reactions, Engagement rate
- Bilingual support (FR/EN)

## Implementation

### 1. Add Leaderboard Route
**File: `src/App.tsx`**
- Add new protected route `/dashboard/leaderboard`
- Import new `DashboardLeaderboard` page component

### 2. Update Sidebar Navigation
**File: `src/components/dashboard/DashboardSidebar.tsx`**
- Add 4th menu item: Leaderboard
- Use `Trophy` icon from lucide-react
- Route: `/dashboard/leaderboard`

### 3. Create Leaderboard Hook
**File: `src/hooks/useFullLeaderboard.ts` (new)**
- Fetch all billable_users for workspace
- Fetch all posts for workspace
- Calculate per-user metrics:
  - Post count
  - Total impressions
  - Total reactions (likes + comments)
  - Engagement rate: reactions / impressions * 100
- Support month filtering (current month, last 3 months, all time)
- Sort by global score (weighted combination or configurable)

### 4. Create Leaderboard Page
**File: `src/pages/DashboardLeaderboard.tsx` (new)**
- Uses `DashboardLayout` wrapper
- Header with title, subtitle, and month filter dropdown
- Full-width table with leaderboard data

**Table Columns:**
| Column | Description |
|--------|-------------|
| Rank | 1-2-3 with medal colors, then 4+ in neutral |
| Photo | Avatar with initials fallback |
| Name | Full name |
| Title | LinkedIn title |
| Posts | Post count for period |
| Impressions | Formatted with k/M suffix |
| Reactions | Likes + comments |
| Engagement | Percentage with 2 decimals |

### 5. Month Filter Component
**Integrated in page header**
- Options: "Toutes les dates" / "Ce mois" / "3 derniers mois" / "6 derniers mois"
- Uses existing Select component styling

## Visual Design

### Table Styling
- Minimalist design matching existing UI
- Subtle row hover effect
- Rank column with medal coloring:
  - 1st: `bg-amber-500/20 text-amber-600`
  - 2nd: `bg-gray-400/20 text-gray-500`
  - 3rd: `bg-orange-400/20 text-orange-500`
  - 4+: `bg-muted text-muted-foreground`

### Layout
```text
+--------------------------------------------------+
| [Trophy] Leaderboard           [Month Filter v]  |
| Team member ranking by LinkedIn performance      |
+--------------------------------------------------+
| Rank | Photo | Name      | Title  | Posts | ... |
+--------------------------------------------------+
| [1]  | [Av]  | Gaultier  | Tech.. |   5   | ... |
| [2]  | [Av]  | Aurelien  | Busi.. |   2   | ... |
| [3]  | [Av]  | Raphaël   | Ops..  |   1   | ... |
| [4]  | [Av]  | Marie     | Mark.. |   1   | ... |
+--------------------------------------------------+
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/DashboardLeaderboard.tsx` | Create |
| `src/hooks/useFullLeaderboard.ts` | Create |
| `src/components/dashboard/DashboardSidebar.tsx` | Modify |
| `src/App.tsx` | Modify |

## Technical Details

### Hook Logic (`useFullLeaderboard.ts`)
```typescript
interface LeaderboardEntry {
  id: string;
  rank: number;
  profileName: string;
  linkedinTitle: string | null;
  avatarUrl: string | null;
  postCount: number;
  impressions: number;
  reactions: number;
  engagementRate: number; // reactions / impressions * 100
}

// Filter posts by period using linkedin_created_at or created_at
// Aggregate metrics per billable_user
// Sort by impressions (primary) or configurable metric
```

### Engagement Rate Formula
```
Engagement Rate = (reactions / impressions) * 100
```
Where reactions = likes + comments from the posts table.

### Month Filter Options
- `all`: All time (no date filter)
- `month`: Current calendar month
- `3months`: Last 3 months
- `6months`: Last 6 months

### Number Formatting
- Reuse existing `formatNumber` helper for k/M suffixes
- Engagement rate: 2 decimal places with % suffix
