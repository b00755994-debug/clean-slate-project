
# Plan : Diagnostiquer et corriger l'erreur persistante de création de workspace

## Diagnostic effectue

### Verification des politiques RLS
Les politiques RLS ont ete correctement mises a jour :
- `workspaces` : politique INSERT maintenant PERMISSIVE (confirmee par requete directe)
- `workspace_members` : politique pour auto-ajout initial ajoutee

### Analyse des logs d'erreur
Les dernieres erreurs dans les logs Postgres datent de **07:50:05 UTC**, soit **apres** la migration de 07:48:52. Cependant, ces erreurs peuvent correspondre a des tentatives faites AVANT que le navigateur ne rafraichisse.

### Utilisateur de test
- `r.charpenet@free.fr` : compte cree a 07:40, confirme a 07:40:52
- Cet utilisateur n'a **aucun workspace_member** associe
- L'onboarding n'est pas complete (`onboarding_completed: false`)

## Probleme identifie

Le probleme pourrait etre cause par l'un des scenarios suivants :

1. **Cache du navigateur** : L'application cote client utilise une version cached du code
2. **Test sur l'app publiee** : L'utilisateur teste peut-etre sur `superpump-v2.lovable.app` qui n'a pas les dernieres mises a jour
3. **Session perimee** : Le token JWT peut ne pas etre correctement transmis

## Solution proposee

### Etape 1 : Verification immediate (sans code)
L'utilisateur doit :
1. Fermer completement le navigateur
2. Vider le cache ou utiliser une fenetre de navigation privee
3. Aller sur la preview Lovable (pas l'app publiee)
4. Se connecter avec un nouveau compte ou le compte de test
5. Essayer l'onboarding

### Etape 2 : Si le probleme persiste

Ajouter des logs detailles dans le code pour identifier exactement ou l'erreur se produit.

#### Modification de OnboardingFlow.tsx

Remplacer la fonction `ensureWorkspace` pour ajouter des logs de debug :

```typescript
const ensureWorkspace = async (companyName?: string): Promise<string | null> => {
  if (!user) {
    console.error('[Onboarding] No user found');
    return null;
  }

  console.log('[Onboarding] User authenticated:', user.id, user.email);

  // If we already have a workspace, use it
  if (workspaceId) {
    console.log('[Onboarding] Using existing workspaceId:', workspaceId);
    return workspaceId;
  }

  // Check if user already has a workspace
  if (workspace?.id) {
    console.log('[Onboarding] Using workspace from hook:', workspace.id);
    setWorkspaceId(workspace.id);
    return workspace.id;
  }

  // Create a new workspace
  const workspaceName = companyName?.trim() || `${user.email}'s Workspace`;
  console.log('[Onboarding] Creating new workspace:', workspaceName);
  
  const { data: newWorkspace, error } = await supabase
    .from('workspaces')
    .insert({
      workspace_name: workspaceName,
      is_connected: false,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[Onboarding] Error creating workspace:', error);
    console.error('[Onboarding] Error code:', error.code);
    console.error('[Onboarding] Error message:', error.message);
    console.error('[Onboarding] Error details:', error.details);
    toast.error(language === 'fr' ? 'Erreur lors de la creation du workspace' : 'Error creating workspace');
    return null;
  }

  console.log('[Onboarding] Workspace created successfully:', newWorkspace.id);

  // Create workspace_member entry
  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({
      profile_id: user.id,
      workspace_id: newWorkspace.id,
      role: 'owner',
      joined_at: new Date().toISOString(),
    });

  if (memberError) {
    console.error('[Onboarding] Error creating membership:', memberError);
  } else {
    console.log('[Onboarding] Membership created successfully');
  }

  setWorkspaceId(newWorkspace.id);
  return newWorkspace.id;
};
```

## Verification technique

### Politiques actuelles (verifiees)

| Table | Policy | Type | Statut |
|-------|--------|------|--------|
| workspaces | Authenticated users can create workspaces | INSERT | PERMISSIVE |
| workspace_members | Users can create initial workspace membership | INSERT | PERMISSIVE |

### Tests recommandes

1. **Test avec nouveau compte** :
   - Creer un compte avec email valide
   - Confirmer l'email
   - Acceder a /onboarding
   - Remplir l'etape 1 et cliquer "Continuer"

2. **Verifier les logs console** :
   - Ouvrir les DevTools (F12)
   - Onglet Console
   - Chercher les messages `[Onboarding]`

## Fichiers a modifier

1. `src/components/onboarding/OnboardingFlow.tsx` : Ajouter les logs de debug

## Prochaines etapes

1. Implementer les logs de debug
2. Demander a l'utilisateur de re-tester en navigation privee
3. Analyser les logs console pour identifier la cause exacte
4. Si necessaire, verifier que le token JWT est correctement passe a Supabase
