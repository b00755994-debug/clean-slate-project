

## Match Dashboard badge to Test page "Outline + Arrow" proportions

The Dashboard badge has extra classes (`hover:bg-muted/50`, `text-muted-foreground`) not present in the test page version. Align them exactly.

### Change in `src/pages/Dashboard.tsx` (line 834)

Replace the current Badge className with the exact same classes from the test page variant:

```tsx
<Badge variant="outline" className="cursor-pointer py-1 pl-1.5 pr-1.5 text-xs gap-1 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
```

This removes `hover:bg-muted/50` and `text-muted-foreground` that were added in the dashboard but absent from the test page version.

