import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Check, Crown, Users, Star, Shield, ArrowLeft,
  Sparkles, TrendingUp, Target, Mail, Zap, CreditCard
} from "lucide-react";

const plans = {
  starter: {
    name: "Starter",
    price: 47,
    description: "Perfect for creators getting started",
    features: [
      "25 AI-powered hooks/month",
      "Smart editing & CSV/text export",
      "Basic psychology framework applied",
      "3 gladiator agents",
      "A/B test variations",
      "Remove watermarks"
    ],
    popular: true,
    icon: Shield
  },
  pro: {
    name: "Pro",
    price: 197,
    description: "Advanced tools for serious creators",
    features: [
      "Everything in Starter",
      "5 Pro Tools suite",
      "Council analysis",
      "Real-time collaboration",
      "Audio feedback",
      "Advanced analytics"
    ],
    popular: false,
    icon: Star
  },
  vault: {
    name: "Vault",
    price: 5000,
    period: "year",
    description: "Elite tier for premium creators",
    features: [
      "Everything in Pro",
      "$50K+ swipe copy bank",
      "Monthly fresh templates",
      "VIP support channel",
      "White-label options",
      "Custom branding"
    ],
    popular: false,
    icon: Crown
  }
};

export default function CheckoutPage() {
  const [location, setLocation] = useLocation();
  const [isMatch, params] = useRoute("/checkout/:plan");
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const planType = params?.plan || 'starter';
  const plan = plans[planType as keyof typeof plans];

  useEffect(() => {
    if (!plan) {
      setLocation('/subscribe');
    }
  }, [plan, setLocation]);

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with checkout.",
        variant: "destructive",
      });
      setLocation('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/create-checkout-session", {
        planType: planType,
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout/${planType}`
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return null;
  }

  const Icon = plan.icon;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Back button */}
            <Button
              variant="ghost"
              onClick={() => setLocation('/subscribe')}
              className="mb-6 text-white hover:text-purple-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>

            {/* Checkout Card */}
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <Icon className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  Complete Your {plan.name} Subscription
                </CardTitle>
                <p className="text-slate-300">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Plan Summary */}
                <div className="bg-slate-700/30 rounded-lg p-6 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Icon className="w-5 h-5 text-purple-400" />
                        OnyxHooks {plan.name}
                        {plan.popular && (
                          <Badge className="bg-purple-500 text-white ml-2">
                            Most Popular
                          </Badge>
                        )}
                      </h3>
                      <p className="text-slate-300 text-sm mt-1">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">
                        ${plan.price.toLocaleString()}
                      </div>
                      <div className="text-slate-400 text-sm">
                        per {plan.period || 'month'}
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-white font-medium mb-3">What's included:</h4>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="space-y-4">
                  <Button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                        Creating Checkout Session...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Continue to Secure Checkout
                      </div>
                    )}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-slate-400 text-sm">
                      Secure checkout powered by Stripe
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                      <span>🔒 SSL Encrypted</span>
                      <span>💳 All Major Cards</span>
                      <span>🛡️ PCI Compliant</span>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="text-center text-xs text-slate-500 space-y-1">
                  <p>
                    By continuing, you agree to our{" "}
                    <a href="/terms" className="text-purple-400 hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</a>
                  </p>
                  {planType === 'vault' && (
                    <p className="text-orange-400 font-medium">
                      Vault tier subscriptions are non-refundable due to immediate access to premium content.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}