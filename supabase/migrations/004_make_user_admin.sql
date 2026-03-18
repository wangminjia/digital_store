-- Set specific user as admin (run this after signing up)
-- Replace 'USER_ID_HERE' with the actual user UUID

UPDATE profiles 
SET is_admin = TRUE 
WHERE id = 'USER_ID_HERE';

-- Or make the first signed-up user admin
SELECT make_first_user_admin();

-- Verify
SELECT id, email, is_admin, created_at 
FROM profiles 
WHERE is_admin = TRUE;
