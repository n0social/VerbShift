import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import GuideForm from '../GuideForm'

interface EditGuidePageProps {
  params: { id: string }
}

async function getGuide(id: string) {
  const [guide, categories] = await Promise.all([
    prisma.guide.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return { guide, categories }
}

export default async function EditGuidePage({ params }: EditGuidePageProps) {
  const { guide, categories } = await getGuide(params.id)

  if (!guide) {
    notFound()
  }

  return <GuideForm guide={guide} categories={categories} />
}
