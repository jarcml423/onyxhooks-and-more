import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { apiRequest } from "@/lib/queryClient";
import { 
  Check, Crown, Users, Star, Shield, ArrowLeft,
  Sparkles, TrendingUp, Target, Mail, Zap
} from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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
    popular: true
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
      "Priority support"
    ],
    popular: false
  },
  vault: {
    name: "Vault",
    price: 5000,
    description: "Elite tier for top performers",
    features: [
      "Everything in Pro",
      "200+ swipe copy bank",
      "Elite council sequence",
      "White label mode",
      "CRM export",
      "Platinum lottery access"
    ],
    popular: false
  }
};

const CheckoutForm = ({ planType }: { planType: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?success=true`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Payment Failed", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const plan = plans[planType as keyof typeof plans];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">
          {plan.name} Plan - ${planType === 'vault' ? plan.price.toLocaleString() : plan.price}/{planType === 'vault' ? 'year' : 'month'}
        </h3>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <PaymentElement />
      
      {/* Legal Agreement Checkbox */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I have read and agree to the{" "}
          <a href="https://onyxnpearls.com/terms.html" target="_blank" className="text-primary hover:underline">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="https://onyxnpearls.com/privacy.html" target="_blank" className="text-primary hover:underline">
            Privacy Policy
          </a>.
          I understand that Vault Tier purchases are final and non-refundable due to instant digital delivery of proprietary assets.
        </label>
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing || !acceptTerms}
        className="w-full btn-primary"
        size="lg"
      >
        {isProcessing ? (
          "Processing..."
        ) : (
          <>
            <Crown className="w-4 h-4 mr-2" />
            Subscribe to {plan.name} - ${planType === 'vault' ? plan.price.toLocaleString() : plan.price}/{planType === 'vault' ? 'yr' : 'mo'}
          </>
        )}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <Shield className="w-4 h-4 inline mr-1" />
        Secure payment powered by Stripe • 30-day money-back guarantee
      </div>
    </form>
  );
};

export default function Subscribe() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("starter");
  const [loading, setLoading] = useState(false);

  // Get plan from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    if (planParam && plans[planParam as keyof typeof plans]) {
      setSelectedPlan(planParam);
    }
  }, []);

  useEffect(() => {
    if (selectedPlan && user) {
      createSubscription();
    }
  }, [selectedPlan, user]);

  const createSubscription = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/create-subscription", { 
        planType: selectedPlan 
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error: any) {
      toast({
        title: "Failed to create subscription",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (planType: string) => {
    setSelectedPlan(planType);
    setClientSecret(""); // Reset client secret when plan changes
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center">
            <CardContent className="py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sign In Required
              </h2>
              <p className="text-gray-600 mb-8">
                Please sign in to subscribe to OnyxHooks & More™
              </p>
              <Button onClick={() => setLocation("/login")}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Setting up your subscription...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: 'hsl(247, 84%, 66%)',
    },
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upgrade to unlock AI-powered offer optimization and 200+ proven templates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Selection */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Select a Plan</h2>
              
              {Object.entries(plans).map(([key, plan]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedPlan === key 
                      ? 'border-2 border-primary shadow-lg' 
                      : 'border hover:shadow-md'
                  } ${plan.popular ? 'ring-2 ring-primary ring-opacity-20' : ''}`}
                  onClick={() => handlePlanChange(key)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center text-xl">
                          {plan.name}
                          {plan.popular && (
                            <Badge className="ml-2 bg-primary">Most Popular</Badge>
                          )}
                        </CardTitle>
                        <p className="text-gray-600 mt-1">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">
                          ${key === 'vault' ? plan.price.toLocaleString() : plan.price}
                        </div>
                        <div className="text-gray-600">
                          {key === 'vault' ? '/year' : '/month'}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {selectedPlan === key && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center text-blue-800">
                          <Check className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Selected Plan</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Benefits Summary */}
              <Card className="bg-gradient-to-br from-primary to-secondary text-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Why Upgrade?</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Unlimited AI generation
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      ROI simulation tools
                    </div>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Funnel optimization
                    </div>
                    <div className="flex items-center">
                      <Crown className="w-4 h-4 mr-2" />
                      Premium templates
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    Secure Checkout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clientSecret ? (
                    <Elements 
                      stripe={stripePromise} 
                      options={{ 
                        clientSecret,
                        appearance 
                      }}
                    >
                      <CheckoutForm planType={selectedPlan} />
                    </Elements>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-gray-600">Loading payment form...</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trust Signals */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center space-x-6 text-gray-500">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="text-sm">SSL Secured</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm">30-Day Guarantee</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Trusted by 2,000+ creators worldwide
                  </p>
                  <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
                    <span>🔒 256-bit SSL encryption</span>
                    <span>💳 Powered by Stripe</span>
                    <span>🛡️ PCI DSS compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-600 text-sm">
                  Yes, you can cancel your subscription at any time. No long-term commitments.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Is there a money-back guarantee?</h4>
                <p className="text-gray-600 text-sm">
                  We offer a 30-day money-back guarantee on all paid plans. No questions asked.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards and debit cards through our secure Stripe integration.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h4>
                <p className="text-gray-600 text-sm">
                  Yes, you can change your plan at any time. Changes take effect at your next billing cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
