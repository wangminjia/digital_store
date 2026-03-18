import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MarketingNav } from '@/components/marketing/nav'
import { BookList, BookListSkeleton } from '@/components/books/book-list'
import { Suspense } from 'react'
import { BookOpen, Star, Shield, Zap, Library, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />
          
          <div className="container-custom relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <Zap className="h-4 w-4" />
                <span>Over 10,000+ books available</span>
              </div>
              
              <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6">
                Discover Your Next
                <span className="text-gradient block mt-2">Great Read</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                Access a curated collection of premium e-books. Read anywhere, anytime with our seamless reading experience designed for book lovers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button size="lg" className="btn-press bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all px-8" asChild>
                  <Link href="/books">
                    Browse Books
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 hover:bg-muted/50" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-6 mt-12 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>Offline Reading</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>Lifetime Ownership</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 border-y bg-muted/30">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-heading font-bold text-3xl md:text-4xl text-primary">10K+</div>
                <div className="text-sm text-muted-foreground mt-1">Books Available</div>
              </div>
              <div>
                <div className="font-heading font-bold text-3xl md:text-4xl text-primary">50K+</div>
                <div className="text-sm text-muted-foreground mt-1">Happy Readers</div>
              </div>
              <div>
                <div className="font-heading font-bold text-3xl md:text-4xl text-primary">4.9</div>
                <div className="text-sm text-muted-foreground mt-1">Average Rating</div>
              </div>
              <div>
                <div className="font-heading font-bold text-3xl md:text-4xl text-primary">100%</div>
                <div className="text-sm text-muted-foreground mt-1">Secure</div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Why Choose E-Book Shop?
              </h2>
              <p className="text-muted-foreground text-lg">
                Everything you need for an exceptional reading experience
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: Library, title: 'Curated Library', desc: 'Hand-picked selection of quality books across various genres, from bestsellers to hidden gems.' },
                { icon: BookOpen, title: 'Premium Reader', desc: 'Beautiful reading interface with progress tracking, bookmarks, and customizable settings.' },
                { icon: Shield, title: 'Secure Access', desc: 'Your purchases are securely tied to your account forever. Access them anytime, anywhere.' },
              ].map((item, i) => (
                <div key={i} className="group relative p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 bg-muted/30">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-3">
                  Featured Books
                </h2>
                <p className="text-muted-foreground text-lg">
                  Explore our latest additions to the library
                </p>
              </div>
              <Button variant="outline" className="mt-4 md:mt-0 border-2" asChild>
                <Link href="/books">View All Books</Link>
              </Button>
            </div>
            
            <Suspense fallback={<BookListSkeleton />}>
              <BookList />
            </Suspense>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg">
                Start reading in three simple steps
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { step: '01', title: 'Browse & Choose', desc: 'Explore our curated collection and find your next favorite book.', icon: Library },
                { step: '02', title: 'Purchase & Own', desc: 'Buy once, own forever. No subscriptions or hidden fees.', icon: Star },
                { step: '03', title: 'Read Anywhere', desc: 'Access your library instantly across all your devices.', icon: Clock },
              ].map((item, i) => (
                <div key={i} className="relative text-center">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="font-heading font-bold text-5xl text-muted/30 absolute -top-2 left-1/2 -translate-x-1/2 -z-10">
                    {item.step}
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container-custom">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 md:py-24 text-center">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }} />
              </div>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-6">
                  Ready to Start Reading?
                </h2>
                <p className="text-primary-foreground/80 text-lg md:text-xl mb-8">
                  Join thousands of readers and get access to our entire collection today.
                </p>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-press shadow-xl" asChild>
                  <Link href="/auth/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t bg-muted/30">
        <div className="container-custom py-12">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-heading font-bold text-xl">E-Book Shop</span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                Your gateway to thousands of premium e-books. Read anywhere, anytime.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/books" className="hover:text-primary transition-colors">Books</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/auth/signin" className="hover:text-primary transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 E-Book Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
