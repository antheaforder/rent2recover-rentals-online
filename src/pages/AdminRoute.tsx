import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';
import AdminDashboard from './AdminDashboard';

const AdminRoute = () => {
  const { isAuthenticated, isSuperAdmin, loading } = useAuth();

  console.log('AdminRoute render:', { isAuthenticated, isSuperAdmin, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated and is a super admin, show admin dashboard
  if (isAuthenticated && isSuperAdmin) {
    return <AdminDashboard />;
  }

  // Otherwise show auth page
  return <AuthPage />;
};

export default AdminRoute;
