# Admin Dashboard Setup Instructions

## Overview

The admin dashboard is now fully integrated into your e-book shop. No Prisma needed - everything works with your existing Supabase setup!

## What Was Added

### Database Changes
- `is_admin` field added to `profiles` table
- New RLS policies for admin access
- Helper function to make first user admin

### Admin Pages
- `/admin` - Dashboard with stats
- `/admin/books` - Book management (CRUD)
- `/admin/books/new` - Create new book
- `/admin/books/[bookId]/edit` - Edit book
- `/admin/books/[bookId]/chapters` - Chapter management
- `/admin/books/[bookId]/chapters/new` - Create chapter
- `/admin/books/[bookId]/chapters/[chapterId]/edit` - Edit chapter
- `/admin/users` - User management
- `/admin/purchases` - View all purchases

### Admin Features
- Dashboard stats (users, books, purchases, chapters)
- Book CRUD operations
- Chapter CRUD operations
- User management (toggle admin status)
- Purchase history with revenue calculation
- Admin-only navigation in user dropdown

## Setup Steps

### 1. Run Database Migration

Go to Supabase SQL Editor and run:

```sql
-- File: supabase/migrations/003_add_admin_support.sql

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_profiles_admin ON profiles(is_admin) WHERE is_admin = TRUE;

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can view all purchases" ON purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can view all reading progress" ON reading_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can manage books" ON books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can manage chapters" ON chapters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

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
```

### 2. Make Yourself Admin

After signing up, run this in SQL Editor:

```sql
-- Option 1: Make specific user admin
UPDATE profiles 
SET is_admin = TRUE 
WHERE id = 'YOUR_USER_ID_HERE';

-- Option 2: Make first user admin
SELECT make_first_user_admin();

-- Verify
SELECT id, email, is_admin FROM profiles WHERE is_admin = TRUE;
```

### 3. Access Admin Panel

1. Sign in to your app
2. Click your avatar in top right
3. You'll see "Admin Panel" option
4. Click to access `/admin`

## Admin Capabilities

### Dashboard
- View total users, books, purchases, chapters
- See recent purchases with user info
- Quick overview of store activity

### Books Management
- List all books with status
- Create new books with slug, price, cover
- Edit book details
- Delete books (with cascade to chapters)
- Publish/unpublish books

### Chapters Management
- View chapters for each book
- Create new chapters with HTML content
- Edit chapter content
- Reorder chapters
- Delete chapters

### User Management
- View all registered users
- See user signup dates
- Toggle admin status for users
- Only admins can grant admin access

### Purchases
- View all transactions
- Filter by status
- Calculate total revenue
- See which users bought which books

## Security

- All admin routes protected by `isAdmin()` check
- RLS policies ensure only admins can manage data
- Non-admins redirected to `/app`
- Admin link only visible to admins in dropdown

## Why No Prisma?

Prisma would add complexity without benefits for this use case:

| Aspect | Supabase Only | With Prisma |
|--------|---------------|-------------|
| Setup | Already working | New schema, migrations |
| RLS | Native support | Need workarounds |
| Learning | Team knows it | New tool |
| Time | Ship now | Weeks of migration |
| Maintenance | Single source | Two systems |

Your admin dashboard works perfectly with Supabase's native capabilities!

## Next Steps

1. Run the SQL migration
2. Make yourself admin
3. Access `/admin`
4. Try creating a book
5. Add chapters to the book
6. View it on the public site

Enjoy your new admin dashboard!
