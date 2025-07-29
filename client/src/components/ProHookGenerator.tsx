import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Sword, Shield, Crown, Zap, TrendingUp, Target, Brain, Eye, Heart, Users, BarChart3, Trophy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { HookUsageTracker } from "./HookUsageTracker";

interface ProHookResponse {
  hooks: Array<{
    gladiator: 'Maximus' | 'Spartacus' | 'Leonidas' | 'Brutus' | 'Achilles';
    hook: string;
    neuroTriggers: string[];
    psychologyFramework: string;
    conversionScore: number;
    variations: string[];
    battleLabMetrics: {
      predictedCtr: number;
      emotionalImpact: number;
      curiosityGap: number;
      urgencyLevel: number;
    };
  }>;
  eliteAnalysis: {
    topPerformer: string;
    psychoProfile: string;
    conversionPrediction: string;
    battleStrategy: string;
  };
  neuroOptimization: {
    primaryTrigger: string;
    secondaryTriggers: string[];
    cognitiveLoad: string;
    decisionFramework: string;
  };
  battleLabResults: {
    winner: string;
    confidence: number;
    reasoning: string;
    abTestStrategy: string;
  };
}

export function ProHookGenerator() {
  const [formData, setFormData] = useState({
    industry: "",
    targetAudience: "",
    painPoint: "",
    desiredOutcome: "",
    psychoProfile: "",
    businessModel: "",
    pricePoint: "",
    competitorAngle: "",
    brandPersonality: ""
  });
  
  const [result, setResult] = useState<ProHookResponse | null>(null);
  const [activeTab, setActiveTab] = useState("generate");
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/pro-hooks/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setActiveTab("analysis");
    },
    onError: (error) => {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate pro hooks. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.industry || !formData.targetAudience || !formData.painPoint || !formData.desiredOutcome) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate hooks.",
        variant: "destructive"
      });
      return;
    }
    generateMutation.mutate(formData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const exportToCSV = () => {
    if (!result?.hooks) return;
    
    const csvContent = [
      ['Gladiator', 'Hook', 'Neuro Triggers', 'Psychology Framework', 'Conversion Score', 'Predicted CTR', 'Emotional Impact', 'Curiosity Gap', 'Urgency Level', 'Variations'],
      ...result.hooks.map(hook => [
        hook.gladiator,
        `"${hook.hook}"`,
        `"${hook.neuroTriggers.join('; ')}"`,
        `"${hook.psychologyFramework}"`,
        hook.conversionScore.toString(),
        hook.battleLabMetrics.predictedCtr.toString(),
        hook.battleLabMetrics.emotionalImpact.toString(),
        hook.battleLabMetrics.curiosityGap.toString(),
        hook.battleLabMetrics.urgencyLevel.toString(),
        `"${hook.variations.join('; ')}"`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OnyxHooks-Pro-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Pro Export Complete!",
      description: "Elite hook analysis exported to CSV successfully",
    });
  };

  const exportToText = () => {
    if (!result?.hooks) return;
    
    let textContent = `OnyxHooks Pro Elite Arsenal - Generated ${new Date().toLocaleDateString()}\n`;
    textContent += `======================================================\n\n`;
    
    result.hooks.forEach((hook, index) => {
      textContent += `${index + 1}. GLADIATOR: ${hook.gladiator}\n`;
      textContent += `HOOK: ${hook.hook}\n`;
      textContent += `PSYCHOLOGY: ${hook.psychologyFramework}\n`;
      textContent += `NEURO TRIGGERS: ${hook.neuroTriggers.join(', ')}\n`;
      textContent += `CONVERSION SCORE: ${hook.conversionScore}/100\n`;
      textContent += `BATTLE LAB METRICS:\n`;
      textContent += `  - Predicted CTR: ${hook.battleLabMetrics.predictedCtr}%\n`;
      textContent += `  - Emotional Impact: ${hook.battleLabMetrics.emotionalImpact}/10\n`;
      textContent += `  - Curiosity Gap: ${hook.battleLabMetrics.curiosityGap}/10\n`;
      textContent += `  - Urgency Level: ${hook.battleLabMetrics.urgencyLevel}/10\n`;
      textContent += `VARIATIONS:\n`;
      hook.variations.forEach((variation, vIndex) => {
        textContent += `  ${vIndex + 1}. ${variation}\n`;
      });
      textContent += '\n---\n\n';
    });
    
    if (result.eliteAnalysis) {
      textContent += `ELITE ANALYSIS:\n`;
      textContent += `Top Performer: ${result.eliteAnalysis.topPerformer}\n`;
      textContent += `Psycho Profile: ${result.eliteAnalysis.psychoProfile}\n`;
      textContent += `Battle Strategy: ${result.eliteAnalysis.battleStrategy}\n\n`;
    }
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OnyxHooks-Pro-Analysis-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Pro Text Export Complete!",
      description: "Complete analysis exported to text file",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Pro Elite Neuro Hook Arsenal
          </h1>
          <Eye className="h-8 w-8 text-purple-500" />
        </div>
        <p className="text-slate-200 text-lg">
          5 Elite Gladiators + Neuromarketing + Battle Lab Testing + Psychological Frameworks
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            Advanced Psychology
          </Badge>
          <Badge variant="secondary" className="bg-pink-500/10 text-pink-400 border-pink-500/20">
            Battle Lab Analytics
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            Neuro Optimization
          </Badge>
        </div>
      </div>

      {/* Hook Usage Tracker */}
      <HookUsageTracker 
        currentUsage={{
          used: 0,
          limit: -1,
          tier: 'pro',
          resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-600">
          <TabsTrigger value="generate" className="data-[state=active]:bg-purple-600">
            Generate
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-pink-600">
            Elite Analysis
          </TabsTrigger>
          <TabsTrigger value="battlelab" className="data-[state=active]:bg-blue-600">
            Battle Lab
          </TabsTrigger>
          <TabsTrigger value="optimization" className="data-[state=active]:bg-cyan-600">
            Neuro Optimize
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Advanced Input Form */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Advanced Neuro Input System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Core Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-white font-medium">Industry / Niche *</Label>
                    <Input
                      id="industry"
                      placeholder="e.g., Executive Coaching, SaaS, Fitness"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="text-white font-medium">Target Audience *</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., C-Suite Executives, Busy Entrepreneurs"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="psychoProfile" className="text-white font-medium">Psychological Profile</Label>
                    <Select value={formData.psychoProfile} onValueChange={(value) => setFormData({...formData, psychoProfile: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select psychology type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="skeptical">Skeptical (High-trust barriers)</SelectItem>
                        <SelectItem value="status-seeking">Status-Seeking (Ego-driven)</SelectItem>
                        <SelectItem value="solution-hungry">Solution-Hungry (Pain-driven)</SelectItem>
                        <SelectItem value="analytical">Analytical (Data-driven)</SelectItem>
                        <SelectItem value="emotional">Emotional (Feeling-driven)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pain Point & Outcome */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="painPoint" className="text-white font-medium">Core Pain Point *</Label>
                    <Textarea
                      id="painPoint"
                      placeholder="What's the deepest frustration they're experiencing?"
                      value={formData.painPoint}
                      onChange={(e) => setFormData({...formData, painPoint: e.target.value})}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outcome" className="text-white font-medium">Ultimate Outcome *</Label>
                    <Textarea
                      id="outcome"
                      placeholder="What transformation do they desperately want?"
                      value={formData.desiredOutcome}
                      onChange={(e) => setFormData({...formData, desiredOutcome: e.target.value})}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Business Intelligence */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessModel" className="text-white font-medium">Business Model</Label>
                    <Select value={formData.businessModel} onValueChange={(value) => setFormData({...formData, businessModel: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="coaching">1:1 Coaching</SelectItem>
                        <SelectItem value="course">Online Course</SelectItem>
                        <SelectItem value="mastermind">Mastermind</SelectItem>
                        <SelectItem value="saas">SaaS Product</SelectItem>
                        <SelectItem value="agency">Agency Service</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePoint" className="text-white font-medium">Price Range</Label>
                    <Select value={formData.pricePoint} onValueChange={(value) => setFormData({...formData, pricePoint: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="low">$100 - $500</SelectItem>
                        <SelectItem value="mid">$500 - $2,000</SelectItem>
                        <SelectItem value="high">$2,000 - $10,000</SelectItem>
                        <SelectItem value="premium">$10,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brandPersonality" className="text-white font-medium">Brand Personality</Label>
                    <Select value={formData.brandPersonality} onValueChange={(value) => setFormData({...formData, brandPersonality: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select personality" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="authoritative">Authoritative Expert</SelectItem>
                        <SelectItem value="empathetic">Empathetic Guide</SelectItem>
                        <SelectItem value="disruptive">Disruptive Challenger</SelectItem>
                        <SelectItem value="sophisticated">Sophisticated Elite</SelectItem>
                        <SelectItem value="relatable">Relatable Mentor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Competitive Intelligence */}
                <div className="space-y-2">
                  <Label htmlFor="competitorAngle" className="text-white font-medium">Competitive Differentiation</Label>
                  <Textarea
                    id="competitorAngle"
                    placeholder="What makes you different from competitors? What angle do they miss?"
                    value={formData.competitorAngle}
                    onChange={(e) => setFormData({...formData, competitorAngle: e.target.value})}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[80px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={generateMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-3"
                >
                  {generateMutation.isPending ? "Elite Council Analyzing..." : "Generate Pro Hook Arsenal"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {result && result.hooks ? (
            <div className="space-y-6">
              {/* Elite Hook Arsenal */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {result.hooks.map((hook, index) => (
                  <Card key={index} className={`${
                    hook.gladiator === 'Maximus' 
                      ? 'bg-blue-900/20 border-blue-500/30' 
                      : hook.gladiator === 'Spartacus'
                      ? 'bg-red-900/20 border-red-500/30'
                      : hook.gladiator === 'Leonidas'
                      ? 'bg-green-900/20 border-green-500/30'
                      : hook.gladiator === 'Brutus'
                      ? 'bg-purple-900/20 border-purple-500/30'
                      : 'bg-yellow-900/20 border-yellow-500/30'
                  }`}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${
                        hook.gladiator === 'Maximus' ? 'text-blue-400' 
                        : hook.gladiator === 'Spartacus' ? 'text-red-400'
                        : hook.gladiator === 'Leonidas' ? 'text-green-400'
                        : hook.gladiator === 'Brutus' ? 'text-purple-400'
                        : 'text-yellow-400'
                      }`}>
                        <Trophy className="h-5 w-5" />
                        {hook.gladiator}
                        <Badge variant="outline" className="ml-auto">
                          {hook.conversionScore}/100
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600 relative group">
                        <p className="text-lg font-medium text-white">"{hook.hook}"</p>
                        
                        {/* Deployment Tooltip */}
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-slate-700 text-white text-xs p-2 rounded-lg shadow-lg max-w-48 border border-slate-600">
                            <strong>Deploy when:</strong><br/>
                            {hook.gladiator === 'Maximus' ? 'Audience seeks systematic solutions and logical frameworks' :
                             hook.gladiator === 'Spartacus' ? 'Need to break attention patterns and create urgency' :
                             hook.gladiator === 'Leonidas' ? 'Targeting achievement-focused, results-driven audience' :
                             hook.gladiator === 'Brutus' ? 'Trust is low and peer validation is needed' :
                             'Audience values status, exclusivity, and premium positioning'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Neuro Triggers */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-200 flex items-center gap-1">
                          <Brain className="h-4 w-4" />
                          Neuro Triggers:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {hook.neuroTriggers.map((trigger, triggerIndex) => (
                            <Badge key={triggerIndex} variant="secondary" className="text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Psychology Framework */}
                      <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                        <p className="text-xs font-medium text-slate-200 mb-1">Psychology Framework:</p>
                        <p className="text-sm text-slate-300">{hook.psychologyFramework}</p>
                      </div>

                      {/* Battle Lab Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">CTR:</span>
                          <span className="text-white">{hook.battleLabMetrics.predictedCtr}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Emotion:</span>
                          <span className="text-white">{hook.battleLabMetrics.emotionalImpact}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Curiosity:</span>
                          <span className="text-white">{hook.battleLabMetrics.curiosityGap}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Urgency:</span>
                          <span className="text-white">{hook.battleLabMetrics.urgencyLevel}/10</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(hook.hook)}
                          className="flex-1 text-slate-400 hover:text-white text-xs"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`📱 Instagram: ${hook.hook.length > 20 ? hook.hook.substring(0, 20) + '...' : hook.hook}\n📧 Email: ${hook.hook}\n🌐 Landing: ${hook.hook} + social proof`)}
                          className="flex-1 text-slate-400 hover:text-white text-xs"
                        >
                          <Target className="h-3 w-3 mr-1" />
                          Multi-Channel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Elite Analysis */}
              <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Eye className="h-5 w-5" />
                    Elite Psychological Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-medium text-purple-300 mb-2">Top Performer</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.eliteAnalysis.topPerformer}</p>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-medium text-purple-300 mb-2">Psychological Profile</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.eliteAnalysis.psychoProfile}</p>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-medium text-purple-300 mb-2">Conversion Prediction</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.eliteAnalysis.conversionPrediction}</p>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-medium text-purple-300 mb-2">Battle Strategy</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.eliteAnalysis.battleStrategy}</p>
                    </div>
                  </div>

                  {/* Channel-Specific Variants */}
                  <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 p-5 rounded-lg border border-slate-600">
                    <h4 className="font-medium text-purple-300 mb-4 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Channel Optimization Variants
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-blue-300 text-sm">📱 Instagram/Social</h5>
                        <p className="text-slate-200 text-sm bg-slate-800/50 p-3 rounded border">
                          "From snug to stunning: Dream jeans in 8 weeks"
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-green-300 text-sm">📧 Email Subject</h5>
                        <p className="text-slate-200 text-sm bg-slate-800/50 p-3 rounded border">
                          "What most moms can't do... but you will"
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-yellow-300 text-sm">🌐 Landing Page</h5>
                        <p className="text-slate-200 text-sm bg-slate-800/50 p-3 rounded border">
                          Top hook + Brutus proof line underneath
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Neuro Auto-Merge Toggle */}
                  <div className="bg-gradient-to-r from-purple-800/20 to-pink-800/20 p-4 rounded-lg border border-purple-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-purple-300 flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Neuro Auto-Merge
                      </h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
                        onClick={() => {
                          const topHook = result.hooks.find(h => h.conversionScore === Math.max(...result.hooks.map(hook => hook.conversionScore)));
                          const trustHook = result.hooks.find(h => h.gladiator === 'Brutus');
                          const merged = `${topHook?.hook} ${trustHook ? '(Validated by 10,000+ success stories)' : ''}`;
                          copyToClipboard(merged);
                          toast({ title: "Merged Hook Copied!", description: "Emotion + Trust variant ready for testing" });
                        }}
                      >
                        Generate Blend
                      </Button>
                    </div>
                    <p className="text-purple-200 text-sm">
                      Combine highest-scoring emotional hook with Brutus trust elements for maximum conversion potential.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <p className="text-slate-300">Generate hooks first to see elite analysis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="battlelab" className="space-y-6">
          {result ? (
            <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <BarChart3 className="h-5 w-5" />
                  Battle Lab Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-cyan-400">
                    Winner: {result.battleLabResults.winner}
                  </div>
                  <div className="text-lg text-cyan-300">
                    Confidence: {result.hooks.find(h => h.gladiator === result.battleLabResults.winner)?.conversionScore || result.battleLabResults.confidence}%
                  </div>
                  <p className="text-white max-w-2xl mx-auto bg-slate-800/30 p-4 rounded-lg">
                    {result.battleLabResults.reasoning}
                  </p>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <h4 className="font-medium text-blue-300 mb-2">A/B Test Strategy</h4>
                  <p className="text-slate-100 drop-shadow-sm">{result.battleLabResults.abTestStrategy}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-slate-300">Generate hooks to access Battle Lab analysis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {result ? (
            <Card className="bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Brain className="h-5 w-5" />
                  Neuro Optimization Framework
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-medium text-cyan-300 mb-2">Primary Trigger</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.neuroOptimization.primaryTrigger}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-medium text-cyan-300 mb-2">Secondary Triggers</h4>
                      <ul className="space-y-1">
                        {result.neuroOptimization.secondaryTriggers.map((trigger, index) => (
                          <li key={index} className="text-slate-100">• {trigger}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-medium text-cyan-300 mb-2">Cognitive Load</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.neuroOptimization.cognitiveLoad}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-medium text-cyan-300 mb-2">Decision Framework</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.neuroOptimization.decisionFramework}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <Brain className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <p className="text-slate-300">Generate hooks to access neuro optimization</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Export Actions - Pro Tier */}
      {result && (
        <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Download className="h-5 w-5" />
              Export Pro Elite Arsenal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={exportToCSV}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={exportToText}
                variant="outline"
                className="flex-1 border-purple-500 text-purple-300 hover:bg-purple-900/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Analysis
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Export your elite hook analysis with neuro triggers and battle lab metrics
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}