

## Plan: Adapt landing page for logged-in users

### Current gaps

- **Header**: Always shows "Sign in" + "Try for free" regardless of auth state. No access to `useAuthContext`.
- **Hero**: Primary CTA always links to `/auth?mode=signup`. No auth awareness.
- **CTA section**: "Book a demo" always links to `/beta`. No auth awareness.
- **Pricing**: Already partially handles auth state (Free plan CTA adapts, Pro CTA adapts). No changes needed.

### Changes

#### 1. `src/components/Header.tsx`
- Import `useAuthContext`
- When **logged in**: replace "Sign in" + "Try for free" buttons with a single "Dashboard" button linking to `/dashboard`
- When **logged out**: keep current behavior (Sign in + Try for free)

#### 2. `src/components/Hero.tsx`
- Import `useAuthContext`
- When **logged in**: primary CTA text becomes "Go to Dashboard" / "Accéder au Dashboard", links to `/dashboard`. Hide "Book a demo" secondary CTA.
- When **logged out**: keep current behavior

#### 3. `src/components/CTA.tsx`
- Import `useAuthContext`
- When **logged in**: button text becomes "Go to Dashboard" / "Accéder au Dashboard", links to `/dashboard`
- When **logged out**: keep current "Book a demo" linking to `/beta`

#### 4. Pricing page
- No changes needed — already auth-aware

