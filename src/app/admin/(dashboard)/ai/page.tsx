import { prisma } from '@/lib/prisma'
import AIGenerateClient from './AIGenerateClient'

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export default async function AIGeneratePage() {
  const categories = await getCategories()

  return <AIGenerateClient categories={categories} />
}
