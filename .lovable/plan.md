

# Ameliorations de l'onboarding

## 1. Persistence de l'etat lors du changement d'onglet

**Probleme** : Le composant `OnboardingFlow` persiste deja `currentStep` et `workspaceId` dans `sessionStorage`, mais les donnees saisies dans chaque step (formulaire Step 1, URLs LinkedIn Step 2) sont stockees uniquement en state React local. Quand on change d'onglet dans Lovable (ou un remount du composant), tout est perdu.

**Solution** :
- **OnboardingStep1** : Persister `formData` dans `sessionStorage` (cle `onboarding_step1_data`). Initialiser le state depuis le storage. Nettoyer a la completion de l'onboarding.
- **OnboardingStepLinkedIn** (Step 2) : Persister la liste des URLs saisies dans `sessionStorage` (cle `onboarding_step2_profiles`). Initialiser depuis le storage.
- **OnboardingFlow** : Persister aussi `step1Data` dans sessionStorage pour qu'il survive aux remounts. Nettoyer toutes les cles a la fin.

## 2. Refonte de la Step 2 (profils LinkedIn) - UI du dashboard

**Probleme actuel** : La step 2 demande prenom + nom + URL. Le dashboard ne demande que l'URL et affiche photo/nom/followers avec des skeletons pendant le scraping.

**Solution** : Reecrire `OnboardingStepLinkedIn` pour :
- **Input unique** : Un seul champ URL LinkedIn par ligne (plus de prenom/nom)
- **Insertion immediate** : Des qu'une URL valide est saisie et confirmee, elle est inseree en DB via `add_billable_user` (nom = null, scraper prend le relais)
- **Affichage table** : Reproduire le format du dashboard principal sous forme de table compacte avec les colonnes :
  - Photo (skeleton si absente) + Nom (skeleton si absent)
  - URL LinkedIn (lien cliquable)
  - Followers (skeleton si absent)
  - Bouton supprimer
  - Pas de colonne Slack Users (comme demande)
- **Polling** : Utiliser le hook `useLinkedInProfiles` existant qui poll deja toutes les 3s pendant 1 minute pour detecter les mises a jour du scraper
- **Interface du Flow** : `onComplete` ne prend plus de profiles en parametre (ils sont deja en DB), juste passe a l'etape suivante

## 3. Boutons retour dans les steps

**Solution** :
- **OnboardingStepper** : Pas de changement (reste des dots)
- **OnboardingStep1** : Pas de bouton retour (c'est la premiere etape)
- **OnboardingStepLinkedIn** : Ajouter un bouton "Retour" qui appelle `onBack`
- **OnboardingStepSlack** : Ajouter un bouton "Retour" qui appelle `onBack`
- **OnboardingFlow** : Ajouter des handlers `onBack` qui font `setCurrentStep(currentStep - 1)`

---

## Detail technique

### Fichiers modifies

**`src/components/onboarding/OnboardingStep1.tsx`**
- Initialiser `formData` depuis `sessionStorage.getItem('onboarding_step1_data')`
- Ajouter un `useEffect` qui persiste `formData` dans sessionStorage a chaque changement

**`src/components/onboarding/OnboardingStepLinkedIn.tsx`** (rewrite majeur)
- Supprimer les champs firstName/lastName
- Un seul input URL + bouton "Ajouter"
- Appel direct a `add_billable_user` via le hook `useLinkedInProfiles`
- Afficher les profils deja ajoutes dans une table identique au dashboard :
  - Avatar (skeleton) | Nom (skeleton) | URL | Followers (skeleton) | Delete
- Accepter les nouveaux props : `workspaceId`, `onBack`
- Persister les URLs saisies (non encore ajoutees) dans sessionStorage

**`src/components/onboarding/OnboardingStepSlack.tsx`**
- Ajouter prop `onBack` et un bouton "Retour" a cote du bouton Skip

**`src/components/onboarding/OnboardingFlow.tsx`**
- Persister `step1Data` dans sessionStorage
- Passer `workspaceId` a la Step 2
- Ajouter handlers `handleBack` pour steps 2 et 3
- Adapter `handleStep2Complete` : ne prend plus de profiles, juste avance
- Nettoyer toutes les cles sessionStorage supplementaires a la completion
