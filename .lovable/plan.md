
# Suppression des posts lors de la suppression d'un profil LinkedIn

## Etat actuel

La base de donnees a deja une contrainte `ON DELETE CASCADE` sur `posts.linkedin_profiles -> billable_users.id`. Quand un billable user est supprime, **ses posts sont automatiquement supprimes de la base**.

Le seul probleme : le cache React Query du team feed (`['posts', workspace?.id]`) n'est pas invalide apres la suppression, donc les posts supprimes restent visibles dans l'interface jusqu'au prochain rechargement.

## Changement

**src/hooks/useLinkedInProfiles.ts** - une seule ligne a ajouter dans le `onSuccess` de `deleteProfileMutation` (ligne 149-151) :

Ajouter l'invalidation du cache des posts pour que le team feed se mette a jour immediatement :

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['linkedin-profiles', workspace?.id] });
  queryClient.invalidateQueries({ queryKey: ['posts', workspace?.id] });
  toast.success('Le profil LinkedIn a été supprimé');
},
```

C'est tout. La cascade en base fait le travail cote donnees, et cette invalidation fait le travail cote interface.
