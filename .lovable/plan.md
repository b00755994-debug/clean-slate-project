
# Page Mockups -- Leaderboard, Team Feed, Analytics

## Objectif

Creer une page `/mockups` accessible sans authentification, qui affiche des mockups visuels des 3 interfaces principales avec des donnees fictives realistes. Cette page servira a valider les designs avant integration dans la landing page.

## Structure de la page

La page sera divisee en 3 sections verticales, chacune avec un titre de section et le composant mockup correspondant :

1. **Leaderboard** -- Tableau de classement avec 8 membres fictifs (noms, titres, followers, posts, impressions, reactions, engagement, rang, evolution)
2. **Team Feed** -- 3-4 PostCards fictives avec des contenus LinkedIn realistes, des reactions, impressions et commentaires
3. **Analytics** -- Les 3 onglets (Overview, Team Activation, Audience & Reach) avec les donnees mock existantes dans `mockData.ts`

## Fichiers a creer/modifier

### 1. `src/pages/Mockups.tsx` (nouveau)

Page principale qui :
- N'utilise PAS `DashboardLayout` ni `ProtectedRoute` (accessible sans login)
- Affiche les 3 sections avec un header simple
- Utilise un fond neutre avec espacement genereux entre les sections

### 2. `src/components/mockups/MockLeaderboard.tsx` (nouveau)

- Reprend la structure de `DashboardLeaderboard.tsx` (table avec colonnes Rang, Membre, Titre, Abonnes, Posts, Impressions, Reactions, Engagement, Evolution)
- Utilise des donnees fictives en dur (8 membres avec noms realistes francophones)
- Pas de dependance a `useFullLeaderboard` ni a Supabase
- Inclut le month selector en statique (affiche "Fevrier 2026")

### 3. `src/components/mockups/MockTeamFeed.tsx` (nouveau)

- Affiche 3 PostCards avec des donnees fictives
- Reutilise le composant `PostCard` existant en lui passant des props fake
- Simule le layout 3 colonnes (Top Posts a gauche, Feed au centre, Active Contributors a droite) -- ou juste le feed central pour le mockup
- Pas de dependance aux hooks reels

### 4. `src/components/mockups/MockAnalytics.tsx` (nouveau)

- Reutilise directement les composants `AnalyticsOverview`, `AnalyticsTeamActivation`, et `AnalyticsReachImpact`
- Ces composants utilisent deja `useAnalyticsData` qui retourne des donnees mock quand il n'y a pas de workspace
- Structure avec les 3 onglets comme dans `DashboardAnalytics.tsx`

### 5. `src/App.tsx` (modifier)

- Ajouter la route `/mockups` sans `ProtectedRoute`

## Donnees fictives

### Leaderboard (8 membres)

| Rang | Nom | Titre | Abonnes | Posts | Impressions | Reactions | Engagement | Evol. |
|------|-----|-------|---------|-------|-------------|-----------|------------|-------|
| 1 | Marie Dupont | Head of Marketing | 12.3k | 8 | 45.2k | 1,240 | 5.2% | +2 |
| 2 | Thomas Martin | CEO & Co-founder | 8.7k | 6 | 38.5k | 980 | 4.8% | -1 |
| 3 | Julie Bernard | Sales Director | 5.4k | 7 | 28.3k | 720 | 4.5% | +1 |
| 4 | Nicolas Petit | Product Manager | 3.2k | 5 | 18.7k | 450 | 3.9% | 0 |
| 5 | Sophie Laurent | HR Manager | 2.8k | 4 | 12.4k | 310 | 3.2% | +3 |
| 6 | Alexandre Moreau | CTO | 6.1k | 3 | 15.8k | 280 | 2.8% | -2 |
| 7 | Camille Leroy | Content Manager | 1.9k | 4 | 9.2k | 210 | 2.5% | new |
| 8 | Pierre Dubois | Account Executive | 1.5k | 2 | 5.6k | 120 | 2.1% | -1 |

### Team Feed (3 posts)

Posts avec du contenu LinkedIn realiste (annonces produit, partage d'experience, conseil professionnel), avec impressions, reactions detaillees, commentaires.

### Analytics

Reutilisation des donnees mock existantes dans `mockData.ts` via le hook `useAnalyticsData`.

## Details techniques

- La page utilise `LanguageProvider` deja en place (supporte FR/EN)
- Les composants mockup sont isoles dans `src/components/mockups/` pour un nettoyage facile
- Les PostCards reutilisent les assets LinkedIn reactions existants (`src/assets/linkedin-reactions/`)
- Pas besoin de migration SQL
- Le hook `useAnalyticsData` retourne deja des donnees mock lorsqu'il n'a pas de workspace, donc les composants Analytics fonctionneront directement
