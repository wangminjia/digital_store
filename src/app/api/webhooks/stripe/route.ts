import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/client'
import Stripe from 'stripe'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const payload = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig || !endpointSecret) {
    return new Response('Webhook signature missing', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.log(`Webhook signature verification failed: ${errorMessage}`)
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 })
  }

  const supabase = createServiceClient()

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      
      const bookId = session.metadata?.bookId
      const userId = session.metadata?.userId
      
      if (!bookId || !userId) {
        console.error('Missing metadata in checkout session')
        return new Response('Missing metadata', { status: 400 })
      }

      // Create or update purchase record
      const { error } = await supabase
        .from('purchases')
        .upsert({
          user_id: userId,
          book_id: bookId,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'completed',
        }, {
          onConflict: 'user_id,book_id',
        })

      if (error) {
        console.error('Error creating purchase:', error)
        return new Response('Database error', { status: 500 })
      }

      // Send welcome email for first purchase
      const { data: userPurchases } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'completed')

      if (userPurchases && userPurchases.length === 1) {
        // This is the first purchase, send welcome email
        try {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/welcome`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.customer_email,
              name: session.customer_details?.name,
            }),
          })
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError)
        }
      }

      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`Payment failed: ${paymentIntent.id}`)
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      
      // Find and update the purchase record
      const { error } = await supabase
        .from('purchases')
        .update({ status: 'refunded' })
        .eq('stripe_payment_intent_id', charge.payment_intent as string)

      if (error) {
        console.error('Error updating refund status:', error)
      }
      
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new Response('Webhook processed', { status: 200 })
}
