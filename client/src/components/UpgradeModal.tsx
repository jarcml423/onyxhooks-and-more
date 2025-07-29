import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Crown, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'limit_reached' | 'near_limit' | 'strategic_upgrade';
  currentTier: 'free' | 'starter' | 'pro' | 'vault';
  usageData?: {
    used: number;
    limit: number;
  };
}

const UPGRADE_SCENARIOS = {
  free_limit: {
    title: "🚀 You've Discovered the Power",
    subtitle: "Ready to scale with Starter?",
    problem: "You've used all 2 free hooks and experienced the AI gladiator council.",
    solution: "Get 25 hooks/month + editing + export with Starter tier.",
    price: "$47/month",
    features: [
      "25 hooks per month (12.5x more)",
      "A/B hook variations",
      "Full editing capabilities", 
      "PDF & clipboard export",
      "Remove watermarks",
      "3-gladiator council analysis"
    ],
    urgency: "Join 2,000+ creators scaling their content"
  },
  starter_limit: {
    title: "🎯 Time to Break Through",
    subtitle: "Unlock unlimited hook generation",
    problem: "You've hit your 25-hook limit. You're ready for unlimited freedom.",
    solution: "Pro tier removes all limits and adds advanced analysis tools.",
    price: "$197/month", 
    features: [
      "UNLIMITED hook generation",
      "Advanced Council analysis",
      "5 Pro Tools suite",
      "Battle Lab A/B testing",
      "Psychological trigger analysis",
      "Priority support"
    ],
    urgency: "Stop hitting limits. Start executing freely."
  },
  starter_near: {
    title: "⚡ Almost Out of Hooks",
    subtitle: "Upgrade before you hit the wall",
    problem: "You're using hooks fast—a sign you're scaling. Don't let limits slow you down.",
    solution: "Pro gives unlimited generation + advanced tools to optimize your hooks.",
    price: "$197/month",
    features: [
      "UNLIMITED hook generation",
      "Never worry about limits again",
      "Advanced Council feedback",
      "Pro Tools for optimization",
      "Real-time psychological analysis"
    ],
    urgency: "Upgrade now and keep your momentum"
  }
};

export default function UpgradeModal({ isOpen, onClose, trigger, currentTier, usageData }: UpgradeModalProps) {
  const getScenario = () => {
    if (currentTier === 'free') return UPGRADE_SCENARIOS.free_limit;
    if (currentTier === 'starter' && trigger === 'limit_reached') return UPGRADE_SCENARIOS.starter_limit;
    if (currentTier === 'starter' && trigger === 'near_limit') return UPGRADE_SCENARIOS.starter_near;
    return UPGRADE_SCENARIOS.starter_limit; // fallback
  };

  const scenario = getScenario();
  const nextTier = currentTier === 'free' ? 'starter' : 'pro';

  if (currentTier === 'pro' || currentTier === 'vault') {
    return null; // No upgrades needed for these tiers
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-slate-900 to-slate-800 border-purple-500/30">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            {scenario.title}
          </DialogTitle>
          <p className="text-lg text-slate-300 mt-2">
            {scenario.subtitle}
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Usage Stats */}
          {usageData && (
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Current Usage</span>
                <Badge variant="outline" className="border-red-400 text-red-400">
                  {usageData.used}/{usageData.limit} Used
                </Badge>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                  style={{ width: `${Math.min((usageData.used / usageData.limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Problem Statement */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <p className="text-slate-300 text-sm leading-relaxed">
                {scenario.problem}
              </p>
            </div>
          </div>

          {/* Solution */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white">
                {scenario.price}
              </div>
              <p className="text-purple-300">
                {scenario.solution}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-2">
              {scenario.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency Message */}
          <div className="text-center">
            <p className="text-sm text-slate-400 italic">
              {scenario.urgency}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link href="/pricing">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
                onClick={onClose}
              >
                {nextTier === 'starter' ? (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Upgrade to Starter - $47/month
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to Pro - $197/month
                  </>
                )}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              className="w-full text-slate-400 hover:text-slate-300"
              onClick={onClose}
            >
              Continue with {currentTier === 'free' ? 'Free' : 'Current'} plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}