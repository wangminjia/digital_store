import { notFound, redirect } from 'next/navigation'
import { getBookBySlug, checkPurchaseStatus, getReadingProgress } from '@/server/actions/books'
import { AppNav } from '@/components/app/nav'
import { Reader } from '@/components/reader/reader'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ReaderPageProps {
  params: Promise<{
    bookId: string
  }>
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { bookId } = await params
  const book = await getBookBySlug(bookId)
  
  if (!book) {
    notFound()
  }
  
  const isPurchased = await checkPurchaseStatus(book.id)
  
  if (!isPurchased) {
    redirect(`/books/${book.slug}`)
  }
  
  const progress = await getReadingProgress(book.id)
  const currentChapter = progress 
    ? book.chapters.find(c => c.id === progress.chapterId) || book.chapters[0]
    : book.chapters[0]

  return (
    <div className="flex flex-col min-h-screen">
      <AppNav />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" asChild>
                <Link href="/app">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Library
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                {book.title}
              </span>
            </div>
            
            {/* Chapter Navigation */}
            <div className="mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {book.chapters.map((chapter, index) => (
                  <Button
                    key={chapter.id}
                    variant={chapter.id === currentChapter?.id ? 'default' : 'outline'}
                    size="sm"
                    asChild
                  >
                    <Link href={`/app/books/${book.id}/chapters/${chapter.id}`}>
                      {index + 1}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Reader */}
            {currentChapter ? (
              <Reader 
                bookId={book.id}
                chapter={currentChapter}
                totalChapters={book.chapters.length}
                currentChapterIndex={book.chapters.findIndex(c => c.id === currentChapter.id)}
                chapterIds={book.chapters.map(c => c.id)}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No chapters available for this book.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
