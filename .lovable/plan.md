

# Plan : Empecher le popup "Add User" de se fermer lors du changement d'onglet

## Diagnostic

J'ai verifie le code et constate que :

1. Le fix actuel sur le DialogContent (ligne 536) inclut deja :
   - `onPointerDownOutside={(e) => e.preventDefault()}`
   - `onInteractOutside={(e) => e.preventDefault()}`

2. **Le probleme** : Ces deux handlers ne couvrent pas le cas specifique du changement d'onglet du navigateur. Quand vous changez d'onglet, le focus quitte completement le document, ce qui declenche l'evenement `onFocusOutside` de Radix UI.

## Solution

Ajouter le handler `onFocusOutside` au DialogContent pour bloquer egalement cet evenement.

## Fichier a modifier

### `src/pages/Dashboard.tsx`

**Ligne 536 - Ajouter `onFocusOutside`** :

```typescript
// AVANT
<DialogContent 
  onPointerDownOutside={(e) => e.preventDefault()} 
  onInteractOutside={(e) => e.preventDefault()}
>

// APRES
<DialogContent 
  onPointerDownOutside={(e) => e.preventDefault()} 
  onInteractOutside={(e) => e.preventDefault()}
  onFocusOutside={(e) => e.preventDefault()}
>
```

## Explication technique

| Evenement | Quand il se declenche | Couvert avant ? |
|-----------|----------------------|-----------------|
| `onPointerDownOutside` | Clic en dehors du dialog | Oui |
| `onInteractOutside` | Toute interaction en dehors | Oui |
| `onFocusOutside` | Focus quitte le dialog (changement d'onglet) | Non |

L'ajout de `onFocusOutside` avec `preventDefault()` empechera le dialog de se fermer quand :
- L'utilisateur change d'onglet dans le navigateur
- L'utilisateur clique dans la barre d'adresse
- Le focus quitte la page pour n'importe quelle raison

## Comportement apres modification

| Action | Avant | Apres |
|--------|-------|-------|
| Ouvrir le popup, changer d'onglet, revenir | Popup ferme | Popup reste ouvert |
| Ouvrir le popup, clic en dehors | Popup reste ouvert | Popup reste ouvert |
| Ouvrir le popup, appuyer sur Escape | Popup se ferme | Popup se ferme |
| Ouvrir le popup, cliquer sur X ou Annuler | Popup se ferme | Popup se ferme |

## Note additionnelle

J'ai egalement remarque que le dialog de configuration du canal Slack (ligne 441) n'a pas ces protections. Si vous souhaitez le meme comportement pour ce popup, je peux appliquer la meme modification.

