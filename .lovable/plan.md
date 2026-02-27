

## Change "Manage subscription/billing" buttons to secondary variant

Replace `variant="outline"` with `variant="secondary"` on the Manage subscription/billing buttons in both pages. This removes the thick blue border and gives a subtle grey background instead.

### Files to edit

**`src/pages/Dashboard.tsx` (line 438):**
- Change `variant="outline"` to `variant="secondary"` on the Manage subscription button

**`src/pages/Pricing.tsx` (lines 432, 469):**
- Line 432: Change the `variant` logic — when showing "Manage billing" (no quantity change), use `variant="secondary"` instead of `"outline"`
- Line 469: Change `variant="outline"` to `variant="secondary"` on the error fallback Manage billing button

