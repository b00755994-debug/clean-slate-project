

## Fix: Add loading state to "Manage billing" button

The delay is inherent to the Stripe API (2 API calls: customer lookup + portal session creation). We can't eliminate it, but we can make it feel responsive.

### `src/pages/Pricing.tsx`
- Add a `isPortalLoading` state
- Wrap `openCustomerPortal` call with loading state management + error handling (toast on error)
- Show `Loader2` spinner and disable the button while loading
- Apply same pattern to the Dashboard's "Manage billing" button

### `src/pages/Dashboard.tsx`
- Same loading state + spinner on the "Manage billing" button there

### `src/hooks/useSubscription.ts`
- No changes needed -- the hook is fine, the UX just needs feedback

