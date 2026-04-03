
-- Fix SECURITY DEFINER view by setting security_invoker
CREATE OR REPLACE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT 
  id,
  first_name,
  last_name,
  avatar_url,
  bio,
  city,
  user_type,
  created_at
FROM public.profiles;
