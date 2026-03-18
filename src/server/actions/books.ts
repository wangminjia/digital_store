'use server'

import { createClient } from '@/lib/supabase/server'
import { Book, Chapter, BookWithChapters, Purchase } from '@/types'
import { createServiceClient } from '@/lib/supabase/client'

export async function getBooks(): Promise<Book[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data || []
}

export async function getBookBySlug(slug: string): Promise<BookWithChapters | null> {
  const supabase = await createClient()
  
  const { data: book, error: bookError } = await supabase
    .from('books')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  
  if (bookError || !book) {
    return null
  }
  
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', book.id)
    .order('order_number', { ascending: true })
  
  if (chaptersError) {
    throw new Error(chaptersError.message)
  }
  
  return {
    ...book,
    chapters: chapters || [],
  }
}

export async function getChapter(bookId: string, chapterId: string): Promise<Chapter | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', chapterId)
    .eq('book_id', bookId)
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

export async function checkPurchaseStatus(bookId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }
  
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('book_id', bookId)
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .single()
  
  if (error || !data) {
    return false
  }
  
  return true
}

export async function getUserLibrary(): Promise<Book[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
  const { data, error } = await supabase
    .from('purchases')
    .select('book:books(*)')
    .eq('user_id', user.id)
    .eq('status', 'completed')
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data?.map((purchase) => purchase.book) || []
}

export async function updateReadingProgress(
  bookId: string,
  chapterId: string,
  progressPercentage: number
): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  const { error } = await supabase
    .from('reading_progress')
    .upsert({
      user_id: user.id,
      book_id: bookId,
      chapter_id: chapterId,
      progress_percentage: Math.min(100, Math.max(0, progressPercentage)),
      last_read_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,book_id,chapter_id',
    })
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function getReadingProgress(bookId: string): Promise<{ chapterId: string; progress: number } | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }
  
  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('book_id', bookId)
    .eq('user_id', user.id)
    .order('last_read_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return {
    chapterId: data.chapter_id,
    progress: data.progress_percentage,
  }
}
