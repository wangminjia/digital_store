import { sendWelcomeEmail } from '@/lib/resend'

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()

    if (!email) {
      return new Response('Email is required', { status: 400 })
    }

    await sendWelcomeEmail({ email, name })

    return new Response('Email sent successfully', { status: 200 })
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return new Response('Failed to send email', { status: 500 })
  }
}
