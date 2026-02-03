

# Plan : Corriger les workspace_id manquants sur les posts

## Diagnostic

**Situation actuelle :**
- **61 posts** au total dans la base
- **47 posts** ont deja un `workspace_id`
- **14 posts** n'ont pas de `workspace_id` (NULL)

**Posts concernes :**
- 13 posts de **Lancelot Brun**
- 1 post de **Raphael Charpenet**
- Tous lies au workspace `2c5d31dd-7724-497d-b1a5-b422f21a0098`

**Cause :** Les posts ont ete importes/crees sans remplir la colonne `workspace_id`, alors que les hooks frontend filtrent par `.eq('workspace_id', workspace.id)`.

## Solution

### Etape 1 : Corriger les posts existants

Migration SQL pour mettre a jour les 14 posts avec le `workspace_id` de leur `billable_user` :

```sql
UPDATE posts p
SET workspace_id = bu.workspace_id
FROM billable_users bu
WHERE p.linkedin_profiles = bu.id
  AND p.workspace_id IS NULL;
```

### Etape 2 : Prevenir le probleme pour les futurs posts

Creer un trigger qui remplit automatiquement `workspace_id` lors de l'insertion d'un post :

```sql
CREATE OR REPLACE FUNCTION public.set_post_workspace_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si workspace_id n'est pas fourni, le recuperer depuis billable_users
  IF NEW.workspace_id IS NULL AND NEW.linkedin_profiles IS NOT NULL THEN
    SELECT workspace_id INTO NEW.workspace_id
    FROM billable_users
    WHERE id = NEW.linkedin_profiles;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_post_workspace_id
  BEFORE INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_post_workspace_id();
```

## Resume des changements

| Type | Description |
|------|-------------|
| Migration SQL | Mise a jour des 14 posts existants |
| Fonction | `set_post_workspace_id()` pour auto-remplir workspace_id |
| Trigger | `trigger_set_post_workspace_id` sur INSERT |

## Resultat attendu

Apres cette migration :
1. Les 14 posts manquants apparaitront dans le feed, analytics et leaderboard
2. Les futurs posts auront automatiquement le bon `workspace_id`
3. Aucune modification du code frontend necessaire

