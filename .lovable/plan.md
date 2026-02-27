

## 1. Delete `/mockups` page and related components

- Delete `src/pages/Mockups.tsx`
- Delete `src/components/mockups/MockLeaderboard.tsx`
- Delete `src/components/mockups/MockTeamFeed.tsx`
- Delete `src/components/mockups/MockAnalytics.tsx`
- Remove the `/mockups` route and import from `src/App.tsx`

## 2. Replace `/test` page with logo exploration page

Replace `src/pages/TestSlackBadge.tsx` with a new page showing multiple Superpump logo variations in a grid (similar layout to the current badge test page). Each variation card shows the logo at real size + zoomed.

Current logo: gradient square (`bg-gradient-to-br from-primary to-destructive`) + Zap icon + "superpump" text.

Variations to propose:
1. **Current** -- reference (gradient square + Zap)
2. **Rounded full** -- circle instead of rounded-lg
3. **Dark monochrome** -- solid dark bg + white Zap
4. **Outlined** -- transparent bg, gradient border, gradient Zap
5. **Gradient text** -- gradient applied to "superpump" text too
6. **Bolt only** -- no background shape, just a gradient-colored Zap icon
7. **Pill shape** -- horizontal pill with icon + text inside
8. **Soft shadow** -- lighter gradient + prominent shadow glow
9. **Minimal lowercase** -- no icon, just styled text
10. **Stacked** -- icon on top, text below
11. **Neon glow** -- dark bg with neon glow effect on icon
12. **Two-tone** -- split gradient (left primary, right destructive)

Update the import in `App.tsx` from `TestSlackBadge` to the new component name, keep route at `/test`.

