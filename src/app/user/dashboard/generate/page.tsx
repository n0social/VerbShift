import { prisma } from '@/lib/prisma';
import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

const AIGenerateClient = dynamic(() => import('@/app/admin/(dashboard)/ai/AIGenerateClient'), { ssr: false });


// Only How-to for guides
function getHowToCategory() {
  return [{ id: 'how-to', name: 'How-to', slug: 'how-to', description: '', color: '#0ea5e9', _count: { guides: 0, blogs: 0 } }];
}

export default async function UserAIGeneratePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/');
  }
  const categories = getHowToCategory();
  return <AIGenerateClient categories={categories} canGenerate={true} />;
}
