import React from 'react';
import { Lock, Crown, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { Link } from 'wouter';

interface TierLockProps {
  requiredTier: 'starter' | 'pro' | 'vault';
  children: React.ReactNode;
  featureName?: string;
  description?: string;
  benefits?: string[];
}

const tierConfig = {
  starter: {
    name: 'Starter',
    price: '$47/month',
    color: 'bg-blue-500',
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-500'
  },
  pro: {
    name: 'Pro',
    price: '$197/month', 
    color: 'bg-purple-500',
    icon: Crown,
    gradient: 'from-purple-500 to-pink-500'
  },
  vault: {
    name: 'Vault',
    price: '$5,000/year',
    color: 'bg-amber-500', 
    icon: Shield,
    gradient: 'from-amber-500 to-orange-500'
  }
};

export default function TierLock({ 
  requiredTier, 
  children, 
  featureName = 'Premium Feature',
  description,
  benefits = []
}: TierLockProps) {
  const { hasAccess, subscriptionStatus, loading } = useSubscriptionStatus();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (hasAccess(requiredTier)) {
    return <>{children}</>;
  }

  const config = tierConfig[requiredTier];
  const Icon = config.icon;

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
      
      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <Card className="max-w-md mx-auto shadow-2xl border-2">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${config.gradient} mx-auto mb-4 flex items-center justify-center`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">
              {featureName} Locked
            </CardTitle>
            <Badge variant="secondary" className="mx-auto">
              <Lock className="w-3 h-3 mr-1" />
              {config.name} Required
            </Badge>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
            
            {benefits.length > 0 && (
              <div className="text-left">
                <h4 className="font-semibold mb-2">Unlock with {config.name}:</h4>
                <ul className="space-y-1 text-sm">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${config.color} mr-2`} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {config.price}
              </div>
              <Link href={`/subscribe?plan=${requiredTier}`}>
                <Button className={`w-full bg-gradient-to-r ${config.gradient} hover:opacity-90`}>
                  <Icon className="w-4 h-4 mr-2" />
                  Upgrade to {config.name}
                </Button>
              </Link>
            </div>
            
            {subscriptionStatus && subscriptionStatus.tier !== 'free' && (
              <p className="text-xs text-gray-500 mt-2">
                Current plan: {subscriptionStatus.tier.charAt(0).toUpperCase() + subscriptionStatus.tier.slice(1)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}