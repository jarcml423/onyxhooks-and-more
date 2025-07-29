import React from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorInfo {
  error: Error;
  errorCode?: string;
  tier?: string;
  guidance?: string;
  upgradePrompt?: string;
  supportInfo?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorInfo: {
        error,
        errorCode: 'REACT_ERROR',
        tier: 'unknown'
      }
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, errorInfo: null });
  };

  render() {
    if (this.state.hasError && this.state.errorInfo) {
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.errorInfo.error} resetError={this.resetError} />;
      }

      return <ErrorDisplay errorInfo={this.state.errorInfo} onRetry={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  errorInfo: ErrorInfo;
  onRetry?: () => void;
  variant?: 'boundary' | 'api' | 'network';
}

export function ErrorDisplay({ errorInfo, onRetry, variant = 'boundary' }: ErrorDisplayProps) {
  const { error, errorCode, tier, guidance, upgradePrompt, supportInfo } = errorInfo;

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'free': return 'border-gray-300';
      case 'starter': return 'border-blue-300';
      case 'pro': return 'border-purple-300';
      case 'vault': return 'border-yellow-300';
      default: return 'border-red-300';
    }
  };

  const getTierBadge = (tier?: string) => {
    if (!tier || tier === 'unknown') return null;
    
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      starter: 'bg-blue-100 text-blue-800',
      pro: 'bg-purple-100 text-purple-800',
      vault: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[tier as keyof typeof colors]}`}>
        {tier.toUpperCase()} USER
      </span>
    );
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className={`max-w-md w-full ${getTierColor(tier)}`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {variant === 'network' ? 'Connection Issue' : 
             variant === 'api' ? 'Service Temporarily Unavailable' : 
             'Something Went Wrong'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {variant === 'network' ? 'Unable to connect to our servers' :
             variant === 'api' ? 'Our AI service is experiencing high demand' :
             'An unexpected error occurred'}
          </CardDescription>
          {getTierBadge(tier)}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error Code */}
          {errorCode && (
            <div className="text-center">
              <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
                Error: {errorCode}
              </code>
            </div>
          )}

          {/* Tier-specific Guidance */}
          {guidance && (
            <Alert>
              <AlertDescription className="text-sm">
                {guidance}
              </AlertDescription>
            </Alert>
          )}

          {/* Upgrade Prompt for Free Users */}
          {upgradePrompt && (
            <Alert className="border-blue-200 bg-blue-50">
              <ArrowUp className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                {upgradePrompt}
              </AlertDescription>
            </Alert>
          )}

          {/* Support Information */}
          {supportInfo && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-sm text-green-800">
                {supportInfo}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            {onRetry && (
              <Button 
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>

          {/* Additional Actions for Higher Tiers */}
          {(tier === 'pro' || tier === 'vault') && (
            <div className="pt-2 border-t">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('mailto:support@offerforge.ai', '_blank')}
                className="w-full text-xs"
              >
                Contact Priority Support
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for handling API errors with tier-specific responses
export function useErrorHandler(tier: string = 'free') {
  const handleError = (error: any): ErrorInfo => {
    // Parse error response from API
    if (error?.response?.data) {
      const apiError = error.response.data;
      return {
        error: new Error(apiError.error?.message || apiError.message || 'API Error'),
        errorCode: apiError.error?.code || 'API_ERROR',
        tier: apiError.tier || tier,
        guidance: apiError.guidance,
        upgradePrompt: apiError.upgradePrompt,
        supportInfo: apiError.supportInfo
      };
    }

    // Network errors
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
      return {
        error: new Error('Network connection failed'),
        errorCode: 'NETWORK_ERROR',
        tier,
        guidance: tier === 'free' 
          ? 'Check your internet connection. Free users may experience connectivity issues during peak times.'
          : 'Connection issue detected. Your tier gets priority network access.'
      };
    }

    // Generic error
    return {
      error: error instanceof Error ? error : new Error('Unknown error'),
      errorCode: 'UNKNOWN_ERROR',
      tier,
      guidance: `Error detected. ${tier === 'free' ? 'Consider upgrading for better error recovery.' : 'Your tier includes enhanced error handling.'}`
    };
  };

  return { handleError };
}

// Component for inline error display (smaller format)
export function InlineError({ errorInfo, onRetry }: { errorInfo: ErrorInfo; onRetry?: () => void }) {
  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-sm text-red-800">
        <div className="space-y-2">
          <p>{errorInfo.error.message}</p>
          {errorInfo.guidance && (
            <p className="text-xs opacity-80">{errorInfo.guidance}</p>
          )}
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry} className="mt-2">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}