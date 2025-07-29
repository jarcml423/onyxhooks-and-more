import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Shield, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ planName, planPrice }: { planName: string; planPrice: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      console.error('Stripe payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Please check your card details and try again",
        variant: "destructive",
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast({
        title: "Payment Successful! 🎉",
        description: "Welcome to Starter tier! Check your email for confirmation.",
      });
      
      // Redirect to dashboard after successful payment
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          "Processing..."
        ) : (
          <>
            <Crown className="w-4 h-4 mr-2" />
            Subscribe to {planName} - ${planPrice}/mo
          </>
        )}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <Shield className="w-4 h-4 inline mr-1" />
        Secure payment powered by Stripe • Test mode
      </div>
    </form>
  );
};

export default function SubscriptionTest() {
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const planDetails = {
    name: "Starter",
    price: 47,
    description: "Perfect for creators getting started",
    features: [
      "Unlimited hook generation",
      "3 gladiator agents",
      "A/B test variations", 
      "OnyxHooks Framework",
      "Editing & export tools",
      "Remove watermarks"
    ]
  };

  const createSubscription = async () => {
    setLoading(true);
    try {
      // Create test subscription
      const response = await apiRequest("POST", "/api/test/stripe-ping", {
        tier: "starter"
      });

      const data = await response.json();
      
      if (data.success) {
        // Create a payment intent for the test subscription
        const paymentResponse = await apiRequest("POST", "/api/create-payment-intent", {
          amount: 47 // $47 for starter tier
        });
        
        const paymentData = await paymentResponse.json();
        
        if (paymentData.clientSecret) {
          setClientSecret(paymentData.clientSecret);
          toast({
            title: "Test Subscription Ready",
            description: "Use test card 4242424242424242 to complete payment",
          });
        } else {
          throw new Error("Failed to create payment intent");
        }
      } else {
        throw new Error(data.message || "Failed to create test subscription");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to setup test subscription",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // Auto-create subscription on page load
    createSubscription();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Setting up test subscription...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Setup Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Could not create test subscription</p>
            <Button onClick={createSubscription}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Starter Subscription
          </h1>
          <p className="text-gray-600">
            Complete the test payment to verify the subscription flow
          </p>
        </div>

        <div className="grid gap-8">
          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-blue-600" />
                {planDetails.name} Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-2xl font-bold">${planDetails.price}<span className="text-base font-normal text-gray-600">/month</span></div>
                <p className="text-gray-600">{planDetails.description}</p>
              </div>
              
              <div className="space-y-2">
                {planDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Test Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Test Card Details</h4>
                <div className="space-y-1 text-sm text-green-700">
                  <div><strong>Card Number:</strong> <code className="bg-white px-1 rounded">4242424242424242</code></div>
                  <div><strong>Expiry Date:</strong> <code className="bg-white px-1 rounded">12/34</code> (or any future date)</div>
                  <div><strong>CVC:</strong> <code className="bg-white px-1 rounded">123</code> (or any 3 digits)</div>
                  <div><strong>ZIP Code:</strong> <code className="bg-white px-1 rounded">12345</code> (any 5 digits)</div>
                </div>
                <p className="text-xs text-green-600 mt-2">💡 This will test the complete subscription flow including welcome emails</p>
              </div>
              
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm planName={planDetails.name} planPrice={planDetails.price} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}