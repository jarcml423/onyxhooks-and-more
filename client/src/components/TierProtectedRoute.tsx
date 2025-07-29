import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Shield, Crown, Zap } from "lucide-react";

interface TierProtectedRouteProps {
  children: React.ReactNode;
  requiredTier: 'free' | 'starter' | 'pro' | 'vault' | 'admin';
  fallbackPath?: string;
}

interface UserData {
  id: number;
  role: 'free' | 'starter' | 'pro' | 'vault' | 'admin';
  subscriptionStatus?: string;
  accessGranted?: boolean;
}

const tierHierarchy = {
  free: 0,
  starter: 1, 
  pro: 2,
  vault: 3,
  admin: 4
};

const tierConfig = {
  free: { icon: <Shield className="w-6 h-6" />, name: "Free", color: "text-blue-400" },
  starter: { icon: <Zap className="w-6 h-6" />, name: "Starter", color: "text-emerald-400" },
  pro: { icon: <Crown className="w-6 h-6" />, name: "Pro", color: "text-purple-400" },
  vault: { icon: <Crown className="w-6 h-6" />, name: "Vault", color: "text-yellow-400" },
  admin: { icon: <Shield className="w-6 h-6" />, name: "Admin", color: "text-red-400" }
};

export default function TierProtectedRoute({ 
  children, 
  requiredTier, 
  fallbackPath = "/dashboard" 
}: TierProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();

  // Get user data and tier information
  const { data: userData, isLoading: userLoading } = useQuery<UserData>({
    queryKey: ["/api/user"],
    enabled: !!user
  });

  // Show loading while checking authentication and user data
  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect to="/login" />;
  }

  // Redirect to dashboard if no user data
  if (!userData) {
    return <Redirect to={fallbackPath} />;
  }

  const userTierLevel = tierHierarchy[userData.role] || 0;
  const requiredTierLevel = tierHierarchy[requiredTier] || 0;

  // Check if user has sufficient tier level
  const hasAccess = userTierLevel >= requiredTierLevel;

  // Special handling for admin routes
  if (requiredTier === 'admin' && userData.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md border-red-500/20 bg-red-900/10">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Admin Access Required</h2>
            <p className="text-gray-300 mb-6">
              This page requires administrator privileges. Contact support if you need access.
            </p>
            <button 
              onClick={() => window.location.href = "/dashboard"}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check subscription status for paid tiers
  if (requiredTier !== 'free' && requiredTier !== 'admin') {
    const needsSubscription = !userData.accessGranted || userData.subscriptionStatus !== 'active';
    
    if (needsSubscription && !hasAccess) {
      const config = tierConfig[requiredTier];
      
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md border-purple-500/20 bg-purple-900/10">
            <CardContent className="p-8 text-center">
              <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {config.name} Tier Required
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={config.color}>{config.icon}</span>
                <span className={`text-lg font-semibold ${config.color}`}>
                  {config.name} Subscription
                </span>
              </div>
              <p className="text-gray-300 mb-6">
                This feature requires an active {config.name} subscription.
                {userData.role === 'free' && (
                  <span className="block mt-2 text-sm text-gray-400">
                    Current tier: Free
                  </span>
                )}
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = "/subscribe"}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Upgrade to {config.name}
                </button>
                <button 
                  onClick={() => window.location.href = fallbackPath}
                  className="w-full px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Allow access if user has sufficient tier level
  if (hasAccess) {
    return <>{children}</>;
  }

  // Fallback: insufficient tier level
  const config = tierConfig[requiredTier];
  const userConfig = tierConfig[userData.role];
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md border-orange-500/20 bg-orange-900/10">
        <CardContent className="p-8 text-center">
          <Lock className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Tier Upgrade Required</h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <span className={userConfig.color}>{userConfig.icon}</span>
                <span className="text-sm text-gray-400">Current</span>
              </div>
              <span className={`text-sm ${userConfig.color}`}>{userConfig.name}</span>
            </div>
            <div className="text-gray-600">→</div>
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <span className={config.color}>{config.icon}</span>
                <span className="text-sm text-gray-400">Required</span>
              </div>
              <span className={`text-sm ${config.color}`}>{config.name}</span>
            </div>
          </div>
          <p className="text-gray-300 mb-6">
            This feature requires {config.name} tier access or higher.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = "/subscribe"}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Upgrade Now
            </button>
            <button 
              onClick={() => window.location.href = fallbackPath}
              className="w-full px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}