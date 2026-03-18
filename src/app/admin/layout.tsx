import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/server/actions/admin'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ShoppingCart,
  ArrowLeft
} from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/app')
  }
  
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-muted border-r">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Manage your store</p>
        </div>
        <nav className="px-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/books">
              <BookOpen className="mr-2 h-4 w-4" />
              Books
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/purchases">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Purchases
            </Link>
          </Button>
          <div className="pt-4 mt-4 border-t">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/app">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to App
              </Link>
            </Button>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
