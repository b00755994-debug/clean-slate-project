

## Change "Manage subscription/billing" buttons to light primary style

Replace `variant="secondary"` with `variant="ghost"` + custom `bg-primary/10 text-primary hover:bg-primary/15` classes on the Manage subscription/billing buttons in both pages.

### Files to edit

**`src/pages/Dashboard.tsx` (~line 438):**
- Change `variant="secondary"` to `variant="ghost"` and add `bg-primary/10 text-primary hover:bg-primary/15` to the className

**`src/pages/Pricing.tsx` (~lines 432, 469):**
- Line 432: Change the non-modified variant from `"secondary"` to `"ghost"` and add `bg-primary/10 text-primary hover:bg-primary/15` to the className
- Line 469: Same change on the error fallback button

