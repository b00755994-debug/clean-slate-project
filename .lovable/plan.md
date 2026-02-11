
# Fix definitif : Decalage du texte dans le SelectTrigger

## Diagnostic

Les tentatives precedentes (CSS `!important`, global overrides) n'ont pas fonctionne car le probleme n'est pas du CSS mais du **DOM**. Radix `SelectValue` cree une structure DOM differente selon que la valeur est :
- La valeur initiale (definie par `useState`) : rendu comme texte simple
- Une valeur selectionnee par l'utilisateur : rendu via la projection `ItemText` avec des spans imbriques supplementaires

Aucun override CSS ne peut corriger une difference structurelle dans le DOM.

## Solution

Remplacer `SelectValue` par un rendu manuel du texte dans le `SelectTrigger` du filtre "Sort by". Ainsi, le DOM est strictement identique quel que soit le choix selectionne.

## Detail technique

**`src/pages/DashboardContent.tsx`** - lignes 132-141

Avant :
```
<Select value={sortBy} onValueChange={...}>
  <SelectTrigger className="w-[130px] h-8 text-sm bg-card">
    <SelectValue placeholder={t.sortBy} />
  </SelectTrigger>
  ...
</Select>
```

Apres :
```
<Select value={sortBy} onValueChange={...}>
  <SelectTrigger className="w-[130px] h-8 text-sm bg-card">
    <span className="truncate">
      {sortBy === 'recent' ? t.mostRecent : sortBy === 'impressions' ? t.mostViewed : t.mostReactions}
    </span>
  </SelectTrigger>
  ...
</Select>
```

On remplace `<SelectValue>` par un `<span>` classique qui affiche le bon label en fonction de l'etat `sortBy`. Le DOM est maintenant identique pour les 3 options.

L'import de `SelectValue` reste utilise par les autres Select de la page (time period, author filter), donc pas besoin de modifier les imports.

### Fichier modifie
- `src/pages/DashboardContent.tsx` (1 bloc modifie)
