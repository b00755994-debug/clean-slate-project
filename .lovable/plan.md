

## Diagnostic

The edge function logs show the root cause clearly:

```
[CHECK-SUBSCRIPTION] Found customer - {"customerId":"cus_U2ulTnnXvgsVji"}
[CHECK-SUBSCRIPTION] ERROR - {"message":"Invalid time value"}
```

Every single call to `check-subscription` crashes with "Invalid time value" **after** finding the customer but **before** updating the workspace. The crash happens at line 83:

```typescript
subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
```

With the Stripe API version `2025-08-27.basil`, `current_period_end` is likely returned as an ISO string or a different format rather than a Unix timestamp. Multiplying it by 1000 produces an invalid date, which crashes `.toISOString()`.

Because the function throws before reaching the workspace update (lines 89-94), the workspace is never synced to `plan: 'pro'`.

Additionally, the customer `cus_U2ulTnnXvgsVji` now has **2 active subscriptions** (one with quantity 30, one with quantity 10) -- likely from multiple test checkouts. This should be cleaned up in Stripe.

## Plan

### Step 1 -- Fix the date handling in `check-subscription`

**File: `supabase/functions/check-subscription/index.ts`**

Replace line 83 with safe date parsing that handles both Unix timestamps and ISO strings:

```typescript
const endValue = subscription.current_period_end;
if (typeof endValue === 'number') {
  subscriptionEnd = new Date(endValue * 1000).toISOString();
} else if (typeof endValue === 'string') {
  subscriptionEnd = new Date(endValue).toISOString();
} else {
  subscriptionEnd = null;
}
```

This single change fixes the crash and allows the function to proceed to the workspace update logic.

### Step 2 -- Clean up duplicate subscriptions in Stripe

Cancel the older/unwanted subscription (`sub_1T4ozTEPoXPeqIKklERiPC2G`, quantity 10) using the Stripe tool, keeping only the one the user intends (`sub_1T4p2sEPoXPeqIKk7a9prpsJ`, quantity 30).

### No other changes needed

The rest of the flow (checkout redirect, `useSubscription` hook detecting `?checkout=success`, workspace cache invalidation) is already correctly wired. The only blocker was this date parsing crash.

