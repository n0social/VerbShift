import Link from 'next/link'
import { Clock, ArrowRight, Eye } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

interface GuideCardProps {
  title: string
  excerpt: string
  slug: string
  coverImage?: string | null
  category: {
    name: string
    slug: string
    color: string
  }
  readTime: number
  views?: number
  createdAt: Date | string
  featured?: boolean
  type?: 'guide' | 'blog'
}

export default function GuideCard({
  title,
  excerpt,
  slug,
  coverImage,
  category,
  readTime,
  views,
  createdAt,
  featured = false,
  type = 'guide',
}: GuideCardProps) {
  const href = type === 'guide' ? `/guides/${slug}` : `/blog/${slug}`

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-gray-200',
        featured && 'md:col-span-2 md:flex-row'
      )}
    >
      {/* Image */}
      <div
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100',
          featured ? 'md:w-1/2 aspect-video md:aspect-auto' : 'aspect-video'
        )}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">🤖</div>
          </div>
        )}
        
        {/* Category badge */}
        <Link
          href={`/${type === 'guide' ? 'guides' : 'blog'}?category=${category.slug}`}
          className="absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm transition-transform hover:scale-105"
          style={{ backgroundColor: category.color }}
        >
          {category.name}
        </Link>
      </div>

      {/* Content */}
      <div className={cn('flex flex-1 flex-col p-6', featured && 'md:p-8')}>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time dateTime={new Date(createdAt).toISOString()}>
            {formatDate(createdAt)}
          </time>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readTime} min read
          </span>
          {views !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {views}
            </span>
          )}
        </div>

        <h3
          className={cn(
            'mt-3 font-semibold text-gray-900 group-hover:text-primary-600 transition-colors',
            featured ? 'text-2xl' : 'text-lg'
          )}
        >
          <Link href={href}>
            <span className="absolute inset-0" />
            {title}
          </Link>
        </h3>

        <p className={cn('mt-3 text-gray-600 line-clamp-2', featured && 'line-clamp-3')}>
          {excerpt}
        </p>

        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:gap-2 transition-all">
            Read more
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  )
}
