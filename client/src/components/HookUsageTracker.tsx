import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Zap, Crown, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface HookUsageData {
  used: number;
  limit: number;
  tier: 'free' | 'starter' | 'pro' | 'vault';
  resetDate?: string;
}

interface HookUsageTrackerProps {
  currentUsage?: HookUsageData;
  className?: string;
}

const TIER_LIMITS = {
  free: { limit: 2, name: "Free", nextTier: "Starter", nextLimit: 25, price: "$47" },
  starter: { limit: 25, name: "Starter", nextTier: "Pro", nextLimit: "Unlimited", price: "$197" },
  pro: { limit: -1, name: "Pro", nextTier: "Vault", nextLimit: "Elite", price: "$5,000" },
  vault: { limit: -1, name: "Vault", nextTier: null, nextLimit: null, price: null }
};

export function HookUsageTracker({ currentUsage, className = "" }: HookUsageTrackerProps) {
  // Demo data if no usage provided
  const usage = currentUsage || {
    used: 22,
    limit: 25,
    tier: 'starter' as const,
    resetDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString()
  };

  const tierInfo = TIER_LIMITS[usage.tier];
  const isUnlimited = usage.limit === -1;
  const usagePercent = isUnlimited ? 0 : Math.min((usage.used / usage.limit) * 100, 100);
  const isAtLimit = !isUnlimited && usage.used >= usage.limit;
  const isNearLimit = !isUnlimited && usagePercent >= 80;
  const remaining = isUnlimited ? "∞" : Math.max(0, usage.limit - usage.used);

  const getUpgradeMessage = () => {
    if (usage.tier === 'free' && isAtLimit) {
      return "You've used all 2 free hooks. Upgrade to Starter for 25 hooks/month.";
    }
    if (usage.tier === 'starter' && isAtLimit) {
      return "You've hit your 25-hook limit. Upgrade to Pro for unlimited hooks.";
    }
    if (usage.tier === 'starter' && isNearLimit) {
      return "You're running low on hooks. Pro gives you unlimited freedom.";
    }
    return null;
  };

  const upgradeMessage = getUpgradeMessage();

  if (isUnlimited) {
    return (
      <Card className={`border-2 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-900 dark:text-green-100">
                {tierInfo.name} - Unlimited Hooks
              </span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300">
              ∞ Available
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${
      isAtLimit 
        ? 'border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800' 
        : isNearLimit 
          ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800' 
          : 'border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700'
    } ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className={`w-5 h-5 ${
              isAtLimit 
                ? 'text-red-600 dark:text-red-400' 
                : isNearLimit 
                  ? 'text-yellow-600 dark:text-yellow-400' 
                  : 'text-blue-600 dark:text-blue-400'
            }`} />
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Hook Usage - {tierInfo.name}
            </span>
          </div>
          <Badge variant={isAtLimit ? "destructive" : isNearLimit ? "outline" : "secondary"}>
            {usage.used}/{usage.limit} Used
          </Badge>
        </div>

        <Progress 
          value={usagePercent} 
          className={`h-3 mb-3 ${
            isAtLimit 
              ? 'bg-red-100 dark:bg-red-900' 
              : isNearLimit 
                ? 'bg-yellow-100 dark:bg-yellow-900' 
                : 'bg-slate-100 dark:bg-slate-800'
          }`}
        />

        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-slate-600 dark:text-slate-300">
            {remaining} hooks remaining
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {Math.round(usagePercent)}% used
          </span>
        </div>

        {upgradeMessage && (
          <div className="mt-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                  {upgradeMessage}
                </p>
                
                {tierInfo.nextTier && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Upgrade to {tierInfo.nextTier}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-purple-600">
                          🚀 Upgrade to {tierInfo.nextTier}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {tierInfo.price}/month
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">
                            {tierInfo.nextLimit} hooks per month
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <span className="text-sm">Current: {tierInfo.name}</span>
                            <span className="text-sm font-medium">{usage.limit} hooks/month</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-900">
                            <span className="text-sm font-medium">Upgrade: {tierInfo.nextTier}</span>
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                              {tierInfo.nextLimit} hooks/month
                            </span>
                          </div>
                        </div>

                        <Link href="/pricing">
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                            Upgrade Now
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        )}

        {usage.resetDate && !isAtLimit && (
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Resets {new Date(usage.resetDate).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}