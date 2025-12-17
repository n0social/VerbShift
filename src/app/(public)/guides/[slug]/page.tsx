import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, Calendar, ArrowLeft, Eye, User } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { MarkdownRenderer, GuideCard } from '@/components'

interface GuidePageProps {
  params: { slug: string }
}

async function getGuide(slug: string) {
  const guide = await prisma.guide.findUnique({
    where: { slug, published: true },
    include: { category: true, author: true },
  })

  if (!guide) return null

  // Increment views
  await prisma.guide.update({
    where: { id: guide.id },
    data: { views: { increment: 1 } },
  })

  // Get related guides
  const relatedGuides = await prisma.guide.findMany({
    where: {
      published: true,
      categoryId: guide.categoryId,
      id: { not: guide.id },
    },
    include: { category: true },
    take: 3,
  })

  return { guide, relatedGuides }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const data = await getGuide(params.slug)

  if (!data) {
    notFound()
  }

  const { guide, relatedGuides } = data

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to guides
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Link
              href={`/guides?category=${guide.category.slug}`}
              className="rounded-full px-3 py-1 text-sm font-medium text-white"
              style={{ backgroundColor: guide.category.color }}
            >
              {guide.category.name}
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            {guide.title}
          </h1>

          <p className="mt-6 text-xl text-gray-600">{guide.excerpt}</p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{guide.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={guide.createdAt.toISOString()}>
                {formatDate(guide.createdAt)}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{guide.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{guide.views + 1} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        {guide.coverImage && (
          <div className="mb-12 overflow-hidden rounded-2xl">
            <img
              src={guide.coverImage}
              alt={guide.title}
              className="w-full object-cover"
            />
          </div>
        )}

        <MarkdownRenderer content={guide.content} />
      </article>

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Guides
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGuides.map((related) => (
                <GuideCard
                  key={related.id}
                  title={related.title}
                  excerpt={related.excerpt}
                  slug={related.slug}
                  coverImage={related.coverImage}
                  category={related.category}
                  readTime={related.readTime}
                  createdAt={related.createdAt}
                  type="guide"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
