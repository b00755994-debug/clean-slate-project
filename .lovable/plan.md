

# MockTeamFeed -- Full Team Feed Page Layout

## Goal
Replace the current simple 3-card grid in `MockTeamFeed` with a complete replica of the `DashboardContent` page layout, including the sticky header with filters, the three-column layout (Top Posts | Feed | Active Contributors), and vertical scrolling.

## Changes

### `src/components/mockups/MockTeamFeed.tsx` -- Full rewrite

Replicate the structure of `DashboardContent.tsx` with static mock data:

**Sticky Header:**
- Title "Team Feed" with Newspaper icon
- Subtitle "Explore your team's LinkedIn posts"
- Static filter bar: Sort dropdown (Most recent), Time period (All time), Author filter (All authors), Favorites toggle, Search input -- all non-functional but visually present

**Three-Column Layout (mirrors `DashboardContent`):**
- **Left column (300px, hidden below XL):** `TopPostsLeaderboard` with mock top posts data (3 entries with author name, content excerpt, interactions count)
- **Center column (max-w-552px, scrollable):** 5-6 `PostCard` components stacked vertically with `space-y-2`, more posts to demonstrate scrolling
- **Right column (300px, hidden below XL):** `ActiveContributorsLeaderboard` with mock contributors data (5 entries with name, avatar, post count)
- Vertical separators between columns (`w-px bg-border mx-2`)

**Mock Data to add:**
- `mockTopPosts`: 3 entries matching `TopPost` interface (id, content, url, authorName, authorAvatar, interactions, impressions)
- `mockContributors`: 5 entries matching `ActiveContributor` interface (id, name, avatarUrl, postCount)
- Expand `mockPosts` from 3 to 5-6 posts for better scroll demonstration
- Use imported avatar images from `src/assets/mockup-avatars/`

**Container:** The whole section needs a fixed height (`h-[700px]` or similar) with `overflow-hidden` on the outer div so the internal scrolling works within the mockup page context.

### Technical Details

- Imports: `TopPostsLeaderboard`, `ActiveContributorsLeaderboard`, `PostCard`, filter UI components (Select, Toggle, Input, Button), icons (Newspaper, Bookmark, Search, Calendar, X)
- All filter controls are rendered but non-functional (static state, no onChange handlers needed beyond basic useState for visual consistency)
- The `PostCard` component uses `fr` locale for date formatting -- this is acceptable for the mockup since it's a minor detail
- Avatar imports reused from existing `src/assets/mockup-avatars/`
