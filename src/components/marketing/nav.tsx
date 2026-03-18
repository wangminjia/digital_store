import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function MarketingNav() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link href="/" className="flex items-center justify-center gap-2">
        <BookOpen className="h-6 w-6" />
        <span className="font-bold text-xl">E-Book Shop</span>
      </Link>
      <nav className="hidden md:flex ml-auto gap-4 sm:gap-6">
        <Link href="/books" className="text-sm font-medium hover:underline underline-offset-4">
          Books
        </Link>
        <Link href="/pricing" className="text-sm font-medium hover:underline underline-offset-4">
          Pricing
        </Link>
      </nav>
      <div className="hidden md:flex ml-auto gap-2">
        <Button variant="ghost" asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/signup">Get Started</Link>
        </Button>
      </div>
      <Sheet>
        <SheetTrigger asChild className="md:hidden ml-auto">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col gap-4">
            <Link href="/books" className="text-sm font-medium">
              Books
            </Link>
            <Link href="/pricing" className="text-sm font-medium">
              Pricing
            </Link>
            <Link href="/auth/signin" className="text-sm font-medium">
              Sign In
            </Link>
            <Link href="/auth/signup" className="text-sm font-medium">
              Get Started
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
