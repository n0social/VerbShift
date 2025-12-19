"use client";

import { Footer } from '@/components'
import NavbarWrapper from '@/components/NavbarWrapper';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  )
}
