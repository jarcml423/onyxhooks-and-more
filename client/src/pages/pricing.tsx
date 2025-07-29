import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Shield } from "lucide-react";
import { Link } from "wouter";

export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with AI-powered hook generation",
      features: [
        "2 AI-generated hooks per month",
        "Basic gladiator council feedback",
        "Standard templates",
        "Community support"
      ],
      cta: "Start Free",
      ctaLink: "/login",
      popular: false,
      icon: Shield,
      color: "bg-slate-100 dark:bg-slate-800"
    },
    {
      name: "Starter", 
      price: "$47",
      period: "per month",
      description: "Ideal for coaches and creators ready to scale their content",
      features: [
        "25 AI-generated hooks per month",
        "Enhanced gladiator council analysis", 
        "A/B test variations",
        "Conversion optimization tips",
        "CSV export functionality",
        "Email support"
      ],
      cta: "Start Starter Plan",
      ctaLink: "/subscribe?plan=starter",
      popular: true,
      icon: Zap,
      color: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      name: "Pro",
      price: "$197", 
      period: "per month",
      description: "Advanced tools for serious marketers and agencies",
      features: [
        "Unlimited AI-generated hooks",
        "Full AI Council access",
        "Advanced analytics dashboard",
        "Campaign intelligence system",
        "UTM tracking & attribution",
        "Priority support",
        "CSV export functionality"
      ],
      cta: "Upgrade to Pro",
      ctaLink: "/subscribe?plan=pro", 
      popular: false,
      icon: Star,
      color: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      name: "Vault",
      price: "$5,000",
      period: "per year",
      description: "Elite tier for industry leaders and enterprise clients",
      features: [
        "Everything in Pro",
        "Monthly $50K+ swipe copy bank",
        "Private AI training sessions",
        "Custom gladiator development",
        "White-label licensing",
        "1-on-1 strategy calls",
        "Enterprise security",
        "Dedicated account manager"
      ],
      cta: "Join Vault Elite",
      ctaLink: "/subscribe?plan=vault",
      popular: false, 
      icon: Crown,
      color: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                OnyxHooks & More™
              </span>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your OnyxHooks Plan
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            AI-powered hook generation platform by Onyx & Pearls Management, Inc. 
            for coaches, course creators, and service providers to generate, optimize, 
            and monetize high-converting digital offers.
          </p>
          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Trusted by 2,000+ creators • Cancel anytime • 30-day money-back guarantee
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full mx-auto">
          {tiers.map((tier, index) => {
            const IconComponent = tier.icon;
            return (
              <Card 
                key={tier.name} 
                className={`relative ${tier.color} border-2 ${
                  tier.popular 
                    ? 'border-purple-500 shadow-lg scale-105' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <IconComponent className={`w-12 h-12 ${
                      tier.name === 'Free' ? 'text-slate-600' :
                      tier.name === 'Starter' ? 'text-purple-600' :
                      tier.name === 'Pro' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`} />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                    {tier.name}
                  </CardTitle>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      {tier.price}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {tier.period}
                    </span>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href={tier.ctaLink}>
                    <Button 
                      className={`w-full ${
                        tier.popular 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                          : tier.name === 'Free'
                          ? 'bg-slate-600 hover:bg-slate-700 text-white'
                          : tier.name === 'Pro'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white'
                      }`}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Refund & Billing Policy */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Refund & Billing Policy
            </h3>
            <div className="text-left space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                By signing up for any subscription tier, you agree to automatic renewals based on the recurring billing cycle (monthly or annual, depending on the tier). All Starter Tier and Pro Tier subscriptions are billed at the beginning of each monthly cycle. All Vault Tier subscriptions are billed at the beginning of each yearly cycle.
              </p>
              <p>
                Customers can cancel at any time from their account dashboard. Refunds are only provided for billing errors or duplicate charges.
              </p>
              <p>
                We encourage new users to try our Free Tier to evaluate the platform before upgrading. Vault Tier subscriptions are annual commitments with specific terms outlined during checkout.
              </p>
              <p className="text-center font-medium">
                Please refer to our Terms and Conditions for full details.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <div className="text-slate-600 dark:text-slate-400 text-sm space-y-2">
            <p>© 2025 Onyx & Pearls Management, Inc. All rights reserved.</p>
            <div className="flex justify-center gap-6">
              <a href="https://onyxnpearls.com/terms.html" className="hover:text-purple-600">
                Terms of Service
              </a>
              <a href="https://onyxnpearls.com/privacy.html" className="hover:text-purple-600">
                Privacy Policy
              </a>
              <a href="/support" className="hover:text-purple-600">
                Contact Support
              </a>
            </div>
            <p className="mt-4">
              Questions? Email us at <a href="mailto:support@onyxnpearls.com" className="text-purple-600 hover:underline">support@onyxnpearls.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}