
# Plan : Persistance de l'état d'onboarding et du popup

## Problème 1 : Onboarding revient au step 1

### Cause
L'état `currentStep` est uniquement en mémoire React (useState). Quand l'utilisateur change d'onglet :
- Le navigateur peut "geler" la page
- Les hooks React Query peuvent re-fetch et provoquer un re-render
- Le composant peut être re-monté, réinitialisant `currentStep` à 1

### Solution
Persister `currentStep` et `workspaceId` dans `sessionStorage` pour survivre aux changements d'onglets.

### Fichier à modifier : `src/components/onboarding/OnboardingFlow.tsx`

**Changements :**

1. Initialiser `currentStep` depuis sessionStorage :
```typescript
const [currentStep, setCurrentStep] = useState(() => {
  const saved = sessionStorage.getItem('onboarding_step');
  return saved ? parseInt(saved, 10) : 1;
});
```

2. Synchroniser avec sessionStorage à chaque changement :
```typescript
useEffect(() => {
  sessionStorage.setItem('onboarding_step', currentStep.toString());
}, [currentStep]);
```

3. Persister aussi `workspaceId` :
```typescript
const [workspaceId, setWorkspaceId] = useState<string | null>(() => {
  return workspace?.id ?? sessionStorage.getItem('onboarding_workspace_id');
});

useEffect(() => {
  if (workspaceId) {
    sessionStorage.setItem('onboarding_workspace_id', workspaceId);
  }
}, [workspaceId]);
```

4. Nettoyer sessionStorage à la fin de l'onboarding :
```typescript
const completeOnboarding = async () => {
  // ... code existant ...
  sessionStorage.removeItem('onboarding_step');
  sessionStorage.removeItem('onboarding_workspace_id');
  window.location.replace('/dashboard');
};
```

---

## Problème 2 : Le popup se ferme au changement d'onglet

### Cause
Le Dialog de Radix UI utilise un `FocusScope` qui peut déclencher la fermeture quand le focus quitte complètement la page (changement d'onglet).

### Solution
Ajouter `onPointerDownOutside` et `onInteractOutside` avec `preventDefault()` sur le DialogContent pour empêcher la fermeture automatique lors des interactions externes.

### Fichier à modifier : `src/pages/Dashboard.tsx`

**Changement sur le DialogContent (ligne ~536) :**

```typescript
<DialogContent 
  onPointerDownOutside={(e) => e.preventDefault()}
  onInteractOutside={(e) => e.preventDefault()}
>
```

Ces props empêchent le Dialog de se fermer quand :
- L'utilisateur clique en dehors (utile pour copy-paste depuis un autre onglet)
- Le focus quitte la page (changement d'onglet)

L'utilisateur peut toujours fermer le popup en :
- Cliquant sur le bouton X
- Cliquant sur "Annuler"
- Appuyant sur Escape

---

## Récapitulatif des fichiers

| Fichier | Action |
|---------|--------|
| `src/components/onboarding/OnboardingFlow.tsx` | Persister currentStep et workspaceId dans sessionStorage |
| `src/pages/Dashboard.tsx` | Empêcher fermeture automatique du Dialog |

## Comportement après modification

| Scénario | Avant | Après |
|----------|-------|-------|
| Onboarding step 2, change d'onglet, revient | Revient au step 1 | Reste au step 2 |
| Onboarding step 3, refresh page | Revient au step 1 | Reste au step 3 (dans la même session) |
| Popup ouvert, change d'onglet pour copier URL | Popup se ferme | Popup reste ouvert |
| Popup ouvert, clic sur Escape | Popup se ferme | Popup se ferme (comportement normal) |

## Section technique

### sessionStorage vs localStorage
- `sessionStorage` : données supprimées à la fermeture de l'onglet (idéal pour l'onboarding temporaire)
- `localStorage` : données persistantes (non souhaité ici car on veut recommencer si l'utilisateur ferme et rouvre)

### Props Radix Dialog
- `onPointerDownOutside` : déclenché lors d'un clic en dehors du dialog
- `onInteractOutside` : déclenché lors de toute interaction en dehors (focus, click, etc.)
- `e.preventDefault()` : empêche le comportement par défaut (fermeture)
