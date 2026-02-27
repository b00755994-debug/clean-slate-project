

## Plan: Simplify Stripe Billing Flows

### Context
The current implementation has most pieces in place (checkout, customer portal, subscription check, workspace sync). The goal is to ensure a coherent, simplified billing experience across the app.

### Changes

#### 1. Pricing page: require authentication for Pro checkout
- In `src/pages/Pricing.tsx`, the "Subscribe to Pro" button already redirects to `/auth?mode=signup` if not logged in. This is correct.
- Add a visual indicator when not logged in: change the Pro CTA to "Sign up to subscribe" instead of "Subscribe to Pro" for unauthenticated users, making it clear they need an account first.

#### 2. Pricing page: "Manage plan" button for subscribers
- Already implemented: subscribers see a "Manage billing" / "Upgrade to X seats" / "Downgrade to X seats" button that opens the Stripe Customer Portal. No changes needed here.

#### 3. Dashboard: "Manage plan" button for Pro users
- Already implemented at line 433-441: Pro plan shows "Manage subscription" button calling `openCustomerPortal`. No changes needed.

#### 4. Dashboard: "Upgrade" button for Free users approaching limit
- Already implemented at line 443-452: Free plan shows "Upgrade to Pro" linking to `/pricing`. 
- Additionally, the LinkedIn profiles section (line 608-613) shows an "Upgrade" badge for non-Pro users. No changes needed.

#### 5. Simplify update-subscription flow via Customer Portal only
- The `update-subscription` edge function currently does direct Stripe API quantity updates. Per the user's intent to simplify, **remove the direct API update path** and rely entirely on the Stripe Customer Portal for all subscription modifications (upgrades, downgrades, cancellations).
- Remove `updateQuantity` from `useSubscription.ts` hook since it's no longer needed.
- In `src/pages/Pricing.tsx`, the subscriber CTA buttons already redirect to Customer Portal. Confirm they don't call `updateQuantity` anywhere (they don't -- they call `openCustomerPortal`).

#### 6. Add Stripe webhook or post-portal sync
- After a user modifies their subscription via Customer Portal, the workspace needs to sync. Currently `check-subscription` handles this on page load.
- Add a `refetch` call to `useSubscription` when the user returns from the Customer Portal (detect via `window.focus` event or by checking URL params).
- In `useSubscription.ts`, add a `window.addEventListener('focus', refetch)` to auto-sync when the user returns from a Stripe tab.

#### 7. Ensure quantity validation on downgrade
- The Customer Portal handles this natively if configured correctly (min quantity = current billable users).
- Optionally, create a Stripe Customer Portal configuration via API to set `subscription_update.products` with quantity constraints. However, this is a Stripe dashboard setting -- already instructed to the user.

### Files to modify

1. **`src/pages/Pricing.tsx`** -- Update unauthenticated CTA text ("Sign up to subscribe")
2. **`src/hooks/useSubscription.ts`** -- Remove `updateQuantity`, add `focus` listener for auto-refetch
3. **`supabase/functions/update-subscription/index.ts`** -- Delete this function (no longer needed, all changes go through Customer Portal)
4. **`supabase/config.toml`** -- Remove `update-subscription` entry

### Technical details

- The `openCustomerPortal` function in `useSubscription.ts` already opens the Stripe Customer Portal in a new tab. When the user returns, the `focus` event will trigger a `refetch` of subscription data, which calls `check-subscription` and syncs the workspace.
- The `check-subscription` edge function already syncs `plan` and `max_billable_users` to the workspace table based on Stripe subscription state. This is the single source of truth.
- No webhook is needed since the sync happens on every `check-subscription` call (page load, focus return, checkout success).

