
# Plan: Ajuster le layout 3 colonnes pour éviter la coupure

## Problème identifié
- Les séparateurs avec `mx-4` (16px × 2 = 32px de chaque côté) créent un espacement trop large
- Les colonnes latérales à 280px ne permettent pas assez d'espace pour le contenu des cards

## Modifications

### Fichier: `src/pages/DashboardContent.tsx`

**1. Réduire les marges des séparateurs:**
- Passer de `mx-4` à `mx-2` pour des séparateurs plus fins

**2. Augmenter la largeur des colonnes latérales:**
- Passer de `w-[280px]` à `w-[300px]` pour plus d'espace au contenu

```tsx
{/* Content - Three Column Layout */}
<div className="flex-1 flex gap-0 pt-4 overflow-hidden">
  {/* Left Column - Top Posts */}
  <div className="hidden xl:block w-[300px] flex-shrink-0 overflow-y-auto pr-2">
    ...
  </div>
  
  {/* Left Separator - réduit */}
  <div className="hidden xl:block w-px bg-border mx-2 flex-shrink-0" />
  
  {/* Center Column - Feed */}
  <div className="flex-1 xl:max-w-[552px] mx-auto overflow-y-auto px-2">
    ...
  </div>
  
  {/* Right Separator - réduit */}
  <div className="hidden xl:block w-px bg-border mx-2 flex-shrink-0" />
  
  {/* Right Column - Active Contributors */}
  <div className="hidden xl:block w-[300px] flex-shrink-0 overflow-y-auto pl-2">
    ...
  </div>
</div>
```

---

## Résumé des changements

| Élément | Avant | Après |
|---------|-------|-------|
| Marge séparateurs | `mx-4` (32px total) | `mx-2` (16px total) |
| Largeur colonnes latérales | `280px` | `300px` |

**Gain total:** +40px pour les colonnes latérales, -32px sur les séparateurs = meilleur équilibre
