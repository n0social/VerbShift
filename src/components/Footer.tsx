'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Sparkles, Github, Twitter, Mail, Send, CheckCircle } from 'lucide-react'

const footerLinks = {
  guides: [
    { name: 'Getting Started', href: '/guides?category=getting-started' },
    { name: 'Machine Learning', href: '/guides?category=machine-learning' },
    { name: 'Prompt Engineering', href: '/guides?category=prompt-engineering' },
    { name: 'Tools & Frameworks', href: '/guides?category=tools-and-frameworks' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'All Guides', href: '/guides' },
    { name: 'Search', href: '/search' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy', href: '/privacy' },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)


  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to subscribe');
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      alert('There was a problem subscribing. Please try again.');
    }
    setLoading(false);
  } 

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl text-primary">
                Verbshift
              </span>
            </Link>
            <p className="text-sm text-gray-600 max-w-xs font-semibold">
              Your Content... Streamlined.
            </p>
            <p className="text-xs text-muted max-w-xs">
              Professional Prose, Programmatically Generated.
            </p>
          </div>

          {/* Links */}
          <div className="mt-16 grid grid-cols-3 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Guides</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.guides.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Company</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          {/* Newsletter Signup */}
          <div className="mb-8 w-full flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Subscribe and become a Member!</h3>
            <p className="text-xs text-gray-600 mb-4">
              Get on the list for updates.
            </p>
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                <CheckCircle className="h-5 w-5" />
                <span>Thanks for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 justify-center w-full max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-medium text-white hover:shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Subscribe
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          <p className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Verbshift. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
