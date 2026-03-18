import Link from 'next/link'
import { getAllBooks } from '@/server/actions/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, FileText } from 'lucide-react'
import { deleteBook } from '@/server/actions/admin'

export default async function AdminBooksPage() {
  const books = await getAllBooks()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Books</h1>
          <p className="text-muted-foreground">Manage your book catalog</p>
        </div>
        <Button asChild>
          <Link href="/admin/books/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4">
        {books.map((book: any) => (
          <Card key={book.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <Badge variant={book.is_published ? 'default' : 'secondary'}>
                      {book.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="text-sm">${(book.price / 100).toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/books/${book.id}/chapters`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Chapters
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/books/${book.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <form action={async () => {
                    'use server'
                    await deleteBook(book.id)
                  }}>
                    <Button variant="destructive" size="sm" type="submit">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
