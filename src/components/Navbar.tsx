'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Sparkles, BookOpen, FileText, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Guides', href: '/guides' },
  { name: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              AI Guides
            </span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-600',
                pathname === item.href
                  ? 'text-primary-600'
                  : 'text-gray-600'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Link
            href="/search"
            className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn('lg:hidden', mobileMenuOpen ? 'block' : 'hidden')}>
        <div className="fixed inset-0 z-50" onClick={() => setMobileMenuOpen(false)} />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">AI Guides</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      '-mx-3 block rounded-lg px-3 py-2 text-base font-medium',
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-2">
                <Link
                  href="/search"
                  className="-mx-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="h-5 w-5" />
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
