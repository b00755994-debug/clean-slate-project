

## Stocker les photos de profil dans Supabase Storage

Les URLs LinkedIn expirent regulierement (toutes les URLs actuelles sont expirees). La solution : telecharger les images et les stocker dans un bucket Supabase Storage.

### Architecture

```text
LinkedIn CDN (temporaire) → Edge Function → Supabase Storage (permanent)
                                              ↓
                                    billable_users.profile_picture
                                    (URL Supabase permanente)
```

### Etapes

#### 1. Creer un bucket Storage `profile-pictures` (public)

Migration SQL pour creer le bucket et les politiques RLS permettant la lecture publique.

#### 2. Creer une edge function `sync-profile-pictures`

Cette fonction :
- Recupere tous les `billable_users` avec un `profile_picture` pointant vers `media.licdn.com`
- Telecharge chaque image
- L'upload dans le bucket `profile-pictures/{billable_user_id}.jpg`
- Met a jour `billable_users.profile_picture` avec l'URL publique Supabase

Elle sera appelable manuellement ou via cron pour rafraichir les photos quand le scraper met a jour les URLs LinkedIn.

#### 3. Mettre a jour le scraping pipeline (n8n)

Apres que n8n met a jour une `profile_picture` avec une nouvelle URL LinkedIn, il faudra appeler `sync-profile-pictures` pour la persister. Alternativement, un cron job quotidien peut synchroniser toutes les photos.

#### 4. Executer la migration initiale

Appeler la fonction une premiere fois pour migrer les 6 photos actuelles (meme si expirees, les nouvelles URLs du prochain scrape seront automatiquement persistees).

### Impact sur le front-end

Aucun changement cote front-end. Le champ `profile_picture` pointera simplement vers une URL Supabase Storage au lieu de LinkedIn. Les composants `PostCard`, `Dashboard`, `DashboardContent`, `OnboardingStepLinkedIn`, et `useFullLeaderboard` continueront de fonctionner sans modification.

### Limites

Les URLs actuelles sont deja expirees, donc la migration initiale ne pourra pas telecharger les images. Il faudra d'abord relancer le scrape n8n pour obtenir de nouvelles URLs LinkedIn, puis executer la sync.

