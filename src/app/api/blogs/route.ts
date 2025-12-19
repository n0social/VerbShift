import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET all blogs
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

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// POST create new blog
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


    // Content filtering for violence, sexual content, hate speech
    const forbiddenPatterns = [
      /violence|kill|murder|shoot|attack|abuse|assault|rape|terror/i,
      /sex|sexual|porn|nude|explicit|erotic|fetish|incest|orgy|xxx/i,
      /hate|racist|homophobic|transphobic|slur|bigot|nazi|genocide/i,
    ];
    const isForbidden = forbiddenPatterns.some((pattern) =>
      pattern.test(title + ' ' + excerpt + ' ' + content)
    );
    if (isForbidden && published) {
      return NextResponse.json(
        { error: 'Content violates our guidelines and cannot be published.' },
        { status: 400 }
      );
    }

    // Prevent duplicate published blogs by title or slug
    const existing = await prisma.blog.findFirst({
      where: {
        OR: [
          { slug },
          { title: title, published: true },
        ],
      },
    });
    if (existing && published) {
      return NextResponse.json(
        { error: 'A published blog post with this title or slug already exists.' },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.create({
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

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}
