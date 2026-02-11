

# Fix: Afficher la photo LinkedIn dans le tableau des profils

## Probleme

Le composant `AvatarImage` de Radix UI ne charge pas les images LinkedIn (probablement un probleme de cross-origin). En revanche, dans la page DashboardContent, les photos s'affichent correctement car elles utilisent un simple tag `<img>`.

## Solution

Remplacer le composant `AvatarImage` par un tag `<img>` natif dans le tableau des profils LinkedIn, comme c'est deja fait dans `DashboardContent.tsx`.

## Fichier concerne

**src/pages/Dashboard.tsx** (lignes 691-699)

Remplacer le bloc Avatar actuel :
```
<Avatar className="h-6 w-6 shrink-0">
  <AvatarImage src={...} alt={...} />
  <AvatarFallback>...</AvatarFallback>
</Avatar>
```

Par une approche conditionnelle avec `<img>` natif (meme pattern que DashboardContent.tsx ligne 175) :
```
{linkedinProfile.profile_picture ? (
  <img src={linkedinProfile.profile_picture} alt={linkedinProfile.profile_name || ''} className="w-6 h-6 rounded-full object-cover shrink-0" />
) : (
  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
    {linkedinProfile.profile_name
      ? <span className="text-[10px] font-medium">{linkedinProfile.profile_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
      : <User className="w-3 h-3" />}
  </div>
)}
```

Aucun autre fichier a modifier.

