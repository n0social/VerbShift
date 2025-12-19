import { prisma } from '@/lib/prisma'
import { GuideCard, CategoryBadge, SearchBar } from '@/components'

interface GuidesPageProps {
  searchParams: { category?: string; q?: string }
}

async function getGuides(category?: string, query?: string) {
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

  const [guides, categories] = await Promise.all([
    prisma.guide.findMany({
      where,
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { guides: { where: { published: true } } },
        },
      },
    }),
  ])

  return { guides, categories }
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const { guides, categories } = await getGuides(searchParams.category, searchParams.q)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Guides</h1>
          <p className="mt-4 text-lg text-gray-600">
            Comprehensive tutorials to help you master AI tools and techniques
          </p>
          
          {/* Search */}
          <div className="mt-8 max-w-xl">
            <SearchBar placeholder="Search guides..." basePath="/guides" />
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
            type="guide"
          />
          {categories.map((category) => (
            <CategoryBadge
              key={category.id}
              name={category.name}
              slug={category.slug}
              color={category.color}
              count={category._count.guides}
              active={searchParams.category === category.slug}
              type="guide"
            />
          ))}
        </div>

        {/* Results info */}
        {searchParams.q && (
          <p className="mb-6 text-gray-600">
            {guides.length} result{guides.length !== 1 ? 's' : ''} for &quot;{searchParams.q}&quot;
          </p>
        )}

        {/* Guides Grid */}
        {guides.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide, index) => (
              <GuideCard
                key={guide.id}
                title={guide.title}
                excerpt={guide.excerpt}
                slug={guide.slug}
                coverImage={guide.coverImage}
                category={guide.category}
                readTime={guide.readTime}
                views={guide.views}
                createdAt={guide.createdAt}
                featured={index === 0 && !searchParams.category && !searchParams.q}
                type="guide"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900">No guides found</h3>
            <p className="mt-2 text-gray-600">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
