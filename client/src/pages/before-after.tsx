import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  TrendingUp, Share2, Twitter, Facebook, Copy, ArrowRight, 
  Sparkles, DollarSign, Target, Users, Zap, Lock, Rocket
} from "lucide-react";

const transformations = [
  {
    id: 1,
    industry: "Business Coaching",
    tier: "vault",
    before: {
      title: "Generic Life Coaching Session",
      price: 75,
      description: "One-on-one coaching session to help with personal development",
      issues: [
        "Vague transformation promise",
        "Low-ticket pricing",
        "Generic positioning",
        "No specific outcome"
      ]
    },
    after: {
      title: "The 90-Day Executive Presence Transformation",
      price: 2497,
      description: "Transform mid-level managers into C-suite ready executives with proven leadership frameworks",
      improvements: [
        "Specific outcome & timeline",
        "Premium pricing strategy", 
        "Executive niche positioning",
        "Clear value proposition"
      ]
    },
    results: {
      priceIncrease: 3229,
      conversionImprovement: 280,
      revenueMultiplier: "33x"
    },
    clientStory: "Sarah went from $3K/month to $45K/month in 6 months using this repositioning."
  },
  {
    id: 2,
    industry: "Digital Marketing",
    tier: "pro",
    before: {
      title: "Marketing Course",
      price: 197,
      description: "Learn digital marketing strategies to grow your business online",
      issues: [
        "Broad market appeal",
        "Course-focused messaging",
        "Price-conscious positioning",
        "Commodity pricing"
      ]
    },
    after: {
      title: "The $10K/Month Agency Blueprint",
      price: 997,
      description: "Build a recurring revenue agency that generates $10K+ monthly within 90 days",
      improvements: [
        "Income-specific outcome",
        "Business model clarity",
        "Value-based pricing",
        "Recurring revenue focus"
      ]
    },
    results: {
      priceIncrease: 406,
      conversionImprovement: 190,
      revenueMultiplier: "7.7x"
    },
    clientStory: "Marcus built his agency to $15K/month using this exact blueprint and positioning."
  },
  {
    id: 3,
    industry: "Health & Fitness",
    tier: "vault",
    before: {
      title: "Fitness Consultation",
      price: 50,
      description: "Personal training consultation to assess your fitness goals",
      issues: [
        "Time-based pricing",
        "Service-focused offer",
        "Hourly mindset",
        "No transformation focus"
      ]
    },
    after: {
      title: "The Body Transformation Guarantee",
      price: 1497,
      description: "Guaranteed 20+ pound weight loss and muscle gain transformation in 16 weeks",
      improvements: [
        "Outcome guarantee",
        "Transformation focus",
        "Premium positioning",
        "Results-based pricing"
      ]
    },
    results: {
      priceIncrease: 2894,
      conversionImprovement: 340,
      revenueMultiplier: "29.9x"
    },
    clientStory: "Alex transformed his personal training business into a $25K/month transformation program."
  }
];

// Helper function to get tier badge
const getTierBadge = (tier: string) => {
  switch (tier) {
    case "vault":
      return {
        text: "Powered by Vault Tier",
        icon: Lock,
        className: "bg-purple-100 text-purple-700 border-purple-200"
      };
    case "pro":
      return {
        text: "Achieved with Pro Tier",
        icon: Rocket,
        className: "bg-blue-100 text-blue-700 border-blue-200"
      };
    default:
      return {
        text: "Created using Free Plan",
        icon: Target,
        className: "bg-gray-100 text-gray-700 border-gray-200"
      };
  }
};

