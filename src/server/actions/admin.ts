'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function isAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  return profile?.is_admin === true
}

export async function getDashboardStats() {
  const supabase = await createClient()
  
  const [
    { count: totalUsers },
    { count: totalBooks },
    { count: totalPurchases },
    { count: totalChapters },
    { data: recentPurchases }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('books').select('*', { count: 'exact', head: true }),
    supabase.from('purchases').select('*', { count: 'exact', head: true }),
    supabase.from('chapters').select('*', { count: 'exact', head: true }),
    supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
  ])
  
  let enrichedPurchases: any[] = []
  
  if (recentPurchases && recentPurchases.length > 0) {
    const userIds = [...new Set(recentPurchases.map(p => p.user_id))]
    const bookIds = [...new Set(recentPurchases.map(p => p.book_id))]
    
    const [{ data: profiles }, { data: books }] = await Promise.all([
      supabase.from('profiles').select('id, email').in('id', userIds),
      supabase.from('books').select('id, title').in('id', bookIds)
    ])
    
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
    const bookMap = new Map(books?.map(b => [b.id, b]) || [])
    
    enrichedPurchases = recentPurchases.map(purchase => ({
      ...purchase,
      profiles: profileMap.get(purchase.user_id) || null,
      books: bookMap.get(purchase.book_id) || null
    }))
  }
  
  return {
    totalUsers: totalUsers || 0,
    totalBooks: totalBooks || 0,
    totalPurchases: totalPurchases || 0,
    totalChapters: totalChapters || 0,
    recentPurchases: enrichedPurchases
  }
}

export async function getAllBooks() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getBookWithChapters(bookId: string) {
  const supabase = await createClient()
  
  const { data: book, error: bookError } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single()
  
  if (bookError) throw bookError
  
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)
    .order('order_number', { ascending: true })
  
  if (chaptersError) throw chaptersError
  
  return { book, chapters: chapters || [] }
}

export async function createBook(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const author = formData.get('author') as string
  const price = parseInt(formData.get('price') as string) * 100 // Convert to cents
  const slug = formData.get('slug') as string
  const isPublished = formData.get('isPublished') === 'on'
  const coverImageUrl = formData.get('coverImageUrl') as string
  
  const { error } = await supabase
    .from('books')
    .insert({
      title,
      description,
      author,
      price,
      slug,
      is_published: isPublished,
      cover_image_url: coverImageUrl || null,
      published_at: isPublished ? new Date().toISOString() : null
    })
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/books')
  redirect('/admin/books')
}

export async function updateBook(bookId: string, formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const author = formData.get('author') as string
  const price = parseInt(formData.get('price') as string) * 100
  const slug = formData.get('slug') as string
  const isPublished = formData.get('isPublished') === 'on'
  const coverImageUrl = formData.get('coverImageUrl') as string
  
  const { error } = await supabase
    .from('books')
    .update({
      title,
      description,
      author,
      price,
      slug,
      is_published: isPublished,
      cover_image_url: coverImageUrl || null,
      published_at: isPublished ? new Date().toISOString() : null
    })
    .eq('id', bookId)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/books')
  revalidatePath(`/admin/books/${bookId}`)
  redirect('/admin/books')
}

export async function deleteBook(bookId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/books')
  return { success: true }
}

export async function createChapter(bookId: string, formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const orderNumber = parseInt(formData.get('orderNumber') as string)
  
  const { error } = await supabase
    .from('chapters')
    .insert({
      book_id: bookId,
      title,
      content,
      order_number: orderNumber
    })
  
  if (error) return { error: error.message }
  
  revalidatePath(`/admin/books/${bookId}/chapters`)
  redirect(`/admin/books/${bookId}/chapters`)
}

export async function updateChapter(chapterId: string, formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const orderNumber = parseInt(formData.get('orderNumber') as string)
  
  const { error } = await supabase
    .from('chapters')
    .update({
      title,
      content,
      order_number: orderNumber
    })
    .eq('id', chapterId)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/books')
  return { success: true }
}

export async function deleteChapter(chapterId: string, bookId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('chapters')
    .delete()
    .eq('id', chapterId)
  
  if (error) return { error: error.message }
  
  revalidatePath(`/admin/books/${bookId}/chapters`)
  return { success: true }
}

export async function getAllUsers() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getAllPurchases() {
  const supabase = await createClient()
  
  const { data: purchases, error } = await supabase
    .from('purchases')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  if (!purchases || purchases.length === 0) {
    return []
  }
  
  const userIds = [...new Set(purchases.map(p => p.user_id))]
  const bookIds = [...new Set(purchases.map(p => p.book_id))]
  
  const [{ data: profiles }, { data: books }] = await Promise.all([
    supabase.from('profiles').select('id, email').in('id', userIds),
    supabase.from('books').select('id, title').in('id', bookIds)
  ])
  
  const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
  const bookMap = new Map(books?.map(b => [b.id, b]) || [])
  
  return purchases.map(purchase => ({
    ...purchase,
    profiles: profileMap.get(purchase.user_id) || null,
    books: bookMap.get(purchase.book_id) || null
  }))
}

export async function toggleUserAdmin(userId: string, isAdmin: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({ is_admin: !isAdmin })
    .eq('id', userId)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}
