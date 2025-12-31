
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const FeedbackForm = dynamic(() => import('@/components/FeedbackForm'), { ssr: false });

export default async function SettingsDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/');
  }
  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      {/* Feedback Section */}
      <FeedbackForm />
    </div>
  );
}
