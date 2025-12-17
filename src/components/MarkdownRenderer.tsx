'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div
      className="prose prose-primary prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-gray-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-code:text-primary-600 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-primary-500 prose-blockquote:text-primary-800 prose-img:rounded-xl prose-table:rounded-lg prose-table:border prose-table:border-gray-200 prose-th:bg-gray-50 prose-th:text-gray-700 prose-ol:pl-6 prose-ul:pl-6 prose-li:marker:text-primary-500">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
