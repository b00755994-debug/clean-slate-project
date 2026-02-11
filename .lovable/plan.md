
# Polling 3s pendant 1 minute puis arret

## Changement

Modifier `src/hooks/useLinkedInProfiles.ts` pour :

1. Ajouter un `useRef` qui stocke le timestamp du premier profil incomplet detecte
2. Dans `refetchInterval`, si des profils sont incomplets :
   - Si moins d'1 minute s'est ecoulee depuis la premiere detection -> poll toutes les 3s
   - Si plus d'1 minute -> arreter le polling (false)
3. Remettre le timer a zero quand tous les profils deviennent complets (pour que ca remarche si on ajoute un nouveau profil plus tard)

## Detail technique

```typescript
// Nouveau ref pour tracker le debut du polling
const pollingStartRef = useRef<number | null>(null);

// Dans la query :
refetchInterval: (query) => {
  const data = query.state.data;
  const hasIncomplete = data && data.some((p: LinkedInProfile) => !p.profile_name);
  
  if (!hasIncomplete) {
    pollingStartRef.current = null; // Reset pour le prochain ajout
    return false;
  }
  
  // Premier profil incomplet detecte : demarrer le timer
  if (!pollingStartRef.current) {
    pollingStartRef.current = Date.now();
  }
  
  // Polling actif pendant 60s seulement
  const elapsed = Date.now() - pollingStartRef.current;
  if (elapsed < 60_000) return 3_000;
  return false;
},
```

Un seul fichier modifie : `src/hooks/useLinkedInProfiles.ts`.
