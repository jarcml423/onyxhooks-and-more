import { TierNavigation } from "@/components/TierNavigation";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NavigationPage() {
  const [currentTier, setCurrentTier] = useState<'free' | 'starter' | 'pro' | 'vault'>('free');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Navigation Center
                </h1>
                <p className="text-slate-400 text-sm">
                  Explore features available for each tier
                </p>
              </div>
            </div>
            
            {/* Tier Switcher for Demo */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">Demo Tier:</span>
              <select 
                value={currentTier}
                onChange={(e) => setCurrentTier(e.target.value as 'free' | 'starter' | 'pro' | 'vault')}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm"
              >
                <option value="free">Free</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="vault">Vault</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Content */}
      <TierNavigation currentTier={currentTier} />
    </div>
  );
}