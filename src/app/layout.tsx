import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Guides - Your Gateway to Mastering AI',
  description: 'Comprehensive guides and tutorials for AI tools, machine learning, and prompt engineering.',
  keywords: ['AI', 'artificial intelligence', 'machine learning', 'guides', 'tutorials', 'ChatGPT', 'prompt engineering'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
