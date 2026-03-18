import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Book } from '@/types'
import { BookOpen, ShoppingCart, Star } from 'lucide-react'

interface BookCardProps {
  book: Book
  isPurchased?: boolean
}

export function BookCard({ book, isPurchased = false }: BookCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full card-lift group border-border/50 bg-card">
      <div className="aspect-[2/3] relative bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {book.cover_image_url ? (
          <Image
            src={book.cover_image_url}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/5 to-secondary/20">
            <BookOpen className="h-20 w-20 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isPurchased && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-accent text-accent-foreground border-0 shadow-md">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Owned
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="flex-1 p-5">
        <Badge variant="secondary" className="mb-3 text-xs font-medium bg-secondary/80">
          {book.author}
        </Badge>
        <h3 className="font-heading font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {book.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-heading font-bold text-xl text-foreground">
            ${(book.price / 100).toFixed(2)}
          </span>
          {isPurchased && (
            <span className="text-xs text-muted-foreground">Purchased</span>
          )}
        </div>
        <Button 
          asChild 
          size="sm" 
          className={`btn-press ${isPurchased ? 'bg-accent hover:bg-accent/90' : ''}`}
        >
          <Link href={`/books/${book.slug}`}>
            {isPurchased ? (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Read
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                View
              </>
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
