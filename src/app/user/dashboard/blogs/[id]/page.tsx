import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import BlogForm from '@/app/admin/(dashboard)/blogs/BlogForm';
import { redirect } from 'next/navigation';

export default async function UserBlogEditPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/');
  }
  const blog = await prisma.blog.findUnique({
    where: { id: params.id, authorId: session.user.id },
    include: { category: true },
  });
  if (!blog) {
    redirect('/user/dashboard/blogs');
  }
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return <BlogForm blog={blog} categories={categories} dashboardContext="user" />;
}
