import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'
import { redirect } from 'next/navigation'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const formData = await req.formData()
  const bookId = formData.get('bookId') as string

  if (!bookId) {
    return new Response('Book ID is required', { status: 400 })
  }

  // Fetch book details
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single()

  if (error || !book) {
    return new Response('Book not found', { status: 404 })
  }

  // Check if user already owns this book
  const { data: existingPurchase } = await supabase
    .from('purchases')
    .select('*')
    .eq('book_id', bookId)
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .single()

  if (existingPurchase) {
    redirect('/app')
  }

  // Create checkout session
  const session = await createCheckoutSession({
    bookId: book.id,
    bookTitle: book.title,
    price: book.price,
    userId: user.id,
    email: user.email!,
  })

  if (session.url) {
    redirect(session.url)
  }

  return new Response('Failed to create checkout session', { status: 500 })
}
