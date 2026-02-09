

# Ajouter le nombre d'abonnes (followers) dans la liste des profils et le leaderboard

## Changements prevus

### 1. Hook `useLinkedInProfiles` (`src/hooks/useLinkedInProfiles.ts`)

- Ajouter `followers` au type `LinkedInProfile`
- Le champ est deja recupere car la query utilise `select('*')`, donc pas de changement de query necessaire

### 2. Liste des URL trackees (`src/pages/Dashboard.tsx`)

- Ajouter une colonne "Followers" dans le header du tableau (entre LinkedIn URL et Slack User)
- Afficher `linkedinProfile.followers` formate (ex: 1.2k) dans chaque ligne
- Ajuster les largeurs des colonnes pour integrer cette nouvelle colonne

### 3. Hook `useFullLeaderboard` (`src/hooks/useFullLeaderboard.ts`)

- Ajouter `followers` dans le select de la query billable_users : `'id, profile_name, linkedin_title, avatar_url, profile_picture, followers'`
- Ajouter `followers: number | null` dans le type `LeaderboardEntry`
- Propager la valeur dans le mapping des entries

### 4. Page Leaderboard (`src/pages/DashboardLeaderboard.tsx`)

- Ajouter une colonne "Followers" entre "Title" et "Posts" dans le header
- Afficher la valeur formatee (ex: 12.5k) dans chaque ligne
- Ajouter les traductions FR/EN ("Abonnes" / "Followers")

## Aucune migration SQL necessaire

La colonne `followers` existe deja dans `billable_users`.

