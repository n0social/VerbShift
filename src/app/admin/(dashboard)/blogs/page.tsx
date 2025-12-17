import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus, Edit, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'

async function getBlogs() {
  return prisma.blog.findMany({
    include: { category: true, author: true },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function BlogsPage() {
  const blogs = await getBlogs()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-gray-600">Manage your blog posts and articles</p>
        </div>
        <Link href="/admin/blogs/new" className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900">{blog.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {blog.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: blog.category.color }}
                      >
                        {blog.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          blog.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {blog.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        {blog.published && (
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/blogs/${blog.id}`}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg">No blog posts yet</p>
                      <p className="mt-1">Get started by creating your first post.</p>
                      <Link href="/admin/blogs/new" className="btn-primary mt-4 inline-flex">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Post
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
