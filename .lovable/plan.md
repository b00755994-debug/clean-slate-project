

# Fix : Padding du texte selectionne dans le SelectTrigger

## Probleme

Quand on selectionne "Most viewed" ou "Most reactions", le texte affiche dans le bouton du filtre (le `SelectTrigger`, pas le dropdown) a un decalage par rapport a "Most recent". C'est parce que Radix Select enveloppe la valeur selectionnee dans un `<span>` interne supplementaire qui peut heriter de styles differents du placeholder.

## Solution

Forcer le premier `<span>` enfant du `SelectTrigger` a ne jamais avoir de padding-left, via un selecteur CSS Tailwind sur le composant global.

## Detail technique

**`src/components/ui/select.tsx`** - `SelectTrigger` (ligne 20)

Ajouter `[&>span]:pl-0` au className du `SelectTrigger` pour s'assurer que le span interne de Radix n'a jamais de padding gauche :

Avant :
```text
"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
```

Apres :
```text
"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:pl-0 [&_*]:pl-0"
```

Le selecteur `[&_*]:pl-0` cible tous les descendants pour s'assurer qu'aucun element imbrique par Radix n'ajoute de padding.

Un seul fichier, une seule ligne modifiee.

