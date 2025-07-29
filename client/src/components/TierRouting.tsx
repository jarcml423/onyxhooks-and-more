import { useQuery } from "@tanstack/react-query";
import StarterTierDashboard from "./StarterTierDashboard";
import VaultDashboard from "./VaultDashboard";
import PlatinumLotteryCard from "./PlatinumLotteryCard";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Zap, Star } from "lucide-react";

interface User {
  id: number;
  role: "free" | "starter" | "vault" | "platinum";
  usageCount?: number;
  templatesUsed?: number;
  lastActive?: string;
  memberSince?: string;
}

export default function TierRouting() {
  const { data: userData, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!userData) {
    return (
      <Card className="cinematic-card max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <Star className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
          <p className="text-gray-300">Please sign in to access your dashboard</p>
        </CardContent>
      </Card>
    );
  }

  // Route based on user tier
  switch (userData.role) {
    case "starter":
      return (
        <StarterTierDashboard 
          user={{
            usageCount: userData.usageCount || 0,
            templatesUsed: userData.templatesUsed || 0,
            lastActive: userData.lastActive || new Date().toISOString()
          }}
        />
      );

    case "vault":
      return (
        <VaultDashboard 
          userData={userData}
          onUpgrade={() => console.log("Upgrade triggered")}
        />
      );

    case "platinum":
      return (
        <div className="space-y-8">
          <div className="text-center">
            <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">
              Platinum Command Center
            </h1>
            <p className="text-gray-300 mt-2">Welcome to the legendary tier</p>
          </div>
          <VaultDashboard 
            userData={userData}
            onUpgrade={() => console.log("Already at highest tier")}
          />
        </div>
      );

    case "free":
    default:
      return (
        <div className="space-y-8">
          {/* Free tier upgrade prompt */}
          <Card className="cinematic-card border-2 border-blue-500/30">
            <CardContent className="p-8 text-center">
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Build High-Converting Offers?
              </h2>
              <p className="text-gray-300 mb-6">
                Upgrade to Starter ($47/month) to access hand-picked templates and the AI Analyzer
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-blue-400 font-bold">10 Templates</div>
                  <div className="text-xs text-gray-400">Hand-picked winners</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold">4 Analyzer Uses</div>
                  <div className="text-xs text-gray-400">Per week</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold">Vault Feed</div>
                  <div className="text-xs text-gray-400">Read-only access</div>
                </div>
              </div>
              <button className="shine-button">
                Upgrade to Starter - $47/month
              </button>
            </CardContent>
          </Card>

          {/* Platinum lottery preview for free users */}
          <PlatinumLotteryCard
            isEligible={false}
            spotsRemaining={5}
            nextEligibilityDate="2025-01-15"
          />
        </div>
      );
  }
}