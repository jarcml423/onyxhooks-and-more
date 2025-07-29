import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Zap, 
  Crown, 
  Shield, 
  Sparkles,
  BookOpen,
  Target,
  Rocket,
  Lock,
  ArrowRight,
  Swords,
  Mail,
  Users
} from "lucide-react";

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  requiredTier: 'free' | 'starter' | 'pro' | 'vault';
  badge?: string;
  tooltipCTA?: string;
  popupCTA?: {
    title: string;
    content: string;
  };
}

interface TierNavigationProps {
  currentTier: 'free' | 'starter' | 'pro' | 'vault';
}

const navigationItems: NavigationItem[] = [
  // FREE TIER
  {
    path: "/",
    label: "Dashboard",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Overview and getting started",
    requiredTier: 'free'
  },
  {
    path: "/quiz",
    label: "Offer Strength Quiz",
    icon: <Target className="h-4 w-4" />,
    description: "Discover your tier recommendation",
    requiredTier: 'free'
  },
  {
    path: "/free-hooks",
    label: "Free Hook Generator",
    icon: <Zap className="h-4 w-4" />,
    description: "Taste the power: 2 hooks/month to experience AI gladiator council",
    requiredTier: 'free',
    badge: "2/month"
  },

  // STARTER TIER
  {
    path: "/starter-hooks",
    label: "Starter Hook Generator", 
    icon: <Rocket className="h-4 w-4" />,
    description: "25 hooks/month + A/B variations. Scales your content creation.",
    requiredTier: 'starter',
    badge: "25/month"
  },
  {
    path: "/offer-generator",
    label: "OnyxHooks Framework",
    icon: <Shield className="h-4 w-4" />,
    description: "Complete offer structure generation", 
    requiredTier: 'starter'
  },

  // PRO TIER
  {
    path: "/pro-hooks",
    label: "Pro Hook Generator",
    icon: <Crown className="h-4 w-4" />,
    description: "UNLIMITED hooks + advanced Council analysis. Freedom to execute.",
    requiredTier: 'pro'
  },
  {
    path: "/pro-tools",
    label: "Pro Tools Suite",
    icon: <Sparkles className="h-4 w-4" />,
    description: "5 monetization tools + Battle Lab",
    requiredTier: 'pro',
    badge: "5 Tools"
  },
  {
    path: "/coaching",
    label: "Live Coaching System",
    icon: <Target className="h-4 w-4" />,
    description: "Real-time feedback + validation",
    requiredTier: 'pro'
  },

  // VAULT TIER
  {
    path: "/vault-hooks",
    label: "Vault Hook Generator",
    icon: <Crown className="h-4 w-4" />,
    description: "6 Elite Gladiators + Neural Mapping",
    requiredTier: 'vault',
    tooltipCTA: "Unlock all 6 Gladiators — Neural Mapping and elite-level persuasion unlocked at Vault tier.",
    popupCTA: {
      title: "🔐 Vault Hook Generator",
      content: "Maximus and Spartacus got you this far.\nNow it's time to unleash the entire Council.\n⚔️ Vault gives you access to advanced neural logic and 6 elite personalities built to convert at scale."
    }
  },
  {
    path: "/swipe-copy",
    label: "Swipe Copy Bank",
    icon: <BookOpen className="h-4 w-4" />,
    description: "200+ battle-tested templates ($50K+ value)",
    requiredTier: 'vault',
    badge: "$50K+ Value",
    tooltipCTA: "$50K+ of battle-tested copy — 200+ templates used in 7-figure launches.",
    popupCTA: {
      title: "🔐 Swipe Copy Bank",
      content: "No need to reinvent the wheel.\nVault gives you a swipe bank of top-converting headlines, CTAs, emails, and hooks — proven in the field, filterable by industry, trigger, and ROI."
    }
  },
  {
    path: "/elite-coaching",
    label: "Elite Coaching",
    icon: <Users className="h-4 w-4" />,
    description: "Platinum qualification + ROI calculator",
    requiredTier: 'vault',
    tooltipCTA: "Work directly with elite advisors to qualify for Platinum. Unlock the ROI Calculator.",
    popupCTA: {
      title: "🔐 Elite Coaching",
      content: "You're building real offers — now let's make sure they scale.\nVault Coaching gives you ROI modeling, elite strategy feedback, and Platinum-tier insight into your next big move."
    }
  },
  {
    path: "/email-templates",
    label: "Email Command Center",
    icon: <Mail className="h-4 w-4" />,
    description: "Elite campaign deployment system",
    requiredTier: 'vault',
    tooltipCTA: "Elite campaign deployment system. Designed for Vault-level outreach.",
    popupCTA: {
      title: "🔐 Email Command Center",
      content: "You've crafted high-converting copy.\nNow command your campaign from the Vault:\n\nTrigger-based sequences\n\nWarm-to-hot nurturing paths\n\nAuthority positioning in every inbox."
    }
  }
];

