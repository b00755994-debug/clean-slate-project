
# Plan : Corriger la politique RLS pour la création initiale de workspace_members

## Problème racine

Lors de l'onboarding, le code fait :
1. Créer un workspace → OK
2. Créer une entrée workspace_member (owner) → ECHEC RLS

La politique actuelle exige d'être "owner" pour insérer un membre, mais lors de la création initiale, personne n'est encore owner.

## Solution

Ajouter une politique RLS qui permet à un utilisateur de **s'auto-ajouter comme owner** d'un workspace nouvellement créé (qui n'a pas encore de membres).

## Migration SQL à exécuter

```sql
-- Politique permettant à un utilisateur de se créer comme premier membre (owner) d'un workspace vide
CREATE POLICY "Users can create initial workspace membership"
ON workspace_members
FOR INSERT
TO authenticated
WITH CHECK (
  -- L'utilisateur s'ajoute lui-même
  profile_id = auth.uid()
  -- En tant que owner
  AND role = 'owner'
  -- Sur un workspace qui n'a pas encore de membres
  AND NOT EXISTS (
    SELECT 1 FROM workspace_members wm 
    WHERE wm.workspace_id = workspace_members.workspace_id
  )
);
```

## Explication de la politique

| Condition | Raison |
|-----------|--------|
| `profile_id = auth.uid()` | L'utilisateur ne peut s'ajouter que lui-même |
| `role = 'owner'` | Le premier membre doit être owner |
| `NOT EXISTS (...)` | Le workspace ne doit pas avoir de membres existants |

## Fichiers impactés

Aucune modification de code requise - le code actuel (`OnboardingFlow.tsx`) est correct. C'est uniquement la politique RLS qui manque.

## Alternative considérée

On aurait pu utiliser une fonction SQL `SECURITY DEFINER` pour créer le workspace ET le membre en une seule transaction, mais la solution proposée est plus simple et maintient la logique côté client.

## Test de validation

Après la migration :
1. Créer un nouveau compte utilisateur
2. Aller sur /onboarding
3. Remplir l'étape 1 (company, role, etc.)
4. Cliquer sur "Continuer"
5. Vérifier que l'étape 2 s'affiche sans erreur
