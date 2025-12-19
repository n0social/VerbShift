import React from 'react';
import DashboardAuthProvider from '@/components/DashboardAuthProvider';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardAuthProvider>
      <div className="flex min-h-screen bg-gray-100">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:ml-64">
          {children}
        </main>
      </div>
    </DashboardAuthProvider>
  );
}