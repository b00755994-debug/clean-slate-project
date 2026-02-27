

## Add "Add more users" badge for Pro users at limit

### Change

In `src/pages/Dashboard.tsx`, at line 622-628, after the `{usedBillableUsers}/{maxBillableUsers}` counter in the LinkedIn Profiles section header, add a condition: when the user is on the Pro plan AND `isAtLimit`, show an "Add more users" badge with the same design as the existing "Upgrade" badge (Crown icon, `bg-primary/10`, small text). Clicking it opens the Stripe Customer Portal via `openCustomerPortal()`.

### Implementation

- Keep the existing free plan "Upgrade" badge as-is
- Add a new condition: `slackWorkspace?.plan === 'pro' && isAtLimit` to show an "Add more users" link-style badge
- Same styling: `inline-flex items-center gap-1 text-xs font-medium text-primary/80 hover:text-primary bg-primary/10 hover:bg-primary/15 px-2 py-0.5 rounded-md transition-colors`
- Uses `Crown` icon (w-3 h-3), same as the Upgrade badge
- On click: calls `openCustomerPortal()` instead of navigating to `/pricing`
- Translations: "Ajouter des utilisateurs" (fr) / "Add more users" (en)

