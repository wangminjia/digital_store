-- Add is_admin field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index for admin lookups
CREATE INDEX idx_profiles_admin ON profiles(is_admin) WHERE is_admin = TRUE;

-- Update RLS policies to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy for admins to update any profile
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy for admins to view all purchases
CREATE POLICY "Admins can view all purchases" ON purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy for admins to view all reading progress
CREATE POLICY "Admins can view all reading progress" ON reading_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy for admins to manage books
CREATE POLICY "Admins can manage books" ON books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy for admins to manage chapters
CREATE POLICY "Admins can manage chapters" ON chapters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Create a function to make first user admin (run manually after first signup)
CREATE OR REPLACE FUNCTION make_first_user_admin()
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET is_admin = TRUE 
  WHERE id = (
    SELECT id FROM profiles 
    ORDER BY created_at ASC 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
