import { prisma } from '@/lib/prisma'
import { GuideCard, SearchBar } from '@/components'
import { Search as SearchIcon } from 'lucide-react'

interface SearchPageProps {
  searchParams: { q?: string }
}

async function searchContent(query?: string) {
  if (!query) return { guides: [], blogs: [] }

  const [guides, blogs] = await Promise.all([
    prisma.guide.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query } },
          { excerpt: { contains: query } },
          { content: { contains: query } },
        ],
      },
      include: { category: true },
      take: 10,
    }),
    prisma.blog.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query } },
          { excerpt: { contains: query } },
          { content: { contains: query } },
        ],
      },
      include: { category: true },
      take: 10,
    }),
  ])

  return { guides, blogs }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { guides, blogs } = await searchContent(searchParams.q)
  const totalResults = guides.length + blogs.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Search</h1>
          <p className="mt-4 text-lg text-gray-600">
            Find guides, tutorials, and blog posts
          </p>
          
          <div className="mt-8 max-w-2xl">
            <SearchBar placeholder="Search everything..." basePath="/search" />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {searchParams.q ? (
          <>
            <p className="mb-8 text-gray-600">
              {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{searchParams.q}&quot;
            </p>

            {totalResults > 0 ? (
              <div className="space-y-12">
                {/* Guides */}
                {guides.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Guides ({guides.length})
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {guides.map((guide) => (
                        <GuideCard
                          key={guide.id}
                          title={guide.title}
                          excerpt={guide.excerpt}
                          slug={guide.slug}
                          coverImage={guide.coverImage}
                          category={guide.category}
                          readTime={guide.readTime}
                          createdAt={guide.createdAt}
                          type="guide"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Blogs */}
                {blogs.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Blog Posts ({blogs.length})
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {blogs.map((blog) => (
                        <GuideCard
                          key={blog.id}
                          title={blog.title}
                          excerpt={blog.excerpt}
                          slug={blog.slug}
                          coverImage={blog.coverImage}
                          category={blog.category}
                          readTime={blog.readTime}
                          createdAt={blog.createdAt}
                          type="blog"
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                <p className="mt-2 text-gray-600">
                  Try searching for different keywords
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
              <SearchIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Start searching</h3>
            <p className="mt-2 text-gray-600">
              Enter a keyword to search guides and blog posts
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
