
import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';
import AdminDashboard from './AdminDashboard';

const AdminRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AuthPage />;
};

export default AdminRoute;
