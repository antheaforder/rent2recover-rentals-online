
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

  const { isAuthenticated, isSuperAdmin, loading, profile, user } = authHook;

  console.log('ProtectedRoute detailed check:', { 
    isAuthenticated, 
    isSuperAdmin, 
    loading, 
    requireSuperAdmin, 
    userEmail: user?.email,
    userRole: profile?.role,
    profileData: profile,
    currentPath: location.pathname,
    userMetadata: user?.user_metadata,
    appMetadata: user?.app_metadata
  });

  if (loading) {
    console.log('ProtectedRoute: Auth still loading, showing spinner');
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
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    console.log('ProtectedRoute: User is authenticated but not super admin');
    console.log('ProtectedRoute: User role:', profile?.role);
    console.log('ProtectedRoute: isSuperAdmin result:', isSuperAdmin);
    console.log('ProtectedRoute: Redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
