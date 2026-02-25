

## Plan: Both Upgrade and Downgrade redirect to Stripe Portal

### Change

In `src/pages/Pricing.tsx`, simplify the subscribed CTA: regardless of whether the user increases or decreases seats, the button opens the Stripe Customer Portal. Remove the `updateQuantity` call entirely from this page.

### File: `src/pages/Pricing.tsx` (lines ~413-440)

Replace the current conditional logic with:

```tsx
{subscribed ? (
  <div className="mt-4">
    <Button
      onClick={openCustomerPortal}
      variant={proUsers[0] !== currentQuantity ? "default" : "outline"}
      className={`w-full font-semibold gap-2 ${
        currentQuantity && proUsers[0] !== currentQuantity
          ? proUsers[0] > currentQuantity
            ? 'bg-success hover:bg-success/90 text-white'
            : 'bg-destructive hover:bg-destructive/90 text-white'
          : ''
      }`}
    >
      {currentQuantity && proUsers[0] !== currentQuantity ? (
        <>
          {proUsers[0] > currentQuantity ? 'Upgrade' : 'Downgrade'} to {proUsers[0]} seats
        </>
      ) : (
        <>
          <Crown className="h-4 w-4" />
          Manage billing
        </>
      )}
    </Button>
  </div>
) : (
  <Button onClick={handleProCheckout} disabled={isCheckoutLoading} variant="hero" className="w-full mt-4">
    {isCheckoutLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
    Subscribe to Pro
  </Button>
)}
```

All three states (upgrade, downgrade, no change) call `openCustomerPortal`. The visual styling (green/red/outline) remains as a hint, but the actual seat modification happens in Stripe's portal.

The `isUpdateLoading` state and the `updateQuantity` import can be cleaned up since they're no longer used on this page.

