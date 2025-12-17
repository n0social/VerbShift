import { prisma } from '@/lib/prisma'
import { GuideCard, CategoryBadge, SearchBar } from '@/components'

interface BlogPageProps {
  searchParams: { category?: string; q?: string }
}

async function getBlogs(category?: string, query?: string) {
  const where: any = { published: true }
  
  if (category) {
    where.category = { slug: category }
  }
  
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { excerpt: { contains: query } },
      { content: { contains: query } },
    ]
  }

  const [blogs, categories] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { blogs: { where: { published: true } } },
        },
      },
    }),
  ])

  return { blogs, categories }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { blogs, categories } = await getBlogs(searchParams.category, searchParams.q)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
          <p className="mt-4 text-lg text-gray-600">
            Stay updated with the latest AI news, insights, and trends
          </p>
          
          {/* Search */}
          <div className="mt-8 max-w-xl">
            <SearchBar placeholder="Search blog posts..." basePath="/blog" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <CategoryBadge
            name="All"
            slug=""
            color="#6b7280"
            active={!searchParams.category}
            type="blog"
          />
          {categories.filter(c => c._count.blogs > 0).map((category) => (
            <CategoryBadge
              key={category.id}
              name={category.name}
              slug={category.slug}
              color={category.color}
              count={category._count.blogs}
              active={searchParams.category === category.slug}
              type="blog"
            />
          ))}
        </div>

        {/* Results info */}
        {searchParams.q && (
          <p className="mb-6 text-gray-600">
            {blogs.length} result{blogs.length !== 1 ? 's' : ''} for "{searchParams.q}"
          </p>
        )}

        {/* Blogs Grid */}
        {blogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <GuideCard
                key={blog.id}
                title={blog.title}
                excerpt={blog.excerpt}
                slug={blog.slug}
                coverImage={blog.coverImage}
                category={blog.category}
                readTime={blog.readTime}
                views={blog.views}
                createdAt={blog.createdAt}
                featured={index === 0 && !searchParams.category && !searchParams.q}
                type="blog"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900">No posts found</h3>
            <p className="mt-2 text-gray-600">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
