import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBookWithChapters, updateBook } from '@/server/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'

interface EditBookPageProps {
  params: Promise<{
    bookId: string
  }>
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { bookId } = await params
  const { book } = await getBookWithChapters(bookId)
  
  if (!book) {
    notFound()
  }
  
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/books">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Book</h1>
          <p className="text-muted-foreground">Update book details</p>
        </div>
      </div>
      
      <Card>
        <form action={updateBook.bind(null, bookId)}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={book.title} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={book.slug} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" defaultValue={book.author} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={book.description} required rows={4} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input id="price" name="price" type="number" min="0" step="0.01" defaultValue={(book.price / 100).toFixed(2)} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Cover Image URL</Label>
              <Input id="coverImageUrl" name="coverImageUrl" type="url" defaultValue={book.cover_image_url || ''} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="isPublished" name="isPublished" defaultChecked={book.is_published} />
              <Label htmlFor="isPublished">Published</Label>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button type="submit">Update Book</Button>
              <Button variant="outline" asChild>
                <Link href="/admin/books">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
