
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireSuperAdmin = false }: ProtectedRouteProps) => {
  const authHook = useAuth();
  const location = useLocation();

  // Handle case where useAuth hook might fail
  if (!authHook) {
    console.error('useAuth hook returned null/undefined in ProtectedRoute');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Authentication Error</div>
          <button 
            onClick={() => window.location.href = '/admin/login'}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const { isAuthenticated, isSuperAdmin, loading, profile } = authHook;

  console.log('ProtectedRoute check:', { 
    isAuthenticated, 
    isSuperAdmin, 
    loading, 
    requireSuperAdmin, 
    userRole: profile?.role,
    currentPath: location.pathname 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    console.log('User is not super admin, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
