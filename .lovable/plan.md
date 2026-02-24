

# Features Section -- Tabbed Mockups Integration

## Goal
Replace the current 4-card grid in the Features section with a tabbed interface. Each tab shows the feature name, description, and its corresponding interactive mockup preview. The existing SlackIntegration section will be merged into this tabbed view as the first tab.

## Current Structure
- **Features.tsx**: 4 feature cards (Slack Alerts, Team Feed, Analytics, Leaderboard) in a grid
- **SlackIntegration.tsx**: Separate section below Features with a full Slack mockup
- **Index.tsx**: `<Features />` then `<SlackIntegration />` as two distinct sections

## New Structure

### Page layout change (`Index.tsx`)
- Remove `<SlackIntegration />` as a standalone section -- it moves into the Features tabs
- Keep `<Features />` which becomes the unified tabbed section

### Features.tsx -- Full rewrite

**Section header**: Keep the existing title ("Everything you need to turn content into pipeline.") and subtitle unchanged.

**Tabbed interface** (using existing `Tabs` component from shadcn):
- 4 horizontal tabs, each showing: icon + feature name
- Tab content area: feature description text + full mockup preview below

**Tab 1 -- Slack Alerts**:
- Description text from current feature card
- Embed the SlackIntegration mockup (the Slack channel simulator with tabs: posts, analytics, leaderboard, share, DM)
- Extract/refactor the Slack mockup rendering from `SlackIntegration.tsx` into a reusable component, or import `SlackIntegration` content directly

**Tab 2 -- Team Feed**:
- Description text from current feature card
- Embed `MockTeamFeed` component (the full 3-column layout already built)

**Tab 3 -- Analytics**:
- Description text from current feature card
- Embed `MockAnalytics` component (tabbed analytics with Overview, Team Activation, Audience & Reach)

**Tab 4 -- Leaderboard**:
- Description text from current feature card
- Embed `MockLeaderboard` component (the ranking table)

### Bilingual support
- All tab labels, descriptions remain bilingual (FR/EN) using the existing `useLanguage` hook
- Mockup components themselves are now in English (from previous changes), which is acceptable

## Technical Details

### Files to modify:

1. **`src/pages/Index.tsx`**: Remove `<SlackIntegration />` import and usage

2. **`src/components/Features.tsx`**: Major rewrite
   - Import `Tabs, TabsList, TabsTrigger, TabsContent` from shadcn
   - Import `MockTeamFeed`, `MockAnalytics`, `MockLeaderboard`
   - Import or inline the Slack mockup content from `SlackIntegration.tsx`
   - Structure: section header, then `<Tabs>` with 4 tabs
   - Each `TabsContent` contains: description paragraph + mockup component
   - Tab triggers styled to match the landing page aesthetic (icon + label, primary color when active)
   - Container for mockups: `max-w-7xl mx-auto` with appropriate height constraints

3. **`src/components/SlackIntegration.tsx`**: Extract the inner Slack mockup (the card with channel tabs and messages) into a separate exportable component, or reference it from Features. The outer section wrapper (title, subtitle, badges) will be removed since Features now provides that context.

### Layout considerations
- Mockup containers will have a fixed max-height with overflow handling to keep the page manageable
- The `MockTeamFeed` already has `h-[700px]` with internal scrolling -- works as-is
- `MockAnalytics` and `MockLeaderboard` may need similar height constraints
- On mobile, tabs could stack or use a horizontal scroll

