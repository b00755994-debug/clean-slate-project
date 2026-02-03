-- Supprimer le role de l'utilisateur
DELETE FROM public.user_roles 
WHERE user_id = 'e0aba8b5-2b55-4320-bcec-af0aa62136fa';

-- Supprimer le profil
DELETE FROM public.profiles 
WHERE id = 'e0aba8b5-2b55-4320-bcec-af0aa62136fa';