import { getServerSession } from 'next-auth';
import { prisma } from '../../../../lib/prisma';
import { authOptions } from '../../../../lib/auth';
import type { Blog } from '@prisma/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function BlogsDashboardPage({ searchParams }: { searchParams?: { q?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/');
  }
  const userId = (session.user as { id: string }).id;
  const search = searchParams?.q || '';

  // Fetch user's blogs
  const userBlogs: (Blog & { category: { name: string } | null })[] = await prisma.blog.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  // Fetch all blogs (optionally filter by search)
  const allBlogs: (Blog & { category: { name: string | null } | null, author: { name: string | null } | null })[] = await prisma.blog.findMany({
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
      {/* User's Blogs */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Blogs</h2>
        {userBlogs.length === 0 ? (
          <p className="text-gray-500">You haven't created any blogs yet.</p>
        ) : (
          <ul className="space-y-4">
            {userBlogs.map((blog) => (
              <li key={blog.id} className="bg-white p-4 rounded shadow">
                <Link href={`/user/dashboard/blogs/${blog.id}`} className="font-semibold text-primary-700 hover:underline">
                  {blog.title}
                </Link>
                <div className="text-xs text-gray-500 mt-1">Category: {blog.category?.name || 'Uncategorized'}</div>
                <div className="text-xs text-gray-400">Created: {new Date(blog.createdAt).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* All Blogs with Search */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Blogs</h2>
        <form className="mb-4 flex" method="get">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search blogs..."
            className="input flex-1 mr-2"
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
        {allBlogs.length === 0 ? (
          <p className="text-gray-500">No blogs found.</p>
        ) : (
          <ul className="space-y-4">
            {allBlogs.map((blog) => (
              <li key={blog.id} className="bg-white p-4 rounded shadow">
                <Link href={`/blog/${blog.slug}`} className="font-semibold text-primary-700 hover:underline">
                  {blog.title}
                </Link>
                <div className="text-xs text-gray-500 mt-1">By: {blog.author?.name || 'Unknown'} | Category: {blog.category?.name || 'Uncategorized'}</div>
                <div className="text-xs text-gray-400">Created: {new Date(blog.createdAt).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
