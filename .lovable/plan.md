

# Plan : Suppression complete de l'utilisateur r.charpenet@free.fr

## Donnees a supprimer

L'utilisateur a les enregistrements suivants restants :

1. **user_roles** : 1 entree (id: `0a35e60e-9bde-44b6-9923-e2b3c02ea5c4`)
2. **profiles** : 1 entree (id: `e0aba8b5-2b55-4320-bcec-af0aa62136fa`)

Les autres tables (workspace_members, bookmarks, workspaces) sont deja vides pour cet utilisateur.

## Ordre de suppression

L'ordre est important a cause des contraintes de cle etrangere :

1. Supprimer d'abord `user_roles` (reference `profiles.id`)
2. Supprimer ensuite `profiles`

Note : L'utilisateur dans `auth.users` ne peut pas etre supprime via SQL - cela doit etre fait manuellement dans le Dashboard Supabase > Authentication > Users.

## Migration SQL

```sql
-- Supprimer le role de l'utilisateur
DELETE FROM public.user_roles 
WHERE user_id = 'e0aba8b5-2b55-4320-bcec-af0aa62136fa';

-- Supprimer le profil
DELETE FROM public.profiles 
WHERE id = 'e0aba8b5-2b55-4320-bcec-af0aa62136fa';
```

## Action manuelle requise

Apres la migration, tu devras supprimer l'utilisateur du systeme d'authentification Supabase :
1. Aller sur le Dashboard Supabase > Authentication > Users
2. Trouver `r.charpenet@free.fr`
3. Cliquer sur les 3 points > Delete user

