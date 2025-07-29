import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, RefreshCw, Zap, TrendingUp, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateMetrics {
  conversionRate: number;
  ctrLift: number;
  avgCpa: number;
  roas: number;
}

interface VisualTemplateProps {
  id: string;
  title: string;
  category: "fitness" | "business" | "yoga" | "coaching";
  hook: string;
  bodyCopy: string;
  cta: string;
  metrics: TemplateMetrics;
  backgroundImage?: string;
  tier: "starter" | "vault" | "platinum";
  isLocked?: boolean;
}

const getIndustryBackground = (category: string): string => {
  const backgrounds = {
    fitness: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    business: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop", 
    yoga: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    coaching: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
  };
  return backgrounds[category] || backgrounds.business;
};

const getTierStyle = (tier: string) => {
  switch(tier) {
    case "starter":
      return {
        theme: "from-slate-700 to-slate-900",
        accent: "text-blue-400",
        border: "border-blue-500/20"
      };
    case "vault": 
      return {
        theme: "from-purple-900 to-indigo-900",
        accent: "text-purple-300",
        border: "border-purple-500/30"
      };
    case "platinum":
      return {
        theme: "from-yellow-600 to-amber-800",
        accent: "text-yellow-200", 
        border: "border-yellow-500/40"
      };
    default:
      return {
        theme: "from-slate-700 to-slate-900",
        accent: "text-blue-400",
        border: "border-blue-500/20"
      };
  }
};

export default function VisualTemplateCard({ 
  id, title, category, hook, bodyCopy, cta, metrics, tier, isLocked = false 
}: VisualTemplateProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const tierStyle = getTierStyle(tier);
  const backgroundImage = getIndustryBackground(category);

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    
    // Track usage for upgrade triggers
    fetch('/api/starter/track-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: id, action: 'copy' })
    });
    
    toast({
      title: "Conversion-Tested Copy Ready",
      description: `${type} (${metrics.conversionRate}% CVR) copied to clipboard`,
    });
  };

  const handleMakeItMine = () => {
    // Track usage for upgrade triggers
    fetch('/api/starter/track-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: id, action: 'use' })
    });
    
    toast({
      title: "High-Converting Template Activated",
      description: `${title} is now optimizing your offer. Average conversion lift: ${metrics.ctrLift}%`,
    });
  };

  const handleGenerateVariation = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "New Variation Generated",
        description: "Your template has been refreshed with new copy",
      });
    }, 2000);
  };

  if (isLocked) {
    return (
      <Card className={`overflow-hidden ${tierStyle.border} relative group hover:scale-[1.02] transition-all duration-300`}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60 z-10 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Upgrade to Unlock</h3>
              <p className="text-gray-300 text-sm mb-4">This high-converting template is available in {tier === "vault" ? "Vault Elite" : "Platinum"}</p>
              <Button className="shine-button">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
        <div 
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${tierStyle.border} bg-gradient-to-br ${tierStyle.theme} group hover:scale-[1.02] transition-all duration-300`}>
      {/* Metrics Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-white">{title}</h3>
          <Badge variant="secondary" className={`${tierStyle.accent} bg-white/10`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        </div>
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="text-center">
            <div className="text-green-400 font-bold">{metrics.conversionRate}%</div>
            <div className="text-gray-400">CVR</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-bold">{metrics.ctrLift}%</div>
            <div className="text-gray-400">CTR Lift</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-bold">${metrics.avgCpa}</div>
            <div className="text-gray-400">Avg CPA</div>
          </div>
          <div className="text-center">
            <div className="text-orange-400 font-bold">{metrics.roas}x</div>
            <div className="text-gray-400">ROAS</div>
          </div>
        </div>
      </div>

      {/* Visual Template with Embedded Text */}
      <div 
        className="h-80 bg-cover bg-center relative group-hover:scale-105 transition-transform duration-500"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Embedded Text Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
          {/* Hook */}
          <div className="mb-4">
            <div className="text-yellow-400 text-sm font-semibold mb-1">🌟 HOOK</div>
            <h2 
              className="text-2xl font-bold leading-tight mb-3" 
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
            >
              {hook}
            </h2>
          </div>

          {/* Body Copy */}
          <div className="mb-4">
            <div className="text-blue-400 text-sm font-semibold mb-1">🧠 BODY COPY</div>
            <p 
              className="text-gray-100 leading-relaxed mb-3" 
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              {bodyCopy}
            </p>
          </div>

          {/* CTA */}
          <div>
            <div className="text-green-400 text-sm font-semibold mb-2">✅ CALL TO ACTION</div>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-bold px-6 py-2 shadow-lg"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {cta}
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-2">
          <Button 
            onClick={handleMakeItMine}
            className="flex-1 shine-button"
          >
            <Target className="w-4 h-4 mr-2" />
            Make This Mine
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateVariation}
            disabled={isGenerating}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex gap-2 text-xs">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleCopy(hook, "Hook")}
            className="flex-1 text-gray-400 hover:text-white"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy Hook
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleCopy(`${hook}\n\n${bodyCopy}\n\n${cta}`, "Full Template")}
            className="flex-1 text-gray-400 hover:text-white"
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>

        {/* Psychological Trigger Tag */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Trigger:</span>
            <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
              Pattern Interrupt + Urgency
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}