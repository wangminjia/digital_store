# E-Book Shop + Reader MVP

A production-ready e-book shop and reader application built with Next.js, Supabase, Stripe, and shadcn/ui.

## Features

- **Public Pages**: Landing page, pricing page, and book catalog
- **Authentication**: Sign up, sign in, password reset with email verification
- **Protected Reader**: Dashboard and chapter-by-chapter reader with progress tracking
- **Payment Integration**: Stripe Checkout with webhook-based purchase entitlements
- **Email Notifications**: Welcome emails via Resend
- **Row Level Security**: Users can only access their own data

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Payments**: [Stripe](https://stripe.com/) (Checkout + Webhooks)
- **Email**: [Resend](https://resend.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd ebook-shop/my-app
npm install
```

### 2. Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Resend Configuration
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the migration SQL in your Supabase SQL Editor:

```bash
# Located at: supabase/migrations/001_initial_schema.sql
```

This creates:
- `books` - Book catalog
- `chapters` - Book chapters
- `profiles` - User profiles
- `purchases` - Purchase records
- `reading_progress` - User reading progress
- Row Level Security policies

### 4. Stripe Configuration

1. Create a Stripe account and get your API keys
2. Create a product/price for each book in your Stripe Dashboard
3. Set up webhook endpoint:
   - Local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Production: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for: `checkout.session.completed`, `payment_intent.payment_failed`, `charge.refunded`

### 5. Supabase Storage (Optional)

For private book assets (PDFs, images):

1. Go to Supabase Dashboard → Storage
2. Create a bucket named `book-assets`
3. Set to private
4. Update storage policies in SQL:

```sql
-- Allow users to download their purchased books
CREATE POLICY "Users can download purchased books" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'book-assets' AND
    EXISTS (
      SELECT 1 FROM purchases
      WHERE purchases.book_id = (storage.objects.metadata->>'book_id')::uuid
      AND purchases.user_id = auth.uid()
      AND purchases.status = 'completed'
    )
  );
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add environment variables in Vercel Dashboard → Project Settings → Environment Variables.

## Project Structure

```
my-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (signin, signup, etc.)
│   │   ├── (marketing)/       # Public pages (landing, pricing)
│   │   ├── (app)/             # Protected app routes
│   │   ├── api/               # API routes (checkout, webhooks)
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── auth/              # Auth forms
│   │   ├── books/             # Book display components
│   │   ├── reader/            # Reader component
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── supabase/          # Supabase clients
│   │   ├── stripe/            # Stripe integration
│   │   └── resend/            # Email integration
│   ├── server/
│   │   ├── actions/           # Server Actions
│   │   └── webhooks/          # Webhook handlers
│   └── types/                 # TypeScript types
├── supabase/
│   └── migrations/            # Database migrations
└── package.json
```

## Server Actions

All data mutations use Next.js Server Actions for security:

- `signUp()` - User registration
- `signIn()` - User authentication
- `signOut()` - Logout
- `resetPassword()` - Password reset request
- `updatePassword()` - Password update
- `getBooks()` - Fetch book catalog
- `getBookBySlug()` - Fetch single book
- `getUserLibrary()` - Fetch user's purchased books
- `updateReadingProgress()` - Save reading progress
- `checkPurchaseStatus()` - Verify book ownership

## Database Schema

### Books
- `id`, `title`, `description`, `cover_image_url`, `price`, `author`
- `published_at`, `is_published`, `slug`, `created_at`, `updated_at`

### Chapters
- `id`, `book_id`, `title`, `content`, `order_number`

### Profiles
- `id` (links to auth.users), `email`, `full_name`, `avatar_url`

### Purchases
- `id`, `user_id`, `book_id`, `stripe_payment_intent_id`, `amount`, `currency`, `status`

### Reading Progress
- `id`, `user_id`, `book_id`, `chapter_id`, `progress_percentage`, `last_read_at`

## Row Level Security

All tables have RLS enabled:

- **Books**: Public can view published books
- **Chapters**: Only accessible if book is purchased or free
- **Profiles**: Users can only access their own profile
- **Purchases**: Users can only view their own purchases
- **Reading Progress**: Users can only access their own progress

## Manual Verification Checklist

### Authentication
- [ ] Sign up with email/password
- [ ] Email verification sent
- [ ] Sign in with credentials
- [ ] Password reset flow
- [ ] Middleware redirects unauthenticated users
- [ ] Middleware redirects authenticated users away from auth pages

### Public Pages
- [ ] Landing page loads
- [ ] Book catalog displays
- [ ] Individual book page loads
- [ ] Pricing page displays
- [ ] Navigation works on mobile

### Book Purchasing
- [ ] "Buy Now" button creates Stripe Checkout session
- [ ] Checkout success redirects to library
- [ ] Purchase record created in database
- [ ] Webhook processes payment completion
- [ ] User can access purchased book

### Reader
- [ ] Library shows purchased books
- [ ] Reader displays chapter content
- [ ] Progress bar updates on scroll
- [ ] Progress saves to database
- [ ] Chapter navigation works
- [ ] Return to last read position

### Email
- [ ] Welcome email sent on first purchase

### Security
- [ ] Unauthenticated users cannot access /app routes
- [ ] Users cannot access books they haven't purchased
- [ ] RLS policies prevent unauthorized data access
- [ ] Stripe webhooks validate signature

## Environment Variable Reference

| Variable | Description | Source |
|----------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard |
| `STRIPE_SECRET_KEY` | Stripe secret key | Stripe Dashboard |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Stripe CLI or Dashboard |
| `RESEND_API_KEY` | Resend API key | Resend Dashboard |
| `RESEND_FROM_EMAIL` | Verified sender email | Resend Dashboard |
| `NEXT_PUBLIC_APP_URL` | App URL (localhost or production) | Your deployment |

## Troubleshooting

### Stripe Webhook Errors
1. Ensure webhook secret is correct
2. Check event types are configured correctly
3. Verify endpoint URL is accessible

### RLS Policy Errors
1. Check user is authenticated
2. Verify policy allows the operation
3. Use service role key for admin operations

### Build Errors
1. Check all env vars are set
2. Ensure TypeScript types are generated
3. Verify all imports are correct

## License

MIT
