import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Verbshift',
  description: 'Your Content... Streamlined. Professional Prose, Programmatically Generated.',
  keywords: ['Verbshift', 'content', 'AI', 'streamlined', 'editor', 'writing', 'automation'],
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
