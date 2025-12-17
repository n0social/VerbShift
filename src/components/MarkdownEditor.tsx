'use client'

import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100" />
  ),
})

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
}: MarkdownEditorProps) {
  return (
    <SimpleMDE
      value={value}
      onChange={onChange}
      options={{
        placeholder,
        spellChecker: false,
        status: false,
        toolbar: [
          'bold',
          'italic',
          'heading',
          '|',
          'quote',
          'unordered-list',
          'ordered-list',
          '|',
          'link',
          'image',
          'code',
          '|',
          'preview',
          'side-by-side',
          'fullscreen',
          '|',
          'guide',
        ],
        sideBySideFullscreen: false,
        minHeight: '300px',
      }}
    />
  )
}
