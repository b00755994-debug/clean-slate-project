

## Fusionner les lignes "Billed" et "Save" en une seule ligne

### Changement sur `src/pages/Pricing.tsx`

Pour les deux cartes Pro et Business, remplacer le badge vert actuel (la `span` avec `bg-success/15 rounded-full`) par une ligne de texte simple sous le prix total mensuel :

**Format final** (exemple Pro, annuel, 40 users) :
```
3,20€  /user/month
128,00€/month for 40 users
Billed 1 228,80€/year (save 307,20€)
```

### Details techniques

1. **Carte Pro** (ligne ~298) : Supprimer la `span` badge vert a cote du prix principal. Ajouter apres la ligne "XX€/month for X users" un nouveau `<p>` conditionnel :
   ```tsx
   {isAnnual && proSavings > 0 && (
     <p className="text-sm text-muted-foreground mt-1">
       Billed {formatPrice(proAnnualTotal)}€{t.perYear} <span className="text-success font-medium">(save {formatPrice(proSavings)}€)</span>
     </p>
   )}
   ```

2. **Carte Business** (ligne ~396) : Meme modification avec `businessAnnualTotal` et `businessSavings`.

