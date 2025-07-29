import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, requireAuth = true, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute check:', { 
    user: user?.email, 
    userExists: !!user,
    loading, 
    adminOnly, 
    requireAuth,
    timestamp: new Date().toISOString()
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (requireAuth && !user) {
    console.log('Redirecting to login - no user');
    return <Redirect to="/login" />;
  }

  // Check admin access
  if (adminOnly) {
    if (!user) {
      console.log('Redirecting to login - admin route, no user');
      return <Redirect to="/login" />;
    }
    
    // Check if user is admin by email or role
    const isAdmin = user.email === 'jarviscamp@bellsouth.net' || user.role === 'admin';
    console.log('Admin check:', { email: user.email, role: user.role, isAdmin });
    
    if (!isAdmin) {
      console.log('Access denied - not admin');
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You don't have admin privileges to access this page.</p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }
  }

  if (!requireAuth && user) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}
