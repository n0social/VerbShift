import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus, Search, Edit, Trash2, Eye, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'

async function getGuides() {
  return prisma.guide.findMany({
    include: { category: true, author: true },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function GuidesPage() {
  const guides = await getGuides()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guides</h1>
          <p className="mt-1 text-gray-600">Manage your AI guides and tutorials</p>
        </div>
        <Link href="/admin/guides/new" className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Guide
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
              {guides.length > 0 ? (
                guides.map((guide) => (
                  <tr key={guide.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900">{guide.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {guide.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: guide.category.color }}
                      >
                        {guide.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          guide.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {guide.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {guide.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(guide.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        {guide.published && (
                          <Link
                            href={`/guides/${guide.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/guides/${guide.id}`}
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
                      <p className="text-lg">No guides yet</p>
                      <p className="mt-1">Get started by creating your first guide.</p>
                      <Link href="/admin/guides/new" className="btn-primary mt-4 inline-flex">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Guide
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
