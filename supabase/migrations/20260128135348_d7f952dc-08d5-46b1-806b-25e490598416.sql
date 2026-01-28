-- Fonction pour calculer les impressions estimées
CREATE OR REPLACE FUNCTION public.calculate_estimated_impressions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  reactions_count NUMERIC;
  comments_count NUMERIC;
  ln_impressions NUMERIC;
  estimated_impressions NUMERIC;
BEGIN
  -- Récupérer les valeurs (avec fallback à 0 si NULL)
  reactions_count := COALESCE(NEW.reactions, 0);
  comments_count := COALESCE(NEW.comments, 0);
  
  -- Calculer ln(impressions) avec la formule
  ln_impressions := 3.9657 + 0.9544 * LN(reactions_count + 1) + 0.1617 * LN(comments_count + 1);
  
  -- Calculer impressions estimées (arrondi à 2 décimales)
  estimated_impressions := ROUND(EXP(ln_impressions)::NUMERIC, 2);
  
  -- Mettre à jour la valeur
  NEW.impressions := estimated_impressions;
  
  RETURN NEW;
END;
$$;

-- Trigger qui s'exécute avant INSERT ou UPDATE sur reactions/comments
CREATE TRIGGER trigger_calculate_impressions
  BEFORE INSERT OR UPDATE OF reactions, comments
  ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_estimated_impressions();

-- Mettre à jour les posts existants sans impressions
UPDATE posts
SET impressions = ROUND(
  EXP(
    3.9657 + 
    0.9544 * LN(COALESCE(reactions, 0) + 1) + 
    0.1617 * LN(COALESCE(comments, 0) + 1)
  )::NUMERIC, 2
)
WHERE impressions IS NULL;