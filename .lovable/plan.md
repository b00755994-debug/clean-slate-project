

## Add logout button in landing page header for logged-in users

### `src/components/Header.tsx`

- Import `LogOut` from lucide-react and `signOut` from `useAuthContext`
- When logged in, show a ghost `LogOut` icon button next to the "Dashboard" button
- On click: call `signOut()` then navigate to `/`

```
// Logged-in state becomes:
<Link to="/dashboard">
  <Button variant="hero">Dashboard</Button>
</Link>
<Button variant="ghost" size="icon" onClick={handleLogout}>
  <LogOut className="h-4 w-4" />
</Button>
```

