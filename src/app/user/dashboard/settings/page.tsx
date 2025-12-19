import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SettingsDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/');
  }
  // Fetch user subscription info
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });
  const subscription = user?.subscription;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <div className="mb-6">
        <div className="font-semibold">Subscription Level:</div>
        <div className="text-lg">
          {subscription?.status === 'active'
            ? `${subscription.plan} (Active)`
            : 'No active subscription'}
        </div>
      </div>
      <div>
        {/* Placeholder for purchase/upgrade logic */}
        <a href="/account/subscriptions" className="btn-primary">{subscription?.status === 'active' ? 'Manage Subscription' : 'Purchase Subscription'}</a>
      </div>
    </div>
  );
}
