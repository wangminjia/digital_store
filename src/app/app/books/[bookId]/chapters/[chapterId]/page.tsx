import { notFound, redirect } from 'next/navigation'
import { getBookBySlug, checkPurchaseStatus, getChapter, getReadingProgress } from '@/server/actions/books'
import { AppNav } from '@/components/app/nav'
import { Reader } from '@/components/reader/reader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface ChapterPageProps {
  params: Promise<{
    bookId: string
    chapterId: string
  }>
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { bookId, chapterId } = await params
  const book = await getBookBySlug(bookId)
  
  if (!book) {
    notFound()
  }
  
  const isPurchased = await checkPurchaseStatus(book.id)
  
  if (!isPurchased) {
    redirect(`/books/${book.slug}`)
  }
  
  const chapter = await getChapter(book.id, chapterId)
  
  if (!chapter) {
    notFound()
  }

  const currentChapterIndex = book.chapters.findIndex(c => c.id === chapterId)

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
                {book.chapters.map((ch, index) => (
                  <Button
                    key={ch.id}
                    variant={ch.id === chapterId ? 'default' : 'outline'}
                    size="sm"
                    asChild
                  >
                    <Link href={`/app/books/${book.id}/chapters/${ch.id}`}>
                      {index + 1}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Reader */}
            <Reader 
              bookId={book.id}
              chapter={chapter}
              totalChapters={book.chapters.length}
              currentChapterIndex={currentChapterIndex}
              chapterIds={book.chapters.map(c => c.id)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
