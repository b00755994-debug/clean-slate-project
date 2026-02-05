

# Plan : Persister l'état du popup "Add User" lors du changement d'onglet

## Diagnostic du problème

Le problème n'est pas lié aux événements Radix UI (`onFocusOutside`, etc.). Dans l'environnement de preview Lovable (qui est un iframe), quand vous changez d'onglet du navigateur :

1. Le navigateur peut "geler" l'iframe
2. Au retour, React peut re-rendre le composant
3. L'état `isDialogOpen` (initialisé à `false`) est réinitialisé
4. Le popup disparaît

Les handlers `preventDefault()` ne peuvent pas empêcher ce comportement car ce n'est pas une fermeture intentionnelle du Dialog - c'est une réinitialisation de l'état React.

## Solution

Persister `isDialogOpen` et les données du formulaire dans `sessionStorage`, comme nous l'avons fait pour l'onboarding.

## Fichier à modifier : `src/pages/Dashboard.tsx`

### Changements

**1. Persister l'état d'ouverture du popup :**

```typescript
// AVANT (ligne 204)
const [isDialogOpen, setIsDialogOpen] = useState(false);

// APRES
const [isDialogOpen, setIsDialogOpen] = useState(() => {
  return sessionStorage.getItem('add_user_dialog_open') === 'true';
});

// Ajouter un useEffect pour synchroniser
useEffect(() => {
  sessionStorage.setItem('add_user_dialog_open', isDialogOpen.toString());
}, [isDialogOpen]);
```

**2. Persister les données du formulaire :**

```typescript
// AVANT (lignes 201-203)
const [newProfileName, setNewProfileName] = useState('');
const [newProfileUrl, setNewProfileUrl] = useState('');
const [selectedSlackUserId, setSelectedSlackUserId] = useState<string>('');

// APRES
const [newProfileName, setNewProfileName] = useState(() => {
  return sessionStorage.getItem('add_user_name') || '';
});
const [newProfileUrl, setNewProfileUrl] = useState(() => {
  return sessionStorage.getItem('add_user_url') || '';
});
const [selectedSlackUserId, setSelectedSlackUserId] = useState<string>(() => {
  return sessionStorage.getItem('add_user_slack_id') || '';
});

// Ajouter des useEffects pour synchroniser
useEffect(() => {
  sessionStorage.setItem('add_user_name', newProfileName);
}, [newProfileName]);

useEffect(() => {
  sessionStorage.setItem('add_user_url', newProfileUrl);
}, [newProfileUrl]);

useEffect(() => {
  sessionStorage.setItem('add_user_slack_id', selectedSlackUserId);
}, [selectedSlackUserId]);
```

**3. Nettoyer le sessionStorage après ajout réussi ou annulation :**

```typescript
// Dans la fonction handleAddProfile, après le succès :
const clearAddUserForm = () => {
  sessionStorage.removeItem('add_user_dialog_open');
  sessionStorage.removeItem('add_user_name');
  sessionStorage.removeItem('add_user_url');
  sessionStorage.removeItem('add_user_slack_id');
};

// Appeler clearAddUserForm() après :
// - Ajout réussi d'un profil
// - Clic sur "Annuler"
```

## Comportement après modification

| Action | Avant | Après |
|--------|-------|-------|
| Ouvrir popup, taper "Jean", changer d'onglet, revenir | Popup fermé, données perdues | Popup ouvert, "Jean" toujours visible |
| Ouvrir popup, coller URL LinkedIn depuis autre onglet | Popup fermé au changement | Popup ouvert, URL préservée |
| Fermer manuellement le popup | Popup fermé | Popup fermé + données effacées |
| Ajouter un profil avec succès | Données effacées | Données effacées |

## Section technique

### Pourquoi les handlers `preventDefault()` ne suffisent pas

Les handlers Radix UI (`onFocusOutside`, `onInteractOutside`, `onPointerDownOutside`) interceptent les **événements utilisateur** qui tenteraient de fermer le dialog. Mais dans l'environnement iframe de Lovable :

- Le changement d'onglet peut provoquer un **re-render** du composant React
- C'est le cycle de vie React qui réinitialise l'état, pas un événement de fermeture
- La seule solution est de persister l'état en dehors de React (sessionStorage)

### Clés sessionStorage utilisées

| Clé | Valeur |
|-----|--------|
| `add_user_dialog_open` | "true" ou "false" |
| `add_user_name` | Nom du profil |
| `add_user_url` | URL LinkedIn |
| `add_user_slack_id` | ID du membre Slack sélectionné |

