export interface Book {
  id: string
  title: string
  description: string
  cover_image_url: string | null
  price: number
  author: string
  published_at: string | null
  created_at: string
  updated_at: string
  slug: string
  is_published: boolean
}

export interface Chapter {
  id: string
  book_id: string
  title: string
  content: string
  order_number: number
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  user_id: string
  book_id: string
  stripe_payment_intent_id: string | null
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'refunded'
  created_at: string
  updated_at: string
}

export interface ReadingProgress {
  id: string
  user_id: string
  book_id: string
  chapter_id: string
  progress_percentage: number
  last_read_at: string
  created_at: string
  updated_at: string
}

export interface BookWithChapters extends Book {
  chapters: Chapter[]
}

export interface BookWithProgress extends Book {
  reading_progress?: ReadingProgress
  purchase?: Purchase
}
