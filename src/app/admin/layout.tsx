import AuthProvider from '@/components/AuthProvider';
import AdminSidebar from '@/components/AdminSidebar';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar /> {/* Sidebar can be renamed or adjusted for general users */}
        <main className="lg:pl-64 pt-14 lg:pt-0">
          <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
