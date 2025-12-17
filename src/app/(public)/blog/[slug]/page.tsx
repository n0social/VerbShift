import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, Calendar, ArrowLeft, Eye, User } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { MarkdownRenderer, GuideCard } from '@/components'

interface BlogPostPageProps {
  params: { slug: string }
}

async function getBlog(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: { slug, published: true },
    include: { category: true, author: true },
  })

  if (!blog) return null

  // Increment views
  await prisma.blog.update({
    where: { id: blog.id },
    data: { views: { increment: 1 } },
  })

  // Get related posts
  const relatedPosts = await prisma.blog.findMany({
    where: {
      published: true,
      categoryId: blog.categoryId,
      id: { not: blog.id },
    },
    include: { category: true },
    take: 3,
  })

  return { blog, relatedPosts }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const data = await getBlog(params.slug)

  if (!data) {
    notFound()
  }

  const { blog, relatedPosts } = data

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Link
              href={`/blog?category=${blog.category.slug}`}
              className="rounded-full px-3 py-1 text-sm font-medium text-white"
              style={{ backgroundColor: blog.category.color }}
            >
              {blog.category.name}
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            {blog.title}
          </h1>

          <p className="mt-6 text-xl text-gray-600">{blog.excerpt}</p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{blog.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={blog.createdAt.toISOString()}>
                {formatDate(blog.createdAt)}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{blog.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{blog.views + 1} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        {blog.coverImage && (
          <div className="mb-12 overflow-hidden rounded-2xl">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full object-cover"
            />
          </div>
        )}

        <MarkdownRenderer content={blog.content} />
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Posts
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <GuideCard
                  key={related.id}
                  title={related.title}
                  excerpt={related.excerpt}
                  slug={related.slug}
                  coverImage={related.coverImage}
                  category={related.category}
                  readTime={related.readTime}
                  createdAt={related.createdAt}
                  type="blog"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
