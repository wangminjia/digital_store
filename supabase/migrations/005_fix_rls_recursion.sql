-- Fix infinite recursion in profiles RLS policy
-- The issue: profiles policy was querying profiles table to check admin status

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Create a security definer function to check admin status
-- This avoids the recursion because it runs with elevated privileges
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create the fixed policies using the function
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (
    public.is_admin(auth.uid())
  );

-- Fix other policies that also had the same issue
DROP POLICY IF EXISTS "Admins can view all purchases" ON purchases;
DROP POLICY IF EXISTS "Admins can view all reading progress" ON reading_progress;
DROP POLICY IF EXISTS "Admins can manage books" ON books;
DROP POLICY IF EXISTS "Admins can manage chapters" ON chapters;

CREATE POLICY "Admins can view all purchases" ON purchases
  FOR SELECT USING (
    public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can view all reading progress" ON reading_progress
  FOR SELECT USING (
    public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage books" ON books
  FOR ALL USING (
    public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage chapters" ON chapters
  FOR ALL USING (
    public.is_admin(auth.uid())
  );
