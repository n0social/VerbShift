import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogForm from '../BlogForm'

interface EditBlogPageProps {
  params: { id: string }
}

async function getBlog(id: string) {
  const [blog, categories] = await Promise.all([
    prisma.blog.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return { blog, categories }
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { blog, categories } = await getBlog(params.id)

  if (!blog) {
    notFound()
  }

  return <BlogForm blog={blog} categories={categories} />
}
