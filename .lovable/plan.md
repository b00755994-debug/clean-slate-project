

# Fix : Alignement des items dans le Select "Sort by"

## Probleme

Le composant `SelectItem` dans `src/components/ui/select.tsx` applique un `pl-8` (padding-left de 2rem) a tous les items pour laisser de la place au check mark du cote gauche. L'item selectionne affiche un check, mais les autres ont un espace vide, ce qui donne l'impression d'un desalignement.

## Solution

Modifier le `SelectItem` dans `src/components/ui/select.tsx` pour utiliser un padding gauche reduit (`pl-2`) et supprimer l'indicateur de check mark. C'est un pattern UI moderne plus propre -- l'item selectionne est deja mis en evidence par le style `focus`/`hover` et par le texte affiche dans le trigger.

## Detail technique

**`src/components/ui/select.tsx`** - Composant `SelectItem` (lignes 104-121)

Avant :
```text
className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm ..."
```

Apres :
```text
className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm ..."
```

Et supprimer le bloc du check indicator (lignes 113-117) :
```text
<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
  <SelectPrimitive.ItemIndicator>
    <Check className="h-4 w-4" />
  </SelectPrimitive.ItemIndicator>
</span>
```

Cela affecte tous les Select du projet, ce qui est souhaitable pour une UI coherente et epuree.
