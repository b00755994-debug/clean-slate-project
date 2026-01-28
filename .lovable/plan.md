
# Plan : Intégrer le calcul automatique des impressions dans Supabase

## Contexte

- **13 posts** en base, dont **5 sans impressions**
- La formule d'estimation est basée sur les réactions (likes) et commentaires
- Objectif : calculer automatiquement les impressions à chaque insertion/modification de post

## Formule à implémenter

```javascript
const lnImpressions = 3.9657 + 0.9544 * Math.log(reactions + 1) + 0.1617 * Math.log(comments + 1);
const impressions = Math.exp(lnImpressions);
```

En SQL (PostgreSQL) :
```sql
3.9657 + 0.9544 * LN(COALESCE(reactions, 0) + 1) + 0.1617 * LN(COALESCE(comments, 0) + 1)
```

---

## Solution en 2 étapes

### Étape 1 : Créer une fonction et un trigger PostgreSQL

**Fonction `calculate_estimated_impressions`** :
- Calcule les impressions estimées à partir de `reactions` et `comments`
- S'exécute automatiquement sur INSERT et UPDATE de la table `posts`
- Met à jour la colonne `impressions` avec la valeur calculée

```sql
CREATE OR REPLACE FUNCTION public.calculate_estimated_impressions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  reactions_count NUMERIC;
  comments_count NUMERIC;
  ln_impressions NUMERIC;
  estimated_impressions NUMERIC;
BEGIN
  -- Récupérer les valeurs (avec fallback à 0 si NULL)
  reactions_count := COALESCE(NEW.reactions, 0);
  comments_count := COALESCE(NEW.comments, 0);
  
  -- Calculer ln(impressions) avec la formule
  ln_impressions := 3.9657 + 0.9544 * LN(reactions_count + 1) + 0.1617 * LN(comments_count + 1);
  
  -- Calculer impressions estimées (arrondi à 2 décimales)
  estimated_impressions := ROUND(EXP(ln_impressions)::NUMERIC, 2);
  
  -- Mettre à jour la valeur
  NEW.impressions := estimated_impressions;
  
  RETURN NEW;
END;
$$;
```

**Trigger `trigger_calculate_impressions`** :
```sql
CREATE TRIGGER trigger_calculate_impressions
  BEFORE INSERT OR UPDATE OF reactions, comments
  ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_estimated_impressions();
```

### Étape 2 : Mettre à jour les posts existants sans impressions

```sql
UPDATE posts
SET impressions = ROUND(
  EXP(
    3.9657 + 
    0.9544 * LN(COALESCE(reactions, 0) + 1) + 
    0.1617 * LN(COALESCE(comments, 0) + 1)
  )::NUMERIC, 2
)
WHERE impressions IS NULL;
```

---

## Vérification des calculs

| Post ID | Reactions | Comments | Formule | Résultat attendu |
|---------|-----------|----------|---------|------------------|
| 297635bb | 68 | 2 | 3.9657 + 0.9544×ln(69) + 0.1617×ln(3) | ~3584 |
| 1a6df836 | 165 | 57 | 3.9657 + 0.9544×ln(166) + 0.1617×ln(58) | ~13375 |

---

## Résultat attendu

| Élément | Avant | Après |
|---------|-------|-------|
| Posts sans impressions | 5 | 0 |
| Calcul automatique | Manuel | Auto (trigger) |
| Analytics Audience & Reach | Données partielles | Données complètes |

---

## Section technique

### Fichiers modifiés

Aucun fichier frontend à modifier - tout se passe côté Supabase :

| Action | Détail |
|--------|--------|
| Migration SQL | Création de la fonction + trigger |
| Update SQL | Mise à jour des 5 posts existants |

### Comportement du trigger

- **INSERT** : Calcule automatiquement les impressions pour tout nouveau post
- **UPDATE** : Recalcule si `reactions` ou `comments` changent
- **Sécurité** : Utilise `SECURITY DEFINER` pour s'exécuter avec les droits nécessaires

### Notes importantes

1. La colonne `impressions` existante est de type `numeric`, compatible avec notre formule
2. Le trigger utilise `BEFORE INSERT OR UPDATE OF reactions, comments` pour ne se déclencher que lorsque ces colonnes changent
3. `COALESCE` gère les valeurs NULL pour éviter les erreurs de calcul
