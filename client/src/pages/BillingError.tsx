import React from 'react';
import { AlertCircle, CreditCard, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'wouter';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';

export default function BillingError() {
  const { subscriptionStatus, loading } = useSubscriptionStatus();

  const getErrorMessage = () => {
    if (!subscriptionStatus) {
      return {
        title: "Authentication Required",
        description: "Please sign in to access premium features.",
        action: "Sign In"
      };
    }

    if (subscriptionStatus.subscriptionStatus === 'past_due') {
      return {
        title: "Payment Issue Detected",
        description: "Your subscription payment failed. Please update your payment method to continue accessing premium features.",
        action: "Update Payment"
      };
    }

    if (subscriptionStatus.subscriptionStatus === 'canceled') {
      return {
        title: "Subscription Canceled",
        description: "Your subscription has been canceled. Upgrade to continue accessing premium features.",
        action: "Reactivate Subscription"
      };
    }

    if (!subscriptionStatus.accessGranted) {
      return {
        title: "Access Not Granted",
        description: "Your account doesn't have access to this premium feature. Please upgrade your plan.",
        action: "Upgrade Plan"
      };
    }

    return {
      title: "Access Denied",
      description: "You don't have permission to access this feature. Please check your subscription status.",
      action: "Check Subscription"
    };
  };

  const error = getErrorMessage();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {error.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.description}
              </AlertDescription>
            </Alert>

            {subscriptionStatus && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm text-gray-900">Current Status:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Plan:</span>
                    <span className="ml-2 font-medium capitalize">{subscriptionStatus.tier}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 font-medium ${
                      subscriptionStatus.subscriptionStatus === 'active' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {subscriptionStatus.subscriptionStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Access:</span>
                    <span className={`ml-2 font-medium ${
                      subscriptionStatus.accessGranted 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {subscriptionStatus.accessGranted ? 'Granted' : 'Denied'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Active:</span>
                    <span className={`ml-2 font-medium ${
                      subscriptionStatus.isActive 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {subscriptionStatus.isActive ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {subscriptionStatus?.subscriptionStatus === 'past_due' ? (
                <Button className="w-full" asChild>
                  <Link href="/billing">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Update Payment Method
                  </Link>
                </Button>
              ) : (
                <Button className="w-full" asChild>
                  <Link href="/subscribe">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {error.action}
                  </Link>
                </Button>
              )}

              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Dashboard
                </Link>
              </Button>

              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>Need help? Contact support at support@offerforge.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}