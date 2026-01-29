

# Plan: Ajuster l'espacement des colonnes du tableau

## Objectif

1. Rapprocher la colonne Title du nom/prénom (réduire l'espace à gauche du titre)
2. Augmenter légèrement l'espacement des colonnes de droite (trouver un juste milieu)

## Modifications

**Fichier**: `src/pages/DashboardLeaderboard.tsx`

### 1. Colonne Title - Rapprocher du nom

Ajouter `pl-0` ou `pl-1` pour réduire le padding gauche de la colonne Title.

### 2. Colonnes de droite - Juste milieu pour l'espacement

Passer de `px-2` à `px-3` pour un espacement plus confortable sans revenir au padding par défaut.

| Colonne | Actuel | Nouveau |
|---------|--------|---------|
| Title | (défaut) | `pl-1` |
| Posts | `w-16 px-2` | `w-16 px-3` |
| Impressions | `w-20 px-2` | `w-20 px-3` |
| Reactions | `w-20 px-2` | `w-20 px-3` |
| Engagement | `w-20 px-2` | `w-20 px-3` |
| Rank | `w-12 px-2` | `w-14 px-3` |
| Evolution | `w-14 px-2` | `w-16 px-3` |

### 3. Résumé visuel

```text
+-----------+------------------------+-------+--------+--------+------+------+------+
| MEMBER    | TITLE (moins d'espace) | POSTS | IMPR.  | REACT. | ENG. | RANK | EVOL |
|           | <-- rapproché          |  <-- espacement légèrement augmenté -->      |
+-----------+------------------------+-------+--------+--------+------+------+------+
```

## Lignes à modifier

- **Ligne 145**: Ajouter `pl-1` au header Title
- **Lignes 146-151**: Changer `px-2` en `px-3` pour les headers de droite
- **Ligne 200**: Ajouter `pl-1` à la cellule Title
- **Lignes 203-214**: Changer `px-2` en `px-3` pour les cellules de droite

