import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BookOpen, FileText, FolderOpen, Eye, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

async function getDashboardStats() {
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
    prisma.user.findMany(), // Fetch users for user management section
  ])

  return {
    stats: {
      guides: guidesCount,
      blogs: blogsCount,
      categories: categoriesCount,
      views: totalViews._sum.views || 0,
    },
    recentGuides,
    recentBlogs,
    users, // Include users in the returned data
  }
}

export default async function AdminDashboard() {
  const { stats, recentGuides, recentBlogs, users } = await getDashboardStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back! Here's an overview of your content.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/guides/new"
            className="btn-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Guide
          </Link>
          <Link
            href="/admin/blogs/new"
            className="btn-secondary"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Guides</p>
              <p className="text-2xl font-bold text-gray-900">{stats.guides}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100">
              <FileText className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Blog Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.blogs}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <FolderOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <Eye className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.views.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Guides */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Recent Guides</h2>
            <Link
              href="/admin/guides"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentGuides.length > 0 ? (
              recentGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/admin/guides/${guide.id}`}
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
                  <span
                    className={`ml-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      guide.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {guide.published ? 'Published' : 'Draft'}
                  </span>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No guides yet</p>
                <Link href="/admin/guides/new" className="text-primary-600 hover:underline">
                  Create your first guide
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Recent Blog Posts</h2>
            <Link
              href="/admin/blogs"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBlogs.length > 0 ? (
              recentBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/admin/blogs/${blog.id}`}
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
                  <span
                    className={`ml-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      blog.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No blog posts yet</p>
                <Link href="/admin/blogs/new" className="text-primary-600 hover:underline">
                  Create your first post
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        <p className="mt-1 text-gray-600">Manage registered users below.</p>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm ring-1 ring-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
