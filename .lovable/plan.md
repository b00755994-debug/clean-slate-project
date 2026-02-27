

## Create a `/test` page with multiple Slack badge "Select" design variations

### Current badge
The current badge at line 834 of `Dashboard.tsx` is a dashed outline `Badge` with a small Slack logo and "Select" text.

### Plan

**1. Create `src/pages/TestSlackBadge.tsx`**
A showcase page with 10-12 different badge/button design variations for the Slack "Select" action, organized in a grid. Each variation will be labeled and displayed at actual size + enlarged. Variations to include:

- **Current**: dashed outline badge (for reference)
- **Solid Slack purple**: bg-[#4A154B] text-white with Slack logo
- **Ghost button**: subtle ghost button with Slack icon
- **Pill with icon only**: just the Slack logo in a small rounded pill, no text
- **Gradient border**: gradient border from purple to pink
- **Slack colored chip**: light purple bg (#F4EDE4 Slack beige) with dark text
- **Dotted circle + icon**: circular badge with just the Slack logo and a "+" overlay
- **Underline link style**: simple text link "Link Slack" with logo inline
- **Outlined with arrow**: outline badge with a small chevron-down
- **Floating action style**: small round button with shadow and Slack logo
- **Tag style**: colored tag with rounded-sm corners
- **Minimal plus**: just a "+" icon in muted style that reveals Slack on hover

**2. Add route in `App.tsx`**
Add `<Route path="/test" element={<TestSlackBadge />} />` before the catch-all.

