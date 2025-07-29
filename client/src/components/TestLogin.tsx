import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Crown, Star, Zap, Gem } from "lucide-react";

const tierConfigs = {
  free: {
    name: "Free",
    icon: User,
    color: "bg-gray-500",
    description: "2 hook/offer generations, quiz access",
    features: ["Basic Hook Generator", "Basic Offer Generator", "Offer Strength Quiz"]
  },
  starter: {
    name: "Starter",
    icon: Star,
    color: "bg-blue-500",
    description: "Unlimited generations, no watermark",
    features: ["Unlimited Hook/Offer Generation", "PDF Export", "No Watermark"]
  },
  pro: {
    name: "Pro",
    icon: Zap,
    color: "bg-purple-500",
    description: "All Starter + 5 Pro Tools",
    features: ["All Starter Features", "Pricing Justification", "Objection Eraser", "Guarantee Generator", "Urgency Engine"]
  },
  vault: {
    name: "Vault",
    icon: Crown,
    color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    description: "Everything + Vault Tools + Platinum Lottery",
    features: ["All Pro Features", "Swipe Copy Bank", "White Label Mode", "CRM Export", "Platinum Lottery Access"]
  }
};

export default function TestLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTierLogin = async (tier: string) => {
    setIsLoading(true);
    try {
      // First switch the role
      const switchResponse = await fetch('/api/test/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: tier })
      });

      if (switchResponse.ok) {
        // Create mock user data for the frontend
        const mockUser = {
          id: 1,
          email: `test-${tier}@example.com`,
          username: `Test${tier.charAt(0).toUpperCase()}${tier.slice(1)}User`,
          role: tier,
          createdAt: new Date().toISOString(),
          subscriptionStatus: tier === "free" ? null : "active",
          subscriptionEndsAt: tier === "free" ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        // Store the mock session data
        localStorage.setItem('test_user', JSON.stringify(mockUser));
        localStorage.setItem('test_token', `mock_token_${tier}_${Date.now()}`);
        localStorage.setItem('test_tier', tier);
        
        toast({
          title: "Login Successful",
          description: `Logged in as ${tier.toUpperCase()} tier user`,
        });

        // Redirect to appropriate page based on tier
        const redirectPath = tier === 'vault' ? '/vault' : 
                           tier === 'pro' ? '/pro-tier' : 
                           tier === 'starter' ? '/dashboard' : '/free-tier';
        
        window.location.href = redirectPath;
      } else {
        const errorData = await switchResponse.json();
        toast({
          title: "Login Failed",
          description: errorData.message || "Failed to switch role",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "Unable to connect to server",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            OnyxHooks & More™ - Test Login
          </h1>
          <p className="text-xl text-gray-600">
            Choose a tier to test the platform functionality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(tierConfigs).map(([tier, config]) => {
            const IconComponent = config.icon;
            return (
              <Card key={tier} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${config.color} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{config.name}</CardTitle>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 mb-6">
                    {config.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleTierLogin(tier)}
                    disabled={isLoading}
                    variant={tier === 'vault' ? 'default' : 'outline'}
                  >
                    {isLoading ? 'Logging in...' : `Test as ${config.name}`}
                  </Button>
                </CardContent>

                {tier === 'vault' && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                      <Gem className="w-3 h-3 mr-1" />
                      Elite
                    </Badge>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <div className="space-y-3 text-sm">
                <p><strong>Free Tier:</strong> Limited to 2 hook/offer generations, watermarked content</p>
                <p><strong>Starter Tier:</strong> Unlimited basic features, full editing, no watermark</p>
                <p><strong>Pro Tier:</strong> Access to advanced tools like Pricing Justification and Objection Eraser</p>
                <p><strong>Vault Tier:</strong> Full platform access including Platinum Lottery ($10,000 exclusive tier)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}