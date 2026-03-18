export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
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
        Insert: {
          id?: string
          title: string
          description: string
          cover_image_url?: string | null
          price: number
          author: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
          slug: string
          is_published?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          cover_image_url?: string | null
          price?: number
          author?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
          slug?: string
          is_published?: boolean
        }
      }
      chapters: {
        Row: {
          id: string
          book_id: string
          title: string
          content: string
          order_number: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          title: string
          content: string
          order_number: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          title?: string
          content?: string
          order_number?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          book_id: string
          stripe_payment_intent_id?: string | null
          amount: number
          currency?: string
          status?: 'pending' | 'completed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          stripe_payment_intent_id?: string | null
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
      }
      reading_progress: {
        Row: {
          id: string
          user_id: string
          book_id: string
          chapter_id: string
          progress_percentage: number
          last_read_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          chapter_id: string
          progress_percentage?: number
          last_read_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          chapter_id?: string
          progress_percentage?: number
          last_read_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
