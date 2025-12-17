import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  name: string
  slug: string
  color: string
  count?: number
  active?: boolean
  type?: 'guide' | 'blog'
}

export default function CategoryBadge({
  name,
  slug,
  color,
  count,
  active = false,
  type = 'guide',
}: CategoryBadgeProps) {
  const href = type === 'guide' ? `/guides?category=${slug}` : `/blog?category=${slug}`

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
        active
          ? 'text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      )}
      style={active ? { backgroundColor: color } : undefined}
    >
      {!active && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {name}
      {count !== undefined && (
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs',
            active ? 'bg-white/20' : 'bg-gray-200'
          )}
        >
          {count}
        </span>
      )}
    </Link>
  )
}
