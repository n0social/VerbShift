import { getServerSession } from 'next-auth';
import { prisma } from '../../../../lib/prisma';
import { authOptions } from '../../../../lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function GuidesDashboardPage({ searchParams }: { searchParams?: { q?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/');
  }
  const userId = session.user.id;
  const search = searchParams?.q || '';

  // Fetch user's guides
  const userGuides = await prisma.guide.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  // Fetch all guides (optionally filter by search)
  const allGuides = await prisma.guide.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        }
      : {},
    orderBy: { createdAt: 'desc' },
    include: { category: true, author: true },
    take: 20,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      {/* User's Guides */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Guides</h2>
        {userGuides.length === 0 ? (
          <p className="text-gray-500">You haven't created any guides yet.</p>
        ) : (
          <ul className="space-y-4">
            {userGuides.map((guide) => (
              <li key={guide.id} className="bg-white p-4 rounded shadow">
                <Link href={`/user/dashboard/guides/${guide.id}`} className="font-semibold text-primary-700 hover:underline">
                  {guide.title}
                </Link>
                <div className="text-xs text-gray-500 mt-1">Category: {guide.category?.name || 'Uncategorized'}</div>
                <div className="text-xs text-gray-400">Created: {new Date(guide.createdAt).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* All Guides with Search */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Guides</h2>
        <form className="mb-4 flex" method="get">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search guides..."
            className="input flex-1 mr-2"
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
        {allGuides.length === 0 ? (
          <p className="text-gray-500">No guides found.</p>
        ) : (
          <ul className="space-y-4">
            {allGuides.map((guide) => (
              <li key={guide.id} className="bg-white p-4 rounded shadow">
                <Link href={`/guides/${guide.slug}`} className="font-semibold text-primary-700 hover:underline">
                  {guide.title}
                </Link>
                <div className="text-xs text-gray-500 mt-1">By: {guide.author?.name || 'Unknown'} | Category: {guide.category?.name || 'Uncategorized'}</div>
                <div className="text-xs text-gray-400">Created: {new Date(guide.createdAt).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
