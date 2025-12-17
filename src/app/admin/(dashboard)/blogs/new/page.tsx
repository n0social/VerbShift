import { prisma } from '@/lib/prisma'
import BlogForm from '../BlogForm'

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export default async function NewBlogPage() {
  const categories = await getCategories()

  return <BlogForm categories={categories} />
}
