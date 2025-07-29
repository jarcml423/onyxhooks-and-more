import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import VisualTemplateCard from "./VisualTemplateCard";
import VisualTemplateGenerator from "./VisualTemplateGenerator";
import { correctedFitnessTemplates, getFitnessTemplatesByTier } from "@/data/corrected-fitness-templates";
import CampaignCorrections from "./CampaignCorrections";
import { 
  Zap, 
  Crown, 
  TrendingUp, 
  Target, 
  Lock,
  Sparkles,
  ChevronRight,
  Clock,
  Users,
  HelpCircle
} from "lucide-react";

interface StarterUser {
  usageCount: number;
  templatesUsed: number;
  lastActive: string;
}

// Enhanced visual templates with embedded text generation
const visualTemplateGenerators = [
  {
    id: "starter-fitness-visual",
    title: "Fitness Transformation Visual",
    industry: "fitness",
    tone: "motivational",
    hook: "Transform Your Body in 90 Days — Without Extreme Diets",
    body: "Sarah lost 32 pounds using this simple 15-minute daily routine. No gym required, no meal prep, just proven results.",
    cta: "See How She Did It",
    backgroundImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    metrics: {
      conversionRate: "23.4",
      ctrLift: "156",
      cpa: "12.50",
      roas: "4.2"
    },
    tier: "starter" as const
  },
  {
    id: "starter-business-visual",
    title: "Business Coaching Visual",
    industry: "business",
    tone: "authoritative", 
    hook: "Scale to $10K/Month in 120 Days — The Exact Blueprint",
    body: "Marcus went from $2K to $10K monthly revenue using this 3-step system. No paid ads, no complex funnels.",
    cta: "Get My Blueprint",
    backgroundImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
    metrics: {
      conversionRate: "18.7",
      ctrLift: "89",
      cpa: "45.00",
      roas: "6.8"
    },
    tier: "starter" as const
  }
];

const starterTemplates = [
  {
    id: "starter-fitness-1",
    title: "30-Day Body Transform Hook",
    category: "fitness" as const,
    hook: "The 1 weird mistake keeping you from your dream body (and how Sarah lost 23 lbs fixing it)",
    bodyCopy: "Sarah tried everything - keto, CrossFit, meal prep. Nothing worked until she discovered this overlooked factor. Now she's in the best shape of her life.",
    cta: "See Sarah's Method",
    metrics: { conversionRate: 12.4, ctrLift: 187, avgCpa: 23, roas: 4.2 },
    tier: "starter" as const
  },
  {
    id: "starter-business-1", 
    title: "Coach Authority Builder",
    category: "business" as const,
    hook: "How I went from unknown coach to 6-figure authority in 90 days (without paid ads)",
    bodyCopy: "Most coaches struggle for years to build credibility. Here's the exact system I used to become the go-to expert in my niche.",
    cta: "Get The Blueprint",
    metrics: { conversionRate: 9.8, ctrLift: 156, avgCpa: 31, roas: 3.8 },
    tier: "starter" as const
  },
  {
    id: "starter-yoga-1",
    title: "Inner Peace Flow Offer",
    category: "yoga" as const, 
    hook: "The 5-minute morning ritual that ended my anxiety (without meditation apps)",
    bodyCopy: "After 15 years of panic attacks, I discovered this simple practice. Now I wake up calm and centered every single day.",
    cta: "Try It Free",
    metrics: { conversionRate: 15.2, ctrLift: 203, avgCpa: 18, roas: 5.1 },
    tier: "starter" as const
  }
];

const vaultPreviewTemplates = [
  {
    id: "vault-preview-1",
    title: "Million Dollar Sales Script",
    category: "business" as const,
    hook: "The exact script that generated $1.2M in 30 days",
    bodyCopy: "This is the word-for-word framework Fortune 500 companies pay $50K to access.",
    cta: "Unlock The Script",
    metrics: { conversionRate: 24.7, ctrLift: 312, avgCpa: 12, roas: 8.4 },
    tier: "vault" as const,
    isLocked: true
  },
  {
    id: "vault-preview-2", 
    title: "Elite Authority Positioning",
    category: "coaching" as const,
    hook: "How to become the only choice in your market",
    bodyCopy: "The psychological positioning strategy that makes prospects feel like working with anyone else is settling.",
    cta: "Claim Your Position", 
    metrics: { conversionRate: 31.2, ctrLift: 445, avgCpa: 8, roas: 12.3 },
    tier: "vault" as const,
    isLocked: true
  }
];

