

## Audit post-Stripe integration

After reviewing the full codebase, here are the gaps and inconsistencies that need to be addressed now that Stripe is integrated.

---

### Issues identified

**1. No subscription sync after checkout (Critical)**
The `create-checkout` function redirects to `/dashboard?checkout=success`, but nothing on the frontend handles this parameter. The `check-subscription` edge function exists but is never called from the frontend. After a successful Stripe checkout, the workspace `plan` and `max_billable_users` remain unchanged in the database.

**2. "Manage subscription" button is still a dead "Coming soon" placeholder (Critical)**
In `Dashboard.tsx` (lines 431-437), the subscription management card shows a disabled "Coming soon" badge instead of invoking the `customer-portal` edge function. The function is deployed and ready, but no UI calls it.

**3. Dashboard plan display reads from workspace table, which is never updated by Stripe (Critical)**
`useWorkspace` reads `plan` and `max_billable_users` from the `workspaces` table. These default to `free` / `3`. There is no mechanism to update them after a Stripe payment succeeds. The `check-subscription` function returns the subscription status but doesn't write back to the database.

**4. Admin page reads plan from `profiles.plan` (stale legacy field)**
`Admin.tsx` line 93 reads `profile.plan` which defaults to `'pro'` and is never updated. This should read from the workspace table or from Stripe subscription status.

**5. Pricing page shows "Get started" for Pro even when user is already subscribed**
No check is performed to see if the user already has an active subscription. A subscribed user could accidentally create a second checkout session.

**6. Testimonial price mismatch**
The pricing page testimonial (line 514-516) says "At €3 per user" but the actual Pro price is €4/user/month.

---

### Plan

**Step A — Create a `useSubscription` hook**
- On mount (and after `checkout=success` detected), call `check-subscription` edge function.
- Returns `{ subscribed, productId, quantity, subscriptionEnd, isLoading, refetch }`.
- Handles the `checkout=success` query param: calls `check-subscription`, then cleans the URL.

**Step B — Update `check-subscription` to sync workspace**
- After verifying the subscription with Stripe, the edge function should also update the `workspaces` table:
  - `plan` → `'pro'` (or `'free'` if no active sub)
  - `max_billable_users` → subscription `quantity`
- This uses the service role key (already available) to write to the workspace.
- Lookup: user → `workspace_members` → `workspace_id`, then update that workspace.

**Step C — Wire "Manage subscription" button in Dashboard**
- Replace the "Coming soon" placeholder with a real button that calls `customer-portal` and opens the returned URL.
- Only show if the workspace plan is `pro` (i.e., user has an active subscription).
- For `free` plan users, show an "Upgrade to Pro" link to `/pricing` instead.

**Step D — Call `check-subscription` on auth state change**
- In `AuthContext`, after `fetchUserData`, also call `check-subscription` to keep the workspace plan in sync.
- Alternatively, call it from the `useSubscription` hook on page load with a reasonable stale time (e.g., 5 minutes via React Query).

**Step E — Pricing page: show current plan state**
- If user is subscribed to Pro, show "Your Plan" badge on the Pro card and change CTA to "Manage subscription" (calls `customer-portal`).
- Disable/prevent double checkout.

**Step F — Fix Admin page plan display**
- Read plan from `workspaces` table (already fetched via the batch membership query) instead of `profiles.plan`.

**Step G — Fix testimonial price**
- Change "€3 per user" to "€4 per user" in the pricing page testimonial.

---

### Technical details

**`check-subscription` edge function update (Step B)**
```text
After confirming subscription status from Stripe:
1. Query workspace_members WHERE profile_id = user.id → get workspace_id
2. If subscribed:
   UPDATE workspaces SET plan = 'pro', max_billable_users = quantity WHERE id = workspace_id
3. If not subscribed:
   UPDATE workspaces SET plan = 'free', max_billable_users = 3 WHERE id = workspace_id
```

**`useSubscription` hook (Step A)**
```text
- React Query key: ['subscription', user?.id]
- staleTime: 5 minutes
- Called on mount + when checkout=success detected
- Invalidates ['workspace', user?.id] after sync to refresh dashboard data
```

**Dashboard plan card logic (Step C)**
```text
if workspace.plan === 'pro':
  → Show "Manage subscription" button → calls customer-portal → window.open(url)
else:
  → Show "Upgrade to Pro" link → navigates to /pricing
```

**File changes summary:**
| File | Change |
|------|--------|
| `supabase/functions/check-subscription/index.ts` | Add workspace sync logic |
| `src/hooks/useSubscription.ts` | New hook |
| `src/pages/Dashboard.tsx` | Wire manage subscription button, handle checkout=success |
| `src/pages/Pricing.tsx` | Show current plan, prevent double checkout, fix testimonial |
| `src/pages/Admin.tsx` | Read plan from workspace instead of profiles |
| `src/contexts/AuthContext.tsx` | Minor: trigger subscription check after login |

