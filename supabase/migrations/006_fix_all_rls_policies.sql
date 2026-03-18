-- Additional RLS fixes for admin access
-- Run this if you're still getting permission errors

-- Ensure books can be read by admins and public (published only)
DROP POLICY IF EXISTS "Books are viewable by everyone" ON books;

CREATE POLICY "Books are viewable by everyone" ON books
  FOR SELECT USING (
    is_published = TRUE OR 
    public.is_admin(auth.uid())
  );

-- Ensure chapters can be read by admins and book owners
DROP POLICY IF EXISTS "Chapters are viewable by book owners or if book is purchased" ON chapters;

CREATE POLICY "Chapters are viewable by users" ON chapters
  FOR SELECT USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM books
      WHERE books.id = chapters.book_id AND books.is_published = TRUE
    ) OR
    EXISTS (
      SELECT 1 FROM purchases
      WHERE purchases.book_id = chapters.book_id 
      AND purchases.user_id = auth.uid()
      AND purchases.status = 'completed'
    )
  );

-- Ensure profiles can be read by admins and self
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Profiles viewable by self or admin" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    public.is_admin(auth.uid())
  );

-- Ensure profiles can be updated by admins and self
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

CREATE POLICY "Profiles updatable by self or admin" ON profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    public.is_admin(auth.uid())
  );

-- Ensure purchases can be read by admins and owners
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
DROP POLICY IF EXISTS "Admins can view all purchases" ON purchases;

CREATE POLICY "Purchases viewable by owner or admin" ON purchases
  FOR SELECT USING (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );

-- Ensure purchases can be inserted by owners and admins
DROP POLICY IF EXISTS "Users can insert own purchases" ON purchases;

CREATE POLICY "Purchases insertable by owner or admin" ON purchases
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );

-- Ensure reading_progress can be managed by owners and admins
DROP POLICY IF EXISTS "Users can view own reading progress" ON reading_progress;
DROP POLICY IF EXISTS "Admins can view all reading progress" ON reading_progress;
DROP POLICY IF EXISTS "Users can insert own reading progress" ON reading_progress;
DROP POLICY IF EXISTS "Users can update own reading progress" ON reading_progress;

CREATE POLICY "Reading progress viewable by owner or admin" ON reading_progress
  FOR SELECT USING (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );

CREATE POLICY "Reading progress insertable by owner or admin" ON reading_progress
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );

CREATE POLICY "Reading progress updatable by owner or admin" ON reading_progress
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );
