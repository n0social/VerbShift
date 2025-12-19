
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { generateCsrfToken } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Generate and set CSRF token cookie on mount
    const token = generateCsrfToken();
    setCsrfToken(token);
    document.cookie = `csrfToken=${token}; path=/; SameSite=Strict`;
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Use NextAuth signIn helper for credentials
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      csrfToken,
      callbackUrl: '/user/dashboard',
    });
    if (res?.ok) {
      router.push(res.url || '/user/dashboard');
    } else {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex items-center justify-between">
            <a href="/forgot-password" className="text-sm text-primary-600 hover:underline">
              Forgot your password?
            </a>
          </div>
          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="/signup" className="text-primary-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}