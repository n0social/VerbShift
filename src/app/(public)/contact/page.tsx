
'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
        setStatus('error');
        return;
      }
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Something went wrong.');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4 text-gray-700">Have a question, suggestion, or want to partner with us? Fill out the form below or email us at <a href="mailto:verbshift@protonmail.com" className="text-primary-600 underline">verbshift@protonmail.com</a>.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full border rounded px-3 py-2"
          required
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="w-full border rounded px-3 py-2"
          required
          value={form.email}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          className="w-full border rounded px-3 py-2"
          rows={5}
          required
          value={form.message}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'success' && (
          <p className="text-green-600 mt-2">Your message has been sent!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 mt-2">{error}</p>
        )}
      </form>
    </div>
  );
}