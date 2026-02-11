

# Fix : Padding sur les items selectionnes dans le Select

## Probleme

Radix Select applique un style interne aux items ayant `data-state="checked"` (l'item actuellement selectionne dans le dropdown). Meme apres la suppression du checkmark indicator, le composant Radix peut ajouter du padding supplementaire sur l'item selectionne, ce qui explique pourquoi "Most viewed" et "Most reactions" ont un decalage quand ils sont selectionnes, mais pas "Most recent" (qui est la valeur par defaut avant toute selection).

## Solution

Dans `src/components/ui/select.tsx`, ajouter un reset explicite du padding pour l'etat checked sur le `SelectItem` :

```text
"data-[state=checked]:pl-2"
```

Cela force `pl-2` sur l'item selectionne, garantissant un alignement identique pour tous les items, qu'ils soient selectionnes ou non.

## Detail technique

**`src/components/ui/select.tsx`** - ligne 108

Avant :
```text
"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-primary/10 focus:text-foreground hover:bg-primary/10"
```

Apres :
```text
"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none data-[state=checked]:pl-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-primary/10 focus:text-foreground hover:bg-primary/10"
```

Un seul fichier, une seule ligne modifiee.

