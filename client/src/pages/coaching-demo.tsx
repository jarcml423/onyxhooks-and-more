import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertCircle, XCircle, Lightbulb, Crown, Star, Shield, Zap, Users, Target, TrendingUp, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import VaultForgeSupreme, { VaultSupremePanel, VaultSupremeButton } from "@/components/VaultForgeSupreme";

interface CoachingFeedback {
  score: number;
  feedback: string;
  level: 'weak' | 'good' | 'strong';
  suggestions?: string[];
}

interface WeeklySummary {
  coachName: string;
  hooksGenerated: number;
  offersGenerated: number;
  councilSessions: number;
  transformation: string;
  encouragement: string;
  nextSteps: string[];
}

export default function CoachingDemo() {
  const [transformation, setTransformation] = useState('');
  const [description, setDescription] = useState('');
  const [hook, setHook] = useState('');
  const [industry, setIndustry] = useState('');
  const [coachType, setCoachType] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [offerArchitecture, setOfferArchitecture] = useState('');
  
  const [transformationFeedback, setTransformationFeedback] = useState<CoachingFeedback | null>(null);
  const [descriptionFeedback, setDescriptionFeedback] = useState<CoachingFeedback | null>(null);
  const [liveScore, setLiveScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [currentTier, setCurrentTier] = useState<'free' | 'starter' | 'pro' | 'vault'>('pro');
  
  const { toast } = useToast();

  // Calculate comprehensive live score including architecture
  const calculateLiveScore = () => {
    let totalScore = 0;
    let fieldCount = 0;
    
    // Score transformation
    if (transformation.length > 5) {
      const transformationScore = getLocalTransformationScore(transformation);
      totalScore += transformationScore.score;
      fieldCount++;
    }
    
    // Score architecture with bonus points
    if (offerArchitecture.length > 20) {
      const architectureScore = scoreOfferArchitecture(offerArchitecture);
      totalScore += architectureScore;
      fieldCount++;
    }
    
    // Score other fields with basic scoring
    if (description.length > 10) {
      totalScore += Math.min(description.length * 2, 70);
      fieldCount++;
    }
    
    const avgScore = fieldCount > 0 ? Math.round(totalScore / fieldCount) : null;
    setLiveScore(avgScore);
  };

  // Architecture scoring function
  const scoreOfferArchitecture = (architecture: string): number => {
    const words = architecture.toLowerCase().split(/\s+/);
    let score = 50; // Base score for having architecture
    
    const structureWords = ['week', 'weeks', 'module', 'session', 'phase', 'step'];
    const deliveryWords = ['coaching', 'calls', 'sessions', 'support', 'access', 'community'];
    const valueWords = ['templates', 'tools', 'workbook', 'bonus', 'exclusive', 'custom'];
    
    if (structureWords.some(word => words.includes(word))) score += 20;
    if (deliveryWords.some(word => words.includes(word))) score += 15;
    if (valueWords.some(word => words.includes(word))) score += 15;
    
    return Math.min(score, 100);
  };

  // Real-time coaching feedback for transformation field
  useEffect(() => {
    if (transformation.length > 5) {
      const timer = setTimeout(() => {
        const feedback = getLocalTransformationScore(transformation);
        setTransformationFeedback(feedback);
        calculateLiveScore(); // Update live score when transformation changes
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setTransformationFeedback(null);
      setLiveScore(null); // Reset to no score
    }
  }, [transformation, currentTier]);

  // Update live score when architecture changes
  useEffect(() => {
    if (offerArchitecture.length > 0) {
      const timer = setTimeout(calculateLiveScore, 300);
      return () => clearTimeout(timer);
    }
  }, [offerArchitecture, description]);

  // Switch tier for demo (no authentication required)
  const switchTier = (newTier: 'free' | 'starter' | 'pro' | 'vault') => {
    setCurrentTier(newTier);
    // Force re-evaluation of current transformation with new tier
    if (transformation.length > 0) {
      setTimeout(() => {
        const newFeedback = getLocalTransformationScore(transformation);
        setTransformationFeedback(newFeedback);
      }, 100);
    }
    toast({
      title: "Tier Switched",
      description: `Now experiencing ${newTier.toUpperCase()} tier coaching`,
    });
  };

  const getTierIcon = (tier: 'free' | 'starter' | 'pro' | 'vault') => {
    switch (tier) {
      case 'free': return <Shield className="h-4 w-4" />;
      case 'starter': return <Zap className="h-4 w-4" />;
      case 'pro': return <Star className="h-4 w-4" />;
      case 'vault': return <Crown className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: 'free' | 'starter' | 'pro' | 'vault') => {
    switch (tier) {
      case 'free': return 'text-gray-600';
      case 'starter': return 'text-blue-600';
      case 'pro': return 'text-purple-600';
      case 'vault': return 'text-yellow-600';
    }
  };

  // Get tier-specific feedback variations
  const getTierSpecificFeedback = (baseScore: number, baseFeedback: string, tier: 'free' | 'starter' | 'pro' | 'vault'): CoachingFeedback => {
    const suggestions: string[] = [];
    
    switch (tier) {
      case 'free':
        if (baseScore < 50) {
          suggestions.push("Try being more specific about the outcome");
          suggestions.push("Add a number or timeframe");
        }
        return {
          score: Math.min(baseScore, 70), // Free tier caps at 70
          feedback: baseFeedback,
          level: baseScore < 40 ? 'weak' : baseScore < 60 ? 'good' : 'strong',
          suggestions
        };
        
      case 'starter':
        if (baseScore < 60) {
          suggestions.push("Use action words: 'generate', 'build', 'achieve'");
          suggestions.push("Include measurable outcomes");
          suggestions.push("Consider the emotional transformation");
        }
        return {
          score: baseScore,
          feedback: `${baseFeedback} Starter insight: Focus on clear value delivery.`,
          level: baseScore < 40 ? 'weak' : baseScore < 70 ? 'good' : 'strong',
          suggestions
        };
        
      case 'pro':
        if (baseScore < 70) {
          suggestions.push("Apply the Value Equation: Dream Outcome ÷ (Time × Effort)");
          suggestions.push("Add urgency or scarcity elements");
          suggestions.push("Consider the before-and-after transformation");
          suggestions.push("Test emotional vs logical appeals");
        }
        return {
          score: Math.min(baseScore + 5, 100), // Pro tier gets bonus points
          feedback: `${baseFeedback} Pro coaching: Consider psychological triggers and conversion optimization.`,
          level: (baseScore + 5) < 50 ? 'weak' : (baseScore + 5) < 75 ? 'good' : 'strong',
          suggestions
        };
        
      case 'vault':
        if (baseScore < 80) {
          suggestions.push("Neuromarketing insight: Use pattern interrupts");
          suggestions.push("Apply Cialdini's principles: Authority, Social Proof, Scarcity");
          suggestions.push("Frame as identity shift: 'Become the person who...'");
          suggestions.push("Test status-driven vs outcome-driven messaging");
          suggestions.push("Consider the customer's internal narrative");
        }
        return {
          score: Math.min(baseScore + 10, 100), // Vault tier gets significant bonus
          feedback: `${baseFeedback} Vault mastery: Leverage advanced psychological frameworks and behavioral triggers.`,
          level: (baseScore + 10) < 60 ? 'weak' : (baseScore + 10) < 80 ? 'good' : 'strong',
          suggestions
        };
    }
  };

  // Enhanced tier-based scoring function
  const getLocalTransformationScore = (text: string): CoachingFeedback => {
    const words = text.toLowerCase().split(/\s+/);
    const weakWords = ['help', 'assist', 'support', 'guide', 'coach'];
    const strongWords = ['achieve', 'generate', 'increase', 'build', 'create', 'scale'];
    const measurementWords = ['$', '%', 'days', 'weeks', 'months', 'x', 'times', 'double'];
    
    let score = 40;
    const hasWeakWords = weakWords.some(word => words.includes(word));
    const hasStrongWords = strongWords.some(word => words.includes(word));
    const hasMeasurements = measurementWords.some(word => text.toLowerCase().includes(word));
    
    let baseFeedback = "";
    let baseLevel: 'weak' | 'good' | 'strong' = 'weak';

    if (hasWeakWords && !hasStrongWords) {
      score = 35;
      baseFeedback = "Too vague. Replace 'help' with specific action words.";
      baseLevel = 'weak';
    } else if (hasStrongWords && !hasMeasurements) {
      score = 65;
      baseFeedback = "Good direction. Add specific measurements or timeframes.";
      baseLevel = 'good';
    } else if (hasStrongWords && hasMeasurements) {
      score = 85;
      baseFeedback = "Excellent! Clear transformation with measurable outcomes.";
      baseLevel = 'strong';
    } else {
      baseFeedback = "Make the outcome more specific and measurable.";
      baseLevel = 'weak';
    }
    
    // Apply tier-specific feedback enhancement
    return getTierSpecificFeedback(score, baseFeedback, currentTier);
  };

  const submitProfile = async () => {
    if (!transformation || !offerArchitecture) {
      toast({
        title: "Missing Information",
        description: "Please fill in both transformation and architecture fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate comprehensive analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate and display final score
      calculateLiveScore();
      
      toast({
        title: "Strategic Analysis Complete",
        description: `Comprehensive offer analysis finished. Score: ${liveScore || 'Calculating'}/100`,
      });
      
      // Generate demo weekly summary
      const mockSummary: WeeklySummary = {
        coachName: "Strategic Demo",
        hooksGenerated: 4,
        offersGenerated: 2,
        councilSessions: 1,
        transformation: transformation,
        encouragement: `Your ${currentTier} tier analysis shows sophisticated strategic thinking. The comprehensive architecture you've provided demonstrates elite-level offer construction.`,
        nextSteps: currentTier === 'free' 
          ? ["Generate 3 strategic hooks this week", "Build foundational offer framework"]
          : currentTier === 'starter'
          ? ["Test 2 advanced hook variations", "Refine transformation specificity with measurable outcomes"]
          : currentTier === 'pro'
          ? ["Leverage Council insights for offer optimization", "Apply Value Equation methodology", "Test psychological vs logical positioning"]
          : ["Deploy neuromarketing frameworks", "Implement identity transformation positioning", "Execute status-elevation messaging architecture"]
      };
      setWeeklySummary(mockSummary);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelIcon = (level: 'weak' | 'good' | 'strong') => {
    switch (level) {
      case 'weak': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'good': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'strong': return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getLevelColor = (level: 'weak' | 'good' | 'strong') => {
    switch (level) {
      case 'weak': return 'bg-red-500';
      case 'good': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
    }
  };

  return (
    <VaultForgeSupreme industry="coaching" showDimensionalLight={true}>
      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Elite Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Brain className="w-12 h-12" style={{ color: "var(--vault-gold-signature)" }} />
            <h1 className="text-5xl font-light tracking-wide" style={{ color: "var(--vault-text-primary)" }}>
              Real-Time Coaching Command Center
            </h1>
          </div>
          <p className="text-xl font-light" style={{ color: "var(--vault-text-secondary)" }}>
            Instant strategic feedback with AI-powered optimization insights
          </p>
        </motion.div>
        
        {/* Premium Tier Switcher */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <VaultSupremePanel glowEffect={true}>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Users className="w-5 h-5" style={{ color: "var(--vault-gold-signature)" }} />
              <h3 className="text-lg font-medium" style={{ color: "var(--vault-text-primary)" }}>
                Experience Level Configuration
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['free', 'starter', 'pro', 'vault'] as const).map((tier) => {
                const tierConfigs = {
                  free: { icon: Shield, label: 'Foundation', color: 'blue' },
                  starter: { icon: Zap, label: 'Builder', color: 'green' },
                  pro: { icon: Star, label: 'Elite', color: 'purple' },
                  vault: { icon: Crown, label: 'Vault', color: 'gold' }
                };
                const config = tierConfigs[tier];
                const Icon = config.icon;
                
                return (
                  <motion.button
                    key={tier}
                    onClick={() => switchTier(tier)}
                    className={`p-6 rounded-xl font-medium transition-all flex flex-col items-center space-y-3 ${
                      currentTier === tier
                        ? 'border border-[#F9C80E] bg-gradient-to-br from-[#F9C80E]/20 to-[#1C84FF]/10'
                        : 'border border-[#1C84FF]/20 bg-[#1C84FF]/5 hover:border-[#1C84FF]/40'
                    }`}
                    style={{
                      backdropFilter: "blur(20px)"
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-8 h-8" style={{ 
                      color: currentTier === tier ? "var(--vault-gold-signature)" : "var(--vault-text-secondary)" 
                    }} />
                    <div className="text-center">
                      <div className="font-semibold" style={{ 
                        color: currentTier === tier ? "var(--vault-gold-signature)" : "var(--vault-text-primary)" 
                      }}>
                        {config.label}
                      </div>
                      <div className="text-xs mt-1 capitalize" style={{ color: "var(--vault-text-secondary)" }}>
                        {tier} Tier
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </VaultSupremePanel>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Input Section */}
          <VaultSupremePanel>
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-8 h-8" style={{ color: "var(--vault-gold-signature)" }} />
              <h3 className="text-xl font-light" style={{ color: "var(--vault-text-primary)" }}>
                Strategic Profile Configuration
              </h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "var(--vault-text-secondary)" }}>
                  Industry Vertical
                </label>
                <input
                  className="w-full h-12 bg-transparent border border-[#1C84FF]/30 rounded-lg px-4 text-white focus:border-[#F9C80E] focus:outline-none"
                  style={{ 
                    backdropFilter: "blur(10px)",
                    background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.3))"
                  }}
                  placeholder="Business Coaching, Health & Wellness, Financial Advisory"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "var(--vault-text-secondary)" }}>
                  Coaching Modality
                </label>
                <input
                  className="w-full h-12 bg-transparent border border-[#1C84FF]/30 rounded-lg px-4 text-white focus:border-[#F9C80E] focus:outline-none"
                  style={{ 
                    backdropFilter: "blur(10px)",
                    background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.3))"
                  }}
                  placeholder="Life Coach, Business Mentor, Performance Coach"
                  value={coachType}
                  onChange={(e) => setCoachType(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "var(--vault-text-secondary)" }}>
                  Primary Challenge Addressed
                </label>
                <input
                  className="w-full h-12 bg-transparent border border-[#1C84FF]/30 rounded-lg px-4 text-white focus:border-[#F9C80E] focus:outline-none"
                  style={{ 
                    backdropFilter: "blur(10px)",
                    background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.3))"
                  }}
                  placeholder="Revenue stagnation, leadership gaps, performance blocks"
                  value={painPoint}
                  onChange={(e) => setPainPoint(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "var(--vault-text-secondary)" }}>
                  Signature Hook Line
                  <span className="text-xs ml-2 opacity-60">(Optional)</span>
                </label>
                <input
                  className="w-full h-12 bg-transparent border border-[#1C84FF]/30 rounded-lg px-4 text-white focus:border-[#F9C80E] focus:outline-none"
                  style={{ 
                    backdropFilter: "blur(10px)",
                    background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.3))"
                  }}
                  placeholder="Your most compelling attention-grabbing statement"
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                />
              </div>
            </div>
          </VaultSupremePanel>

          {/* Real-time Feedback Section */}
          <VaultSupremePanel glowEffect={true}>
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-8 h-8" style={{ color: "var(--vault-gold-signature)" }} />
              <h3 className="text-xl font-light" style={{ color: "var(--vault-text-primary)" }}>
                Live Strategic Analysis
              </h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "var(--vault-text-secondary)" }}>
                  Transformation Outcome Statement *
                </label>
                <textarea
                  className="w-full min-h-24 bg-transparent border border-[#1C84FF]/30 rounded-lg p-4 text-white focus:border-[#F9C80E] focus:outline-none resize-none"
                  style={{ 
                    backdropFilter: "blur(10px)",
                    background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.3))"
                  }}
                  placeholder="Specific transformation with measurable outcomes (e.g., Generate $10K/month recurring revenue within 90 days with proven scaling framework)"
                  value={transformation}
                  onChange={(e) => setTransformation(e.target.value)}
                  rows={3}
                  data-testid="transformation-field"
                />
                {/* Live Score Display for Transformation */}
                {liveScore !== null && (
                  <motion.div 
                    className="mt-4 p-4 rounded-lg border border-[#1C84FF]/20"
                    style={{
                      backdropFilter: "blur(15px)",
                      background: "linear-gradient(135deg, rgba(28, 132, 255, 0.05), rgba(249, 200, 14, 0.05))"
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl font-bold" style={{ color: "var(--vault-gold-signature)" }} data-testid="live-score">
                        {liveScore}
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" style={{ color: "var(--vault-gold-signature)" }} />
                        <span className="text-sm font-medium" style={{ color: "var(--vault-gold-signature)" }}>
                          Score: {liveScore}/100
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#F9C80E]/30">
                        {getTierIcon(currentTier)}
                        <span className="text-xs font-medium capitalize" style={{ color: "var(--vault-text-primary)" }}>
                          {currentTier} Analysis
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="h-2 bg-[#1C84FF]/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#1C84FF] to-[#F9C80E] transition-all duration-500"
                          style={{ width: `${liveScore}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm mb-3" style={{ color: "var(--vault-text-secondary)" }}>
                      {liveScore < 60 ? "Make the outcome more specific and measurable. Pro coaching: Consider psychological triggers and conversion optimization." :
                       liveScore < 80 ? "Good direction. Add specific measurements or timeframes." :
                       "Excellent! Clear transformation with measurable outcomes and comprehensive architecture."}
                    </p>
                    {transformationFeedback && transformationFeedback.suggestions && (
                      <div className="space-y-2">
                        {transformationFeedback.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs" style={{ color: "var(--vault-text-secondary)" }}>
                            <Lightbulb className="h-3 w-3 mt-0.5 flex-shrink-0" style={{ color: "var(--vault-gold-signature)" }} />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                    {offerArchitecture.length > 20 && (
                      <div className="flex items-start gap-2 text-xs mt-2" style={{ color: "var(--vault-text-secondary)" }}>
                        <Lightbulb className="h-3 w-3 mt-0.5 flex-shrink-0" style={{ color: "var(--vault-gold-signature)" }} />
                        Strategic architecture detected: +{scoreOfferArchitecture(offerArchitecture) - 50} bonus points for comprehensive program structure
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "var(--vault-text-secondary)" }}>
                  Strategic Offer Architecture *
                </label>
                <textarea
                  className="w-full min-h-24 bg-transparent border border-[#1C84FF]/30 rounded-lg p-4 text-white focus:border-[#F9C80E] focus:outline-none resize-none"
                  style={{ 
                    backdropFilter: "blur(10px)",
                    background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.3))"
                  }}
                  placeholder="Comprehensive program structure: duration, delivery method, touchpoints, and deliverables (e.g., 12-week elite transformation with weekly strategic sessions and custom playbook)"
                  value={offerArchitecture}
                  onChange={(e) => setOfferArchitecture(e.target.value)}
                  rows={3}
                  data-testid="architecture-field"
                />
              </div>

              <div className="space-y-4">
                <VaultSupremeButton
                  onClick={submitProfile} 
                  disabled={isLoading || !transformation || !offerArchitecture}
                  variant="primary"
                  className="w-full h-12"
                >
                  {isLoading ? "Optimizing Profile..." : "Complete Strategic Analysis"}
                </VaultSupremeButton>
                
                {/* Council Engagement Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <VaultSupremeButton
                    variant="secondary"
                    onClick={() => window.location.href = '/council'}
                    className="h-12 flex items-center justify-center"
                    disabled={currentTier === 'free'}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    <span>{currentTier === 'free' ? 'Council (Upgrade)' : 'Council Analysis'}</span>
                  </VaultSupremeButton>
                  <VaultSupremeButton
                    variant="secondary"
                    onClick={() => window.location.href = '/elite-coaching'}
                    className="h-12 flex items-center justify-center"
                    disabled={currentTier === 'free'}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    <span>{currentTier === 'free' ? 'Elite (Upgrade)' : 'Elite Coaching'}</span>
                  </VaultSupremeButton>
                </div>
                
                <VaultSupremeButton
                  variant="secondary"
                  onClick={async () => {
                    // PRODUCTION SECURITY: Remove mock data - require authentication for real user data
                    setIsLoading(true);
                    try {
                      // This would call a real API endpoint that requires authentication
                      const response = await fetch('/api/user/weekly-summary', {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'application/json',
                          // Authorization header would be added by auth middleware
                        },
                      });
                      
                      if (response.ok) {
                        const realSummary = await response.json();
                        setWeeklySummary(realSummary);
                      } else {
                        toast({
                          title: "Authentication Required",
                          description: "Please sign in to view your weekly strategic summary",
                          variant: "destructive",
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Connection Error",
                        description: "Unable to load strategic summary. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="w-full h-12"
                >
                  Preview {currentTier.toUpperCase()} Strategic Summary
                </VaultSupremeButton>
              </div>
            </div>
          </VaultSupremePanel>
        </div>

        {/* Weekly Summary Display */}
        {weeklySummary && (
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <VaultSupremePanel glowEffect={true}>
              <div className="flex items-center space-x-3 mb-8">
                <CheckCircle className="w-8 h-8" style={{ color: "var(--vault-gold-signature)" }} />
                <h3 className="text-2xl font-light" style={{ color: "var(--vault-text-primary)" }}>
                  Strategic Performance Summary
                </h3>
              </div>
              <p className="text-lg mb-8" style={{ color: "var(--vault-text-secondary)" }}>
                Personalized coaching insights from this week ({currentTier.toUpperCase()} tier analytics)
              </p>
              
              <div className="space-y-8">
                {/* Progress Meters */}
                <div>
                  <h4 className="font-medium mb-6" style={{ color: "var(--vault-text-primary)" }}>
                    Weekly Performance Metrics
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2" style={{ color: "var(--vault-text-secondary)" }}>
                        <span>Hook Generation Progress</span>
                        <span>{weeklySummary.hooksGenerated}/10 target</span>
                      </div>
                      <div className="h-3 bg-[#1C84FF]/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#1C84FF] to-[#F9C80E]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(weeklySummary.hooksGenerated / 10) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2" style={{ color: "var(--vault-text-secondary)" }}>
                        <span>Offer Creation Progress</span>
                        <span>{weeklySummary.offersGenerated}/5 target</span>
                      </div>
                      <div className="h-3 bg-[#1C84FF]/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#1C84FF] to-[#F9C80E]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(weeklySummary.offersGenerated / 5) * 100}%` }}
                          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2" style={{ color: "var(--vault-text-secondary)" }}>
                        <span>Council Engagement</span>
                        <span>{weeklySummary.councilSessions}/3 recommended</span>
                      </div>
                      <div className="h-3 bg-[#1C84FF]/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#1C84FF] to-[#F9C80E]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(weeklySummary.councilSessions / 3) * 100}%` }}
                          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                  <motion.div 
                    className="text-center p-6 rounded-xl border border-[#1C84FF]/20"
                    style={{
                      backdropFilter: "blur(10px)",
                      background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.2))"
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="text-4xl font-bold mb-2" style={{ color: "var(--vault-gold-signature)" }}>
                      {weeklySummary.hooksGenerated}
                    </div>
                    <div className="text-sm mt-2" style={{ color: "var(--vault-text-secondary)" }}>Hooks Generated</div>
                    <div className="text-xs mt-1" style={{ color: "var(--vault-gold-signature)" }}>
                      {weeklySummary.hooksGenerated >= 5 ? "Elite momentum" : "Building foundation"}
                    </div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-6 rounded-xl border border-[#1C84FF]/20"
                    style={{
                      backdropFilter: "blur(10px)",
                      background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.2))"
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="text-4xl font-bold mb-2" style={{ color: "var(--vault-gold-signature)" }}>
                      {weeklySummary.offersGenerated}
                    </div>
                    <div className="text-sm mt-2" style={{ color: "var(--vault-text-secondary)" }}>Offers Created</div>
                    <div className="text-xs mt-1" style={{ color: "var(--vault-gold-signature)" }}>
                      {weeklySummary.offersGenerated >= 2 ? "Strategic output" : "Accelerating creation"}
                    </div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-6 rounded-xl border border-[#1C84FF]/20"
                    style={{
                      backdropFilter: "blur(10px)",
                      background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.2))"
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <div className="text-4xl font-bold mb-2" style={{ color: "var(--vault-gold-signature)" }}>
                      {weeklySummary.councilSessions}
                    </div>
                    <div className="text-sm mt-2" style={{ color: "var(--vault-text-secondary)" }}>Council Sessions</div>
                    <div className="text-xs mt-1" style={{ color: "var(--vault-gold-signature)" }}>
                      {currentTier === 'free' ? "Upgrade for access" : 
                       weeklySummary.councilSessions >= 1 ? "Expert guidance" : "Seek feedback"}
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: "var(--vault-text-primary)" }}>
                      Strategic Transformation Focus
                    </h4>
                    <p className="text-sm italic p-4 rounded-lg border border-[#F9C80E]/20" 
                       style={{ 
                         color: "var(--vault-text-secondary)",
                         background: "linear-gradient(135deg, rgba(249, 200, 14, 0.05), rgba(28, 132, 255, 0.05))"
                       }}>
                      "{weeklySummary.transformation}"
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3" style={{ color: "var(--vault-text-primary)" }}>
                      Performance Recognition
                    </h4>
                    <p className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
                      {weeklySummary.encouragement}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3" style={{ color: "var(--vault-text-primary)" }}>
                      Strategic Next Actions
                    </h4>
                    <ul className="space-y-3">
                      {weeklySummary.nextSteps.map((step, index) => (
                        <motion.li 
                          key={index} 
                          className="flex items-start gap-3 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                        >
                          <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" 
                               style={{ backgroundColor: "var(--vault-gold-signature)" }} />
                          <span style={{ color: "var(--vault-text-secondary)" }}>{step}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </VaultSupremePanel>
          </motion.div>
        )}

        {/* Elite Demo Instructions */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <VaultSupremePanel>
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-8 h-8" style={{ color: "var(--vault-gold-signature)" }} />
              <h3 className="text-xl font-light" style={{ color: "var(--vault-text-primary)" }}>
                Elite Coaching Demo Experience
              </h3>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-4" style={{ color: "var(--vault-text-primary)" }}>
                  Strategic Testing Protocol
                </h4>
                <div className="space-y-3 text-sm" style={{ color: "var(--vault-text-secondary)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full border border-[#F9C80E] flex items-center justify-center text-xs font-bold" style={{ color: "var(--vault-gold-signature)" }}>1</div>
                    <span>Input "Help coaches build confidence" in transformation field</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full border border-[#F9C80E] flex items-center justify-center text-xs font-bold" style={{ color: "var(--vault-gold-signature)" }}>2</div>
                    <span>Observe real-time strategic analysis with live scoring</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full border border-[#F9C80E] flex items-center justify-center text-xs font-bold" style={{ color: "var(--vault-gold-signature)" }}>3</div>
                    <span>Test tier progression for coaching sophistication levels</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full border border-[#F9C80E] flex items-center justify-center text-xs font-bold" style={{ color: "var(--vault-gold-signature)" }}>4</div>
                    <span>Advanced test: "Generate $10K monthly revenue for coaches in 90 days"</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4" style={{ color: "var(--vault-text-primary)" }}>
                  Tier Performance Matrix
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[#1C84FF]/20" style={{ background: "rgba(28, 132, 255, 0.05)" }}>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" style={{ color: "var(--vault-text-secondary)" }} />
                      <span className="text-sm" style={{ color: "var(--vault-text-primary)" }}>Foundation</span>
                    </div>
                    <span className="text-xs" style={{ color: "var(--vault-text-secondary)" }}>Base Analysis</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[#1C84FF]/20" style={{ background: "rgba(28, 132, 255, 0.05)" }}>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" style={{ color: "var(--vault-text-secondary)" }} />
                      <span className="text-sm" style={{ color: "var(--vault-text-primary)" }}>Builder</span>
                    </div>
                    <span className="text-xs" style={{ color: "var(--vault-text-secondary)" }}>Enhanced Feedback</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[#1C84FF]/20" style={{ background: "rgba(28, 132, 255, 0.05)" }}>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" style={{ color: "var(--vault-gold-signature)" }} />
                      <span className="text-sm" style={{ color: "var(--vault-text-primary)" }}>Elite (+5 Bonus)</span>
                    </div>
                    <span className="text-xs" style={{ color: "var(--vault-gold-signature)" }}>Psychological Insights</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[#F9C80E]/30" style={{ background: "rgba(249, 200, 14, 0.1)" }}>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" style={{ color: "var(--vault-gold-signature)" }} />
                      <span className="text-sm" style={{ color: "var(--vault-text-primary)" }}>Vault (+10 Bonus)</span>
                    </div>
                    <span className="text-xs" style={{ color: "var(--vault-gold-signature)" }}>Neuromarketing Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </VaultSupremePanel>
        </motion.div>
      </div>
    </VaultForgeSupreme>
  );
}