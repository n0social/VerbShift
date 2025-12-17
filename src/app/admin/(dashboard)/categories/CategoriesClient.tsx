'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, X, Check } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  _count: {
    guides: number
    blogs: number
  }
}

interface CategoriesClientProps {
  categories: Category[]
}

export default function CategoriesClient({ categories: initialCategories }: CategoriesClientProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#0ea5e9',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', color: '#0ea5e9' })
    setShowForm(false)
    setEditingId(null)
    setError('')
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color,
    })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save category')
      }

      router.refresh()
      resetForm()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete category')
      }
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-gray-600">Organize your guides and blog posts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Category' : 'New Category'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingId ? formData.slug : slugify(e.target.value),
                    })
                  }}
                  className="input"
                  placeholder="Machine Learning"
                  required
                />
              </div>

              <div>
                <label className="label">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input"
                  placeholder="machine-learning"
                  required
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows={2}
                  placeholder="A brief description..."
                />
              </div>

              <div>
                <label className="label">Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-14 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="input flex-1"
                    placeholder="#0ea5e9"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div
                    className="h-full w-full rounded-lg flex items-center justify-center"
                  >
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {category.description && (
              <p className="mt-3 text-sm text-gray-600">{category.description}</p>
            )}
            <div className="mt-4 flex gap-4 text-sm text-gray-500">
              <span>{category._count.guides} guides</span>
              <span>{category._count.blogs} posts</span>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories yet. Create your first one!</p>
        </div>
      )}
    </div>
  )
}
