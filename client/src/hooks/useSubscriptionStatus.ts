import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface SubscriptionStatus {
  tier: 'free' | 'starter' | 'pro' | 'vault';
  isActive: boolean;
  subscriptionStatus: 'active' | 'past_due' | 'canceled';
  accessGranted: boolean;
  signupDate?: Date;
  paymentHistory?: Array<{
    amount: number;
    date: Date;
    tier: string;
  }>;
}

export function useSubscriptionStatus() {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscriptionStatus(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'Users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setSubscriptionStatus({
            tier: data.tier || 'free',
            isActive: data.isActive || false,
            subscriptionStatus: data.subscriptionStatus || 'canceled',
            accessGranted: data.accessGranted || false,
            signupDate: data.signupDate?.toDate(),
            paymentHistory: data.paymentHistory?.map((payment: any) => ({
              ...payment,
              date: payment.date.toDate()
            })) || []
          });
        } else {
          // User document doesn't exist, create with free tier defaults
          setSubscriptionStatus({
            tier: 'free',
            isActive: true,
            subscriptionStatus: 'active',
            accessGranted: false,
            signupDate: new Date()
          });
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching subscription status:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const hasAccess = (requiredTier: 'starter' | 'pro' | 'vault') => {
    if (!subscriptionStatus) return false;
    
    const tierHierarchy = { free: 0, starter: 1, pro: 2, vault: 3 };
    const userTierLevel = tierHierarchy[subscriptionStatus.tier];
    const requiredTierLevel = tierHierarchy[requiredTier];
    
    return subscriptionStatus.accessGranted && userTierLevel >= requiredTierLevel;
  };

  return {
    subscriptionStatus,
    loading,
    error,
    hasAccess,
    isAuthenticated: !!user,
    isPremiumUser: subscriptionStatus?.accessGranted || false
  };
}