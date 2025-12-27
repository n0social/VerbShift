'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wand2, Sparkles, BookOpen, FileText, Copy, Check, ArrowRight } from 'lucide-react'
import { BLOG_CATEGORIES } from '@/app/api/ai/generate/_lib/blogCategories'

interface Category {
  id: string
  name: string
  slug: string
}

interface AIGenerateClientProps {
  categories: Category[];
  canGenerate?: boolean;
}

const BLOG_PERSONALITIES = [
  { key: 'friendly', label: 'Friendly' },
  { key: 'witty', label: 'Witty' },
  { key: 'professional', label: 'Professional' },
  { key: 'inspirational', label: 'Inspirational' },
  { key: 'chill', label: 'Chill' },
];

export default function AIGenerateClient({ categories, canGenerate }: AIGenerateClientProps) {
  const [botRunning, setBotRunning] = useState(false);
  const [botStatus, setBotStatus] = useState('');

  const handleRunBot = async () => {
    setBotRunning(true);
    setBotStatus('Running...');
    try {
      const res = await fetch('/api/admin/run-bot', { method: 'POST' });
      const data = await res.json();
      setBotStatus(data.message || 'Bot finished.');
    } catch (err) {
      setBotStatus('Error running bot.');
    } finally {
      setBotRunning(false);
    }
  };

  const router = useRouter();
  // Read query params for topic and guideType
  let initialTopic = '';
  let initialContentType: 'guide' | 'blog' = 'guide';
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    initialTopic = params.get('topic') || '';
    const guideType = params.get('guideType');
    if (guideType && guideType.toLowerCase().includes('blog')) {
      initialContentType = 'blog';
    } else if (guideType && guideType.toLowerCase().includes('guide')) {
      initialContentType = 'guide';
    }
  }
  const [contentType, setContentType] = useState<'guide' | 'blog'>(initialContentType);
  const [topic, setTopic] = useState(initialTopic);
  // No category selection for guides; always 'How-to'
  const [categoryId, setCategoryId] = useState('how-to');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    excerpt: string;
    content: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  const [personality, setPersonality] = useState('friendly');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canGenerate) {
      setError('You need an active subscription to generate content.');
      return;
    }
    setLoading(true);
    setError('');
    setGeneratedContent(null);
    setReferences([]);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, contentType, personality }),
      });


      let data, text;
      try {
        data = await res.clone().json();
      } catch (jsonErr) {
        text = await res.text();
        throw new Error(`Unexpected response from server: ${text.slice(0, 200)}`);
      }

      if (!res.ok) {
        // Use the already-parsed data if available, otherwise fallback to text
        throw new Error((data && data.error) || text || 'Failed to generate content');
      }

      setGeneratedContent(data);

      // Fetch references for the topic
      const refRes = await fetch(`/api/ai/references?topic=${encodeURIComponent(topic)}`);
      if (refRes.ok) {
        const refData = await refRes.json();
        setReferences(refData.references || []);
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred. Please check your server logs.');
    } finally {
      setLoading(false);
    }
  };

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
      // Redirect to the new user dashboard edit page for guides or blogs after draft creation
      if (contentType === 'guide') {
        router.push(`/user/dashboard/guides/${created.id}`);
      } else {
        router.push(`/user/dashboard/blogs/${created.id}`);
      }
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

  // Use different categories for blog vs guide
  const blogCategories = BLOG_CATEGORIES;
  const guideCategories = [
    { id: 'how-to', name: 'How-to', slug: 'how-to', description: 'Step-by-step guides and tutorials.', color: '#0ea5e9', _count: { guides: 0, blogs: 0 } },
    { id: 'getting-started', name: 'Getting Started', slug: 'getting-started', description: 'Beginner guides and onboarding.', color: '#fbbf24', _count: { guides: 0, blogs: 0 } },
    { id: 'troubleshooting', name: 'Troubleshooting', slug: 'troubleshooting', description: 'Problem solving, fixes, and solutions.', color: '#f59e42', _count: { guides: 0, blogs: 0 } },
    { id: 'it', name: 'IT', slug: 'it', description: 'Information technology, support, and systems.', color: '#6366f1', _count: { guides: 0, blogs: 0 } },
    { id: 'machine-learning', name: 'Machine Learning', slug: 'machine-learning', description: 'ML guides and tutorials.', color: '#22d3ee', _count: { guides: 0, blogs: 0 } },
    { id: 'prompt-engineering', name: 'Prompt Engineering', slug: 'prompt-engineering', description: 'Prompt engineering tips and guides.', color: '#a3e635', _count: { guides: 0, blogs: 0 } },
  ];
  const currentCategories = contentType === 'blog' ? blogCategories : guideCategories;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
                <div className="mb-4">
                  <button
                    type="button"
                    className={`btn-primary px-4 py-2 rounded ${botRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleRunBot}
                    disabled={botRunning}
                  >
                    {botRunning ? 'Running Bot...' : 'Run Bot'}
                  </button>
                  {botStatus && (
                    <span className="ml-4 text-sm text-gray-500">{botStatus}</span>
                  )}
                </div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
            <Wand2 className="h-5 w-5 text-white" />
          </div>
          Generate
        </h1>
        <p className="mt-2 text-gray-600">
          Create a guide, give your team a quick how-to. Or, send a heartwarming email about your new opportunity, wishing your friends the best. You got options.
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

            {/* Category (Guides: always How-to) */}
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
                {currentCategories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Blog Tone/Personality Selector */}
            {contentType === 'blog' && (
              <div>
                <label htmlFor="personality" className="label">
                  Blog Tone
                </label>
                <select
                  id="personality"
                  value={personality}
                  onChange={e => setPersonality(e.target.value)}
                  className="input"
                >
                  {BLOG_PERSONALITIES.map((p) => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 break-all">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !topic || !canGenerate}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating...
                </span>
              ) : !canGenerate ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Subscription Required
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Content
                </span>
              )}
            </button>
            <p className="mt-3 text-xs text-gray-500 text-center">
              <span className="font-semibold">Note:</span> Pressing <span className="font-semibold">Generate</span> will use one generation credit, regardless of whether you save or publish the content.
            </p>
          </form>

          {/* Removed outdated OpenAI API key disclaimer */}
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

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-primary-500 animate-pulse">
              <Wand2 className="h-12 w-12 mb-4" />
              <p className="text-lg font-semibold">The AI writer is working on your request...</p>
              <p className="mt-2 text-sm text-gray-500">This may take up to a minute for in-depth content. Please wait!</p>
            </div>
          ) : generatedContent ? (
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

              {references.length > 0 && contentType === 'guide' && (
                <div className="mt-6">
                  <label className="text-xs font-medium text-gray-500 uppercase">References</label>
                  <ul className="mt-2 list-disc list-inside text-sm text-blue-700">
                    {references.map((ref, idx) => (
                      <li key={idx}>
                        <a href={ref} target="_blank" rel="noopener noreferrer">
                          {ref}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
