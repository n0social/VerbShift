import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// PUT update category
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
    const { name, slug, description, color } = body

    // Check if slug already exists (excluding current category)
    const existing = await prisma.category.findFirst({
      where: { slug, id: { not: params.id } },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description: description || null,
        color,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE category
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

    // Check if category has any guides or blogs
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { guides: true, blogs: true },
        },
      },
    })

    if (category && (category._count.guides > 0 || category._count.blogs > 0)) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing guides or blog posts' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
