"use client";

import React, { useState, useEffect } from 'react';
import { MarkdownEditor } from '@/components';
import { slugify } from '@/lib/utils';
import { Sparkles, Wand2 } from 'lucide-react';


interface GeneratedContent {
  title: string;
  excerpt: string;
  content: string;
}

const GenerateNowPage: React.FC = () => {
    // Stripe Buy Me a Coffee link
    const buyMeCoffeeUrl = 'https://buy.stripe.com/eVq00c6yU1c2anXatz7ok01';
  const [email, setEmail] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string>('');
  // const [isPaid, setIsPaid] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
  });
  const [autoSlug, setAutoSlug] = useState<boolean>(true);

  useEffect(() => {
    if (autoSlug && formData.title) {
      setFormData((prev) => ({ ...prev, slug: slugify(formData.title) }));
    }
  }, [formData.title, autoSlug]);

  // const handlePayment = () => {
  //   window.location.href = 'https://buy.stripe.com/eVq00c6yU1c2anXatz7ok01';
  //   setIsPaid(true); // Simulate payment success for now
  // };





  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!isPaid) {
    //   setError('Please complete the payment first.');
    //   return;
    // }
    setLoading(true);
    setError('');
    setGeneratedContent(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, contentType: 'guide', categoryId: 'how-to', email: email || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate content');
      }
      const data = await res.json();
      setGeneratedContent(data as GeneratedContent);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 container mx-auto p-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
            <Wand2 className="h-5 w-5 text-white" />
          </div>
          Generate
        </h1>
        <p className="mt-2 text-gray-600">
          Instantly generate step-by-step How-to guides and content with AI.
        </p>
        <a
          href={buyMeCoffeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition"
        >
          ☕ Buy Me a Coffee ($0.99)
        </a>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="font-semibold text-gray-900 mb-6">Generate Content</h2>

          <form onSubmit={handleGenerate} className="space-y-6">
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
                placeholder="e.g., How to use AI for writing"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="label">
                Email (optional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Enter your email to receive the result"
              />
            </div>
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
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
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="font-semibold text-gray-900 mb-6">Generated Content</h2>

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
                <label className="text-xs font-medium text-gray-500 uppercase">Content</label>
                <div className="mt-1 max-h-64 overflow-y-auto rounded-lg bg-gray-50 p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {generatedContent.content}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Wand2 className="h-12 w-12 mb-4" />
              <p>Generated content will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/*
      {!isPaid && (
        <div className="mt-8">
          <button
            onClick={handlePayment}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Pay $0.99 to Unlock
          </button>
        </div>
      )}
      */}

      {/*
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">How to Use</h2>
        <ol className="list-decimal pl-6">
          <li>Click the &quot;Pay $0.99 to Generate&quot; button.</li>
          <li>Complete the payment via Stripe.</li>
          <li>After payment, the form will unlock.</li>
          <li>Fill in the details and generate your blog post or article.</li>
          <li>After submission, the form will lock again until another payment is made.</li>
        </ol>
      </div>
      */}
    </div>
  );
};

export default GenerateNowPage;