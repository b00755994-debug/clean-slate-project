

## Keep both CTAs when logged in + Fix Pricing page for Pro subscribers

### 1. `src/components/Hero.tsx` (lines 133-141)
- When logged in, show **both** CTAs instead of just Dashboard:
  - "Go to Dashboard" / "Accéder au Dashboard" → `/dashboard` (hero variant)
  - "Book a demo" / "Réserver une démo" → `/beta` (outline variant)
- Same structure as the logged-out state, just different labels for the primary CTA

### 2. `src/components/CTA.tsx` (lines 65-69)
- When logged in, show **two buttons** side by side:
  - "Go to Dashboard" / "Accéder au Dashboard" → `/dashboard` (hero variant)
  - "Book a demo" / "Réserver une démo" → `/beta` (outline variant)
- Wrap in a flex container like the Hero

### 3. `src/components/Header.tsx`
- When logged in, keep the current layout (LogOut icon + Dashboard button) — no "Book a demo" needed in the header (too crowded)

### 4. `src/pages/Pricing.tsx` (lines 438-442)
- The Pro CTA shows "Subscribe to Pro" for logged-in users even when they already have a Pro subscription, because `subscribed` from `useSubscription` may still be loading or returning false
- Fix: while `isSubLoading` is true, show a loading state on the Pro CTA button
- Also, for logged-in non-subscribed users, the CTA text "Subscribe to Pro" is correct — no change needed there
- The real issue is likely that `subscribed` is `false` during loading. Add `disabled={isSubLoading}` and a spinner to the subscribe button to avoid showing a stale CTA while subscription status loads

