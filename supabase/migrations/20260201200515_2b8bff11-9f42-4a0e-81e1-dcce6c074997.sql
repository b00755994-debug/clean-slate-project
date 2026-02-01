-- 1. Mettre post_history -> posts en CASCADE d'abord
ALTER TABLE public.post_history 
DROP CONSTRAINT IF EXISTS post_history_post_id_fkey;

ALTER TABLE public.post_history 
ADD CONSTRAINT post_history_post_id_fkey 
FOREIGN KEY (post_id) 
REFERENCES public.posts(id) 
ON DELETE CASCADE;

-- 2. Table posts : passer de SET NULL à CASCADE
ALTER TABLE public.posts 
DROP CONSTRAINT IF EXISTS posts_linkedin_profiles_fkey;

ALTER TABLE public.posts 
ADD CONSTRAINT posts_linkedin_profiles_fkey 
FOREIGN KEY (linkedin_profiles) 
REFERENCES public.billable_users(id) 
ON DELETE CASCADE;

-- 3. Table kpis : passer de RESTRICT à CASCADE
ALTER TABLE public.kpis 
DROP CONSTRAINT IF EXISTS kpis_billable_user_id_fkey;

ALTER TABLE public.kpis 
ADD CONSTRAINT kpis_billable_user_id_fkey 
FOREIGN KEY (billable_user_id) 
REFERENCES public.billable_users(id) 
ON DELETE CASCADE;

-- 4. Nettoyage des posts orphelins existants (et leur historique en cascade)
DELETE FROM posts WHERE linkedin_profiles IS NULL;

-- 5. Nettoyage des KPIs orphelins
DELETE FROM kpis WHERE billable_user_id IS NULL;