export default function StarterTierDashboard({ user }: { user: StarterUser }) {
  const [activeTab, setActiveTab] = useState<"templates" | "analyzer">("templates");
  const usagePercentage = (user.usageCount / 4) * 100; // 4 weekly analyzer uses
  const upgradeOpportunity = user.templatesUsed >= 3 || user.usageCount >= 3;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Zap className="w-3 h-3 mr-1" />
            Starter
          </Badge>
          <Badge variant="outline" className="text-gray-300 border-gray-600">
            $47/month
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-white">
          Your offer optimization command center is ready.
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Every template here converts 2-5x better than industry average. Which transformation will you create today?
        </p>
      </div>

      {/* Usage Tracking */}
      <Card className="cinematic-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Weekly Usage</h3>
              <p className="text-sm text-gray-400">Resets every Monday</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">{user.usageCount}/4</div>
              <div className="text-xs text-gray-400">Analyzer uses</div>
            </div>
          </div>
          <Progress 
            value={usagePercentage} 
            className="mb-4"
            style={{
              background: 'rgba(75, 85, 99, 0.3)'
            }}
          />
          {upgradeOpportunity && (
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
              <div>
                <p className="text-sm font-medium text-purple-300">You're using Starter like a pro</p>
                <p className="text-xs text-gray-400">Unlock unlimited access + AI that learns your style</p>
              </div>
              <Link href="/subscribe">
                <Button size="sm" className="shine-button">
                  Upgrade
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cinematic-card group hover:scale-105 transition-transform">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Sharpen My Copy</h3>
            <p className="text-xs text-gray-400 mb-3">Make your hooks and CTAs convert better</p>
            <Button size="sm" variant="outline" className="w-full border-blue-500/30 text-blue-300">
              Analyze Now
            </Button>
          </CardContent>
        </Card>

        <Card className="cinematic-card group hover:scale-105 transition-transform">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Weekly Drop</h3>
            <p className="text-xs text-gray-400 mb-3">Fresh templates + breakdowns</p>
            <Button size="sm" variant="outline" className="w-full border-purple-500/30 text-purple-300">
              View Latest
            </Button>
          </CardContent>
        </Card>

        <Card className="cinematic-card group hover:scale-105 transition-transform">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Vault Feed</h3>
            <p className="text-xs text-gray-400 mb-3">Read-only community insights</p>
            <Button size="sm" variant="outline" className="w-full border-green-500/30 text-green-300">
              Browse Feed
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Target Market Alert */}
      <CampaignCorrections
        originalCopy={{
          hook: "The hidden neurological pattern that separates $100K executives...",
          body: "You've achieved significant success through discipline and intelligence...",
          authority: "47 C-suite executives... Goldman Sachs, McKinsey, Tesla..."
        }}
        correctedCopy={{
          hook: "What if losing 4 inches off your waist didn't require more workouts — just this one pattern shift?",
          body: "You've tried the workouts, the meal plans, the cardio. But that belly fat? Still there. Still stuck. What if the problem isn't your effort — it's your metabolism's operating system?",
          authority: "Over 1,200 women over 40 — from busy moms to business owners — finally saw results they could feel and see."
        }}
        onApplyCorrection={() => window.location.reload()}
      />

      {/* Corrected Fitness Templates */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-green-400" />
            Target-Aligned Templates
          </h2>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Women 40+ Focused
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {getFitnessTemplatesByTier('starter').map((template) => (
            <VisualTemplateGenerator key={template.id} {...template} />
          ))}
        </div>
      </div>

      {/* Original Templates (Needs Review) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-300 flex items-center gap-2">
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
              Needs Review
            </Badge>
            Original Templates
          </h2>
          <Badge variant="outline" className="text-gray-400 border-gray-500/30">
            Target Misalignment
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {visualTemplateGenerators.slice(0, 2).map((template) => (
            <VisualTemplateGenerator key={template.id} {...template} />
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/20">
          <div className="text-sm text-green-400 font-medium mb-1">Ready-to-Deploy Assets</div>
          <div className="text-xs text-gray-300">Click any template above to preview full deployment-ready marketing asset with embedded text and performance metrics</div>
        </div>
      </div>

      {/* Traditional Templates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Copy Templates</h2>
          <Badge variant="outline" className="text-purple-300 border-purple-500/30">
            10 Hand-Picked Templates
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {starterTemplates.map((template) => (
            <VisualTemplateCard key={template.id} {...template} />
          ))}
        </div>
      </div>

      {/* Vault Preview Section */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Want 2X More Results?
          </h2>
          <p className="text-gray-300">
            Unlock the full Analyzer + Vault Templates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vaultPreviewTemplates.map((template) => (
            <VisualTemplateCard key={template.id} {...template} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/subscribe">
            <Button className="shine-button">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Vault Elite
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Upgrade Trigger Cards */}
      {user.templatesUsed >= 2 && (
        <Card className="cinematic-card border-2 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              You're Ready for What's Next
            </h3>
            <p className="text-gray-300 mb-4">
              You've used {user.templatesUsed} templates. Vault Elite users get unlimited access plus AI that learns your brand voice.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
              <div className="space-y-1">
                <TrendingUp className="w-5 h-5 text-green-400 mx-auto" />
                <div className="text-green-400 font-semibold">Unlimited Templates</div>
              </div>
              <div className="space-y-1">
                <Target className="w-5 h-5 text-blue-400 mx-auto" />
                <div className="text-blue-400 font-semibold">AI That Learns You</div>
              </div>
              <div className="space-y-1">
                <Clock className="w-5 h-5 text-purple-400 mx-auto" />
                <div className="text-purple-400 font-semibold">Real-Time Analyzer</div>
              </div>
            </div>
            <Link href="/subscribe">
              <Button className="shine-button">
                Unlock Vault Elite - $197/month
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Help & FAQ Section */}
      <Card className="cinematic-card border border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Need Help?</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Get answers to common questions or contact our support team.
          </p>
          <div className="flex gap-3">
            <Link href="/faq">
              <Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-500/10">
                <HelpCircle className="h-4 w-4 mr-2" />
                View FAQ
              </Button>
            </Link>
            <a href="mailto:support@onyxnpearls.com">
              <Button variant="outline" size="sm" className="border-gray-400 text-gray-400 hover:bg-gray-500/10">
                Contact Support
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}