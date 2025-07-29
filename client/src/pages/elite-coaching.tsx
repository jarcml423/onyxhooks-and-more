import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, Shield, Zap, Users, Target, TrendingUp, CheckCircle, AlertCircle, XCircle, Lightbulb, Brain, Gauge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VaultForgeSupreme, { VaultSupremePanel, VaultSupremeButton } from "@/components/VaultForgeSupreme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FuturisticIcon from "@/components/FuturisticIcons";
import Premium3DElement from "@/components/Premium3DElements";
import { PlatinumROICalculator } from '@/components/PlatinumROICalculator';
import { OperatorBadge } from '@/components/OperatorBadge';
import { CouncilPreviewInvite } from '@/components/CouncilPreviewInvite';
import { PlatinumSamplePreview } from '@/components/PlatinumSamplePreview';

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

export default function EliteCoaching() {
  const [transformation, setTransformation] = useState('');
  const [description, setDescription] = useState('');
  const [hook, setHook] = useState('');
  const [industry, setIndustry] = useState('');
  const [coachType, setCoachType] = useState('');
  const [painPoint, setPainPoint] = useState('');
  
  const [transformationFeedback, setTransformationFeedback] = useState<CoachingFeedback | null>(null);
  const [descriptionFeedback, setDescriptionFeedback] = useState<CoachingFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [candidateCode, setCandidateCode] = useState<string>('');
  const [currentTier, setCurrentTier] = useState<'free' | 'starter' | 'pro' | 'vault'>('vault');
  const [activeSection, setActiveSection] = useState<'optimization' | 'analytics' | 'council'>('optimization');
  
  const { toast } = useToast();

  // Enhanced coaching feedback with tier bonuses
  const getLocalTransformationScore = (text: string): CoachingFeedback => {
    if (text.length < 10) {
      return { score: 0, feedback: "Too short to analyze", level: 'weak' };
    }

    let score = 0;
    let feedback = "";
    let suggestions: string[] = [];

    // Enhanced scoring criteria
    const hasSpecificOutcome = /(\$\d+|revenue|income|profit|sales|clients|\d+%|\d+x|earn|make)/.test(text.toLowerCase());
    const hasTimeframe = /(days?|weeks?|months?|years?|\d+\s*day|\d+\s*week|\d+\s*month)/.test(text.toLowerCase());
    const hasClearTransformation = /(from|to|become|achieve|generate|build|create|transform|help|get|reach)/.test(text.toLowerCase());
    const hasMetrics = /(\d+)/.test(text);
    const hasEmotionalOutcome = /(confidence|security|freedom|peace|happiness|fulfillment)/.test(text.toLowerCase());
    
    if (hasSpecificOutcome) score += 25;
    if (hasTimeframe) score += 20;
    if (hasClearTransformation) score += 20;
    if (hasMetrics) score += 15;
    if (hasEmotionalOutcome) score += 10;
    if (text.length > 50) score += 5;
    if (text.length > 100) score += 5;

    // Tier-specific bonuses and advanced analysis
    if (currentTier === 'pro') {
      score += 5; // Pro tier bonus
      if (/emotional|feeling|confidence|security/.test(text)) score += 10;
      suggestions.push("Pro insight: Consider emotional transformation alongside tangible results");
    } else if (currentTier === 'vault') {
      score += 10; // Vault tier bonus
      if (/identity|become|transformation|elite|premium/.test(text)) score += 15;
      suggestions.push("Vault analysis: Frame as identity shift for premium positioning");
      suggestions.push("Neuromarketing trigger: Use status elevation language");
    }

    // Generate feedback based on score
    if (score < 40) {
      feedback = currentTier === 'free' 
        ? "Add specific outcomes and timeframes" 
        : currentTier === 'starter'
        ? "Include measurable results and clear before/after states"
        : currentTier === 'pro'
        ? "Enhance with emotional outcomes and psychological transformation"
        : "Apply identity shift framing and status elevation psychology";
      
      if (!hasSpecificOutcome) suggestions.push("Add specific dollar amounts or percentages");
      if (!hasTimeframe) suggestions.push("Include a clear timeframe (30, 60, 90 days)");
    } else if (score < 70) {
      feedback = currentTier === 'free'
        ? "Good foundation, add more specific details"
        : currentTier === 'starter' 
        ? "Strong core, enhance with supporting metrics"
        : currentTier === 'pro'
        ? "Solid framework, layer in emotional triggers"
        : "Excellent structure, optimize for premium positioning";
    } else {
      feedback = currentTier === 'free'
        ? "Excellent transformation statement!"
        : currentTier === 'starter'
        ? "Outstanding clarity and specificity"
        : currentTier === 'pro' 
        ? "Premium-level transformation with psychological depth"
        : "Elite-tier transformation optimized for maximum conversion";
    }

    return {
      score: Math.min(100, score),
      feedback,
      level: score < 40 ? 'weak' : score < 70 ? 'good' : 'strong',
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  };

  // Real-time coaching feedback with proper debouncing
  useEffect(() => {
    if (transformation.length > 10) {
      const timer = setTimeout(() => {
        const feedback = getLocalTransformationScore(transformation);
        setTransformationFeedback(feedback);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setTransformationFeedback(null);
    }
  }, [transformation, currentTier]);

  const generateWeeklySummary = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Calculate qualification score based on inputs
      let qualificationScore = 0;
      const transformationScore = transformationFeedback?.score || 0;
      
      // Industry scoring (some industries score higher for Platinum)
      const premiumIndustries = ['business', 'finance', 'technology', 'marketing'];
      if (premiumIndustries.includes(industry)) qualificationScore += 25;
      else qualificationScore += 15;
      
      // Coaching type scoring
      const premiumTypes = ['consultant', 'mastermind', 'certification'];
      if (premiumTypes.includes(coachType)) qualificationScore += 25;
      else qualificationScore += 15;
      
      // Pain point scoring
      const premiumPainPoints = ['revenue', 'direction', 'skills'];
      if (premiumPainPoints.includes(painPoint)) qualificationScore += 25;
      else qualificationScore += 15;
      
      // Transformation quality bonus
      qualificationScore += Math.floor(transformationScore * 0.35);
      
      const finalScore = Math.min(100, qualificationScore);
      const qualified = finalScore >= 75;
      
      // Generate unique candidate code for high scorers
      if (finalScore >= 85) {
        const timestamp = Date.now().toString(36).slice(-4);
        const scoreCode = finalScore.toString().padStart(3, '0');
        const industryCode = industry.slice(0, 2).toUpperCase();
        setCandidateCode(`OPR-${industryCode}${scoreCode}-${timestamp}`);
      }
      
      const mockSummary: WeeklySummary = {
        coachName: "Platinum Candidate",
        hooksGenerated: finalScore,
        offersGenerated: qualified ? 1 : 0,
        councilSessions: qualified ? 1 : 0,
        transformation: transformation || "Elite transformation consulting for high-achievers",
        encouragement: qualified 
          ? `CONGRATULATIONS! You've qualified for Platinum Elite status with a ${finalScore}/100 assessment score. Your strategic approach and market positioning demonstrate the sophistication we seek in our exclusive 50-member Founder's Circle.`
          : `Your assessment score of ${finalScore}/100 shows strong potential. To qualify for Platinum Elite (75+ required), enhance your transformation specificity and consider premium market positioning. You're currently eligible for our Pro tier with upgrade pathway.`,
        nextSteps: qualified
          ? ["Schedule your Platinum onboarding call", "Access exclusive Founder's Circle community", "Begin 1-on-1 Elite Council sessions", "Implement custom neuromarketing strategy"]
          : ["Refine transformation statement for premium positioning", "Consider high-value market segments", "Upgrade to Pro tier for advanced tools", "Reapply for Platinum after 30 days"]
      };
      setWeeklySummary(mockSummary);
      setIsLoading(false);
    }, 2000);
  };

  const tierConfigs = {
    free: { 
      icon: Zap, 
      label: 'Foundation', 
      color: 'blue',
      description: 'Core optimization tools'
    },
    starter: { 
      icon: Shield, 
      label: 'Builder', 
      color: 'green',
      description: 'Enhanced coaching insights'
    },
    pro: { 
      icon: Star, 
      label: 'Elite', 
      color: 'purple',
      description: 'Psychological optimization'
    },
    vault: { 
      icon: Crown, 
      label: 'Vault', 
      color: 'gold',
      description: 'Neuromarketing mastery'
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
            <FuturisticIcon 
              type="coaching"
              size="large"
              animated={true}
              glowIntensity="high"
            />
            <h1 className="text-5xl font-light tracking-wide" style={{ color: "var(--vault-text-primary)" }}>
              Platinum Elite Assessment
            </h1>
          </div>
          <p className="text-xl font-light mb-4" style={{ color: "var(--vault-text-secondary)" }}>
            Discover if you qualify for our exclusive $5,000 Platinum tier
          </p>
          <div className="inline-flex items-center space-x-2 px-6 py-2 rounded-full" style={{
            background: "linear-gradient(135deg, rgba(249, 200, 14, 0.2), rgba(28, 132, 255, 0.1))",
            border: "1px solid rgba(249, 200, 14, 0.3)"
          }}>
            <Crown className="w-4 h-4" style={{ color: "var(--vault-gold-signature)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--vault-gold-signature)" }}>
              Limited to 50 Elite Operators Globally
            </span>
          </div>
        </motion.div>

        {/* Tier Selection Panel */}
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
                Platinum Qualification Assessment
              </h3>
              <p className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
                Complete this elite assessment to determine your qualification level
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(tierConfigs).map(([tier, config]) => {
                const Icon = config.icon;
                return (
                  <motion.button
                    key={tier}
                    onClick={() => setCurrentTier(tier as any)}
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
                      <div className="text-xs mt-1" style={{ color: "var(--vault-text-secondary)" }}>
                        {config.description}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </VaultSupremePanel>
        </motion.div>

        {/* Main Interface Tabs */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {[
              { key: 'optimization', label: 'Strategic Optimization', icon: Target },
              { key: 'analytics', label: 'Performance Analytics', icon: TrendingUp },
              { key: 'council', label: 'Council Insights', icon: Brain }
            ].map(({ key, label, icon: Icon }) => (
              <VaultSupremeButton
                key={key}
                variant={activeSection === key ? "primary" : "secondary"}
                onClick={() => setActiveSection(key as any)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </VaultSupremeButton>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Strategic Optimization Section */}
          {activeSection === 'optimization' && (
            <motion.div
              key="optimization"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Transformation Optimization */}
                <VaultSupremePanel>
                  <div className="flex items-center space-x-3 mb-6">
                    <FuturisticIcon type="strategic" size="medium" animated={true} />
                    <h3 className="text-xl font-light" style={{ color: "var(--vault-text-primary)" }}>
                      Transformation Statement
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <textarea
                      value={transformation}
                      onChange={(e) => setTransformation(e.target.value)}
                      placeholder="e.g., Help busy professionals generate $10K monthly revenue in 90 days without working weekends"
                      className="w-full h-32 bg-transparent border border-[#1C84FF]/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#F9C80E] focus:outline-none transition-colors resize-none"
                      style={{ 
                        backdropFilter: "blur(10px)",
                        background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.3))"
                      }}
                    />
                    
                    {/* Real-time Feedback */}
                    <AnimatePresence>
                      {transformationFeedback && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 rounded-lg border"
                          style={{
                            background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.2))",
                            borderColor: transformationFeedback.level === 'strong' ? '#F9C80E' : 
                                        transformationFeedback.level === 'good' ? '#1C84FF' : '#EF4444'
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {transformationFeedback.level === 'strong' ? (
                                <CheckCircle className="w-5 h-5 text-[#F9C80E]" />
                              ) : transformationFeedback.level === 'good' ? (
                                <AlertCircle className="w-5 h-5 text-[#1C84FF]" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                              )}
                              <span className="font-medium" style={{ color: "var(--vault-text-primary)" }}>
                                Optimization Score
                              </span>
                            </div>
                            <Premium3DElement
                              type="number"
                              value={transformationFeedback.score}
                              context={transformationFeedback.level === 'strong' ? 'success' : 
                                      transformationFeedback.level === 'good' ? 'warning' : 'error'}
                              size="small"
                              glow={transformationFeedback.level === 'strong'}
                            />
                          </div>
                          
                          <p className="text-sm mb-3" style={{ color: "var(--vault-text-secondary)" }}>
                            {transformationFeedback.feedback}
                          </p>
                          
                          {transformationFeedback.suggestions && (
                            <div className="space-y-2">
                              <div className="text-xs font-medium" style={{ color: "var(--vault-gold-signature)" }}>
                                {currentTier.toUpperCase()} TIER INSIGHTS:
                              </div>
                              {transformationFeedback.suggestions.map((suggestion, index) => (
                                <div key={index} className="flex items-start space-x-2 text-xs">
                                  <Lightbulb className="w-3 h-3 mt-0.5 text-[#F9C80E]" />
                                  <span style={{ color: "var(--vault-text-secondary)" }}>{suggestion}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </VaultSupremePanel>

                {/* Quick Profile Setup */}
                <VaultSupremePanel>
                  <div className="flex items-center space-x-3 mb-6">
                    <FuturisticIcon type="profile" size="medium" animated={true} />
                    <h3 className="text-xl font-light" style={{ color: "var(--vault-text-primary)" }}>
                      Strategic Profile
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--vault-text-secondary)" }}>
                        Industry Focus
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full h-12 bg-transparent border border-[#1C84FF]/30 rounded-lg px-4 text-white focus:border-[#F9C80E] focus:outline-none"
                        style={{ 
                          backdropFilter: "blur(10px)",
                          background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.3))"
                        }}
                      >
                        <option value="" style={{ backgroundColor: '#111827', color: '#9CA3AF' }}>Select Industry</option>
                        <option value="fitness" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Fitness & Health</option>
                        <option value="business" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Business Coaching</option>
                        <option value="life" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Life Coaching</option>
                        <option value="marketing" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Marketing & Sales</option>
                        <option value="real_estate" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Real Estate</option>
                        <option value="finance" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Finance & Investing</option>
                        <option value="relationships" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Relationships</option>
                        <option value="productivity" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Productivity</option>
                        <option value="mindset" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Mindset & Personal Development</option>
                        <option value="nutrition" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Nutrition & Wellness</option>
                        <option value="technology" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Technology Consulting</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--vault-text-secondary)" }}>
                        Coaching Type
                      </label>
                      <select
                        value={coachType}
                        onChange={(e) => setCoachType(e.target.value)}
                        className="w-full h-12 bg-transparent border border-[#1C84FF]/30 rounded-lg px-4 text-white focus:border-[#F9C80E] focus:outline-none"
                        style={{ 
                          backdropFilter: "blur(10px)",
                          background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.3))"
                        }}
                      >
                        <option value="" style={{ backgroundColor: '#111827', color: '#9CA3AF' }}>Select Type</option>
                        <option value="1-on-1" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>1-on-1 Coaching</option>
                        <option value="group" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Group Programs</option>
                        <option value="course" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Online Courses</option>
                        <option value="mastermind" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Mastermind</option>
                        <option value="consultant" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Strategic Consulting</option>
                        <option value="workshop" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Workshops & Retreats</option>
                        <option value="membership" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Membership Programs</option>
                        <option value="certification" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Certification Programs</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--vault-text-secondary)" }}>
                        Primary Pain Point
                      </label>
                      <select
                        value={painPoint}
                        onChange={(e) => setPainPoint(e.target.value)}
                        className="w-full h-12 bg-transparent border border-[#1C84FF]/30 rounded-lg px-4 text-white focus:border-[#F9C80E] focus:outline-none"
                        style={{ 
                          backdropFilter: "blur(10px)",
                          background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.3))"
                        }}
                      >
                        <option value="" style={{ backgroundColor: '#111827', color: '#9CA3AF' }}>Select Pain Point</option>
                        <option value="revenue" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Revenue Growth Plateau</option>
                        <option value="confidence" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Low Confidence/Self-Doubt</option>
                        <option value="time" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Time Management Issues</option>
                        <option value="health" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Health & Fitness Struggles</option>
                        <option value="relationships" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Relationship Problems</option>
                        <option value="direction" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Lack of Clear Direction</option>
                        <option value="overwhelm" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Feeling Overwhelmed</option>
                        <option value="motivation" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Low Motivation/Energy</option>
                        <option value="skills" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Skill Development Gaps</option>
                        <option value="mindset" style={{ backgroundColor: '#111827', color: '#F3F4F6' }}>Limiting Beliefs/Mindset</option>
                      </select>
                    </div>
                    
                    <VaultSupremeButton
                      variant="gold"
                      onClick={generateWeeklySummary}
                      className="w-full"
                      disabled={isLoading || !industry || !coachType || !painPoint}
                    >
                      {isLoading ? "Calculating Qualification..." : "Assess Platinum Eligibility"}
                    </VaultSupremeButton>
                    
                    <div className="mt-4 p-4 rounded-lg" style={{
                      background: "linear-gradient(135deg, rgba(249, 200, 14, 0.1), rgba(28, 132, 255, 0.05))",
                      border: "1px solid rgba(249, 200, 14, 0.2)"
                    }}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Crown className="w-4 h-4" style={{ color: "var(--vault-gold-signature)" }} />
                        <span className="text-sm font-medium" style={{ color: "var(--vault-gold-signature)" }}>
                          Platinum Tier Benefits
                        </span>
                      </div>
                      <ul className="text-xs space-y-1" style={{ color: "var(--vault-text-secondary)" }}>
                        <li>• 1-on-1 Elite Council Sessions with 6 AI Gladiators</li>
                        <li>• Custom Neuromarketing Campaign Development</li>
                        <li>• Private Founder's Circle Access</li>
                        <li>• Revenue Guarantee: 10x ROI or Full Refund</li>
                        <li>• Direct Line to VaultForge Core Team</li>
                      </ul>
                    </div>
                  </div>
                </VaultSupremePanel>
              </div>
            </motion.div>
          )}

          {/* Performance Analytics Section */}
          {activeSection === 'analytics' && weeklySummary && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              <VaultSupremePanel glowEffect={true}>
                <div className="flex items-center space-x-3 mb-8">
                  <FuturisticIcon type="analytics" size="large" animated={true} />
                  <div>
                    <h3 className="text-2xl font-light" style={{ color: "var(--vault-text-primary)" }}>
                      Performance Analytics
                    </h3>
                    <p className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
                      {currentTier.toUpperCase()} tier strategic insights
                    </p>
                  </div>
                </div>
                
                {/* 3D Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <Premium3DElement
                      type="number"
                      value={weeklySummary.hooksGenerated}
                      context="hooks"
                      size="large"
                      glow={true}
                    />
                    <h4 className="text-lg font-medium mt-4" style={{ color: "var(--vault-text-primary)" }}>
                      Qualification Score
                    </h4>
                    <p className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
                      {weeklySummary.hooksGenerated >= 75 ? "✅ Platinum Qualified" : "⚡ Developing Potential"}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Premium3DElement
                      type="number"
                      value={weeklySummary.offersGenerated}
                      context="offers"
                      size="large"
                      glow={true}
                    />
                    <h4 className="text-lg font-medium mt-4" style={{ color: "var(--vault-text-primary)" }}>
                      Elite Status
                    </h4>
                    <p className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
                      {weeklySummary.offersGenerated >= 1 ? "👑 Founder's Circle Ready" : "🔄 Enhancement Required"}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Premium3DElement
                      type="number"
                      value={weeklySummary.councilSessions}
                      context="council"
                      size="large"
                      glow={true}
                    />
                    <h4 className="text-lg font-medium mt-4" style={{ color: "var(--vault-text-primary)" }}>
                      Revenue Potential
                    </h4>
                    <p className="text-sm" style={{ color: "var(--vault-text-secondary)" }}>
                      {weeklySummary.councilSessions >= 1 ? "💰 $50K+ Annual Trajectory" : "📊 Foundation Building"}
                    </p>
                  </div>
                </div>
                
                {/* Strategic Insights */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: "var(--vault-gold-signature)" }}>
                      Assessment Results
                    </h4>
                    <p className="italic" style={{ color: "var(--vault-text-secondary)" }}>
                      "{weeklySummary.transformation}"
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: "var(--vault-gold-signature)" }}>
                      Qualification Status
                    </h4>
                    <p style={{ color: "var(--vault-text-secondary)" }}>
                      {weeklySummary.encouragement}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: "var(--vault-gold-signature)" }}>
                      Next Steps
                    </h4>
                    <div className="space-y-2">
                      {weeklySummary.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-[#F9C80E] mt-2 flex-shrink-0" />
                          <span style={{ color: "var(--vault-text-secondary)" }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {weeklySummary.hooksGenerated >= 75 && (
                    <div className="mt-6 text-center">
                      <VaultSupremeButton variant="gold" size="large">
                        <Crown className="w-5 h-5 mr-2" />
                        Apply for Platinum Elite ($5,000)
                      </VaultSupremeButton>
                      <p className="text-xs mt-1" style={{ color: "var(--vault-gold-signature)" }}>
                        Next Council Induction: July 2025 – Only 12 Spots
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--vault-text-secondary)" }}>
                        Limited to 50 members globally worldwide
                      </p>
                    </div>
                  )}
                </div>
              </VaultSupremePanel>
            </motion.div>
          )}

          {/* Council Insights Section */}
          {activeSection === 'council' && (
            <motion.div
              key="council"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              <VaultSupremePanel glowEffect={true}>
                <div className="text-center py-12">
                  <FuturisticIcon type="council" size="large" animated={true} />
                  <h3 className="text-2xl font-light mt-6 mb-4" style={{ color: "var(--vault-text-primary)" }}>
                    Council Insights
                  </h3>
                  <p className="text-lg mb-8" style={{ color: "var(--vault-text-secondary)" }}>
                    {currentTier === 'free' 
                      ? "Upgrade to access strategic council feedback"
                      : `${currentTier.toUpperCase()} tier council analysis available`
                    }
                  </p>
                  
                  {currentTier !== 'free' ? (
                    <div className="text-left max-w-2xl mx-auto space-y-4">
                      <div className="p-4 rounded-lg" style={{
                        background: "linear-gradient(135deg, rgba(28, 132, 255, 0.1), rgba(17, 24, 39, 0.2))",
                        border: "1px solid rgba(28, 132, 255, 0.3)"
                      }}>
                        <h4 className="font-medium mb-2" style={{ color: "var(--vault-gold-signature)" }}>
                          Alex's Value Framework
                        </h4>
                        <p style={{ color: "var(--vault-text-secondary)" }}>
                          Dream Outcome + Perceived Likelihood - Time & Effort - Risk = VALUE
                        </p>
                      </div>
                      
                      {currentTier === 'vault' && (
                        <div className="p-4 rounded-lg" style={{
                          background: "linear-gradient(135deg, rgba(249, 200, 14, 0.1), rgba(28, 132, 255, 0.05))",
                          border: "1px solid rgba(249, 200, 14, 0.3)"
                        }}>
                          <h4 className="font-medium mb-2" style={{ color: "var(--vault-gold-signature)" }}>
                            Vault Council Analysis
                          </h4>
                          <p style={{ color: "var(--vault-text-secondary)" }}>
                            Advanced neuromarketing triggers detected. Consider identity shift framing and status elevation psychology for premium positioning.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <VaultSupremeButton variant="primary">
                      Upgrade for Council Access
                    </VaultSupremeButton>
                  )}
                </div>
              </VaultSupremePanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Platinum Components */}
        {weeklySummary && (
          <>
            <PlatinumROICalculator 
              industry={industry} 
              qualificationScore={weeklySummary.hooksGenerated} 
            />
            
            <PlatinumSamplePreview 
              qualificationScore={weeklySummary.hooksGenerated}
              industry={industry}
            />
            
            <OperatorBadge 
              qualificationScore={weeklySummary.hooksGenerated}
              candidateCode={candidateCode}
            />
            
            <CouncilPreviewInvite 
              qualificationScore={weeklySummary.hooksGenerated}
            />
          </>
        )}
      </div>
    </VaultForgeSupreme>
  );
}