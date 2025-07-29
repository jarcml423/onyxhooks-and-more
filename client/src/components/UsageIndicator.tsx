import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, Crown } from "lucide-react";
import { Link } from "wouter";

interface UsageStatus {
  canProceed: boolean;
  remainingOffers: number;
  dailyOfferCount: number;
  planLimits: {
    dailyOffers: number;
    dailyTokens: number;
  };
  warningMessage?: string;
  upgradeRequired?: boolean;
}

interface UsageIndicatorProps {
  showDetails?: boolean;
  compact?: boolean;
}

export default function UsageIndicator({ showDetails = false, compact = false }: UsageIndicatorProps) {
  const { data: usage, isLoading } = useQuery({
    queryKey: ["/api/usage-status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading || !usage) {
    return compact ? null : (
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
            <span className="text-sm text-gray-500">Loading usage...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const usagePercent = (usage.dailyOfferCount / usage.planLimits.dailyOffers) * 100;
  const isNearLimit = usagePercent >= 80;
  const isAtLimit = usage.remainingOffers <= 0;

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant={isAtLimit ? "destructive" : isNearLimit ? "outline" : "secondary"}>
          {usage.dailyOfferCount}/{usage.planLimits.dailyOffers}
        </Badge>
        {isAtLimit && (
          <Link href="/subscribe">
            <Button size="sm" className="h-6 px-2 text-xs">
              <Crown className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <Card className={`border-2 ${isAtLimit ? 'border-red-200 bg-red-50' : isNearLimit ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className={`w-5 h-5 ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-blue-600'}`} />
            <span className="font-semibold text-gray-900">Daily Usage</span>
          </div>
          <Badge variant={isAtLimit ? "destructive" : isNearLimit ? "outline" : "secondary"}>
            {usage.dailyOfferCount}/{usage.planLimits.dailyOffers} Offers
          </Badge>
        </div>

        <Progress 
          value={usagePercent} 
          className={`h-2 mb-3 ${isAtLimit ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : 'bg-gray-100'}`}
        />

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {usage.remainingOffers} offers remaining today
          </span>
          <span className="text-gray-500">
            {Math.round(usagePercent)}% used
          </span>
        </div>

        {usage.warningMessage && (
          <div className={`mt-3 p-3 rounded-lg flex items-start space-x-2 ${
            isAtLimit ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{usage.warningMessage}</p>
              {isAtLimit && (
                <Link href="/subscribe">
                  <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700 text-white">
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {showDetails && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Plan:</span>
                <span className="ml-2 font-medium capitalize">{usage.planLimits.dailyOffers === 2 ? 'Free' : usage.planLimits.dailyOffers === 10 ? 'Pro' : usage.planLimits.dailyOffers === 25 ? 'Vault' : 'Agency'}</span>
              </div>
              <div>
                <span className="text-gray-500">Resets:</span>
                <span className="ml-2 font-medium">Midnight</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}