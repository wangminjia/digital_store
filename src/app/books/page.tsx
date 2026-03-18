import Link from 'next/link'
import { MarketingNav } from '@/components/marketing/nav'
import { BookList, BookListSkeleton } from '@/components/books/book-list'
import { Suspense } from 'react'

export default function BooksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Book Collection
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Browse our curated selection of premium e-books. Purchase once, read forever.
              </p>
            </div>
            <Suspense fallback={<BookListSkeleton />}>
              <BookList />
            </Suspense>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2026 E-Book Shop. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
