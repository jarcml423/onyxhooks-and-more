import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, DollarSign, CreditCard, User } from "lucide-react";

interface StripeTestResult {
  success: boolean;
  tier: string;
  priceId?: string;
  fallback?: boolean;
  actualTier?: string;
  customer?: {
    id: string;
    email: string;
    name: string;
  };
  subscription?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    interval: string;
    interval_count: number;
  };
  paymentIntent?: {
    client_secret: string;
    amount: number;
    currency: string;
  };
  message?: string;
  error?: string;
  configuredTiers?: string[];
}

export default function StripeTestConsole() {
  const [testResults, setTestResults] = useState<Record<string, StripeTestResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const tiers = ['starter', 'pro', 'vault', 'agency'];

  const testTier = async (tier: string) => {
    setLoading(prev => ({ ...prev, [tier]: true }));
    
    try {
      const response = await apiRequest("POST", "/api/test/stripe-ping", { tier });
      const result = await response.json();
      
      setTestResults(prev => ({ ...prev, [tier]: result }));
      
      if (result.success) {
        toast({
          title: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Test Successful`,
          description: result.message || `Stripe configured correctly for ${tier}`,
        });
      } else {
        toast({
          title: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Test Failed`,
          description: result.message || result.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorResult = {
        success: false,
        tier,
        error: error.message || "Network error",
        message: `Failed to test ${tier} tier`
      };
      
      setTestResults(prev => ({ ...prev, [tier]: errorResult }));
      
      toast({
        title: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Test Error`,
        description: error.message || "Network error",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [tier]: false }));
    }
  };

  const testAllTiers = async () => {
    for (const tier of tiers) {
      await testTier(tier);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: (currency || 'USD').toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Stripe Integration Test Console
          </CardTitle>
          <CardDescription>
            Test Stripe charging for each tier to verify configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tiers.map(tier => (
              <Button
                key={tier}
                onClick={() => testTier(tier)}
                disabled={loading[tier]}
                variant="outline"
                size="sm"
              >
                {loading[tier] && <Clock className="w-4 h-4 mr-2 animate-spin" />}
                Test {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Button>
            ))}
          </div>
          
          <Button 
            onClick={testAllTiers}
            disabled={Object.values(loading).some(Boolean)}
            className="w-full"
          >
            Test All Tiers
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {Object.entries(testResults).map(([tier, result]) => (
          <Card key={tier} className={`border ${result.success ? 'border-green-200' : 'border-red-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
                </CardTitle>
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? "SUCCESS" : "FAILED"}
                </Badge>
              </div>
              {result.fallback && (
                <Badge variant="secondary" className="w-fit">
                  Using Fallback: {result.actualTier}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {result.message && (
                <p className="text-sm text-gray-600">{result.message}</p>
              )}
              
              {result.error && (
                <p className="text-sm text-red-600 font-medium">{result.error}</p>
              )}

              {result.configuredTiers && (
                <div>
                  <p className="text-sm font-medium mb-1">Configured Tiers:</p>
                  <div className="flex flex-wrap gap-1">
                    {result.configuredTiers.map(configTier => (
                      <Badge key={configTier} variant="outline" className="text-xs">
                        {configTier}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.priceId && (
                <div className="text-sm">
                  <span className="font-medium">Price ID:</span> 
                  <code className="ml-1 bg-gray-100 px-1 rounded">{result.priceId}</code>
                </div>
              )}

              {result.customer && (
                <div className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium text-sm">Customer Created</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div><span className="font-medium">ID:</span> {result.customer.id}</div>
                    <div><span className="font-medium">Email:</span> {result.customer.email}</div>
                    <div><span className="font-medium">Name:</span> {result.customer.name}</div>
                  </div>
                </div>
              )}

              {result.subscription && (
                <div className="border rounded-lg p-3 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium text-sm">Subscription Created</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div><span className="font-medium">ID:</span> {result.subscription.id}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge variant="outline" className="ml-1 text-xs">
                        {result.subscription.status}
                      </Badge>
                    </div>
                    <div><span className="font-medium">Amount:</span> {formatCurrency(result.subscription.amount, result.subscription.currency)}</div>
                    <div><span className="font-medium">Billing:</span> Every {result.subscription.interval_count} {result.subscription.interval}(s)</div>
                  </div>
                </div>
              )}

              {result.paymentIntent && (
                <div className="border rounded-lg p-3 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium text-sm">Payment Intent</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div><span className="font-medium">Amount:</span> {formatCurrency(result.paymentIntent.amount, result.paymentIntent.currency)}</div>
                    <div><span className="font-medium">Client Secret:</span> 
                      <code className="ml-1 bg-white px-1 rounded text-xs">
                        {result.paymentIntent.client_secret ? result.paymentIntent.client_secret.substring(0, 20) + '...' : 'N/A'}
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}