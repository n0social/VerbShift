'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

interface SearchBarProps {
  placeholder?: string
  basePath?: string
}

export default function SearchBar({
  placeholder = 'Search guides...',
  basePath = '/guides',
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (query) {
        params.set('q', query)
      } else {
        params.delete('q')
      }
      router.push(`${basePath}?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
      </div>
      {isPending && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      )}
    </form>
  )
}
