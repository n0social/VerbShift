import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import GuideForm from '@/app/admin/(dashboard)/guides/GuideForm';
import { redirect } from 'next/navigation';

export default async function UserGuideEditPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/');
  }
  const guide = await prisma.guide.findUnique({
    where: { id: params.id, authorId: session.user.id },
    include: { category: true },
  });
  if (!guide) {
    redirect('/user/dashboard/guides');
  }
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return <GuideForm guide={guide} categories={categories} dashboardContext="user" />;
}
