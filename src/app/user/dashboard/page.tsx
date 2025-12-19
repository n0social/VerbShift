

import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/');
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });
  if (!user) {
    return <p>User not found.</p>;
  }
  const [guidesCount, blogsCount, categoriesCount, totalViews, recentGuides, recentBlogs, users] = await Promise.all([
    prisma.guide.count(),
    prisma.blog.count(),
    prisma.category.count(),
    prisma.guide.aggregate({ _sum: { views: true } }),
    prisma.guide.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.blog.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.user.findMany(),
  ]);
  const stats = {
    guides: guidesCount,
    blogs: blogsCount,
    categories: categoriesCount,
    views: totalViews._sum.views || 0,
  };

  return (
    <DashboardClient
      user={user}
      stats={stats}
      users={users}
    />
  );
}