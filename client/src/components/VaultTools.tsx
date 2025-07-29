import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Copy, Crown, Mail, Video, Gift, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface VaultToolsProps {
  offer?: string;
  transformation?: string;
  industry?: string;
  hook?: string;
  coachType?: string;
}

export function VaultTools({ offer, transformation, industry, hook, coachType }: VaultToolsProps) {
  const [activeTools, setActiveTools] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const toggleTool = (toolId: string) => {
    setActiveTools(prev => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  const updateInput = (toolId: string, field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [toolId]: { ...prev[toolId], [field]: value }
    }));
  };

  const generateValueLadder = async () => {
    if (!offer || !transformation || !industry || !coachType) {
      toast({ title: "Missing required fields", description: "Please provide all required details.", variant: "destructive" });
      return;
    }

    setLoading(prev => ({ ...prev, ladder: true }));
    try {
      const response = await apiRequest("POST", "/api/value-ladder", {
        primaryOffer: offer,
        transformation,
        industry,
        coachType
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, ladder: data }));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, ladder: false }));
    }
  };

  const generateOriginStory = async () => {
    const storyInputs = inputs.story || {};
    if (!storyInputs.turningPoint || !storyInputs.whyStarted || !storyInputs.whoTheyServe) {
      toast({ title: "Missing required fields", description: "Please fill in the origin story details.", variant: "destructive" });
      return;
    }

    setLoading(prev => ({ ...prev, story: true }));
    try {
      const response = await apiRequest("POST", "/api/origin-story", {
        coachType: coachType || "Coach",
        turningPoint: storyInputs.turningPoint,
        whyStarted: storyInputs.whyStarted,
        whoTheyServe: storyInputs.whoTheyServe,
        transformation
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, story: data }));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, story: false }));
    }
  };

  const generateVSLScript = async () => {
    if (!hook || !offer || !transformation) {
      toast({ title: "Missing required fields", description: "Please provide hook, offer, and transformation details.", variant: "destructive" });
      return;
    }

    setLoading(prev => ({ ...prev, vsl: true }));
    try {
      const response = await apiRequest("POST", "/api/vsl-script", {
        hook,
        offer,
        transformation,
        industry,
        painPoint: inputs.vsl?.painPoint
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, vsl: data }));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, vsl: false }));
    }
  };

  const generateLeadMagnets = async () => {
    if (!industry || !coachType || !transformation) {
      toast({ title: "Missing required fields", description: "Please provide industry, coach type, and transformation details.", variant: "destructive" });
      return;
    }

    setLoading(prev => ({ ...prev, magnets: true }));
    try {
      const response = await apiRequest("POST", "/api/lead-magnets", {
        industry,
        coachType,
        transformation,
        offer
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, magnets: data }));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, magnets: false }));
    }
  };

  const generateEmailSequence = async () => {
    if (!offer || !transformation) {
      toast({ title: "Missing required fields", description: "Please provide offer and transformation details.", variant: "destructive" });
      return;
    }

    setLoading(prev => ({ ...prev, emails: true }));
    try {
      const emailInputs = inputs.emails || {};
      const response = await apiRequest("POST", "/api/email-sequence", {
        offer,
        transformation,
        painPoints: emailInputs.painPoints?.split(',').map((p: string) => p.trim()) || [],
        objections: emailInputs.objections?.split(',').map((o: string) => o.trim()) || [],
        industry
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, emails: data }));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, emails: false }));
    }
  };

  const tools = [
    {
      id: "ladder",
      title: "Value Ladder Map Generator",
      description: "Create strategic pricing tiers from lead magnet to premium offers",
      icon: TrendingUp,
      action: generateValueLadder,
      result: results.ladder,
      requiresInputs: false
    },
    {
      id: "story",
      title: "Origin Story Script Builder",
      description: "Craft your emotional founder story for VSLs and brand building",
      icon: Crown,
      action: generateOriginStory,
      result: results.story,
      requiresInputs: true
    },
    {
      id: "vsl",
      title: "VSL Script Writer",
      description: "Generate full 90-second video sales letter with Pain → Truth → Shift → CTA",
      icon: Video,
      action: generateVSLScript,
      result: results.vsl,
      requiresInputs: true
    },
    {
      id: "magnets",
      title: "Lead Magnet Generator",
      description: "Create irresistible lead magnets with high perceived value",
      icon: Gift,
      action: generateLeadMagnets,
      result: results.magnets,
      requiresInputs: false
    },
    {
      id: "emails",
      title: "Email Sequence Builder",
      description: "7-email nurture sequence to convert leads into buyers",
      icon: Mail,
      action: generateEmailSequence,
      result: results.emails,
      requiresInputs: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Vault Tools</h2>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">Vault Tier</Badge>
      </div>

      {tools.map((tool) => (
        <Card key={tool.id} className="w-full border-purple-200">
          <Collapsible 
            open={activeTools[tool.id]} 
            onOpenChange={() => toggleTool(tool.id)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <tool.icon className="h-5 w-5 text-purple-600" />
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </div>
                  {activeTools[tool.id] ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {tool.requiresInputs && (
                    <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      {tool.id === "story" && (
                        <>
                          <div>
                            <Label htmlFor="turningPoint">Your Turning Point *</Label>
                            <Textarea
                              id="turningPoint"
                              placeholder="What challenge or moment changed everything for you?"
                              value={inputs.story?.turningPoint || ""}
                              onChange={(e) => updateInput("story", "turningPoint", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="whyStarted">Why You Started This Business *</Label>
                            <Textarea
                              id="whyStarted"
                              placeholder="What motivated you to help others with this transformation?"
                              value={inputs.story?.whyStarted || ""}
                              onChange={(e) => updateInput("story", "whyStarted", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="whoTheyServe">Who You Serve *</Label>
                            <Input
                              id="whoTheyServe"
                              placeholder="Your ideal client description"
                              value={inputs.story?.whoTheyServe || ""}
                              onChange={(e) => updateInput("story", "whoTheyServe", e.target.value)}
                            />
                          </div>
                        </>
                      )}

                      {tool.id === "vsl" && (
                        <div>
                          <Label htmlFor="painPoint">Specific Pain Point (Optional)</Label>
                          <Input
                            id="painPoint"
                            placeholder="What specific frustration will you address?"
                            value={inputs.vsl?.painPoint || ""}
                            onChange={(e) => updateInput("vsl", "painPoint", e.target.value)}
                          />
                        </div>
                      )}

                      {tool.id === "emails" && (
                        <>
                          <div>
                            <Label htmlFor="painPoints">Pain Points (comma-separated)</Label>
                            <Textarea
                              id="painPoints"
                              placeholder="frustration with results, lack of clarity, overwhelm"
                              value={inputs.emails?.painPoints || ""}
                              onChange={(e) => updateInput("emails", "painPoints", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="objections">Common Objections (comma-separated)</Label>
                            <Textarea
                              id="objections"
                              placeholder="too expensive, no time, tried before"
                              value={inputs.emails?.objections || ""}
                              onChange={(e) => updateInput("emails", "objections", e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <Button 
                    onClick={tool.action}
                    disabled={loading[tool.id]}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {loading[tool.id] ? "Generating..." : `Generate ${tool.title}`}
                  </Button>

                  {tool.result && (
                    <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      {tool.id === "ladder" && (
                        <div className="space-y-6">
                          {["lowTier", "midTier", "highTier"].map((tier) => (
                            <div key={tier} className="border border-purple-200 rounded-lg p-4">
                              <h4 className="font-semibold mb-2 capitalize">{tier.replace("Tier", " Tier")}</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Name:</strong> {tool.result[tier]?.name}</p>
                                <p><strong>Format:</strong> {tool.result[tier]?.format}</p>
                                <p><strong>Transformation:</strong> {tool.result[tier]?.transformation}</p>
                                <p><strong>Price Range:</strong> {tool.result[tier]?.priceRange}</p>
                                <p><strong>Purpose:</strong> {tool.result[tier]?.purpose}</p>
                              </div>
                            </div>
                          ))}
                          <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                            <h4 className="font-semibold mb-2">Strategy Overview</h4>
                            <p className="text-sm">{tool.result.strategy}</p>
                          </div>
                        </div>
                      )}

                      {tool.id === "story" && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              Your Origin Story
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(tool.result.story)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </h4>
                            <div className="text-sm whitespace-pre-wrap bg-white dark:bg-gray-900 p-4 rounded border">
                              {tool.result.story}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Hook Variations</h4>
                            {tool.result.hooks?.map((hook: string, index: number) => (
                              <div key={index} className="text-sm p-2 bg-white dark:bg-gray-900 rounded border mb-2">
                                {hook}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {tool.id === "vsl" && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              Complete VSL Script
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(tool.result.fullScript)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </h4>
                            <div className="text-sm whitespace-pre-wrap bg-white dark:bg-gray-900 p-4 rounded border">
                              {tool.result.fullScript}
                            </div>
                          </div>
                          {["painSection", "truthSection", "shiftSection", "ctaSection"].map((section) => (
                            <div key={section}>
                              <h4 className="font-semibold mb-2 capitalize">{section.replace("Section", " Section")}</h4>
                              <div className="text-sm bg-white dark:bg-gray-900 p-3 rounded border">
                                {tool.result[section]}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {tool.id === "magnets" && (
                        <div className="space-y-4">
                          {tool.result.magnets?.map((magnet: any, index: number) => (
                            <div key={index} className="border border-purple-200 rounded-lg p-4">
                              <h4 className="font-semibold mb-2">{magnet.title}</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Format:</strong> {magnet.format}</p>
                                <p><strong>Description:</strong> {magnet.description}</p>
                                <p><strong>CTA:</strong> {magnet.cta}</p>
                                <p><strong>Delivery:</strong> {magnet.deliveryMethod}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {tool.id === "emails" && (
                        <div className="space-y-4">
                          <div className="mb-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                            <h4 className="font-semibold mb-2">Sequence Strategy</h4>
                            <p className="text-sm">{tool.result.sequenceStrategy}</p>
                          </div>
                          {tool.result.emails?.map((email: any, index: number) => (
                            <div key={index} className="border border-purple-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">Day {email.day}</h4>
                                <Badge variant="outline">{email.tone}</Badge>
                              </div>
                              <p className="text-sm font-medium mb-2">Subject: {email.subject}</p>
                              <p className="text-xs text-gray-600 mb-3">{email.purpose}</p>
                              <div className="text-sm bg-white dark:bg-gray-900 p-3 rounded border whitespace-pre-wrap">
                                {email.bodyContent}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
}