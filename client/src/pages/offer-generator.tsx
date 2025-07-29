import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import UsageIndicator from "@/components/UsageIndicator";
import UpgradeModal from "@/components/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Sparkles, Shuffle, Save, Copy, TrendingUp, Target, Users, DollarSign } from "lucide-react";

interface GeneratedOffer {
  name: string;
  priceRange: string;
  headlines: string[];
  benefits: string[];
  positioning: string;
  targetAudience: string;
}

interface OfferResult {
  offer: GeneratedOffer;
  id: number;
}

export default function OfferGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [niche, setNiche] = useState("");
  const [transformation, setTransformation] = useState("");
  const [currentOffer, setCurrentOffer] = useState("");
  const [generatedOffer, setGeneratedOffer] = useState<GeneratedOffer | null>(null);
  const [savedOfferId, setSavedOfferId] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Get user data for usage limits
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
    enabled: !!user,
  });

  // Generate offer mutation
  const generateMutation = useMutation({
    mutationFn: async (data: { niche: string; transformation: string; currentOffer?: string }) => {
      const response = await apiRequest("POST", "/api/generate-offer", data);
      return response.json();
    },
    onSuccess: (data: OfferResult & { usageStatus?: any; warningMessage?: string }) => {
      setGeneratedOffer(data.offer);
      setSavedOfferId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/usage-status"] });
      
      if (data.warningMessage) {
        toast({
          title: "Offer generated!",
          description: data.warningMessage,
          variant: "default",
        });
      } else {
        toast({
          title: "Offer generated!",
          description: "Your optimized offer has been created successfully.",
        });
      }
    },
    onError: (error: any) => {
      // Check if it's a usage limit error
      if (error.status === 403) {
        setShowUpgradeModal(true);
        toast({
          title: "Usage limit reached",
          description: "You've reached your daily offer generation limit.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation failed",
          description: error.message || "Failed to generate offer. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Remix offer mutation
  const remixMutation = useMutation({
    mutationFn: async (offerId: number) => {
      const response = await apiRequest("POST", "/api/rewrite-offer", { offerId });
      return response.json();
    },
    onSuccess: (data: OfferResult) => {
      setGeneratedOffer(data.offer);
      setSavedOfferId(data.id);
      toast({
        title: "Offer remixed!",
        description: "Your offer has been regenerated with new variations.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Remix failed",
        description: error.message || "Failed to remix offer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!niche.trim() || !transformation.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both niche and transformation fields.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      niche: niche.trim(),
      transformation: transformation.trim(),
      currentOffer: currentOffer.trim() || undefined,
    });
  };

  const handleRemix = () => {
    if (!savedOfferId) return;
    remixMutation.mutate(savedOfferId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };

  const canGenerate = userData?.role !== "free" || (userData?.usageCount || 0) < 2;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Offer Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your expertise into a high-converting offer. Our AI analyzes your niche and desired transformation to create compelling headlines, pricing, and positioning.
            </p>
            
            {/* Usage Counter */}
            {userData?.role === "free" && (
              <div className="mt-6 inline-flex items-center bg-blue-50 px-4 py-2 rounded-full">
                <span className="text-blue-800 text-sm">
                  Free generations: {2 - (userData?.usageCount || 0)} remaining
                </span>
              </div>
            )}
          </div>

          {/* Usage Indicator */}
          <div className="mb-6">
            <UsageIndicator showDetails={true} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Tell Us About Your Offer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="niche">Your Niche or Industry</Label>
                  <Input
                    id="niche"
                    placeholder="e.g., Executive coaching, Digital marketing, Fitness coaching"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Be specific about who you serve
                  </p>
                </div>

                <div>
                  <Label htmlFor="transformation">Desired Transformation</Label>
                  <Textarea
                    id="transformation"
                    placeholder="e.g., Help executives increase their leadership presence and get promoted to C-suite roles within 12 months"
                    value={transformation}
                    onChange={(e) => setTransformation(e.target.value)}
                    className="mt-1 min-h-[100px]"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Describe the specific outcome your clients will achieve
                  </p>
                </div>

                <div>
                  <Label htmlFor="currentOffer">Current Offer (Optional)</Label>
                  <Textarea
                    id="currentOffer"
                    placeholder="Describe your current offer if you have one..."
                    value={currentOffer}
                    onChange={(e) => setCurrentOffer(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This helps the AI improve upon what you already have
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={generateMutation.isPending || !canGenerate}
                    className="flex-1"
                  >
                    {generateMutation.isPending ? (
                      "Generating..."
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Offer
                      </>
                    )}
                  </Button>
                  
                  {generatedOffer && (
                    <Button
                      onClick={handleRemix}
                      disabled={remixMutation.isPending}
                      variant="outline"
                    >
                      {remixMutation.isPending ? (
                        "Remixing..."
                      ) : (
                        <>
                          <Shuffle className="w-4 h-4 mr-2" />
                          Remix
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {!canGenerate && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      You've reached your free generation limit. 
                      <a href="/subscribe" className="text-primary hover:underline ml-1">
                        Upgrade to Pro
                      </a> for unlimited generations.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Offer Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Your Optimized Offer
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedOffer ? (
                  <div className="space-y-6">
                    {/* Offer Name */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-lg font-semibold">Offer Name</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(generatedOffer.name)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {generatedOffer.name}
                      </p>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {generatedOffer.priceRange}
                      </Badge>
                    </div>

                    <Separator />

                    {/* Headlines */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="font-semibold">Compelling Headlines</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(generatedOffer.headlines.join('\n'))}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {generatedOffer.headlines.map((headline, index) => (
                          <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="font-medium text-blue-900">{headline}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="font-semibold">Core Benefits</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(generatedOffer.benefits.join('\n'))}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {generatedOffer.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <p className="text-gray-700">{benefit}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Positioning */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="font-semibold">Positioning Statement</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(generatedOffer.positioning)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg italic">
                        "{generatedOffer.positioning}"
                      </p>
                    </div>

                    {/* Target Audience */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="font-semibold">Target Audience</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(generatedOffer.targetAudience)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-start">
                        <Users className="w-5 h-5 text-primary mt-0.5 mr-3" />
                        <p className="text-gray-700">{generatedOffer.targetAudience}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No offer generated yet</p>
                    <p className="text-sm text-gray-400">
                      Fill in the form on the left and click "Generate Offer" to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          {generatedOffer && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                What's Next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-hover text-center">
                  <CardContent className="p-6">
                    <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Test ROI Potential</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      See how this pricing strategy performs with different traffic and conversion rates.
                    </p>
                    <Button variant="outline" size="sm">
                      Run ROI Simulation
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-hover text-center">
                  <CardContent className="p-6">
                    <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Critique Your Funnel</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Get AI feedback on your sales page and funnel structure.
                    </p>
                    <Button variant="outline" size="sm">
                      Analyze Funnel
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-hover text-center">
                  <CardContent className="p-6">
                    <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Access Prompt Vault</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Get templates for VSL scripts, email sequences, and ad copy.
                    </p>
                    <Button variant="outline" size="sm">
                      Browse Templates
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
        
        {/* Upgrade Modal */}
        <UpgradeModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentPlan={userData?.role || "free"}
          message="You've reached your daily offer generation limit. Upgrade to continue creating optimized offers."
        />
      </div>
    </ProtectedRoute>
  );
}
