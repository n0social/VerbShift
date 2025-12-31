"use client";
import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, FileText, FolderOpen, Eye } from 'lucide-react';
import EditUserModal from '@/components/EditUserModal';

export default function DashboardClient({ user, stats, users }: any) {
  const [editUser, setEditUser] = useState<any>(null);
  const [usersState, setUsersState] = useState(users);

  const handleEditUser = (user: any) => setEditUser(user);
  const handleCloseModal = () => setEditUser(null);
  const handleSaveUser = async (updated: any) => {
    const res = await fetch(`/api/users/${updated.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const data = await res.json();
      setUsersState((prev: any[]) => prev.map(u => u.id === updated.id ? data.user : u));
    } else {
      throw new Error('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setUsersState((prev: any[]) => prev.filter(u => u.id !== id));
    } else {
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center">Dashboard</h1>
      <p className="mt-1 text-gray-600 text-center">Welcome, {user.name}!</p>
      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Guides</p>
              <p className="text-2xl font-bold text-gray-900">{stats.guides}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100">
              <FileText className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Blog Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.blogs}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <FolderOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Metrics Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Your Guide Metrics</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Total Guide Views:</span>
              <span>{stats.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Total Guides:</span>
              <span>{stats.guides}</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Your Blog Metrics</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Total Blog Views:</span>
              <span>{stats.blogViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Total Blogs:</span>
              <span>{stats.blogs}</span>
            </div>
          </div>
        </div>
      </div>
      {/* User Management (admin only) */}
      {(user.role && user.role.toLowerCase() === 'admin') && usersState && usersState.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="mt-1 text-gray-600">Manage registered users below.</p>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm ring-1 ring-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usersState.map((u: any) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-4" onClick={() => handleEditUser(u)}>Edit</button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* SubscriptionModalClient removed */}
      <EditUserModal
        user={editUser}
        open={!!editUser}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />
    </div>
  );
}