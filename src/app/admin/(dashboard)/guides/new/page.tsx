import { prisma } from '@/lib/prisma'
import GuideForm from '../GuideForm'

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export default async function NewGuidePage() {
  const categories = await getCategories()

  return <GuideForm categories={categories} />
}
