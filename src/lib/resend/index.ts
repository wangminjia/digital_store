import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string
  name?: string
}) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: 'Welcome to E-Book Shop!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to E-Book Shop!</h1>
        <p>Hi ${name || 'there'},</p>
        <p>Thank you for your first purchase! We're excited to have you as a reader.</p>
        <p>You can access your books anytime by visiting your library:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/app" 
           style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; margin: 16px 0;">
          Go to Library
        </a>
        <p>Happy reading!</p>
        <p>The E-Book Shop Team</p>
      </div>
    `,
  })

  if (error) {
    throw error
  }

  return data
}
