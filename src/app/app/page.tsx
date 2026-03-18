import Link from 'next/link'
import { AppNav } from '@/components/app/nav'
import { getUserLibrary } from '@/server/actions/books'
import { BookCard } from '@/components/books/book-card'
import { Button } from '@/components/ui/button'
import { Library } from 'lucide-react'

export default async function AppPage() {
  const books = await getUserLibrary()

  return (
    <div className="flex flex-col min-h-screen">
      <AppNav />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Library</h1>
              <p className="text-muted-foreground mt-1">
                Access your purchased books and continue reading
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/books">
                <Library className="mr-2 h-4 w-4" />
                Browse Store
              </Link>
            </Button>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <Library className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your library is empty</h2>
              <p className="text-muted-foreground mb-6">
                Purchase books from our store to start reading
              </p>
              <Button asChild>
                <Link href="/books">Browse Books</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} isPurchased />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
