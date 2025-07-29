import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Sword, Shield, Crown, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { HookUsageTracker } from "./HookUsageTracker";

interface FreeHookResponse {
  hooks: Array<{
    gladiator: 'Maximus' | 'Spartacus';
    hook: string;
    critique: string;
  }>;
  gladiatorClash: {
    maximusCritique: string;
    spartacusCritique: string;
  };
  upgradeTeaser: string;
  hooksRemaining: number;
  nextReset: string;
}

export function FreeHookGenerator() {
  const [formData, setFormData] = useState({
    industry: "",
    targetAudience: "",
    painPoint: "",
    desiredOutcome: ""
  });
  
  const [result, setResult] = useState<FreeHookResponse | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const generateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log("Sending data:", data);
      const response = await apiRequest("POST", "/api/free-hooks/generate", data);
      
      // Check if it's a 429 (rate limit) error
      if (response.status === 429) {
        const errorData = await response.json();
        throw new Error(`LIMIT_REACHED:${errorData.error}`);
      }
      
      const result = await response.json();
      console.log("Received result:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("Setting result:", data);
      setResult(data);
    },
    onError: (error) => {
      console.error("Generation error:", error);
      
      const errorMessage = error?.message || error?.toString() || "";
      
      // Check if it's a limit reached error
      if (errorMessage.includes("LIMIT_REACHED") || errorMessage.includes("Monthly hook limit")) {
        toast({
          title: "🎯 Monthly Limit Reached!",
          description: "Upgrade to Starter for unlimited hooks at just $47/month",
          variant: "default"
        });
        return;
      }
      
      // Default error message for other types of errors
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
        description: "Please fill in all fields to generate hooks.",
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Sword className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Free Tier Gladiator Council
          </h1>
          <Shield className="h-8 w-8 text-purple-500" />
        </div>
        <p className="text-slate-200 text-lg">
          Get 2 powerful marketing hooks monthly from Maximus & Spartacus
        </p>
      </div>

      {/* Hook Usage Tracker */}
      <HookUsageTracker 
        currentUsage={{
          used: result ? (2 - result.hooksRemaining) : 0,
          limit: 2,
          tier: 'free',
          resetDate: result?.nextReset
        }}
      />

      {/* Input Form */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Hook Intelligence Input
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

            <Button 
              type="submit" 
              disabled={generateMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {generateMutation.isPending ? "Gladiators Strategizing..." : "Generate Hooks"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Debug Info */}
      {generateMutation.isPending && (
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardContent className="pt-6">
            <p className="text-center text-blue-400">Gladiators are forging your hooks...</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && result.hooks && (
        <div className="space-y-6">
          {/* Gladiator Hooks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.hooks.map((hook, index) => (
              <Card key={index} className={`${
                hook.gladiator === 'Maximus' 
                  ? 'bg-blue-900/20 border-blue-500/30' 
                  : 'bg-red-900/20 border-red-500/30'
              }`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${
                    hook.gladiator === 'Maximus' ? 'text-blue-400' : 'text-red-400'
                  }`}>
                    {hook.gladiator === 'Maximus' ? (
                      <>
                        <Shield className="h-5 w-5" />
                        🧠 Maximus (Strategist)
                      </>
                    ) : (
                      <>
                        <Sword className="h-5 w-5" />
                        🗡️ Spartacus (Disruptor)
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                    <p className="text-lg font-medium text-white">"{hook.hook}"</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300 italic">
                      {hook.critique}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(hook.hook)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gladiator Clash */}
          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                ⚔️ Gladiator Clash
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  Maximus
                </Badge>
                <p className="text-sm text-white">"{result.gladiatorClash.maximusCritique}"</p>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                  Spartacus
                </Badge>
                <p className="text-sm text-white">"{result.gladiatorClash.spartacusCritique}"</p>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Teaser */}
          <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Crown className="h-8 w-8 text-yellow-500 mx-auto" />
                <p className="text-yellow-200">{result.upgradeTeaser}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-300">
                  <span>Hooks remaining: {result.hooksRemaining}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Resets: {result.nextReset}</span>
                </div>
                <Link href="/subscribe?plan=starter">
                  <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 w-full">
                    Upgrade to STARTER
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}