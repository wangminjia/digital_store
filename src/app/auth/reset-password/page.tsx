import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import Link from 'next/link'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center">
          <span className="font-bold text-xl">E-Book Shop</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <ResetPasswordForm />
      </main>
    </div>
  )
}
