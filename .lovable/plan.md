

# Plan : Détection temps réel des nouveaux posts

## Résumé

Implémenter une souscription Supabase Realtime pour détecter automatiquement les nouveaux posts ajoutés par le scrapper backend, et afficher une notification non-intrusive dans le feed.

## Fichiers à créer

### 1. `src/components/content/NewPostsBanner.tsx` (nouveau)

Composant de notification discret qui apparaît en haut du feed :

```typescript
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    newPost: 'nouveau post',
    newPosts: 'nouveaux posts',
    show: 'Afficher',
  },
  en: {
    newPost: 'new post',
    newPosts: 'new posts',
    show: 'Show',
  }
};

interface NewPostsBannerProps {
  count: number;
  onRefresh: () => void;
}

export function NewPostsBanner({ count, onRefresh }: NewPostsBannerProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (count === 0) return null;

  const postLabel = count > 1 ? t.newPosts : t.newPost;

  return (
    <button
      onClick={onRefresh}
      className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/20 
                 text-primary text-sm font-medium rounded-lg 
                 flex items-center justify-center gap-2 
                 transition-all duration-200 mb-3
                 border border-primary/20 hover:border-primary/30
                 shadow-sm hover:shadow-md"
    >
      <RefreshCw className="h-4 w-4" />
      <span>{count} {postLabel}</span>
      <span className="text-primary/70">—</span>
      <span>{t.show}</span>
    </button>
  );
}
```

## Fichiers à modifier

### 2. `src/hooks/useTeamFeed.ts`

Ajouter la souscription Realtime et exposer les nouvelles fonctions :

**Ajouts :**
- Import de `useEffect`, `useState`, `useCallback`
- State `newPostsCount` pour compter les nouveaux posts
- `useEffect` pour créer le channel Realtime avec filtre `workspace_id`
- Fonction `refreshPosts` pour réinitialiser le compteur et invalider le cache
- Export des nouvelles valeurs : `newPostsCount`, `refreshPosts`

```typescript
const [newPostsCount, setNewPostsCount] = useState(0);

useEffect(() => {
  if (!workspace?.id) return;

  const channel = supabase
    .channel(`posts-workspace-${workspace.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
        filter: `workspace_id=eq.${workspace.id}`
      },
      (payload) => {
        setNewPostsCount(prev => prev + 1);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [workspace?.id]);

const refreshPosts = useCallback(() => {
  setNewPostsCount(0);
  queryClient.invalidateQueries({ queryKey: ['posts', workspace?.id] });
}, [queryClient, workspace?.id]);
```

### 3. `src/components/content/TeamFeed.tsx`

Intégrer le banner de notification :

**Modifications :**
- Import du composant `NewPostsBanner`
- Récupérer `newPostsCount` et `refreshPosts` depuis le hook
- Afficher `<NewPostsBanner />` en haut du feed

## Fonctionnement

```text
Backend Scrapper
      |
      | INSERT nouveau post
      v
+------------------+
| Table posts      |
| (Supabase)       |
+--------+---------+
         |
         | Realtime event (filtré par workspace_id)
         v
+--------+---------+
| useTeamFeed      |
| newPostsCount++  |
+--------+---------+
         |
         v
+--------+---------+
| NewPostsBanner   |
| "X nouveaux      |
|  posts - Afficher"|
+------------------+
         |
         | Click utilisateur
         v
+------------------+
| refreshPosts()   |
| invalidateQueries|
+------------------+
```

## Avantages

- **Non-intrusif** : L'utilisateur garde le contrôle
- **Performant** : Pas de re-fetch automatique, juste un compteur léger
- **UX claire** : Indication visuelle du nombre de nouveaux posts
- **Workspace-scoped** : Seuls les posts du workspace actif sont détectés

