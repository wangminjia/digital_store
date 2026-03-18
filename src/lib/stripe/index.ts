import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function createCheckoutSession({
  bookId,
  bookTitle,
  price,
  userId,
  email,
}: {
  bookId: string
  bookTitle: string
  price: number
  userId: string
  email: string
}) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: bookTitle,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/books`,
    metadata: {
      bookId,
      userId,
    },
  })

  return session
}
