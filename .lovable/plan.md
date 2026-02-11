

# Modification de l'interface "Profils LinkedIn suivis"

## 1. Migration base de donnees

Rendre la colonne `profile_name` nullable dans `billable_users` et mettre a jour la fonction RPC :

```sql
ALTER TABLE billable_users ALTER COLUMN profile_name DROP NOT NULL;
```

Mettre a jour la fonction `add_billable_user` pour que `p_profile_name` soit optionnel (default NULL).

## 2. Formulaire d'ajout (src/pages/Dashboard.tsx)

- Supprimer le champ Input "Nom du profil" du Dialog
- Supprimer le state `newProfileName` et sa persistence sessionStorage
- Modifier `handleAddProfile` pour passer `profileName` a une chaine vide ou null
- Adapter la validation : seul le champ URL LinkedIn est requis
- Mettre a jour les traductions FR/EN

## 3. Tableau des profils (src/pages/Dashboard.tsx)

Dans la colonne "Nom", ajouter un `Avatar` (h-6 w-6) a gauche du nom :
- Source image : champ `profile_picture` du profil
- Fallback : initiales du `profile_name` ou icone generique si pas de nom
- Affichage du nom : `profile_name` si disponible, sinon texte grise "En attente..." (le scraper remplira plus tard)

## 4. Hook (src/hooks/useLinkedInProfiles.ts)

- Rendre `profileName` optionnel dans la mutation `addProfile`
- Passer `null` ou `''` a la RPC si non fourni

## Details techniques

### State a supprimer
- `newProfileName` + son `useEffect` sessionStorage
- `sessionStorage.removeItem('add_user_name')` dans `clearAddUserForm`

### Rendu tableau
```text
[Photo 24x24] Jean Dupont        | linkedin.com/in/jean  | ...
[Icone user]  En attente...       | linkedin.com/in/paul  | ...
```

