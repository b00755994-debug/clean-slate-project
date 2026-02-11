

# Fix : Decalage du texte selectionne dans le SelectTrigger (tentative definitive)

## Probleme

Les classes Tailwind `[&>span]:pl-0` et `[&_*]:pl-0` ajoutees precedemment ne suffisent pas car Radix Select peut appliquer des **styles inline** (`style="padding-left: ..."`) ou des **margins** sur les elements internes du trigger quand une valeur est selectionnee. Les styles inline ont une specificite CSS superieure aux classes Tailwind standards.

## Solution

Deux modifications dans `src/components/ui/select.tsx` :

1. **SelectTrigger** : Utiliser le modificateur `!important` de Tailwind (`!pl-0`, `!ml-0`) sur tous les descendants pour forcer l'override des styles inline Radix. Ajouter aussi le reset des margins.

2. **Ajouter un style CSS global** en fallback dans `src/index.css` pour cibler specifiquement les spans internes du trigger Radix avec `!important`.

## Detail technique

### Fichier 1 : `src/components/ui/select.tsx` - SelectTrigger (ligne 20)

Remplacer :
```
[&>span]:line-clamp-1 [&>span]:pl-0 [&_*]:pl-0
```

Par :
```
[&>span]:line-clamp-1 [&>span]:!pl-0 [&>span]:!ml-0 [&_*]:!pl-0 [&_*]:!ml-0
```

L'ajout de `!` devant les utilitaires Tailwind genere `!important`, ce qui override les styles inline de Radix. On ajoute aussi `ml-0` pour couvrir le cas ou Radix utilise `margin-left` au lieu de `padding-left`.

### Fichier 2 : `src/index.css` - Ajouter un style global de fallback

Ajouter a la fin du fichier CSS :
```css
/* Force no padding/margin on Radix Select trigger internal spans */
[data-radix-select-trigger] span,
[data-radix-select-trigger] span * {
  padding-left: 0 !important;
  margin-left: 0 !important;
  text-indent: 0 !important;
}
```

Cela cible tous les spans a l'interieur du trigger Radix, quel que soit le niveau d'imbrication, avec `!important` pour overrider les styles inline.

### Resume des fichiers modifies
- `src/components/ui/select.tsx` (1 ligne modifiee)
- `src/index.css` (ajout de 7 lignes)

