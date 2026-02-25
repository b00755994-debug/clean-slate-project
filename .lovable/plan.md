

## Plan: Merge Pro plan CTA buttons into a single dynamic button

### Current state (lines 412-450)
When subscribed, there are 2 buttons:
1. "Upgrade/Downgrade to X seats" (appears only when quantity changed)
2. "Manage billing" (always visible, opens Stripe portal)

Plus a text line showing current seats when unchanged.

### Target behavior
A single button that:
- **No change** (slider == currentQuantity): "Manage billing" with Crown icon, outline style → opens Stripe portal
- **Upgrade** (slider > currentQuantity): "Upgrade to X seats" in green (`bg-success hover:bg-success/90`) → calls `updateQuantity`
- **Downgrade** (slider < currentQuantity): "Downgrade to X seats" in red (`bg-destructive hover:bg-destructive/90`) → calls `updateQuantity`

### Changes

**File: `src/pages/Pricing.tsx`** (lines 412-450)

Replace the entire `{subscribed ? (...) : (...)}` CTA block with a single button logic:

```tsx
{subscribed ? (
  <div className="mt-4">
    {currentQuantity && proUsers[0] !== currentQuantity ? (
      <Button
        onClick={async () => {
          setIsUpdateLoading(true);
          try {
            await updateQuantity(proUsers[0]);
            toast.success(`Subscription updated to ${proUsers[0]} seats`);
          } catch (err: any) {
            toast.error(err.message || "Failed to update subscription");
          } finally {
            setIsUpdateLoading(false);
          }
        }}
        disabled={isUpdateLoading}
        className={`w-full font-semibold ${
          proUsers[0] > currentQuantity
            ? 'bg-success hover:bg-success/90 text-white'
            : 'bg-destructive hover:bg-destructive/90 text-white'
        }`}
      >
        {isUpdateLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {proUsers[0] > currentQuantity ? 'Upgrade' : 'Downgrade'} to {proUsers[0]} seats
      </Button>
    ) : (
      <Button onClick={openCustomerPortal} variant="outline" className="w-full font-semibold gap-2">
        <Crown className="h-4 w-4" />
        Manage billing
      </Button>
    )}
  </div>
) : (
  <Button onClick={handleProCheckout} disabled={isCheckoutLoading} variant="hero" className="w-full mt-4">
    {isCheckoutLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
    Subscribe to Pro
  </Button>
)}
```

The "current plan: X seats" text is removed since the slider already shows the current value (initialized via `useEffect`). The button dynamically switches between portal access and quantity update based on slider position.

