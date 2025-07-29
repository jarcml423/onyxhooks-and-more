import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Sword, Shield, Crown, Zap, TrendingUp, Target, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { HookUsageTracker } from "./HookUsageTracker";

interface StarterHookResponse {
  hooks: Array<{
    gladiator: 'Maximus' | 'Spartacus' | 'Leonidas';
    hook: string;
    critique: string;
    conversionTips: string[];
    variation: string;
  }>;
  councilConsensus: string;
  abTestSuggestion: string;
  upgradeTeaser: string;
  hooksRemaining: number;
}

export function StarterHookGenerator() {
  const [formData, setFormData] = useState({
    industry: "",
    targetAudience: "",
    painPoint: "",
    desiredOutcome: "",
    tonePref: ""
  });
  
  const [result, setResult] = useState<StarterHookResponse | null>(null);
  const [activeTab, setActiveTab] = useState("generate");
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/starter-hooks/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate hooks. Please try again.",
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
      description: "Hook copied to clipboard",
    });
  };

  const exportToCSV = () => {
    if (!result?.hooks) return;
    
    const csvContent = [
      ['Gladiator', 'Hook', 'Variation', 'Critique', 'Conversion Tips'],
      ...result.hooks.map(hook => [
        hook.gladiator,
        `"${hook.hook}"`,
        `"${hook.variation}"`,
        `"${hook.critique}"`,
        `"${hook.conversionTips.join('; ')}"`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OnyxHooks-Starter-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete!",
      description: "Hooks exported to CSV successfully",
    });
  };

  const exportToText = () => {
    if (!result?.hooks) return;
    
    const textContent = result.hooks.map((hook, index) => 
      `${index + 1}. ${hook.gladiator}: "${hook.hook}"\n   Variation: "${hook.variation}"\n   Critique: ${hook.critique}\n   Tips: ${hook.conversionTips.join(', ')}\n`
    ).join('\n');
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OnyxHooks-Starter-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete!",
      description: "Hooks exported to text file successfully",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Crown className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Starter Elite Hook Arsenal
          </h1>
          <Shield className="h-8 w-8 text-green-500" />
        </div>
        <p className="text-slate-200 text-lg">
          3 Gladiator Agents + A/B Testing + Conversion Optimization
        </p>
      </div>

      {/* Hook Usage Tracker */}
      <HookUsageTracker 
        currentUsage={{
          used: result?.hooksRemaining ? (25 - result.hooksRemaining) : 22,
          limit: 25,
          tier: 'starter',
          resetDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString()
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-600">
          <TabsTrigger value="generate" className="data-[state=active]:bg-green-600">
            Generate Hooks
          </TabsTrigger>
          <TabsTrigger value="optimize" className="data-[state=active]:bg-blue-600">
            A/B Test & Optimize
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Input Form */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Elite Hook Intelligence Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-white font-medium">Industry / Niche</Label>
                    <Input
                      id="industry"
                      placeholder="e.g., Life Coaching, SaaS, Fitness"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="text-white font-medium">Target Audience</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., Entrepreneurs, Busy Moms, CEOs"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="painPoint" className="text-white font-medium">Main Pain Point</Label>
                  <Textarea
                    id="painPoint"
                    placeholder="What problem are they struggling with?"
                    value={formData.painPoint}
                    onChange={(e) => setFormData({...formData, painPoint: e.target.value})}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="outcome" className="text-white font-medium">Desired Outcome</Label>
                    <Textarea
                      id="outcome"
                      placeholder="What transformation do they want?"
                      value={formData.desiredOutcome}
                      onChange={(e) => setFormData({...formData, desiredOutcome: e.target.value})}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone" className="text-white font-medium">Tone Preference (Optional)</Label>
                    <Textarea
                      id="tone"
                      placeholder="e.g., Professional, Casual, Urgent, Authoritative"
                      value={formData.tonePref}
                      onChange={(e) => setFormData({...formData, tonePref: e.target.value})}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[80px]"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={generateMutation.isPending}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {generateMutation.isPending ? "Elite Council Strategizing..." : "Generate Hook Arsenal"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Loading State */}
          {generateMutation.isPending && (
            <Card className="bg-green-900/20 border-green-500/30">
              <CardContent className="pt-6">
                <p className="text-center text-green-400">Elite gladiator council is forging your hook arsenal...</p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && result.hooks && (
            <div className="space-y-6">
              {/* Elite Hook Arsenal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {result.hooks.map((hook, index) => (
                  <Card key={index} className={`${
                    hook.gladiator === 'Maximus' 
                      ? 'bg-blue-900/20 border-blue-500/30' 
                      : hook.gladiator === 'Spartacus'
                      ? 'bg-red-900/20 border-red-500/30'
                      : 'bg-green-900/20 border-green-500/30'
                  }`}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${
                        hook.gladiator === 'Maximus' ? 'text-blue-400' 
                        : hook.gladiator === 'Spartacus' ? 'text-red-400'
                        : 'text-green-400'
                      }`}>
                        {hook.gladiator === 'Maximus' ? (
                          <>
                            <Shield className="h-5 w-5" />
                            🧠 Maximus (Strategy)
                          </>
                        ) : hook.gladiator === 'Spartacus' ? (
                          <>
                            <Sword className="h-5 w-5" />
                            🗡️ Spartacus (Disruption)
                          </>
                        ) : (
                          <>
                            <Target className="h-5 w-5" />
                            🎯 Leonidas (Results)
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <p className="text-lg font-medium text-white">"{hook.hook}"</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300 italic">
                          {hook.critique}
                        </p>
                        
                        {/* Conversion Tips */}
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-200">Conversion Tips:</p>
                          {hook.conversionTips.map((tip, tipIndex) => (
                            <p key={tipIndex} className="text-xs text-slate-400">• {tip}</p>
                          ))}
                        </div>

                        {/* Variation */}
                        <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                          <p className="text-xs font-medium text-slate-200 mb-1">A/B Test Variation:</p>
                          <p className="text-sm text-slate-300">"{hook.variation}"</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(hook.hook)}
                          className="text-slate-400 hover:text-white flex-1"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Original
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(hook.variation)}
                          className="text-slate-400 hover:text-white flex-1"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Variation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Export Actions */}
              <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Download className="h-5 w-5" />
                    Export Hook Arsenal
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
                      Export Text
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    Export your generated hooks for external use and analysis
                  </p>
                </CardContent>
              </Card>

              {/* Council Consensus */}
              <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    ⚔️ Elite Council Consensus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{result.councilConsensus}</p>
                </CardContent>
              </Card>

              {/* A/B Test Strategy */}
              <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <TrendingUp className="h-5 w-5" />
                    A/B Testing Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{result.abTestSuggestion}</p>
                </CardContent>
              </Card>

              {/* Pro Upgrade Teaser */}
              <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Crown className="h-8 w-8 text-yellow-500 mx-auto" />
                    <p className="text-yellow-200">{result.upgradeTeaser}</p>
                    <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                      Upgrade to PRO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="optimize" className="space-y-6">
          {result && result.hooks ? (
            <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                <Target className="h-6 w-6" />
                Auto A/B Suggestion Block
              </h2>

              {/* Council Consensus Best Hook */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Council Consensus: Best Performing Hook
                </h3>
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 mb-4">
                  <p className="text-cyan-100 italic text-lg">
                    "{result.hooks[0]?.hook || 'Loading best hook...'}"
                  </p>
                </div>
                <ul className="space-y-2 text-blue-200 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    Clear outcome and specific transformation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    Strong action verbs and psychological triggers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    Matched tone: <span className="font-semibold">Professional & Inspiring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    Emotionally aligned with target audience
                  </li>
                </ul>
              </div>

              {/* A/B Testing Plan Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  A/B Testing Plan
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-slate-800/50 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-slate-700/50">
                        <th className="p-3 text-left text-cyan-400 font-semibold">Hook Variant</th>
                        <th className="p-3 text-left text-cyan-400 font-semibold">Best Placement</th>
                        <th className="p-3 text-left text-cyan-400 font-semibold">Strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.hooks.map((hook, index) => (
                        <tr key={index} className="border-t border-slate-600">
                          <td className="p-3 font-medium">{hook.gladiator}</td>
                          <td className="p-3">
                            {hook.gladiator === 'Maximus' ? 'Landing Page / Email Headers' :
                             hook.gladiator === 'Spartacus' ? 'Social Media / Ads' :
                             'Sales Pages / CTAs'}
                          </td>
                          <td className="p-3 text-sm">
                            {hook.gladiator === 'Maximus' ? 'Strategic, System-Focused' :
                             hook.gladiator === 'Spartacus' ? 'Disruptive, Urgent' :
                             'Victory-Driven, Results'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pro Optimization Tip */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-8">
                <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Pro Optimization Strategy
                </h4>
                <div className="text-blue-100 space-y-2 text-sm">
                  <p><strong>Maximus:</strong> Deploy for structured, high-intent traffic seeking systems and frameworks</p>
                  <p><strong>Spartacus:</strong> Use to break attention patterns on cold audiences and create urgency</p>
                  <p><strong>Leonidas:</strong> Perfect for results-focused segments ready to take action</p>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="text-center">
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-8 py-3 text-lg font-semibold">
                  🔓 Unlock Live A/B Tracking in Pro Tier
                </Button>
              </div>
            </div>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>A/B Test & Optimization Center</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Generate hooks first to see your personalized A/B testing strategy.
                </p>
                <p className="text-slate-400 text-sm">
                  The optimization center will display custom recommendations based on your generated gladiator hooks.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}