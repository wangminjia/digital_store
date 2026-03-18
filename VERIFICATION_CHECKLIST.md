# Manual Verification Checklist

Use this checklist to verify all features are working correctly before deployment.

## Authentication & Authorization

### Sign Up Flow
- [ ] Navigate to `/auth/signup`
- [ ] Fill in full name, email, and password (min 8 characters)
- [ ] Submit form
- [ ] Verify redirect to `/auth/verify-email`
- [ ] Check Supabase auth.users table for new user
- [ ] Check profiles table for automatic profile creation
- [ ] Verify welcome email sent (if configured)

### Sign In Flow
- [ ] Navigate to `/auth/signin`
- [ ] Enter valid credentials
- [ ] Submit form
- [ ] Verify redirect to `/app` (dashboard)
- [ ] Check that user menu shows correct email/name

### Password Reset Flow
- [ ] Navigate to `/auth/signin`
- [ ] Click "Forgot password?"
- [ ] Enter registered email
- [ ] Submit form
- [ ] Verify "Check your email" message displays
- [ ] Click reset link in email
- [ ] Enter new password
- [ ] Verify redirect to `/app`

### Middleware Protection
- [ ] Try accessing `/app` without authentication → Should redirect to `/auth/signin`
- [ ] Try accessing `/auth/signin` while authenticated → Should redirect to `/app`
- [ ] Verify redirect parameter works: `/auth/signin?redirect=/app/books/123`

## Public Pages

### Landing Page (`/`)
- [ ] Page loads without errors
- [ ] Hero section displays correctly
- [ ] Feature cards visible
- [ ] Featured books section loads
- [ ] CTA buttons work
- [ ] Mobile responsive (test on mobile width)

### Books Catalog (`/books`)
- [ ] Page loads with book grid
- [ ] Book cards display cover, title, author, price
- [ ] "View" buttons link to book detail
- [ ] Empty state works (when no books published)
- [ ] Mobile responsive

### Book Detail Page (`/books/[slug]`)
- [ ] Page loads with book info
- [ ] Cover image displays (or placeholder)
- [ ] Title, author, description visible
- [ ] Price displays correctly (formatted as $X.XX)
- [ ] "Buy Now" button visible for non-purchased books
- [ ] Chapter list displays
- [ ] "Read Now" button for purchased books
- [ ] "You own this book" badge for purchased books
- [ ] 404 page for invalid slugs

### Pricing Page (`/pricing`)
- [ ] Page loads with pricing tiers
- [ ] All plans display correctly
- [ ] CTA buttons work
- [ ] "Most Popular" badge on Pro plan

## Book Purchasing

### Stripe Checkout
- [ ] Click "Buy Now" on book detail page
- [ ] Verify redirect to Stripe Checkout
- [ ] Verify book title and price correct in Checkout
- [ ] Complete test payment (use test card: 4242 4242 4242 4242)
- [ ] Verify redirect to `/app?success=true`
- [ ] Check purchase record in database (status: 'completed')

### Webhook Handling
- [ ] Verify `checkout.session.completed` webhook processes
- [ ] Check purchase record created/updated
- [ ] Verify first purchase triggers welcome email
- [ ] Test `payment_intent.payment_failed` (use card: 4000 0000 0000 0002)
- [ ] Verify purchase status remains 'pending' or not created

### Duplicate Purchase Prevention
- [ ] Try to buy book already purchased
- [ ] Verify redirect to `/app` instead of Checkout

## Reader Dashboard

### Library Page (`/app`)
- [ ] Page loads with user's purchased books
- [ ] Empty state displays when no books
- [ ] "Browse Store" button links to `/books`
- [ ] Book cards show "Read" button
- [ ] Progress indicator on books (if implemented)

### Reader View (`/app/books/[bookId]`)
- [ ] Page loads with first chapter or last read chapter
- [ ] Chapter navigation buttons work
- [ ] Progress bar updates on scroll
- [ ] Progress saves after 2 seconds of no scrolling
- [ ] "Saving..." indicator appears
- [ ] "Back to Library" button works
- [ ] Chapter content displays (HTML rendered correctly)

### Chapter Navigation (`/app/books/[bookId]/chapters/[chapterId]`)
- [ ] Direct URL access to specific chapter works
- [ ] Chapter buttons highlight current chapter
- [ ] Previous/Next chapter buttons work
- [ ] Chapter counter displays correctly ("Chapter X of Y")

## Progress Tracking

### Progress Persistence
- [ ] Read a chapter, scroll to 50%
- [ ] Navigate away
- [ ] Return to book
- [ ] Verify progress restored
- [ ] Verify `reading_progress` table has correct data

### Progress Updates
- [ ] Scroll through chapter
- [ ] Verify progress bar updates in real-time
- [ ] Wait 2 seconds after scrolling stops
- [ ] Verify database updated

## Email Notifications

### Welcome Email
- [ ] Complete first purchase
- [ ] Verify welcome email sent via Resend
- [ ] Check email content and links

## Security

### RLS Policies
- [ ] Try to access another user's purchase (via API) → Should fail
- [ ] Try to access another user's progress → Should fail
- [ ] Try to modify another user's profile → Should fail
- [ ] Unauthenticated request to protected data → Should fail

### Stripe Security
- [ ] Verify webhook signature validation
- [ ] Try to forge webhook request → Should return 400
- [ ] Verify metadata validation (bookId, userId required)

## Database

### Data Integrity
- [ ] Verify foreign key constraints work
- [ ] Delete book → Verify chapters cascade delete
- [ ] Delete user → Verify profile and purchases cascade

### Indexes
- [ ] Verify queries use indexes (check query performance)
- [ ] Book slug lookup is fast
- [ ] User library query is fast
- [ ] Reading progress query is fast

## Performance

### Page Load Times
- [ ] Landing page loads < 3s
- [ ] Book catalog loads < 2s
- [ ] Reader loads < 2s
- [ ] No layout shift during loading

### API Response Times
- [ ] Sign in < 500ms
- [ ] Book fetch < 500ms
- [ ] Progress update < 500ms

## Mobile Responsiveness

### Device Testing
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on iPad
- [ ] Test responsive breakpoints: 320px, 768px, 1024px, 1440px

### Touch Interactions
- [ ] Buttons are touch-friendly (min 44px)
- [ ] Reader scrolls smoothly
- [ ] Navigation menu works
- [ ] Forms are usable on mobile

## Error Handling

### Graceful Degradation
- [ ] Test with JavaScript disabled → Basic functionality works
- [ ] Test with slow network → Loading states display
- [ ] Test offline → Appropriate error messages

### Error Pages
- [ ] 404 page for unknown routes
- [ ] 500 page for server errors
- [ ] Error boundaries catch React errors

## Deployment

### Vercel Deployment
- [ ] Build succeeds without errors
- [ ] All environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate valid
- [ ] Redirects work (www to non-www)

### Post-Deployment
- [ ] Test all features in production
- [ ] Verify Stripe webhooks point to production URL
- [ ] Check Supabase connection
- [ ] Monitor error logs
- [ ] Test email delivery

## Final Checklist

- [ ] All critical features working
- [ ] No console errors
- [ ] No 500 errors in logs
- [ ] Performance acceptable
- [ ] Mobile experience good
- [ ] Security verified
- [ ] Documentation complete

## Sign-off

**Tested by:** _______________

**Date:** _______________

**Status:** [ ] Ready for Launch  [ ] Needs Fixes

**Notes:**
