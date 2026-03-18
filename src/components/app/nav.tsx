import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/server/actions/auth'

export async function AppNav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single()

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link href="/app" className="flex items-center justify-center gap-2">
        <BookOpen className="h-6 w-6" />
        <span className="font-bold text-xl">E-Book Shop</span>
      </Link>
      <nav className="hidden md:flex ml-8 gap-4 sm:gap-6">
        <Link href="/app" className="text-sm font-medium hover:underline underline-offset-4">
          Library
        </Link>
        <Link href="/books" className="text-sm font-medium hover:underline underline-offset-4">
          Store
        </Link>
      </nav>
      <div className="flex items-center ml-auto gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {profile?.full_name && (
                  <p className="font-medium">{profile.full_name}</p>
                )}
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/app">Library</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/books">Store</Link>
            </DropdownMenuItem>
            {profile?.is_admin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async () => {
                'use server'
                await signOut()
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4">
              <Link href="/app" className="text-sm font-medium">
                Library
              </Link>
              <Link href="/books" className="text-sm font-medium">
                Store
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
