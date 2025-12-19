'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { MarkdownEditor } from '@/components'
import { slugify, calculateReadTime } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface BlogFormProps {
  blog?: {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    coverImage: string | null
    published: boolean
    featured: boolean
    categoryId: string
  }
  categories: Category[]
  dashboardContext?: 'user' | 'admin'
}

export default function BlogForm({ blog, categories, dashboardContext }: BlogFormProps) {
  const router = useRouter()
  const isEditing = !!blog
  // Use explicit dashboardContext prop if provided, fallback to path detection (for backward compatibility)
  let isUserDashboard = false;
  if (dashboardContext) {
    isUserDashboard = dashboardContext === 'user';
  } else if (typeof window !== 'undefined') {
    isUserDashboard = window.location.pathname.includes('/user/dashboard');
  }
  const dashboardBase = isUserDashboard ? '/user/dashboard/blogs' : '/admin/blogs';
  
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    coverImage: blog?.coverImage || '',
    published: blog?.published || false,
    featured: blog?.featured || false,
    categoryId: blog?.categoryId || categories[0]?.id || '',
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [autoSlug, setAutoSlug] = useState(!isEditing)

  useEffect(() => {
    if (autoSlug && formData.title) {
      setFormData(prev => ({ ...prev, slug: slugify(formData.title) }))
    }
  }, [formData.title, autoSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const readTime = calculateReadTime(formData.content)
      const payload = { ...formData, readTime }

      const url = isEditing ? `/api/blogs/${blog.id}` : '/api/blogs'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save blog post')
      }

      router.push(dashboardBase)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/blogs/${blog?.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete blog post')
      router.push(dashboardBase)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={dashboardBase}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Blog Post' : 'New Blog Post'}
            </h1>
            <p className="mt-1 text-gray-600">
              {isEditing ? 'Update your blog post' : 'Create a new blog post'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn-secondary text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="label">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="The Future of AI in 2024"
                  required
                />
              </div>

              <div>
                <label htmlFor="slug" className="label">
                  Slug
                </label>
                <div className="flex gap-2">
                  <input
                    id="slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      setAutoSlug(false)
                      setFormData({ ...formData, slug: e.target.value })
                    }}
                    className="input"
                    placeholder="the-future-of-ai-2024"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSlug(true)
                      setFormData({ ...formData, slug: slugify(formData.title) })
                    }}
                    className="btn-secondary whitespace-nowrap"
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="excerpt" className="label">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="A brief description of this blog post..."
                  required
                />
              </div>

              <div>
                <label className="label">Content</label>
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Write your blog post content in Markdown..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Publish Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Published</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="input"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Cover Image</h3>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className="mt-4 rounded-lg w-full h-32 object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