export default function BeforeAfter() {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleShare = (platform: string, transformation: any) => {
    const text = `🚀 Amazing transformation: "${transformation.before.title}" ($${transformation.before.price}) → "${transformation.after.title}" ($${transformation.after.price}) = ${transformation.results.priceIncrease}% increase! See how @OnyxHooks helps creators optimize their offers.`;
    const url = window.location.href;

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
        break;
      case "copy":
        navigator.clipboard.writeText(`${text}\n\n${url}`);
        setCopiedId(transformation.id);
        toast({
          title: "Copied to clipboard!",
          description: "Share this transformation with your audience.",
        });
        setTimeout(() => setCopiedId(null), 2000);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Real Transformations,
            <span className="gradient-text block mt-2">
              Real Results
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            See how OnyxHooks & More™ has helped creators, coaches, and service providers transform 
            their struggling offers into high-converting, premium-priced programs.
          </p>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">2,000+</div>
              <p className="text-gray-600">Offers Optimized</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">$50M+</div>
              <p className="text-gray-600">Revenue Generated</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">847%</div>
              <p className="text-gray-600">Avg. Price Increase</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">3.2x</div>
              <p className="text-gray-600">Conversion Lift</p>
            </div>
          </div>
        </div>

        {/* Transformations */}
        <div className="space-y-16">
          {transformations.map((transformation, index) => (
            <div key={transformation.id} className="relative">
              {/* Industry Badge */}
              <div className="text-center mb-8">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {transformation.industry}
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Before Card */}
                <Card className="border-2 border-red-200 bg-red-50">
                  <CardHeader>
                    <div className="text-center mb-4">
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        BEFORE
                      </Badge>
                    </div>
                    <CardTitle className="text-center text-xl">
                      "{transformation.before.title}"
                    </CardTitle>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-red-700">
                        ${transformation.before.price}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-center mb-6 italic">
                      "{transformation.before.description}"
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-red-800">Issues:</h4>
                      {transformation.before.issues.map((issue, i) => (
                        <div key={i} className="flex items-center text-sm text-red-700">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                          {issue}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* After Card */}
                <Card className="border-2 border-green-200 bg-green-50 relative">
                  <CardHeader>
                    <div className="text-center mb-4">
                      <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                        AFTER
                      </Badge>
                    </div>
                    <CardTitle className="text-center text-xl">
                      "{transformation.after.title}"
                    </CardTitle>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-green-700">
                        ${transformation.after.price}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-center mb-6 italic">
                      "{transformation.after.description}"
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-800">Improvements:</h4>
                      {transformation.after.improvements.map((improvement, i) => (
                        <div key={i} className="flex items-center text-sm text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                          {improvement}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  {/* Tier Watermark */}
                  {(() => {
                    const tierBadge = getTierBadge(transformation.tier);
                    const IconComponent = tierBadge.icon;
                    return (
                      <div className="absolute bottom-3 right-3">
                        <div className={`inline-flex items-center text-xs px-2 py-1 rounded-md border ${tierBadge.className}`}>
                          <IconComponent className="w-3 h-3 mr-1" />
                          {tierBadge.text}
                        </div>
                      </div>
                    );
                  })()}
                </Card>
              </div>

              {/* Results & Arrow */}
              <div className="flex justify-center my-8">
                <div className="bg-white rounded-full p-4 shadow-lg border-2 border-primary">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Results Card */}
              <Card className="bg-gradient-to-r from-primary to-secondary text-white">
                <CardContent className="text-center py-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-4xl font-bold mb-2">
                        {transformation.results.priceIncrease}%
                      </div>
                      <p className="opacity-90">Price Increase</p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-2">
                        {transformation.results.conversionImprovement}%
                      </div>
                      <p className="opacity-90">Conversion Lift</p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-2">
                        {transformation.results.revenueMultiplier}
                      </div>
                      <p className="opacity-90">Revenue Multiple</p>
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <p className="text-lg font-medium">
                      💫 {transformation.clientStory}
                    </p>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => handleShare("twitter", transformation)}
                      variant="outline"
                      className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-primary"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Share on X
                    </Button>
                    <Button
                      onClick={() => handleShare("facebook", transformation)}
                      variant="outline"
                      className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-primary"
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Share on Facebook
                    </Button>
                    <Button
                      onClick={() => handleShare("copy", transformation)}
                      variant="outline"
                      className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-primary"
                    >
                      {copiedId === transformation.id ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <small className="text-xs text-gray-500 italic">
            *Individual results vary. These examples are for illustrative purposes only and do not guarantee specific outcomes.
          </small>
        </div>

        {/* Success Factors */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Made These Transformations Possible?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center card-hover">
              <CardContent className="p-6">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Specific Outcomes</h3>
                <p className="text-sm text-gray-600">
                  Clear, measurable transformations with defined timelines
                </p>
              </CardContent>
            </Card>

            <Card className="text-center card-hover">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Niche Positioning</h3>
                <p className="text-sm text-gray-600">
                  Targeting specific audiences with tailored solutions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center card-hover">
              <CardContent className="p-6">
                <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Value-Based Pricing</h3>
                <p className="text-sm text-gray-600">
                  Pricing based on transformation value, not time
                </p>
              </CardContent>
            </Card>

            <Card className="text-center card-hover">
              <CardContent className="p-6">
                <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Premium Positioning</h3>
                <p className="text-sm text-gray-600">
                  Positioning as the expert solution for serious clients
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready for Your Own Transformation?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join 2,000+ creators who've already optimized their offers with OnyxHooks & More™. 
            See what's possible when you position and price your expertise correctly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/quiz">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                <Zap className="w-5 h-5 mr-2" />
                Take Free Offer Quiz
              </Button>
            </Link>
            <Link href="/offer-generator">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate My Offer
              </Button>
            </Link>
          </div>
          
          <p className="text-sm mt-6 opacity-75">
            No credit card required • Get results in under 5 minutes
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Join thousands sharing their transformations:</p>
          <div className="flex justify-center space-x-8 opacity-60">
            <Twitter className="w-8 h-8" />
            <Facebook className="w-8 h-8" />
            <Share2 className="w-8 h-8" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
