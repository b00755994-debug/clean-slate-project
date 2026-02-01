-- Supprimer l'ancienne contrainte de clé étrangère
ALTER TABLE public.posts 
DROP CONSTRAINT IF EXISTS posts_linkedin_profiles_fkey;

-- Recréer avec ON DELETE SET NULL pour permettre la suppression des profils
ALTER TABLE public.posts 
ADD CONSTRAINT posts_linkedin_profiles_fkey 
FOREIGN KEY (linkedin_profiles) 
REFERENCES public.billable_users(id) 
ON DELETE SET NULL;