import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET all guides
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')

    const where: any = {}

    if (category) {
      where.category = { slug: category }
    }

    if (published === 'true') {
      where.published = true
    }

    if (featured === 'true') {
      where.featured = true
    }

    const guides = await prisma.guide.findMany({
      where,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(guides)
  } catch (error) {
    console.error('Error fetching guides:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guides' },
      { status: 500 }
    )
  }
}

// POST create new guide
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, published, featured, categoryId, readTime } = body

    // Check if slug already exists
    const existing = await prisma.guide.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'A guide with this slug already exists' },
        { status: 400 }
      )
    }

    const guide = await prisma.guide.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        published: published || false,
        featured: featured || false,
        readTime: readTime || 5,
        authorId: session.user.id,
        categoryId,
      },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(guide, { status: 201 })
  } catch (error) {
    console.error('Error creating guide:', error)
    return NextResponse.json(
      { error: 'Failed to create guide' },
      { status: 500 }
    )
  }
}
