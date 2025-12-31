


import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/');
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return <p>User not found.</p>;
  }

  // User-specific stats
  const [guidesCount, blogsCount, categoriesCount, userGuideViews, userBlogViews, users] = await Promise.all([
    prisma.guide.count({ where: { authorId: user.id } }),
    prisma.blog.count({ where: { authorId: user.id } }),
    prisma.category.count(),
    prisma.guide.aggregate({ _sum: { views: true }, where: { authorId: user.id } }),
    prisma.blog.aggregate({ _sum: { views: true }, where: { authorId: user.id } }),
    prisma.user.findMany(),
  ]);
  const stats = {
    guides: guidesCount,
    blogs: blogsCount,
    categories: categoriesCount,
    views: userGuideViews._sum.views || 0,
    blogViews: userBlogViews._sum.views || 0,
  };



  return (
    <DashboardClient
      user={user}
      stats={stats}
      users={users}
    />
  );
}