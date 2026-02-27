

## Audit & Fix: Pricing page Pro CTA logic

### Root cause analysis

The edge function logs reveal the core issue: **every call to `check-subscription` is failing with "Authentication error: Auth session missing!"**. This means `subscribed` is always `false` (the default), so the CTA always shows "Subscribe to Pro" instead of "Manage billing".

The cascade of bugs:

1. **`useSubscription` silently swallows errors**: When `check-subscription` returns a 500 error, react-query catches the exception, `data` stays `undefined`, and `subscribed` defaults to `false`. The user sees no error feedback.

2. **"Subscribe to Pro" click creates a duplicate checkout**: Since `subscribed` is falsely `false`, clicking the CTA calls `handleProCheckout` → `create-checkout`, which tries to create a NEW Stripe checkout session for an already-subscribed customer. This may fail or create a duplicate subscription.

3. **No error state displayed**: The Pricing page has no way to show the user that subscription status couldn't be loaded.

4. **`isSubLoading` only covers initial load**: Once the query errors out, `isLoading` becomes `false` and the error is invisible.

### Why "Auth session missing"

The `check-subscription` edge function uses `supabaseClient.auth.getUser(token)` with the service role key client. The token comes from the `Authorization` header which `supabase.functions.invoke()` passes automatically from the client session. If the session token is expired or missing in the preview iframe context, all calls fail silently.

### Fixes

#### 1. `src/hooks/useSubscription.ts`
- Expose `error` and `isError` from the react-query result so consumers can react to failures
- Add `retry: 2` to give transient auth failures a chance to resolve
- Return `isError` in the hook's return value

#### 2. `src/pages/Pricing.tsx` — Pro CTA section (lines 414-456)
- When `isSubLoading` is true, show a disabled button with spinner (already partially done but the logic is inside the `else` branch)
- When `isError` is true (subscription check failed), treat as "unknown" state: show a "Manage billing" button if the user is logged in (safer than showing "Subscribe" which could create duplicates), or show a retry button
- **Key change**: Restructure the conditional:
  ```
  if (isSubLoading && user) → spinner button
  else if (subscribed) → manage billing / upgrade/downgrade
  else if (user && isError) → "Manage billing" with warning toast on click (safe fallback)
  else → subscribe / sign up
  ```
- This prevents the dangerous case where a subscribed user sees "Subscribe to Pro" and creates a duplicate

#### 3. `src/hooks/useSubscription.ts` — query config
- Add `retry: 2` to handle transient auth issues
- Expose `isError` from the query

### Technical detail

```
// useSubscription.ts changes:
const { data, isLoading, isError, refetch } = useQuery<SubscriptionData>({
  ...existing config,
  retry: 2,
});

return {
  ...existing returns,
  isError,
};

// Pricing.tsx Pro CTA restructure:
{(isSubLoading && user) ? (
  <Button disabled variant="outline" className="w-full mt-4">
    <Loader2 className="animate-spin" /> Loading...
  </Button>
) : subscribed ? (
  // existing manage billing logic
) : (user && isError) ? (
  // Safe fallback: assume they might be subscribed, offer portal
  <Button onClick={handlePortal} variant="outline" className="w-full mt-4">
    Manage billing
  </Button>
) : (
  // existing subscribe/signup logic
)}
```

