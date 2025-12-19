import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BookOpen, FileText, FolderOpen, Eye, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

async function getUserDashboardData(userId: string) {
  const [userGuides, userBlogs] = await Promise.all([
    prisma.guide.findMany({
      where: { authorId: userId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.blog.findMany({
      where: { authorId: userId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { userGuides, userBlogs };
}

export default async function UserDashboard({ params }: { params: { userId: string } }) {
  const { userGuides, userBlogs } = await getUserDashboardData(params.userId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ color: '#111827' }}>Your Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome! Here’s an overview of your content.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Your Guides</h2>
            <Link
              href="/user/guides"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {userGuides.length > 0 ? (
              userGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/user/guides/${guide.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{guide.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: guide.category.color }}
                      />
                      <span>{guide.category.name}</span>
                      <span>•</span>
                      <span>{formatDate(guide.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No guides yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Your Blog Posts</h2>
            <Link
              href="/user/blogs"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {userBlogs.length > 0 ? (
              userBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/user/blogs/${blog.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{blog.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: blog.category.color }}
                      />
                      <span>{blog.category.name}</span>
                      <span>•</span>
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No blog posts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}