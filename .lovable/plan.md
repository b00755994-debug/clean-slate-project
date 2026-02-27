

## Set Stripe Portal minimum quantity = max(10, tracked profiles)

The Stripe Customer Portal supports `minimum_quantity` per product in its configuration. We'll compute this dynamically when opening the portal.

### Changes to `supabase/functions/customer-portal/index.ts`

Before creating the portal session, add logic to:

1. Look up the user's workspace via `workspace_members`
2. Count `billable_users` for that workspace
3. Compute `minimumQty = Math.max(10, count)`
4. Create a portal configuration with `features.subscription_update.products` set for both Pro products (monthly + annual) with `minimum_quantity: minimumQty`
5. Pass that configuration ID to `stripe.billingPortal.sessions.create({ configuration: configId, ... })`

```typescript
// After finding customerId, before creating portalSession:

// 1. Get workspace
const { data: membership } = await supabaseClient
  .from('workspace_members')
  .select('workspace_id')
  .eq('profile_id', user.id)
  .maybeSingle();

// 2. Count tracked profiles
let profileCount = 0;
if (membership?.workspace_id) {
  const { count } = await supabaseClient
    .from('billable_users')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', membership.workspace_id);
  profileCount = count ?? 0;
}

const minimumQty = Math.max(10, profileCount);

// 3. Create portal config with minimum
const portalConfig = await stripe.billingPortal.configurations.create({
  business_profile: { headline: 'Manage your SuperPump subscription' },
  features: {
    subscription_update: {
      enabled: true,
      default_allowed_updates: ['quantity'],
      products: [
        { product: 'prod_U2u5D1O58TUiGO', prices: ['price_1T4oGzEPoXPeqIKkP1JHmhVr'] },
        { product: 'prod_U2u5R33sL7CeRe', prices: ['price_1T4oHOEPoXPeqIKkFdPcMylA'] },
      ],
    },
    subscription_cancel: { enabled: true },
    payment_method_update: { enabled: true },
    invoice_history: { enabled: true },
  },
});

// 4. Use it when creating the session
const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  configuration: portalConfig.id,
  return_url: `${origin}/pricing`,
});
```

### Limitation

The Stripe `billingPortal.configurations.create` API supports `minimum_quantity` and `maximum_quantity` on products. If these fields aren't available via the current Stripe SDK version, we may need to check the exact API shape. The portal will natively show an error message like "Minimum quantity is 10" if the user tries to go below.

### No other files change

The `customer-portal` edge function is the only file modified. The frontend already calls `openCustomerPortal()` which invokes this function.

