import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBookBySlug, checkPurchaseStatus } from '@/server/actions/books'
import { MarketingNav } from '@/components/marketing/nav'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BookOpen, ShoppingCart, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

interface BookPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  
  if (!book) {
    notFound()
  }
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isPurchased = user ? await checkPurchaseStatus(book.id) : false

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Book Cover */}
            <div className="aspect-[2/3] relative bg-muted rounded-lg overflow-hidden max-w-md mx-auto lg:mx-0">
              {book.cover_image_url ? (
                <Image
                  src={book.cover_image_url}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BookOpen className="h-32 w-32 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-4">
                  {book.author}
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight mb-4">
                  {book.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  ${(book.price / 100).toFixed(2)}
                </span>
                {isPurchased ? (
                  <Button size="lg" asChild>
                    <Link href={`/app/books/${book.id}`}>
                      <BookOpen className="mr-2 h-5 w-5" />
                      Read Now
                    </Link>
                  </Button>
                ) : (
                  <form action="/api/checkout" method="POST">
                    <input type="hidden" name="bookId" value={book.id} />
                    <Button size="lg" type="submit">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Buy Now
                    </Button>
                  </form>
                )}
              </div>
              
              {isPurchased && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  <span>You own this book</span>
                </div>
              )}
              
              <Separator />
              
              {/* Chapters List */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Chapters</h2>
                {book.chapters.length === 0 ? (
                  <p className="text-muted-foreground">No chapters available yet.</p>
                ) : (
                  <div className="space-y-2">
                    {book.chapters.map((chapter, index) => (
                      <Card key={chapter.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-muted-foreground mr-2">
                                Chapter {index + 1}
                              </span>
                              <span className="font-medium">{chapter.title}</span>
                            </div>
                            {isPurchased && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/app/books/${book.id}/chapters/${chapter.id}`}>
                                  Read
                                </Link>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
