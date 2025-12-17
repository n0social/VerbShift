import { prisma } from '@/lib/prisma'
import CategoriesClient from './CategoriesClient'

async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { guides: true, blogs: true },
      },
    },
    orderBy: { name: 'asc' },
  })
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return <CategoriesClient categories={categories} />
}
