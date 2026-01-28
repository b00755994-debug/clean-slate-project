
# Plan : Révision des CTAs de la Landing Page

## Objectif

Modifier les boutons d'action sur le Header et le Hero pour diriger les utilisateurs vers les bonnes destinations :
- **"Join the Beta"** → Page d'inscription (nouveaux utilisateurs)
- **"Log in"** → Page de connexion (utilisateurs existants)  
- **"Book a call with us"** → Page Beta avec calendrier

---

## Changements à effectuer

### 1. Header (`src/components/Header.tsx`)

| Bouton | Avant | Après |
|--------|-------|-------|
| "Se connecter" / "Sign in" | `/auth` | `/auth` (inchangé - mode connexion) |
| "Rejoindre la Beta" / "Join the Beta" | `/beta` | `/auth?mode=signup` (mode inscription) |

### 2. Hero (`src/components/Hero.tsx`)

| Bouton | Avant | Après |
|--------|-------|-------|
| "Rejoindre la Beta" / "Join the Beta" | `/beta` | `/auth?mode=signup` (mode inscription) |
| "On en parle ?" / "Book a call with us" | `/beta` | `/beta` (inchangé - calendrier) |

### 3. Page Auth (`src/pages/Auth.tsx`)

Ajouter la lecture du paramètre URL `?mode=signup` pour afficher automatiquement le formulaire d'inscription au lieu de connexion.

---

## Détails techniques

### Modification de Auth.tsx

Ajouter un `useEffect` pour détecter le paramètre `mode` :

```typescript
useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('mode') === 'signup') {
    setIsLogin(false);
  }
}, [location.search]);
```

### Modification de Header.tsx

```tsx
// Avant
<Link to="/beta">
  <Button variant="hero">{t.joinBeta}</Button>
</Link>

// Après
<Link to="/auth?mode=signup">
  <Button variant="hero">{t.joinBeta}</Button>
</Link>
```

### Modification de Hero.tsx

```tsx
// Bouton principal - Avant
<Link to="/beta">

// Bouton principal - Après
<Link to="/auth?mode=signup">

// Bouton secondaire reste inchangé
<Link to="/beta">
```

---

## Fichiers modifiés

| Fichier | Modification |
|---------|--------------|
| `src/pages/Auth.tsx` | Lecture du query param `?mode=signup` pour pré-sélectionner l'inscription |
| `src/components/Header.tsx` | Redirection du bouton "Join the Beta" vers `/auth?mode=signup` |
| `src/components/Hero.tsx` | Redirection du bouton "Join the Beta" vers `/auth?mode=signup` |

---

## Résultat attendu

| Bouton | Destination | Comportement |
|--------|-------------|--------------|
| Header → "Log in" | `/auth` | Affiche le formulaire de connexion |
| Header → "Join the Beta" | `/auth?mode=signup` | Affiche le formulaire d'inscription |
| Hero → "Join the Beta" | `/auth?mode=signup` | Affiche le formulaire d'inscription |
| Hero → "Book a call with us" | `/beta` | Affiche le calendrier Cal.com |
