import { getServerSession } from 'next-auth';
import { prisma } from '../../../../lib/prisma';
import { authOptions } from '../../../../lib/auth';
import type { Category } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function CategoriesDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/');
  }
  const userId = (session.user as { id: string }).id;

  // Fetch user's categories (categories where user has created guides or blogs)
  const userCategories: Category[] = await prisma.category.findMany({
    where: {
      OR: [
        { guides: { some: { authorId: userId } } },
        { blogs: { some: { authorId: userId } } },
      ],
    },
    orderBy: { name: 'asc' },
  });

  // Fetch all categories
  const allCategories: Category[] = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    take: 50,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      {/* User's Categories */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Categories</h2>
        {userCategories.length === 0 ? (
          <p className="text-gray-500">You haven&apos;t created content in any categories yet.</p>
        ) : (
          <ul className="space-y-2">
            {userCategories.map((cat: Category) => (
              <li key={cat.id} className="bg-white p-3 rounded shadow">
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* All Categories */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Categories</h2>
        {allCategories.length === 0 ? (
          <p className="text-gray-500">No categories found.</p>
        ) : (
          <ul className="space-y-2">
            {allCategories.map((cat: Category) => (
              <li key={cat.id} className="bg-white p-3 rounded shadow">
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
