import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET single guide
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guide = await prisma.guide.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!guide) {
      return NextResponse.json(
        { error: 'Guide not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(guide)
  } catch (error) {
    console.error('Error fetching guide:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guide' },
      { status: 500 }
    )
  }
}

// PUT update guide
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if slug already exists (excluding current guide)
    const existing = await prisma.guide.findFirst({
      where: { slug, id: { not: params.id } },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A guide with this slug already exists' },
        { status: 400 }
      )
    }

    const guide = await prisma.guide.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        published,
        featured,
        categoryId,
        readTime,
      },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(guide)
  } catch (error) {
    console.error('Error updating guide:', error)
    return NextResponse.json(
      { error: 'Failed to update guide' },
      { status: 500 }
    )
  }
}

// DELETE guide
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.guide.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting guide:', error)
    return NextResponse.json(
      { error: 'Failed to delete guide' },
      { status: 500 }
    )
  }
}
