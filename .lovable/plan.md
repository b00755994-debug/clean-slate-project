

## Plan: Invalidate all caches on profile deletion

### File: `src/hooks/useLinkedInProfiles.ts` (lines 196-199)

Add the missing cache invalidations in `deleteProfileMutation.onSuccess` to match the same pattern used for scraping transitions:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['linkedin-profiles', workspace?.id] });
  queryClient.invalidateQueries({ queryKey: ['billable-users', workspace?.id] });
  queryClient.invalidateQueries({ queryKey: ['billable-users-list', workspace?.id] });
  queryClient.invalidateQueries({ queryKey: ['posts', workspace?.id] });
  queryClient.invalidateQueries({ queryKey: ['all-posts-leaderboard', workspace?.id] });
  toast.success('Le profil LinkedIn a été supprimé');
},
```

This ensures the deleted profile disappears immediately from the Dashboard (profiles table), Team Feed, and Leaderboard.

