
# Plan : Afficher les images des posts LinkedIn dans le Team Feed

## Situation actuelle

La colonne `post_image` existe dans la table `posts` et contient les URLs des images/médias des posts LinkedIn. Ces données sont déjà récupérées par le hook `useTeamFeed` (via `select('*')`), mais elles ne sont pas typées ni affichées dans les cartes du feed.

## Modifications à effectuer

### 1. `src/hooks/useTeamFeed.ts`

**Ajouter `post_image` à l'interface Post** (ligne 18)

```typescript
interface Post {
  id: string;
  content: string | null;
  url: string | null;
  avatar_url: string | null;
  impressions: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  reactions: number | null;
  linkedin_created_at: string | null;
  linkedin_profiles: string | null;
  post_image: string | null;  // Ajouter cette ligne
}
```

### 2. `src/components/content/PostCard.tsx`

**Ajouter `post_image` à l'interface PostCardProps** (après ligne 35)

```typescript
post: {
  // ... existing fields
  post_image?: string | null;  // Ajouter
}
```

**Ajouter l'affichage de l'image** entre le contenu textuel et les stats (après ligne 213)

```typescript
{/* Content */}
<div className="px-4 py-3">
  <p className="text-[14px] text-foreground whitespace-pre-wrap leading-[1.45] font-normal">
    {displayContent}
    {shouldTruncate && !isExpanded && (
      <>
        ...{' '}
        <button onClick={() => setIsExpanded(true)} className="...">
          voir plus
        </button>
      </>
    )}
  </p>
</div>

{/* Post Image - NOUVEAU */}
{post.post_image && (
  <div className="px-4 pb-3">
    <img 
      src={post.post_image}
      alt="Contenu du post"
      className="w-full max-h-[400px] object-cover rounded-lg"
      loading="lazy"
    />
  </div>
)}

{/* Stats Line */}
{(totalReactions > 0 || ...
```

## Résultat visuel

```text
┌─────────────────────────────────┐
│ [Avatar] Nom de l'auteur        │
│          Titre • 2h • 🌐        │
├─────────────────────────────────┤
│ Contenu textuel du post...      │
│                                 │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │     IMAGE DU POST           │ │  ← Nouveau
│ │   (max 400px de hauteur)    │ │
│ │                             │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 👍❤️🎉 123  |  👁 1.2k  42 comm. │
├─────────────────────────────────┤
│ 🔗 Voir sur LinkedIn            │
└─────────────────────────────────┘
```

## Fichiers modifiés

| Fichier | Modification |
|---------|--------------|
| `src/hooks/useTeamFeed.ts` | Ajouter `post_image` à l'interface Post |
| `src/components/content/PostCard.tsx` | Ajouter `post_image` à l'interface + affichage de l'image |

## Points techniques

- **Lazy loading** : L'attribut `loading="lazy"` optimise le chargement des images hors écran
- **Hauteur max** : `max-h-[400px]` évite que les images trop grandes déforment le feed
- **Object-cover** : Maintient les proportions de l'image tout en remplissant l'espace
- **Coins arrondis** : `rounded-lg` pour une cohérence visuelle avec le reste de la carte
