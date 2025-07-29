import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Copy, DollarSign, Shield, Clock, Zap, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProToolsProps {
  offer?: string;
  transformation?: string;
  industry?: string;
  hook?: string;
}

export function ProTools({ offer, transformation, industry, hook }: ProToolsProps) {
  const [activeTools, setActiveTools] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const toggleTool = (toolId: string) => {
    setActiveTools(prev => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  const generatePricingJustification = async () => {
    if (!offer || !transformation) {
      toast({ title: "Missing required fields", description: "Please provide offer and transformation details.", variant: "destructive" });
      return;
    }

    setLoading(prev => ({ ...prev, pricing: true }));
    try {
      const response = await apiRequest("POST", "/api/pricing-justification", {
        offer,
        transformation,
        targetAudience: industry
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, pricing: data }));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, pricing: false }));
    }
  };

  const generateUpsells = async () => {
    if (!offer || !transformation) {
      toast({ title: "Missing required fields", description: "Please provide offer and transformation details.", variant: "destructive" });
      return;
    }

    setLoading(prev => ({ ...prev, upsells: true }));
    try {
      const response = await apiRequest("POST", "/api/build-upsells", {
        primaryOffer: offer,
        transformation,
        industry
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, upsells: data }));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, upsells: false }));
    }
  };

  const generateObjectionErasers = async () => {
    if (!offer || !industry) {
      toast({ title: "Missing required fields", description: "Please provide offer and industry details.", variant: "destructive" });
      return;
    }

    setLoading(prev => ({ ...prev, objections: true }));
    try {
      const response = await apiRequest("POST", "/api/objection-erasers", {
        industry,
        offer,
        hook,
        transformation
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, objections: data }));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, objections: false }));
    }
  };

  const generateGuarantees = async () => {
    if (!offer || !transformation) {
      toast({ title: "Missing required fields", description: "Please provide offer and transformation details.", variant: "destructive" });
      return;
    }

    setLoading(prev => ({ ...prev, guarantees: true }));
    try {
      const response = await apiRequest("POST", "/api/generate-guarantees", {
        offer,
        transformation,
        industry
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, guarantees: data }));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, guarantees: false }));
    }
  };

  const generateUrgencyFrameworks = async () => {
    if (!offer) {
      toast({ title: "Missing required fields", description: "Please provide offer details.", variant: "destructive" });
      return;
    }

    setLoading(prev => ({ ...prev, urgency: true }));
    try {
      const response = await apiRequest("POST", "/api/urgency-frameworks", {
        offer,
        hook,
        transformation
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, urgency: data }));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, urgency: false }));
    }
  };

  const tools = [
    {
      id: "pricing",
      title: "Pricing Justification Generator",
      description: "Create emotionally-anchored price justification with cost of inaction logic",
      icon: DollarSign,
      action: generatePricingJustification,
      result: results.pricing
    },
    {
      id: "upsells",
      title: "Upsell / Cross-Sell Builder",
      description: "Generate natural offer expansions that deepen transformation",
      icon: Target,
      action: generateUpsells,
      result: results.upsells
    },
    {
      id: "objections",
      title: "Objection Eraser Engine",
      description: "Overcome price, time, and belief objections with emotional reframes",
      icon: Shield,
      action: generateObjectionErasers,
      result: results.objections
    },
    {
      id: "guarantees",
      title: "Guarantee Generator",
      description: "Create bold, trust-building guarantees with risk reversal",
      icon: Shield,
      action: generateGuarantees,
      result: results.guarantees
    },
    {
      id: "urgency",
      title: "Urgency / Scarcity Engine",
      description: "Add authentic urgency without manipulation or hype",
      icon: Clock,
      action: generateUrgencyFrameworks,
      result: results.urgency
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Pro Tools</h2>
        <Badge variant="secondary">Pro Tier</Badge>
      </div>

      {tools.map((tool) => (
        <Card key={tool.id} className="w-full">
          <Collapsible 
            open={activeTools[tool.id]} 
            onOpenChange={() => toggleTool(tool.id)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <tool.icon className="h-5 w-5 text-blue-600" />
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
                  <Button 
                    onClick={tool.action}
                    disabled={loading[tool.id]}
                    className="w-full"
                  >
                    {loading[tool.id] ? "Generating..." : `Generate ${tool.title}`}
                  </Button>

                  {tool.result && (
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {tool.id === "pricing" && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              Cost of Inaction
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(tool.result.costOfInaction)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </h4>
                            <p className="text-sm">{tool.result.costOfInaction}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              Emotional ROI
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(tool.result.emotionalROI)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </h4>
                            <p className="text-sm">{tool.result.emotionalROI}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              Identity Alignment
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(tool.result.identityAlignment)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </h4>
                            <p className="text-sm">{tool.result.identityAlignment}</p>
                          </div>
                        </div>
                      )}

                      {tool.id === "upsells" && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Upsell Offer</h4>
                            <div className="space-y-2">
                              <p><strong>Name:</strong> {tool.result.upsell?.name}</p>
                              <p><strong>Description:</strong> {tool.result.upsell?.description}</p>
                              <p><strong>Price Range:</strong> {tool.result.upsell?.priceRange}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Cross-Sell Offer</h4>
                            <div className="space-y-2">
                              <p><strong>Name:</strong> {tool.result.crossSell?.name}</p>
                              <p><strong>Description:</strong> {tool.result.crossSell?.description}</p>
                              <p><strong>Price Range:</strong> {tool.result.crossSell?.priceRange}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {tool.id === "objections" && (
                        <div className="space-y-4">
                          {["priceObjections", "timeObjections", "beliefObjections"].map((category) => (
                            <div key={category}>
                              <h4 className="font-semibold mb-2 capitalize">{category.replace("Objections", " Objections")}</h4>
                              {tool.result[category]?.map((objection: any, index: number) => (
                                <div key={index} className="border-l-4 border-blue-500 pl-4 mb-3">
                                  <p className="text-sm font-medium">"{objection.objection}"</p>
                                  <p className="text-sm mt-1">{objection.reframe}</p>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}

                      {tool.id === "guarantees" && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              Primary Guarantee
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(tool.result.primaryGuarantee)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </h4>
                            <p className="text-sm">{tool.result.primaryGuarantee}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              Alternative Guarantee
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(tool.result.alternativeGuarantee)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </h4>
                            <p className="text-sm">{tool.result.alternativeGuarantee}</p>
                          </div>
                        </div>
                      )}

                      {tool.id === "urgency" && (
                        <div className="space-y-4">
                          {["deadlineUrgency", "priorityUrgency", "scarcityFraming"].map((type) => (
                            <div key={type}>
                              <h4 className="font-semibold mb-2 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <p className="text-sm mb-2"><strong>Framework:</strong> {tool.result[type]?.framework}</p>
                              <p className="text-sm"><strong>Example:</strong> {tool.result[type]?.example}</p>
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