

## Reduce toast duration and add dismiss button

The toasts use Sonner. Two changes needed in `src/components/ui/sonner.tsx`:

1. Add `duration={3000}` prop (default is 4000ms, reducing to 3s)
2. Add `closeButton={true}` prop to show a small X button on each toast for manual dismiss

Single file edit, ~2 lines added to the `<Sonner>` component.

