import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBookWithChapters, deleteChapter } from '@/server/actions/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react'

interface ChaptersPageProps {
  params: Promise<{
    bookId: string
  }>
}

export default async function ChaptersPage({ params }: ChaptersPageProps) {
  const { bookId } = await params
  const { book, chapters } = await getBookWithChapters(bookId)
  
  if (!book) {
    notFound()
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/books">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-muted-foreground">Manage chapters</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/books/${bookId}/chapters/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Chapter
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4">
        {chapters.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No chapters yet</p>
              <Button asChild>
                <Link href={`/admin/books/${bookId}/chapters/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Chapter
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          chapters.map((chapter: any) => (
            <Card key={chapter.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">#{chapter.order_number}</Badge>
                    <h3 className="font-semibold">{chapter.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/books/${bookId}/chapters/${chapter.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server'
                      await deleteChapter(chapter.id, bookId)
                    }}>
                      <Button variant="destructive" size="sm" type="submit">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
