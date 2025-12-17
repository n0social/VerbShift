'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wand2, Sparkles, BookOpen, FileText, Copy, Check, ArrowRight } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface AIGenerateClientProps {
  categories: Category[]
}

export default function AIGenerateClient({ categories }: AIGenerateClientProps) {
  const router = useRouter()
  const [contentType, setContentType] = useState<'guide' | 'blog'>('guide')
  const [topic, setTopic] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<{
    title: string
    excerpt: string
    content: string
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGeneratedContent(null)

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, contentType }),
      })

      let data
      try {
        data = await res.json()
      } catch (jsonErr) {
        // If response is not JSON, show the raw text (likely an error page)
        const text = await res.text()
        throw new Error(`Unexpected response from server: ${text.slice(0, 200)}`)
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content')
      }

      setGeneratedContent(data)
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred. Please check your server logs.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!generatedContent) return

    setLoading(true)
    try {
      const endpoint = contentType === 'guide' ? '/api/guides' : '/api/blogs'
      const slug = generatedContent.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generatedContent,
          slug,
          categoryId,
          published: false,
          featured: false,
          readTime: Math.ceil(generatedContent.content.split(/\s+/).length / 200),
        }),
      })

      if (!res.ok) throw new Error('Failed to create content')

      const created = await res.json()
      router.push(`/admin/${contentType === 'guide' ? 'guides' : 'blogs'}/${created.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!generatedContent) return
    await navigator.clipboard.writeText(generatedContent.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
            <Wand2 className="h-5 w-5 text-white" />
          </div>
          AI Content Generator
        </h1>
        <p className="mt-2 text-gray-600">
          Generate guides and blog posts using AI. Just provide a topic and let the magic happen!
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="font-semibold text-gray-900 mb-6">Generate Content</h2>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Content Type */}
            <div>
              <label className="label">Content Type</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setContentType('guide')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                    contentType === 'guide'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  Guide
                </button>
                <button
                  type="button"
                  onClick={() => setContentType('blog')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                    contentType === 'blog'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  Blog Post
                </button>
              </div>
            </div>

            {/* Topic */}
            <div>
              <label htmlFor="topic" className="label">
                Topic
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="input"
                placeholder="e.g., How to use ChatGPT for coding"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="label">
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 break-all">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !topic}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Content
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> AI generation requires an OpenAI API key. Without it, sample content will be generated based on your topic.
            </p>
          </div>
        </div>

        {/* Generated Content */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Generated Content</h2>
            {generatedContent && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          {generatedContent ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Title</label>
                <p className="mt-1 font-semibold text-gray-900">{generatedContent.title}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Excerpt</label>
                <p className="mt-1 text-gray-600">{generatedContent.excerpt}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Content Preview</label>
                <div className="mt-1 max-h-64 overflow-y-auto rounded-lg bg-gray-50 p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {generatedContent.content.substring(0, 1000)}
                    {generatedContent.content.length > 1000 && '...'}
                  </pre>
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full btn-primary mt-4"
              >
                <span className="flex items-center gap-2">
                  Create as Draft
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Wand2 className="h-12 w-12 mb-4" />
              <p>Generated content will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
