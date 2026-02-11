

# Elargir le filtre "All authors"

Modification simple dans `src/pages/DashboardContent.tsx` : passer la largeur du `SelectTrigger` du filtre auteur de `w-[140px]` a `w-[200px]` pour que les noms s'affichent sur une seule ligne.

## Detail technique

- **Fichier** : `src/pages/DashboardContent.tsx`
- **Ligne ~155** : changer `className="w-[140px] h-8 text-sm bg-card"` en `className="w-[200px] h-8 text-sm bg-card"` sur le `SelectTrigger` du filtre auteur

