import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MarketingNav } from '@/components/marketing/nav'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    description: 'Perfect for casual readers',
    price: 0,
    features: [
      'Access to free books',
      'Basic reader features',
      'Progress tracking',
      'Cloud sync',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
  },
  {
    name: 'Pro',
    description: 'For serious book lovers',
    price: 999,
    features: [
      'Everything in Basic',
      'Access to premium books',
      'Priority support',
      'Advanced annotations',
      'Offline reading',
    ],
    cta: 'Upgrade to Pro',
    href: '/auth/signup',
    popular: true,
  },
  {
    name: 'Team',
    description: 'For organizations',
    price: 2999,
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Admin dashboard',
      'Usage analytics',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    href: '#',
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the plan that works best for you. All plans include access to our reader app.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 mt-12 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card key={plan.name} className={plan.popular ? 'border-primary shadow-lg' : ''}>
                  {plan.popular && (
                    <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-4xl font-bold">
                      ${(plan.price / 100).toFixed(2)}
                      <span className="text-lg font-normal text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} asChild>
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2026 E-Book Shop. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