const tierConfig = {
  free: {
    name: "Free",
    color: "text-slate-400",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/20",
    icon: <Shield className="h-4 w-4" />
  },
  starter: {
    name: "Starter",
    color: "text-blue-400", 
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    icon: <Rocket className="h-4 w-4" />
  },
  pro: {
    name: "Pro",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10", 
    borderColor: "border-purple-500/20",
    icon: <Crown className="h-4 w-4" />
  },
  vault: {
    name: "Vault",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20", 
    icon: <Sparkles className="h-4 w-4" />
  }
};

function canAccessItem(userTier: string, requiredTier: string): boolean {
  const tierOrder = ['free', 'starter', 'pro', 'vault'];
  const userIndex = tierOrder.indexOf(userTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  return userIndex >= requiredIndex;
}

export function TierNavigation({ currentTier }: TierNavigationProps) {
  const [location] = useLocation();
  const config = tierConfig[currentTier];
  
  const accessibleItems = navigationItems.filter(item => 
    canAccessItem(currentTier, item.requiredTier)
  );
  
  const lockedItems = navigationItems.filter(item => 
    !canAccessItem(currentTier, item.requiredTier)
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Current Tier Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
            {config.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {config.name} Tier Navigation
            </h2>
            <p className="text-slate-400">
              Access your available tools and features
            </p>
          </div>
          <Badge variant="secondary" className={`${config.bgColor} ${config.color} ${config.borderColor}`}>
            Current Plan
          </Badge>
        </div>
      </div>

      {/* Available Features */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-400" />
          Available Features ({accessibleItems.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessibleItems.map((item, index) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`
                  p-4 rounded-xl border transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-purple-500/20 border-purple-500/40 shadow-lg shadow-purple-500/20' 
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/80 hover:border-slate-600'
                  }
                `}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-purple-500/20' : 'bg-slate-700/50'}`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">
                          {item.label}
                        </h4>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs mt-1 bg-green-500/10 text-green-400 border-green-500/20">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <div className="p-1 rounded-full bg-purple-500/20">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Locked Features (Upgrade Opportunities) */}
      {lockedItems.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-400" />
            Upgrade to Unlock ({lockedItems.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedItems.map((item) => {
              const requiredConfig = tierConfig[item.requiredTier];
              return (
                <div key={item.path} className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/50 relative overflow-hidden">
                  {/* Locked Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-[1px]" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-700/30">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-300 text-sm">
                            {item.label}
                          </h4>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs mt-1 bg-slate-600/20 text-slate-400 border-slate-600/20">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Lock className="h-4 w-4 text-orange-400" />
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed mb-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className={`text-xs ${requiredConfig.bgColor} ${requiredConfig.color} ${requiredConfig.borderColor}`}>
                        Requires {requiredConfig.name}
                      </Badge>
                      {item.tooltipCTA && item.popupCTA ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" className="text-xs h-7 px-3 hover:bg-purple-500/20 border-purple-400/30">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Unlock
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs bg-slate-900 border-purple-500/30">
                                <p className="text-sm text-white">{item.tooltipCTA}</p>
                              </TooltipContent>
                            </Tooltip>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md bg-slate-900 border-purple-500/30">
                            <DialogHeader>
                              <DialogTitle className="text-lg font-bold text-purple-300">
                                {item.popupCTA.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                {item.popupCTA.content}
                              </p>
                              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                Upgrade to Vault - $5,000/year
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button size="sm" variant="outline" className="text-xs h-7 px-3">
                          {currentTier === 'free' ? 'Get Starter' : 'Upgrade'}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}