
# Plan: Layout 3 colonnes avec Feed au centre

## Objectif
Créer une nouvelle disposition où le feed scrollable est au centre, encadré par les leaderboards (Top Posts à gauche, Active Contributors à droite).

## Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           Header + Filters                               │
├──────────────────┬──────────────────────────────┬───────────────────────┤
│                  │              │               │                       │
│   Top Posts      │   Separator  │  Team Feed    │  Separator │ Active   │
│   Leaderboard    │      |       │   (scroll)    │     |      │ Contrib. │
│                  │              │               │            │          │
│   (sticky)       │              │   (552px)     │            │ (sticky) │
│                  │              │               │            │          │
└──────────────────┴──────────────────────────────┴───────────────────────┘
```

## Modifications

### 1. Fichier: `src/pages/DashboardContent.tsx`

**Changements dans la section Content (lignes 211-233):**

- Restructurer le layout en 3 colonnes
- Colonne gauche: Top Posts seul (sticky)
- Colonne centrale: Team Feed avec son propre scroll
- Colonne droite: Active Contributors seul (sticky)
- Séparateurs verticaux entre chaque colonne

```tsx
{/* Content - Three Column Layout */}
<div className="flex-1 flex gap-0 pt-4 overflow-hidden">
  {/* Left Column - Top Posts */}
  <div className="hidden xl:block w-[280px] flex-shrink-0 overflow-y-auto pr-2">
    <div className="sticky top-0">
      <TopPostsLeaderboard posts={topPosts} loading={leaderboardsLoading} />
    </div>
  </div>
  
  {/* Left Separator */}
  <div className="hidden xl:block w-px bg-border mx-4 flex-shrink-0" />
  
  {/* Center Column - Feed */}
  <div className="flex-1 lg:max-w-[552px] mx-auto overflow-y-auto px-2">
    <TeamFeed ... />
  </div>
  
  {/* Right Separator */}
  <div className="hidden xl:block w-px bg-border mx-4 flex-shrink-0" />
  
  {/* Right Column - Active Contributors */}
  <div className="hidden xl:block w-[280px] flex-shrink-0 overflow-y-auto pl-2">
    <div className="sticky top-0">
      <ActiveContributorsLeaderboard contributors={activeContributors} loading={leaderboardsLoading} />
    </div>
  </div>
</div>
```

### 2. Imports à ajouter

```tsx
import { TopPostsLeaderboard } from '@/components/content/TopPostsLeaderboard';
import { ActiveContributorsLeaderboard } from '@/components/content/ActiveContributorsLeaderboard';
import { useLeaderboards } from '@/hooks/useLeaderboards';
```

### 3. Hook à utiliser

Ajouter l'utilisation du hook `useLeaderboards` directement dans `DashboardContent`:

```tsx
const { topPosts, activeContributors, loading: leaderboardsLoading } = useLeaderboards();
```

### 4. Responsive Design

| Breakpoint | Comportement |
|------------|--------------|
| `< lg` (mobile/tablet) | Feed seul, pleine largeur |
| `lg` à `xl` | Feed seul centré |
| `≥ xl` | 3 colonnes (Top Posts | Feed | Active Contributors) |

---

## Section Technique

### Fichiers modifiés
| Fichier | Modification |
|---------|--------------|
| `src/pages/DashboardContent.tsx` | Nouveau layout 3 colonnes, imports directs des leaderboards |

### Notes
- Le composant `FeedLeaderboards` n'est plus utilisé dans cette configuration (peut être conservé pour d'autres usages)
- Les colonnes latérales ont une largeur fixe de 280px pour s'adapter aux cards
- Le feed reste à 552px max pour garder le style LinkedIn
