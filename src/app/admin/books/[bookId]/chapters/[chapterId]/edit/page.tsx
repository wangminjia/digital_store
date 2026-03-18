import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBookWithChapters, updateChapter } from '@/server/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

interface EditChapterPageProps {
  params: Promise<{
    bookId: string
    chapterId: string
  }>
}

export default async function EditChapterPage({ params }: EditChapterPageProps) {
  const { bookId, chapterId } = await params
  const { book, chapters } = await getBookWithChapters(bookId)
  const chapter = chapters.find((c: any) => c.id === chapterId)
  
  if (!book || !chapter) {
    notFound()
  }
  
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/books/${bookId}/chapters`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Chapter</h1>
          <p className="text-muted-foreground">Update chapter content</p>
        </div>
      </div>
      
      <Card>
        <form action={updateChapter.bind(null, chapterId)}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Chapter Title</Label>
              <Input id="title" name="title" defaultValue={chapter.title} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input id="orderNumber" name="orderNumber" type="number" min="1" defaultValue={chapter.order_number} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML supported)</Label>
              <Textarea id="content" name="content" defaultValue={chapter.content} required rows={20} />
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button type="submit">Update Chapter</Button>
              <Button variant="outline" asChild>
                <Link href={`/admin/books/${bookId}/chapters`}>Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
