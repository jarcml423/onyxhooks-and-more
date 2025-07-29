import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Target, TrendingUp, Users, ArrowRight, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { Scorecard } from "@/components/Scorecard";

interface HookGenerationResult {
  hooks: string[];
  scoredResults?: any[];
}

interface OfferGenerationResult {
  offer: {
    hook: string;
    problem: string;
    promise: string;
    cta: string;
    offerName: string;
    priceRange: string;
  };
  id: number;
}

export default function FreeTier() {
  const [selectedTool, setSelectedTool] = useState<"hooks" | "offer" | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string>("free");
  const { toast } = useToast();

  // Hook Generator State
  const [hookInputs, setHookInputs] = useState({
    industry: "",
    coachType: "",
    targetAudience: ""
  });

  // Offer Generator State
  const [offerInputs, setOfferInputs] = useState({
    coachType: "",
    offerType: "",
    tonePreference: "",
    painPoint: "",
    challengeFaced: "",
    desiredFeeling: ""
  });

  const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);
  const [generatedOffer, setGeneratedOffer] = useState<any>(null);

  // Hook Generation Mutation
  const hookMutation = useMutation({
    mutationFn: async (data: typeof hookInputs) => {
      const response = await apiRequest("POST", "/api/generate-hooks", data);
      return response.json() as Promise<HookGenerationResult>;
    },
    onSuccess: (data) => {
      setGeneratedHooks(data.hooks);
      toast({
        title: "Hooks Generated!",
        description: "Your high-converting hooks are ready to use.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  // Offer Generation Mutation
  const offerMutation = useMutation({
    mutationFn: async (data: typeof offerInputs) => {
      const response = await apiRequest("POST", "/api/generate-offer", data);
      return response.json() as Promise<OfferGenerationResult>;
    },
    onSuccess: (data) => {
      setGeneratedOffer(data.offer);
      toast({
        title: "OnyxHooks Framework Created!",
        description: "Your complete offer structure is ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const handleHookGeneration = () => {
    if (!hookInputs.industry || !hookInputs.coachType) {
      toast({
        title: "Missing Information",
        description: "Please fill in industry and coach type",
        variant: "destructive",
      });
      return;
    }
    hookMutation.mutate(hookInputs);
  };

  const handleOfferGeneration = () => {
    if (!offerInputs.coachType || !offerInputs.offerType) {
      toast({
        title: "Missing Information", 
        description: "Please fill in coach type and offer type",
        variant: "destructive",
      });
      return;
    }
    offerMutation.mutate(offerInputs);
  };

  if (!selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <Sparkles className="w-4 h-4 mr-1" />
              Free Tier Experience
            </Badge>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              OfferForge AI Free Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started with powerful AI-driven tools to create high-converting offers and hooks. 
              Experience the foundation of what coaches and creators use to scale to 6-figures.
            </p>
          </div>

          {/* Tool Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Hook Generator */}
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-purple-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Hook Generator</CardTitle>
                    <CardDescription>Create attention-grabbing hooks that stop the scroll</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Proven copywriting principles</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Emotional triggers & curiosity gaps</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4" />
                    <span>2 high-converting hooks per generation</span>
                  </div>
                  <Button 
                    onClick={() => setSelectedTool("hooks")} 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Generate Hooks <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* OnyxHooks Framework */}
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-indigo-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <Target className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">OnyxHooks Framework</CardTitle>
                    <CardDescription>Complete offer structure with Hook, Problem, Promise & CTA</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4" />
                    <span>4-part proven framework</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Psychology-backed structure</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4" />
                    <span>Complete offer with pricing guidance</span>
                  </div>
                  <Button 
                    onClick={() => setSelectedTool("offer")} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Offer <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Value Proposition */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-8">Why Start With Free Tools?</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Test the Power</h3>
                <p className="text-muted-foreground">Experience AI-generated content that actually converts</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Learn the Framework</h3>
                <p className="text-muted-foreground">Understand what makes offers irresistible to your audience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Scale When Ready</h3>
                <p className="text-muted-foreground">Upgrade for unlimited generations and advanced features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedTool(null)}
          className="mb-6"
        >
          ← Back to Tools
        </Button>

        <RoleSwitcher onRoleChange={setCurrentRole} />

        {selectedTool === "hooks" && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Hook Generator
              </CardTitle>
              <CardDescription>
                Generate 2 high-converting hooks using proven copywriting principles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select onValueChange={(value) => setHookInputs({...hookInputs, industry: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health-fitness">Health & Fitness</SelectItem>
                        <SelectItem value="business-coaching">Business Coaching</SelectItem>
                        <SelectItem value="life-coaching">Life Coaching</SelectItem>
                        <SelectItem value="relationship">Relationship</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                        <SelectItem value="spirituality">Spirituality</SelectItem>
                        <SelectItem value="parenting">Parenting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="coachType">Coach Type *</Label>
                    <Input
                      id="coachType"
                      placeholder="e.g., Weight Loss Coach, Business Mentor"
                      value={hookInputs.coachType}
                      onChange={(e) => setHookInputs({...hookInputs, coachType: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
                    <Input
                      id="targetAudience"
                      placeholder="e.g., Busy professionals, New entrepreneurs"
                      value={hookInputs.targetAudience}
                      onChange={(e) => setHookInputs({...hookInputs, targetAudience: e.target.value})}
                    />
                  </div>

                  <Button 
                    onClick={handleHookGeneration}
                    disabled={hookMutation.isPending}
                    className="w-full h-12"
                  >
                    {hookMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate Hooks
                  </Button>
                </div>

                {/* Generated Hooks Display */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Generated Hooks</h3>
                  {generatedHooks.length > 0 ? (
                    <div className="space-y-3">
                      {generatedHooks.map((hook, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-sm flex-1">{hook}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(hook)}
                            >
                              {copiedText === hook ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Your generated hooks will appear here
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTool === "offer" && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                OfferForge Framework Generator
              </CardTitle>
              <CardDescription>
                Create a complete offer with Hook, Problem, Promise, and CTA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="coachType">Coach Type *</Label>
                    <Input
                      id="coachType"
                      placeholder="e.g., Business Coach, Fitness Trainer"
                      value={offerInputs.coachType}
                      onChange={(e) => setOfferInputs({...offerInputs, coachType: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="offerType">Offer Type *</Label>
                    <Select onValueChange={(value) => setOfferInputs({...offerInputs, offerType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select offer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">Online Course</SelectItem>
                        <SelectItem value="coaching">1-on-1 Coaching</SelectItem>
                        <SelectItem value="group-program">Group Program</SelectItem>
                        <SelectItem value="mastermind">Mastermind</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tonePreference">Tone (Optional)</Label>
                    <Select onValueChange={(value) => setOfferInputs({...offerInputs, tonePreference: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="painPoint">Pain Point (Optional)</Label>
                    <Textarea
                      id="painPoint"
                      placeholder="What problem does your audience face?"
                      value={offerInputs.painPoint}
                      onChange={(e) => setOfferInputs({...offerInputs, painPoint: e.target.value})}
                    />
                  </div>

                  <Button 
                    onClick={handleOfferGeneration}
                    disabled={offerMutation.isPending}
                    className="w-full h-12"
                  >
                    {offerMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate OnyxHooks Framework
                  </Button>
                </div>

                {/* Generated Offer Display */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Generated Framework</h3>
                  {generatedOffer ? (
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="font-semibold text-purple-600 mb-2">🎯 Hook</h4>
                        <p className="text-sm mb-2">{generatedOffer.hook}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedOffer.hook)}
                        >
                          {copiedText === generatedOffer.hook ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </Card>

                      <Card className="p-4">
                        <h4 className="font-semibold text-red-600 mb-2">⚡ Problem</h4>
                        <p className="text-sm mb-2">{generatedOffer.problem}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedOffer.problem)}
                        >
                          {copiedText === generatedOffer.problem ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </Card>

                      <Card className="p-4">
                        <h4 className="font-semibold text-green-600 mb-2">✨ Promise</h4>
                        <p className="text-sm mb-2">{generatedOffer.promise}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedOffer.promise)}
                        >
                          {copiedText === generatedOffer.promise ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </Card>

                      <Card className="p-4">
                        <h4 className="font-semibold text-blue-600 mb-2">🚀 Call to Action</h4>
                        <p className="text-sm mb-2">{generatedOffer.cta}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedOffer.cta)}
                        >
                          {copiedText === generatedOffer.cta ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </Card>

                      <Card className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                        <h4 className="font-semibold mb-2">📦 {generatedOffer.offerName}</h4>
                        <p className="text-sm text-muted-foreground">Price Range: {generatedOffer.priceRange}</p>
                      </Card>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Your OnyxHooks framework will appear here
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}