

## Plan: Verify backend supports per-unit quantity changes via Customer Portal

### Analysis

The user chose Option A: keep the Stripe Customer Portal for quantity modifications (increments of 1). Need to verify the backend handles this correctly.

### Current state review

The `check-subscription` Edge Function already:
- Reads `subscription.items.data[0].quantity` from Stripe
- Syncs it directly to `workspaces.max_billable_users`
- This works for ANY quantity value (1, 5, 11, 23, etc.)

The `useSubscription` hook already:
- Returns `quantity` from the check
- Auto-refetches on window focus (after returning from Customer Portal)
- Invalidates workspace cache

The `add_billable_user` DB function already:
- Checks `COUNT(*) >= max_billable_users` before allowing new profiles
- Works with any integer limit

### Conclusion

**No code changes are needed.** The entire backend chain (Stripe → check-subscription → workspaces.max_billable_users → add_billable_user validation) already supports arbitrary quantity values. Whether the user changes from 10 to 11 or 10 to 20 in the Customer Portal, the sync will work correctly.

The only action needed is in the **Stripe Dashboard**: configure the Customer Portal's quantity settings (min/max) as desired. The backend is already quantity-agnostic.

### Optional improvement (minor)

In the Pricing page, the slider currently enforces increments of 10 for new checkouts. If you want new subscriptions to also start at any quantity (not just multiples of 10), the slider step would need to change. But since the user only asked about modification (Customer Portal), this is out of scope.

