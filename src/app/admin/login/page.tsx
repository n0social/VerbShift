'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-2 text-gray-600">Sign in to manage your AI Guides</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aiguides.com"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Admin credentials:</p>
            <p className="font-mono text-xs mt-1">
              donavansky@gmail.com / Intellect101!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
