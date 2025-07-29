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
import { Copy, Crown, Zap, TrendingUp, Target, Brain, Eye, Heart, Users, BarChart3, Trophy, Shield, Sword, Diamond, Lock, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { HookUsageTracker } from "./HookUsageTracker";

interface VaultHookResponse {
  hooks: Array<{
    gladiator: 'Maximus' | 'Spartacus' | 'Leonidas' | 'Brutus' | 'Achilles' | 'Valerius';
    hook: string;
    neuroTriggers: string[];
    psychologyFramework: string;
    conversionScore: number;
    exclusiveInsight: string;
    premiumVariations: string[];
    vaultMetrics: {
      neurologicalImpact: number;
      statusTrigger: number;
      exclusivityIndex: number;
      persuasionDepth: number;
      identityShift: number;
    };
  }>;
  supremeAnalysis: {
    topPerformer: string;
    psychoProfile: string;
    conversionPrediction: string;
    battleStrategy: string;
    neuralMapping: string;
    exclusiveInsights: string[];
  };
  vaultOptimization: {
    primaryFramework: string;
    secondaryFrameworks: string[];
    cognitiveArchitecture: string;
    identityTransformation: string;
    statusElevation: string;
  };
  eliteSequencing: {
    phase1Opener: string;
    phase2Amplifier: string;
    phase3Closer: string;
    sequenceReasoning: string;
    deploymentStrategy: string;
  };
  exclusiveIntelligence: {
    marketGaps: string[];
    competitorBlindSpots: string[];
    untappedTriggers: string[];
    premiumPositioning: string;
  };
}

export function VaultHookGenerator() {
  const [formData, setFormData] = useState({
    industry: "",
    targetAudience: "",
    painPoint: "",
    desiredOutcome: "",
    psychoProfile: "",
    businessModel: "",
    pricePoint: "",
    competitorAngle: "",
    brandPersonality: "",
    marketPosition: "",
    exclusiveAdvantage: "",
    statusLevel: "",
    identityShift: ""
  });
  
  const [result, setResult] = useState<VaultHookResponse | null>(null);
  const [activeTab, setActiveTab] = useState("generate");
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/vault-hooks/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setActiveTab("supreme");
    },
    onError: (error) => {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate vault hooks. Please try again.",
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
      ['Gladiator', 'Hook', 'Neuro Triggers', 'Psychology Framework', 'Conversion Score', 'Exclusive Insight', 'Neural Impact', 'Status Trigger', 'Exclusivity Index', 'Identity Shift', 'Premium Variations'],
      ...result.hooks.map(hook => [
        hook.gladiator,
        `"${hook.hook}"`,
        `"${hook.neuroTriggers.join('; ')}"`,
        `"${hook.psychologyFramework}"`,
        hook.conversionScore.toString(),
        `"${hook.exclusiveInsight}"`,
        hook.vaultMetrics.neurologicalImpact.toString(),
        hook.vaultMetrics.statusTrigger.toString(),
        hook.vaultMetrics.exclusivityIndex.toString(),
        hook.vaultMetrics.identityShift.toString(),
        `"${hook.premiumVariations.join('; ')}"`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OnyxHooks-Vault-Supreme-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Vault Supreme Export Complete!",
      description: "Elite neural arsenal exported to CSV successfully",
    });
  };

  const exportToText = () => {
    if (!result?.hooks) return;
    
    let textContent = `OnyxHooks Vault Supreme Neural Arsenal - Generated ${new Date().toLocaleDateString()}\n`;
    textContent += `===============================================================================\n\n`;
    
    result.hooks.forEach((hook, index) => {
      textContent += `${index + 1}. GLADIATOR: ${hook.gladiator}\n`;
      textContent += `HOOK: ${hook.hook}\n`;
      textContent += `PSYCHOLOGY FRAMEWORK: ${hook.psychologyFramework}\n`;
      textContent += `NEURO TRIGGERS: ${hook.neuroTriggers.join(', ')}\n`;
      textContent += `CONVERSION SCORE: ${hook.conversionScore}/100\n`;
      textContent += `EXCLUSIVE INSIGHT: ${hook.exclusiveInsight}\n`;
      textContent += `VAULT METRICS:\n`;
      textContent += `  - Neurological Impact: ${hook.vaultMetrics.neurologicalImpact}/10\n`;
      textContent += `  - Status Trigger: ${hook.vaultMetrics.statusTrigger}/10\n`;
      textContent += `  - Exclusivity Index: ${hook.vaultMetrics.exclusivityIndex}/10\n`;
      textContent += `  - Identity Shift: ${hook.vaultMetrics.identityShift}/10\n`;
      textContent += `PREMIUM VARIATIONS:\n`;
      hook.premiumVariations.forEach((variation, vIndex) => {
        textContent += `  ${vIndex + 1}. ${variation}\n`;
      });
      textContent += '\n---\n\n';
    });
    
    if (result.supremeAnalysis) {
      textContent += `SUPREME ANALYSIS:\n`;
      textContent += `Top Performer: ${result.supremeAnalysis.topPerformer}\n`;
      textContent += `Psycho Profile: ${result.supremeAnalysis.psychoProfile}\n`;
      textContent += `Neural Mapping: ${result.supremeAnalysis.neuralMapping}\n`;
      textContent += `Battle Strategy: ${result.supremeAnalysis.battleStrategy}\n\n`;
    }
    
    if (result.exclusiveIntelligence) {
      textContent += `EXCLUSIVE INTELLIGENCE:\n`;
      textContent += `Market Gaps: ${result.exclusiveIntelligence.marketGaps.join(', ')}\n`;
      textContent += `Competitor Blind Spots: ${result.exclusiveIntelligence.competitorBlindSpots.join(', ')}\n`;
      textContent += `Premium Positioning: ${result.exclusiveIntelligence.premiumPositioning}\n\n`;
    }
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OnyxHooks-Vault-Supreme-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Vault Supreme Export Complete!",
      description: "Complete neural arsenal analysis exported to text file",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Crown className="h-10 w-10 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Vault Supreme Neural Arsenal
          </h1>
          <Diamond className="h-10 w-10 text-yellow-500" />
        </div>
        <p className="text-slate-200 text-xl">
          6 Elite Gladiators + Neural Mapping + Identity Transformation + Exclusive Intelligence
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
            Neural Mapping
          </Badge>
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            Identity Shift
          </Badge>
          <Badge variant="secondary" className="bg-pink-500/10 text-pink-400 border-pink-500/20">
            Elite Sequencing
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            Market Intelligence
          </Badge>
        </div>
      </div>

      {/* Hook Usage Tracker */}
      <HookUsageTracker 
        currentUsage={{
          used: 0,
          limit: 1,
          tier: 'vault',
          resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-600">
          <TabsTrigger value="generate" className="data-[state=active]:bg-yellow-600">
            Generate
          </TabsTrigger>
          <TabsTrigger value="supreme" className="data-[state=active]:bg-purple-600">
            Supreme Analysis
          </TabsTrigger>
          <TabsTrigger value="sequencing" className="data-[state=active]:bg-pink-600">
            Elite Sequencing
          </TabsTrigger>
          <TabsTrigger value="optimization" className="data-[state=active]:bg-blue-600">
            Vault Optimize
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="data-[state=active]:bg-cyan-600">
            Exclusive Intel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Vault Input Form */}
          <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                Vault Supreme Intelligence Input
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
                      placeholder="e.g., Executive Coaching, High-End Consulting"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="bg-slate-800 border-yellow-500/30 text-white placeholder:text-slate-400 focus:border-yellow-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="text-white font-medium">Elite Target Audience *</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., Fortune 500 CEOs, Ultra-High Net Worth"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                      className="bg-slate-800 border-yellow-500/30 text-white placeholder:text-slate-400 focus:border-yellow-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="statusLevel" className="text-white font-medium">Status Level</Label>
                    <Select value={formData.statusLevel} onValueChange={(value) => setFormData({...formData, statusLevel: value})}>
                      <SelectTrigger className="bg-slate-800 border-yellow-500/30 text-white focus:border-yellow-500">
                        <SelectValue placeholder="Select status tier" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="emerging">Emerging Elite</SelectItem>
                        <SelectItem value="established">Established Authority</SelectItem>
                        <SelectItem value="apex">Apex Performer</SelectItem>
                        <SelectItem value="legendary">Legendary Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pain Point & Transformation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="painPoint" className="text-white font-medium">Core Pain Point *</Label>
                    <Textarea
                      id="painPoint"
                      placeholder="What's the deepest status threat or performance gap?"
                      value={formData.painPoint}
                      onChange={(e) => setFormData({...formData, painPoint: e.target.value})}
                      className="bg-slate-800 border-yellow-500/30 text-white placeholder:text-slate-400 min-h-[100px] focus:border-yellow-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outcome" className="text-white font-medium">Identity Transformation *</Label>
                    <Textarea
                      id="outcome"
                      placeholder="What elite identity do they desire to embody?"
                      value={formData.desiredOutcome}
                      onChange={(e) => setFormData({...formData, desiredOutcome: e.target.value})}
                      className="bg-slate-800 border-yellow-500/30 text-white placeholder:text-slate-400 min-h-[100px] focus:border-yellow-500"
                    />
                  </div>
                </div>

                {/* Advanced Psychology */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="psychoProfile" className="text-white font-medium">Psychological Archetype</Label>
                    <Select value={formData.psychoProfile} onValueChange={(value) => setFormData({...formData, psychoProfile: value})}>
                      <SelectTrigger className="bg-slate-800 border-yellow-500/30 text-white focus:border-yellow-500">
                        <SelectValue placeholder="Select archetype" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="emperor">The Emperor (Command & Control)</SelectItem>
                        <SelectItem value="visionary">The Visionary (Innovation & Future)</SelectItem>
                        <SelectItem value="conqueror">The Conqueror (Expansion & Dominance)</SelectItem>
                        <SelectItem value="sage">The Sage (Wisdom & Insight)</SelectItem>
                        <SelectItem value="alchemist">The Alchemist (Transformation)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marketPosition" className="text-white font-medium">Market Position</Label>
                    <Select value={formData.marketPosition} onValueChange={(value) => setFormData({...formData, marketPosition: value})}>
                      <SelectTrigger className="bg-slate-800 border-yellow-500/30 text-white focus:border-yellow-500">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="disruptor">Market Disruptor</SelectItem>
                        <SelectItem value="leader">Category Leader</SelectItem>
                        <SelectItem value="innovator">Innovation Pioneer</SelectItem>
                        <SelectItem value="authority">Thought Authority</SelectItem>
                        <SelectItem value="exclusive">Exclusive Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePoint" className="text-white font-medium">Investment Level</Label>
                    <Select value={formData.pricePoint} onValueChange={(value) => setFormData({...formData, pricePoint: value})}>
                      <SelectTrigger className="bg-slate-800 border-yellow-500/30 text-white focus:border-yellow-500">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="premium">$10K - $25K</SelectItem>
                        <SelectItem value="elite">$25K - $100K</SelectItem>
                        <SelectItem value="supreme">$100K - $500K</SelectItem>
                        <SelectItem value="legendary">$500K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="identityShift" className="text-white font-medium">Identity Shift</Label>
                    <Select value={formData.identityShift} onValueChange={(value) => setFormData({...formData, identityShift: value})}>
                      <SelectTrigger className="bg-slate-800 border-yellow-500/30 text-white focus:border-yellow-500">
                        <SelectValue placeholder="Select transformation" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="performer-to-leader">Performer → Leader</SelectItem>
                        <SelectItem value="expert-to-authority">Expert → Authority</SelectItem>
                        <SelectItem value="successful-to-legendary">Successful → Legendary</SelectItem>
                        <SelectItem value="local-to-global">Local → Global</SelectItem>
                        <SelectItem value="follower-to-pioneer">Follower → Pioneer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Exclusive Intelligence */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="exclusiveAdvantage" className="text-white font-medium">Exclusive Competitive Advantage</Label>
                    <Textarea
                      id="exclusiveAdvantage"
                      placeholder="What unique advantage or insider knowledge do you possess that competitors can't replicate?"
                      value={formData.exclusiveAdvantage}
                      onChange={(e) => setFormData({...formData, exclusiveAdvantage: e.target.value})}
                      className="bg-slate-800 border-yellow-500/30 text-white placeholder:text-slate-400 min-h-[80px] focus:border-yellow-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competitorAngle" className="text-white font-medium">Market Intelligence</Label>
                    <Textarea
                      id="competitorAngle"
                      placeholder="What are competitors missing? What gaps exist in the market that only you can fill?"
                      value={formData.competitorAngle}
                      onChange={(e) => setFormData({...formData, competitorAngle: e.target.value})}
                      className="bg-slate-800 border-yellow-500/30 text-white placeholder:text-slate-400 min-h-[80px] focus:border-yellow-500"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={generateMutation.isPending}
                  className="w-full bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 hover:from-yellow-700 hover:via-purple-700 hover:to-pink-700 text-xl py-4"
                >
                  {generateMutation.isPending ? "Vault Intelligence Analyzing..." : "🏛️ Generate Vault Supreme Arsenal"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supreme" className="space-y-6">
          {result && result.hooks ? (
            <div className="space-y-6">
              {/* Supreme Hook Arsenal - 6 Gladiators */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {result.hooks.map((hook, index) => (
                  <Card key={index} className={`${
                    hook.gladiator === 'Maximus' 
                      ? 'bg-blue-900/30 border-blue-400/50' 
                      : hook.gladiator === 'Spartacus'
                      ? 'bg-red-900/30 border-red-400/50'
                      : hook.gladiator === 'Leonidas'
                      ? 'bg-green-900/30 border-green-400/50'
                      : hook.gladiator === 'Brutus'
                      ? 'bg-purple-900/30 border-purple-400/50'
                      : hook.gladiator === 'Achilles'
                      ? 'bg-yellow-900/30 border-yellow-400/50'
                      : 'bg-indigo-900/30 border-indigo-400/50'
                  } shadow-lg`}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${
                        hook.gladiator === 'Maximus' ? 'text-blue-300' 
                        : hook.gladiator === 'Spartacus' ? 'text-red-300'
                        : hook.gladiator === 'Leonidas' ? 'text-green-300'
                        : hook.gladiator === 'Brutus' ? 'text-purple-300'
                        : hook.gladiator === 'Achilles' ? 'text-yellow-300'
                        : 'text-indigo-300'
                      }`}>
                        <Crown className="h-5 w-5" />
                        {hook.gladiator}
                        <Badge variant="outline" className="ml-auto text-yellow-300 border-yellow-500">
                          {hook.conversionScore}/100
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-slate-800/70 rounded-lg border border-slate-500 relative group">
                        <p className="text-lg font-medium text-white drop-shadow-sm">"{hook.hook}"</p>
                        
                        {/* Elite Deployment Tooltip */}
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="bg-slate-700 text-white text-xs p-3 rounded-lg shadow-xl max-w-56 border border-slate-500">
                            <strong className="text-yellow-300">Elite Deploy:</strong><br/>
                            {hook.gladiator === 'Maximus' ? 'Strategic frameworks for systematic thinkers' :
                             hook.gladiator === 'Spartacus' ? 'Disruptive breakthrough for stagnant markets' :
                             hook.gladiator === 'Leonidas' ? 'Victory positioning for competitive environments' :
                             hook.gladiator === 'Brutus' ? 'Authority building when credibility is questioned' :
                             hook.gladiator === 'Achilles' ? 'Elite status for exclusivity-driven audiences' :
                             'Wisdom positioning for transformation-seeking leaders'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Exclusive Insight */}
                      <div className="p-3 bg-gradient-to-r from-yellow-900/20 to-purple-900/20 rounded border border-yellow-500/30">
                        <p className="text-xs font-medium text-yellow-300 mb-1">🔐 Vault Exclusive Insight:</p>
                        <p className="text-sm text-slate-200">{hook.exclusiveInsight}</p>
                      </div>

                      {/* Vault Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Neural:</span>
                          <span className="text-yellow-300">{hook.vaultMetrics.neurologicalImpact}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className="text-yellow-300">{hook.vaultMetrics.statusTrigger}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Exclusive:</span>
                          <span className="text-yellow-300">{hook.vaultMetrics.exclusivityIndex}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Identity:</span>
                          <span className="text-yellow-300">{hook.vaultMetrics.identityShift}/10</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(hook.hook)}
                          className="flex-1 text-slate-400 hover:text-yellow-300 text-xs"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(hook.premiumVariations.join('\n\n'))}
                          className="flex-1 text-slate-400 hover:text-yellow-300 text-xs"
                        >
                          <Diamond className="h-3 w-3 mr-1" />
                          Variations
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Supreme Analysis */}
              <Card className="bg-gradient-to-r from-yellow-900/20 via-purple-900/20 to-pink-900/20 border-yellow-500/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <Crown className="h-6 w-6" />
                    Supreme Vault Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-yellow-500/30">
                      <h4 className="font-medium text-yellow-300 mb-2">Supreme Performer</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.supremeAnalysis.topPerformer}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-yellow-500/30">
                      <h4 className="font-medium text-yellow-300 mb-2">Neural Mapping</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.supremeAnalysis.neuralMapping}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-yellow-500/30">
                      <h4 className="font-medium text-yellow-300 mb-2">Conversion Architecture</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.supremeAnalysis.conversionPrediction}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-yellow-500/30">
                      <h4 className="font-medium text-yellow-300 mb-2">Elite Strategy</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.supremeAnalysis.battleStrategy}</p>
                    </div>
                  </div>

                  {/* Exclusive Insights */}
                  <div className="bg-gradient-to-r from-purple-800/20 to-pink-800/20 p-5 rounded-lg border border-purple-500/30">
                    <h4 className="font-medium text-purple-300 mb-4 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Vault-Exclusive Intelligence
                    </h4>
                    <div className="space-y-3">
                      {result.supremeAnalysis.exclusiveInsights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Diamond className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <p className="text-purple-200 text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export Section */}
              <Card className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-400">
                    <Download className="h-5 w-5" />
                    Export Vault Supreme Arsenal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button 
                      onClick={exportToCSV}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export to CSV
                    </Button>
                    <Button 
                      onClick={exportToText}
                      variant="outline"
                      className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export to Text
                    </Button>
                  </div>
                  <p className="text-emerald-200 text-sm mt-3">
                    Export your complete Vault Supreme neural arsenal including all 6 gladiator hooks, metrics, and exclusive intelligence.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-slate-300">Generate hooks first to see supreme analysis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sequencing" className="space-y-6">
          {result ? (
            <Card className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-400">
                  <Sword className="h-5 w-5" />
                  Elite Sequencing Framework
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/40 p-4 rounded-lg border border-pink-500/30">
                    <h4 className="font-medium text-pink-300 mb-3">Phase 1: Opener</h4>
                    <p className="text-slate-100 text-sm mb-3">{result.eliteSequencing.phase1Opener}</p>
                    <Badge variant="outline" className="text-xs">Attention Break</Badge>
                  </div>
                  <div className="bg-slate-800/40 p-4 rounded-lg border border-pink-500/30">
                    <h4 className="font-medium text-pink-300 mb-3">Phase 2: Amplifier</h4>
                    <p className="text-slate-100 text-sm mb-3">{result.eliteSequencing.phase2Amplifier}</p>
                    <Badge variant="outline" className="text-xs">Desire Amplification</Badge>
                  </div>
                  <div className="bg-slate-800/40 p-4 rounded-lg border border-pink-500/30">
                    <h4 className="font-medium text-pink-300 mb-3">Phase 3: Closer</h4>
                    <p className="text-slate-100 text-sm mb-3">{result.eliteSequencing.phase3Closer}</p>
                    <Badge variant="outline" className="text-xs">Action Trigger</Badge>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-slate-800/40 to-purple-800/40 p-5 rounded-lg border border-slate-600">
                  <h4 className="font-medium text-pink-300 mb-3">Deployment Strategy</h4>
                  <p className="text-pink-100 mb-4">{result.eliteSequencing.deploymentStrategy}</p>
                  <div className="bg-slate-900/50 p-3 rounded border border-pink-500/20">
                    <p className="text-xs text-pink-200">{result.eliteSequencing.sequenceReasoning}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <Sword className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                <p className="text-slate-300">Generate hooks to access elite sequencing</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {result ? (
            <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Brain className="h-5 w-5" />
                  Vault Optimization Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-blue-500/30">
                      <h4 className="font-medium text-blue-300 mb-2">Primary Framework</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.vaultOptimization.primaryFramework}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-blue-500/30">
                      <h4 className="font-medium text-blue-300 mb-2">Identity Transformation</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.vaultOptimization.identityTransformation}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-blue-500/30">
                      <h4 className="font-medium text-blue-300 mb-2">Cognitive Architecture</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.vaultOptimization.cognitiveArchitecture}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-blue-500/30">
                      <h4 className="font-medium text-blue-300 mb-2">Status Elevation</h4>
                      <p className="text-slate-100 drop-shadow-sm">{result.vaultOptimization.statusElevation}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-800/20 to-cyan-800/20 p-5 rounded-lg border border-blue-500/30">
                  <h4 className="font-medium text-blue-300 mb-3">Secondary Frameworks</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.vaultOptimization.secondaryFrameworks.map((framework, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-cyan-400" />
                        <span className="text-blue-100 text-sm">{framework}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <Brain className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-slate-300">Generate hooks to access vault optimization</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          {result ? (
            <Card className="bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Eye className="h-5 w-5" />
                  Exclusive Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-cyan-500/30">
                      <h4 className="font-medium text-cyan-300 mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Market Gaps
                      </h4>
                      <ul className="space-y-2">
                        {result.exclusiveIntelligence.marketGaps.map((gap, index) => (
                          <li key={index} className="text-cyan-100 text-sm flex items-start gap-2">
                            <span className="text-cyan-400 mt-1">•</span>
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-cyan-500/30">
                      <h4 className="font-medium text-cyan-300 mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Competitor Blind Spots
                      </h4>
                      <ul className="space-y-2">
                        {result.exclusiveIntelligence.competitorBlindSpots.map((blindspot, index) => (
                          <li key={index} className="text-cyan-100 text-sm flex items-start gap-2">
                            <span className="text-cyan-400 mt-1">•</span>
                            {blindspot}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-cyan-500/30">
                      <h4 className="font-medium text-cyan-300 mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Untapped Triggers
                      </h4>
                      <ul className="space-y-2">
                        {result.exclusiveIntelligence.untappedTriggers.map((trigger, index) => (
                          <li key={index} className="text-cyan-100 text-sm flex items-start gap-2">
                            <span className="text-cyan-400 mt-1">•</span>
                            {trigger}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-slate-800/40 p-4 rounded-lg border border-cyan-500/30">
                      <h4 className="font-medium text-cyan-300 mb-3 flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Premium Positioning
                      </h4>
                      <p className="text-cyan-100 text-sm">{result.exclusiveIntelligence.premiumPositioning}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <Eye className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <p className="text-slate-300">Generate hooks to access exclusive intelligence</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}