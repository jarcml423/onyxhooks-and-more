import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, Crown, TrendingUp, AlertTriangle } from "lucide-react";
import { ValueValidator } from "@/components/ValueValidator";
import { ProTools } from "@/components/ProTools";
import { VaultTools } from "@/components/VaultTools";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function ProTier() {
  const [offerData, setOfferData] = useState({
    offer: "",
    transformation: "",
    industry: "",
    coachType: "",
    painPoint: "",
    hook: ""
  });
  const [valueValidated, setValueValidated] = useState<any>(null);
  const [currentTier, setCurrentTier] = useState("pro");
  const { toast } = useToast();

  // Get current role for demo purposes
  const { data: roleData } = useQuery({
    queryKey: ["/api/test/current-role"],
    queryFn: async () => {
      const response = await fetch("/api/test/current-role");
      return response.json();
    }
  });

  const userRole = roleData?.role || "pro";

  const updateOfferData = (field: string, value: string) => {
    setOfferData(prev => ({ ...prev, [field]: value }));
  };

  const handleValueValidation = (result: any) => {
    setValueValidated(result);
    if (result.isValueStrong) {
      toast({ 
        title: "Value validation passed!", 
        description: "Your offer has strong transformation value. Pro and Vault tools are now available." 
      });
    } else {
      toast({ 
        title: "Value needs strengthening", 
        description: "Please address the recommendations before using monetization tools.",
        variant: "destructive"
      });
    }
  };

  const canAccessMonetizationTools = valueValidated?.isValueStrong || true; // Temporarily enabled for testing

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pro & Vault Tier
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              Advanced monetization tools with Value Before Price validation
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="border-blue-500 text-blue-700">
                <Zap className="h-4 w-4 mr-1" />
                Pro Tools
              </Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-700">
                <Crown className="h-4 w-4 mr-1" />
                Vault Tools
              </Badge>
              <RoleSwitcher />
            </div>
          </div>

          {/* Offer Setup */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Offer Foundation Setup
              </CardTitle>
              <CardDescription>
                Provide your offer details to unlock Pro and Vault tier functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="offer">Your Offer Description *</Label>
                  <Textarea
                    id="offer"
                    placeholder="Describe your coaching offer or course..."
                    value={offerData.offer}
                    onChange={(e) => updateOfferData("offer", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="transformation">Transformation Delivered *</Label>
                  <Textarea
                    id="transformation"
                    placeholder="What specific change does your customer experience?"
                    value={offerData.transformation}
                    onChange={(e) => updateOfferData("transformation", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry/Niche</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Business Coaching, Health & Wellness"
                    value={offerData.industry}
                    onChange={(e) => updateOfferData("industry", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="coachType">Coach Type</Label>
                  <Input
                    id="coachType"
                    placeholder="e.g., Business Coach, Life Coach"
                    value={offerData.coachType}
                    onChange={(e) => updateOfferData("coachType", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="painPoint">Primary Pain Point</Label>
                  <Input
                    id="painPoint"
                    placeholder="What specific problem does this solve?"
                    value={offerData.painPoint}
                    onChange={(e) => updateOfferData("painPoint", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hook">Current Hook (if any)</Label>
                  <Input
                    id="hook"
                    placeholder="Your existing hook or headline"
                    value={offerData.hook}
                    onChange={(e) => updateOfferData("hook", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Value Before Price Validation */}
          <div className="mb-8">
            <ValueValidator
              offer={offerData.offer}
              transformation={offerData.transformation}
              painPoint={offerData.painPoint}
              targetAudience={offerData.industry}
              onValidationComplete={handleValueValidation}
            />
          </div>

          {/* Tools Access Gate */}
          {!canAccessMonetizationTools && valueValidated && (
            <Alert className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Value Before Price Directive:</strong> Your offer needs stronger transformation value before accessing monetization tools. 
                Please address the recommendations above to unlock Pro and Vault features.
              </AlertDescription>
            </Alert>
          )}

          {/* Pro and Vault Tools */}
          <Tabs defaultValue="pro" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pro" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Pro Tools
              </TabsTrigger>
              <TabsTrigger 
                value="vault" 
                className="flex items-center gap-2"
                disabled={userRole !== "vault" && userRole !== "agency"}
              >
                <Crown className="h-4 w-4" />
                Vault Tools
                {(userRole !== "vault" && userRole !== "agency") && (
                  <Badge variant="secondary" className="ml-2 text-xs">Upgrade Required</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pro" className="space-y-6">
              {userRole === "free" ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Upgrade to Pro Required</h3>
                      <p className="text-gray-600 mb-4">
                        Access advanced monetization tools including pricing justification, 
                        upsell builders, objection handling, and guarantee generation.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Upgrade to Pro - $47/month
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className={`${!canAccessMonetizationTools ? 'opacity-50 pointer-events-none' : ''}`}>
                  <ProTools
                    offer={offerData.offer}
                    transformation={offerData.transformation}
                    industry={offerData.industry}
                    hook={offerData.hook}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="vault" className="space-y-6">
              {userRole !== "vault" && userRole !== "agency" ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Upgrade to Vault Required</h3>
                      <p className="text-gray-600 mb-4">
                        Access premium content creation tools including value ladder mapping, 
                        origin story builders, VSL scripts, lead magnets, and email sequences.
                      </p>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Upgrade to Vault - $197/month
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className={`${!canAccessMonetizationTools ? 'opacity-50 pointer-events-none' : ''}`}>
                  <VaultTools
                    offer={offerData.offer}
                    transformation={offerData.transformation}
                    industry={offerData.industry}
                    hook={offerData.hook}
                    coachType={offerData.coachType}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Value Before Price Explanation */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Value Before Price Philosophy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                OnyxHooks & More™ follows the "Value Before Price" directive - we ensure your offer delivers 
                real transformation before recommending premium pricing or monetization strategies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                  <h4 className="font-semibold mb-1">Emotional Value</h4>
                  <p className="text-sm text-gray-600">Relieves stress, frustration, fear, or pain</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                  <h4 className="font-semibold mb-1">Functional Value</h4>
                  <p className="text-sm text-gray-600">Saves time, money, effort, or delivers clear results</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                  <h4 className="font-semibold mb-1">Identity Value</h4>
                  <p className="text-sm text-gray-600">Elevates how they see themselves or are seen by others</p>
                </div>
              </div>
              <div className="text-center mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm italic">
                  "Price justification must reference emotional ROI or cost of inaction. 
                  Upsells should deepen transformation—not just add features."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}