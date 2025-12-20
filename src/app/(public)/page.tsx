import Link from 'next/link'
import { ArrowRight, Sparkles, BookOpen, FileText, Zap, Users, TrendingUp } from 'lucide-react'
import TypedMottoLiteral from '@/components/TypedMottoLiteral'
import { prisma } from '@/lib/prisma'
import { GuideCard } from '@/components'

async function getFeaturedContent() {
  const [guides, blogs, categories] = await Promise.all([
    prisma.guide.findMany({
      where: { published: true },
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }).then((guides) => guides.map((guide) => ({
      ...guide,
      createdAt: guide.createdAt.toISOString(),
    }))),

    prisma.blog.findMany({
      where: { published: true },
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }).then((blogs) => blogs.map((blog) => ({
      ...blog,
      createdAt: blog.createdAt.toISOString(),
    }))),

    prisma.category.findMany({
      include: {
        _count: {
          select: { guides: { where: { published: true } } },
        },
      },
    }),
  ])

  return { guides, blogs, categories }
}

export default async function HomePage() {
  const { guides, blogs, categories } = await getFeaturedContent()

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            {/* Removed 'Your AI Learning Journey Starts Here' */}
            <h1 className="text-4xl font-bold tracking-tight text-secondary sm:text-6xl">
              <TypedMottoLiteral />
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Professional Prose, Programmatically Generated.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 relative z-20">
              <Link href="/guides" className="btn-primary">
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Guides
              </Link>
              <Link href="/blog" className="btn-secondary">
                Read Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary-400/20 to-accent-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-accent-400/20 to-primary-400/20 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="flex justify-center">
                <BookOpen className="h-8 w-8 text-primary-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{guides.length}+</p>
              <p className="text-sm text-gray-600">Expert Guides</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <FileText className="h-8 w-8 text-accent-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{blogs.length}+</p>
              <p className="text-sm text-gray-600">Blog Posts</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-8 w-8 text-primary-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">10K+</p>
              <p className="text-sm text-gray-600">Happy Readers</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <TrendingUp className="h-8 w-8 text-accent-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{categories.length}</p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="mt-2 text-gray-600">Find guides tailored to your interests</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category: { id: string; name: string; slug: string; color: string; _count: { guides: number } }) => (
              <Link
                key={category.id}
                href={`/guides?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-gray-200"
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10"
                  style={{ backgroundColor: category.color }}
                />
                <div
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Zap className="h-5 w-5" style={{ color: category.color }} />
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {category._count.guides} guides
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Guides</h2>
              <p className="mt-2 text-gray-600">Learn from our comprehensive AI tutorials</p>
            </div>
            <Link
              href="/guides"
              className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 sm:flex"
            >
              View all guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide: { id: string; title: string; slug: string; excerpt: string; coverImage: string | null; category: { name: string; slug: string; color: string }; readTime: number; views: number; createdAt: string }, index: number) => (
              <GuideCard
                key={guide.id}
                title={guide.title}
                excerpt={guide.excerpt}
                slug={guide.slug}
                coverImage={guide.coverImage || '/images/default-cover.jpg'}
                category={guide.category}
                readTime={guide.readTime}
                views={guide.views}
                createdAt={guide.createdAt}
                featured={index === 0}
                type="guide"
              />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/guides" className="btn-secondary">
              View all guides
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">From the Blog</h2>
              <p className="mt-2 text-gray-600">Stay updated with the latest AI news</p>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 sm:flex"
            >
              View all posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: { id: string; title: string; slug: string; excerpt: string; coverImage: string | null; category: { name: string; slug: string; color: string }; readTime: number; views: number; createdAt: string }) => (
              <GuideCard
                key={blog.id}
                title={blog.title}
                excerpt={blog.excerpt}
                slug={blog.slug}
                coverImage={blog.coverImage || '/images/default-cover.jpg'}
                category={blog.category}
                readTime={blog.readTime}
                views={blog.views}
                createdAt={blog.createdAt}
                type="blog"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Generate Now Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Generate Content Instantly</h2>
          <p className="mt-4 text-gray-600">Pay $0.99 per generation and create high-quality content instantly.</p>
          <div className="mt-6">
            <Link href="/generate-now" className="btn-primary">
              Generate Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-white py-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0" />
        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8 z-10">
          <h2 className="text-3xl font-extrabold text-accent-600 sm:text-4xl drop-shadow-md">
            New users can generate one post for FREE.
          </h2>
        </div>
      </section>
    </>
  )
}
import Link from 'next/link'
import { ArrowRight, Sparkles, BookOpen, FileText, Zap, Users, TrendingUp } from 'lucide-react'
import TypedMottoLiteral from '@/components/TypedMottoLiteral'
import { prisma } from '@/lib/prisma'
import { GuideCard } from '@/components'

async function getFeaturedContent() {
  const [guides, blogs, categories] = await Promise.all([
    prisma.guide.findMany({
      where: { published: true },
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }).then((guides) => guides.map((guide) => ({
      ...guide,
      createdAt: guide.createdAt.toISOString(),
    }))),

    prisma.blog.findMany({
      where: { published: true },
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }).then((blogs) => blogs.map((blog) => ({
      ...blog,
      createdAt: blog.createdAt.toISOString(),
    }))),

    prisma.category.findMany({
      include: {
        _count: {
          select: { guides: { where: { published: true } } },
        },
      },
    }),
  ])

  return { guides, blogs, categories }
}

export default async function HomePage() {
  const { guides, blogs, categories } = await getFeaturedContent()

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            {/* Removed 'Your AI Learning Journey Starts Here' */}
            <h1 className="text-4xl font-bold tracking-tight text-secondary sm:text-6xl">
              <TypedMottoLiteral />
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Professional Prose, Programmatically Generated.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 relative z-20">
              <Link href="/guides" className="btn-primary">
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Guides
              </Link>
              <Link href="/blog" className="btn-secondary">
                Read Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary-400/20 to-accent-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-accent-400/20 to-primary-400/20 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="flex justify-center">
                <BookOpen className="h-8 w-8 text-primary-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{guides.length}+</p>
              <p className="text-sm text-gray-600">Expert Guides</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <FileText className="h-8 w-8 text-accent-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{blogs.length}+</p>
              <p className="text-sm text-gray-600">Blog Posts</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-8 w-8 text-primary-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">10K+</p>
              <p className="text-sm text-gray-600">Happy Readers</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <TrendingUp className="h-8 w-8 text-accent-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{categories.length}</p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="mt-2 text-gray-600">Find guides tailored to your interests</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category: { id: string; name: string; slug: string; color: string; _count: { guides: number } }) => (
              <Link
                key={category.id}
                href={`/guides?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-gray-200"
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10"
                  style={{ backgroundColor: category.color }}
                />
                <div
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Zap className="h-5 w-5" style={{ color: category.color }} />
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {category._count.guides} guides
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Guides</h2>
              <p className="mt-2 text-gray-600">Learn from our comprehensive AI tutorials</p>
            </div>
            <Link
              href="/guides"
              className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 sm:flex"
            >
              View all guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide: { id: string; title: string; slug: string; excerpt: string; coverImage: string | null; category: { name: string; slug: string; color: string }; readTime: number; views: number; createdAt: string }, index: number) => (
              <GuideCard
                key={guide.id}
                title={guide.title}
                excerpt={guide.excerpt}
                slug={guide.slug}
                coverImage={guide.coverImage || '/images/default-cover.jpg'}
                category={guide.category}
                readTime={guide.readTime}
                views={guide.views}
                createdAt={guide.createdAt}
                featured={index === 0}
                type="guide"
              />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/guides" className="btn-secondary">
              View all guides
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">From the Blog</h2>
              <p className="mt-2 text-gray-600">Stay updated with the latest AI news</p>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 sm:flex"
            >
              View all posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: { id: string; title: string; slug: string; excerpt: string; coverImage: string | null; category: { name: string; slug: string; color: string }; readTime: number; views: number; createdAt: string }) => (
              <GuideCard
                key={blog.id}
                title={blog.title}
                excerpt={blog.excerpt}
                slug={blog.slug}
                coverImage={blog.coverImage || '/images/default-cover.jpg'}
                category={blog.category}
                readTime={blog.readTime}
                views={blog.views}
                createdAt={blog.createdAt}
                type="blog"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Generate Now Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Generate Content Instantly</h2>
          <p className="mt-4 text-gray-600">Pay $0.99 per generation and create high-quality content instantly.</p>
          <div className="mt-6">
            <Link href="/generate-now" className="btn-primary">
              Generate Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-white py-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0" />
        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8 z-10">
          <h2 className="text-3xl font-extrabold text-accent-600 sm:text-4xl drop-shadow-md">
            New users can generate one post for FREE.
          </h2>
        </div>
      </section>
    </>
  )
}
