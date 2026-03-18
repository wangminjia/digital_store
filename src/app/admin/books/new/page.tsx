import Link from 'next/link'
import { createBook } from '@/server/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'

export default function NewBookPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/books">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Book</h1>
          <p className="text-muted-foreground">Create a new book in your catalog</p>
        </div>
      </div>
      
      <Card>
        <form action={createBook}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required placeholder="the-art-of-programming" />
              <p className="text-sm text-muted-foreground">Used in URL: /books/your-slug</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required rows={4} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input id="price" name="price" type="number" min="0" step="0.01" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Cover Image URL (optional)</Label>
              <Input id="coverImageUrl" name="coverImageUrl" type="url" placeholder="https://..." />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="isPublished" name="isPublished" />
              <Label htmlFor="isPublished">Publish immediately</Label>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button type="submit">Create Book</Button>
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
