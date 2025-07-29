import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, TrendingUp, Users, Target, Award, ChevronRight, Download, Copy, Share, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface EliteVaultInterfaceProps {
  onComplete: () => void;
}

interface EliteFormData {
  industry: string;
  targetAudience: string;
  businessModel: string;
  painPoint: string;
  desiredOutcome: string;
  pricePoint: string;
  brandPersonality: string;
  competitorAnalysis: string;
}

// Enhanced SaaS-style color system
const ELITE_BRAND_COLORS = {
  fitness: {
    primary: "#00D4AA",
    secondary: "#00B894",
    accent: "#00CEC9",
    gradient: "linear-gradient(135deg, #00D4AA 0%, #00B894 50%, #00A085 100%)",
    glow: "rgba(0, 212, 170, 0.3)"
  },
  business: {
    primary: "#0984E3", 
    secondary: "#0C7CD5",
    accent: "#74B9FF",
    gradient: "linear-gradient(135deg, #0984E3 0%, #0C7CD5 50%, #005AA7 100%)",
    glow: "rgba(9, 132, 227, 0.3)"
  },
  finance: {
    primary: "#F39C12",
    secondary: "#E67E22", 
    accent: "#F1C40F",
    gradient: "linear-gradient(135deg, #F39C12 0%, #E67E22 50%, #D35400 100%)",
    glow: "rgba(243, 156, 18, 0.3)"
  },
  technology: {
    primary: "#6C5CE7",
    secondary: "#A29BFE",
    accent: "#FD79A8",
    gradient: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 50%, #74B9FF 100%)",
    glow: "rgba(108, 92, 231, 0.3)"
  },
  consulting: {
    primary: "#00B894",
    secondary: "#00CEC9",
    accent: "#F39C12", 
    gradient: "linear-gradient(135deg, #00B894 0%, #00CEC9 50%, #6C5CE7 100%)",
    glow: "rgba(0, 184, 148, 0.3)"
  }
};

interface EliteContentResult {
  strategicFramework: {
    marketPosition: string;
    competitiveDifferentiation: string;
    psychologicalTriggers: string[];
    conversionStrategy: string;
  };
  campaignAssets: {
    hook: string;
    problemAgitation: string;
    authorityBuilding: string;
    solutionPresentation: string;
    socialProof: string;
    urgencyMechanism: string;
    callToAction: string;
  };
  psychologicalProfile: {
    customerAvatar: string;
    emotionalDrivers: string[];
    cognitiveBiases: string[];
    decisionMakingProcess: string;
  };
  marketIntelligence: {
    industryInsights: string;
    trendAnalysis: string;
    opportunityGaps: string[];
    riskFactors: string[];
  };
  conversionOptimization: {
    primaryMessage: string;
    secondaryMessages: string[];
    objectionHandling: string[];
    valueStackBuilding: string;
  };
}

export default function EliteVaultInterface({ onComplete }: EliteVaultInterfaceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<EliteFormData>({
    industry: "",
    targetAudience: "",
    businessModel: "",
    painPoint: "",
    desiredOutcome: "",
    pricePoint: "",
    brandPersonality: "",
    competitorAnalysis: ""
  });
  const [eliteContent, setEliteContent] = useState<EliteContentResult | null>(null);
  const { toast } = useToast();

  const brandColors = ELITE_BRAND_COLORS[formData.industry.toLowerCase() as keyof typeof ELITE_BRAND_COLORS] 
    || ELITE_BRAND_COLORS.consulting;

  const steps = [
    "Strategic Foundation",
    "Market Intelligence", 
    "Elite Content Generation",
    "Campaign Deployment"
  ];

  const generateEliteContent = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const mockEliteContent: EliteContentResult = {
        strategicFramework: {
          marketPosition: "Premium market leader leveraging advanced behavioral psychology and proprietary methodologies to deliver transformational outcomes for high-achieving professionals seeking accelerated results.",
          competitiveDifferentiation: "Exclusive access to neuropsychological optimization protocols developed through 15+ years of executive coaching research, combined with data-driven personalization algorithms that adapt to individual cognitive patterns and success frameworks.",
          psychologicalTriggers: ["Executive Authority Positioning", "Scarcity Through Exclusivity", "Achievement-Based Social Proof", "Neurological Pattern Recognition"],
          conversionStrategy: "Multi-phase psychological progression utilizing cognitive commitment escalation, social validation anchoring, and executive decision-making frameworks to create irresistible momentum toward enrollment."
        },
        campaignAssets: {
          hook: "The hidden neurological pattern that separates $100K executives from $1M+ leaders (and why your current success strategies are actually limiting your next breakthrough)",
          problemAgitation: "You've achieved significant success through discipline and intelligence, yet you're hitting invisible ceilings that feel impossible to break. Despite working harder than ever, you're watching peers advance past you, securing opportunities and recognition that should be yours. The strategies that got you here aren't just insufficient—they're actively sabotaging your next level of achievement.",
          authorityBuilding: "After 15 years developing breakthrough protocols for Fortune 500 executives, I've identified the precise neurological and behavioral patterns that distinguish top-tier performers. My clients include 47 C-suite executives, 12 Forbes-featured entrepreneurs, and leaders from Goldman Sachs, McKinsey, and Tesla who've achieved 300-400% income increases within 18 months.",
          solutionPresentation: "The Executive Peak Performance Protocol™ combines cutting-edge neurofeedback optimization, strategic behavioral reprogramming, and exclusive access to executive-level opportunity networks. This isn't coaching—it's cognitive architecture redesign for sustained peak performance.",
          socialProof: "David Chen (Tesla VP): 'Increased my strategic decision speed by 300% and secured promotion to SVP within 8 months.' Sarah Martinez (Goldman Sachs MD): 'Finally cracked the code on executive presence—landed three board positions and doubled my equity compensation.'",
          urgencyMechanism: "I only accept 12 new executives per year into this program. Current cohort applications close in 72 hours, and the next availability isn't until Q3 2026. The neurological optimization window requires immediate action—delay costs exponential opportunity.",
          callToAction: "Claim your Executive Assessment Call (normally $2,500, complimentary for qualified candidates) within the next 48 hours. We'll analyze your cognitive performance patterns and determine if you qualify for our Q4 Executive Cohort."
        },
        psychologicalProfile: {
          customerAvatar: "High-achieving executive or entrepreneur, 35-55 years old, currently earning $150K-$500K annually, possesses strong analytical mindset, values efficiency and measurable results, faces plateau frustration despite previous success, prioritizes elite networking and recognition, makes decisions based on ROI and competitive advantage.",
          emotionalDrivers: ["Achievement Recognition", "Competitive Superiority", "Legacy Building", "Intellectual Mastery", "Status Elevation", "Control and Influence"],
          cognitiveBiases: ["Authority Bias toward proven expertise", "Scarcity Bias for exclusive opportunities", "Confirmation Bias for data-driven validation", "Loss Aversion for missing competitive advantages"],
          decisionMakingProcess: "Rational evaluation of ROI and credentials, followed by emotional validation through peer success stories and exclusive positioning, with final commitment triggered by scarcity and competitive urgency."
        },
        marketIntelligence: {
          industryInsights: "Executive coaching market experiencing 15% annual growth, driven by increasing complexity of leadership roles and competitive pressure for sustained performance. Premium segment ($10K+ programs) growing 23% annually as executives seek differentiated advantages.",
          trendAnalysis: "Shift toward neuroscience-based optimization, data-driven personalization, and exclusive peer networks. Traditional coaching approaches becoming commoditized while premium, research-backed programs command higher valuations.",
          opportunityGaps: ["Lack of neuroscience integration in current offerings", "Insufficient peer networking components", "Generic rather than personalized approaches", "Limited measurable outcome tracking"],
          riskFactors: ["Market saturation in basic coaching", "Economic sensitivity for discretionary spending", "Increased competition from corporate internal programs", "Client expectation escalation"]
        },
        conversionOptimization: {
          primaryMessage: "Unlock the neurological patterns of $1M+ executives through scientifically-proven optimization protocols that deliver measurable performance breakthroughs in 90 days or less.",
          secondaryMessages: ["Exclusive access to Fortune 500 executive networks", "Proprietary neurological assessment and optimization", "Guaranteed measurable results within 90 days", "Limited to 12 executives per year for maximum personalization"],
          objectionHandling: ["Price: 'The opportunity cost of staying at your current performance level far exceeds this investment'", "Time: 'This program is designed specifically for executives with limited time—2 hours per week maximum'", "Trust: 'Every client undergoes the same neurological assessment process used by Olympic athletes and Navy SEALs'"],
          valueStackBuilding: "Complete neurological optimization assessment ($5,000 value), personalized cognitive enhancement protocol ($8,000 value), exclusive executive network access ($12,000 value), quarterly performance tracking and optimization ($6,000 value), lifetime access to updated protocols ($15,000 value). Total value: $46,000. Investment: $25,000."
        }
      };

      setEliteContent(mockEliteContent);
      setCurrentStep(2);
      
      toast({
        title: "Elite Content Generated",
        description: "Strategic framework and campaign assets created with enterprise-level sophistication",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportContent = async (format: 'pdf' | 'copy' | 'campaign') => {
    if (!eliteContent) return;
    
    if (format === 'copy') {
      const fullContent = `
STRATEGIC FRAMEWORK
Market Position: ${eliteContent.strategicFramework.marketPosition}

CAMPAIGN ASSETS
Hook: ${eliteContent.campaignAssets.hook}
Problem: ${eliteContent.campaignAssets.problemAgitation}
Authority: ${eliteContent.campaignAssets.authorityBuilding}
Solution: ${eliteContent.campaignAssets.solutionPresentation}
Social Proof: ${eliteContent.campaignAssets.socialProof}
Urgency: ${eliteContent.campaignAssets.urgencyMechanism}
Call to Action: ${eliteContent.campaignAssets.callToAction}

PSYCHOLOGICAL PROFILE
Customer Avatar: ${eliteContent.psychologicalProfile.customerAvatar}
Decision Process: ${eliteContent.psychologicalProfile.decisionMakingProcess}

VALUE OPTIMIZATION
Primary Message: ${eliteContent.conversionOptimization.primaryMessage}
Value Stack: ${eliteContent.conversionOptimization.valueStackBuilding}
      `;
      
      await navigator.clipboard.writeText(fullContent);
      toast({
        title: "Content Copied",
        description: "Elite campaign content copied to clipboard"
      });
    } else {
      toast({
        title: `${format.toUpperCase()} Export`,
        description: "Feature available in production version"
      });
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          ${brandColors.gradient},
          radial-gradient(circle at 25% 25%, ${brandColors.glow} 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, ${brandColors.glow} 0%, transparent 50%)
        `,
        backgroundColor: "#0a0e1a"
      }}
    >
      {/* Salesforce-style accent bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: brandColors.primary }}
      />
      
      {/* Premium overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40 backdrop-blur-[0.5px]" />
      
      <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
        
        {/* Enhanced Progress Indicator */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onComplete}
              className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vault
            </Button>
            
            <div className="flex items-center space-x-2 text-white/60 text-sm">
              <Crown className="w-4 h-4" style={{ color: brandColors.accent }} />
              <span>VAULTFORGE ELITE</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-300`}
                style={{
                  backgroundColor: index <= currentStep ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
                  borderColor: index <= currentStep ? brandColors.primary : "rgba(255, 255, 255, 0.1)",
                  color: index <= currentStep ? "white" : "rgba(255, 255, 255, 0.5)",
                  boxShadow: index <= currentStep ? `0 0 20px ${brandColors.glow}` : "none"
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium`}
                    style={{
                      backgroundColor: index <= currentStep ? brandColors.primary : "rgba(255, 255, 255, 0.1)",
                      color: index <= currentStep ? "white" : "rgba(255, 255, 255, 0.5)"
                    }}
                  >
                    {index + 1}
                  </div>
                  <span className="font-light tracking-wide">{step}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Strategic Foundation */}
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              <div 
                className="backdrop-blur-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border rounded-2xl p-10 shadow-2xl"
                style={{ borderColor: `${brandColors.primary}30` }}
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: brandColors.gradient }}
                  >
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-light text-white tracking-wide">Strategic Foundation</h2>
                    <p className="text-white/60 text-lg font-light mt-2">Establish the elite framework for your campaign</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-xl font-light text-white mb-6 tracking-wide">Market Positioning</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white/70 text-sm font-light mb-2 tracking-wide">Industry Vertical</label>
                        <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white backdrop-blur-sm">
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl">
                            <SelectItem value="fitness">Fitness & Health Optimization</SelectItem>
                            <SelectItem value="business">Business & Executive Coaching</SelectItem>
                            <SelectItem value="finance">Finance & Investment Strategy</SelectItem>
                            <SelectItem value="technology">Technology & Innovation</SelectItem>
                            <SelectItem value="consulting">Strategic Consulting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm font-light mb-2 tracking-wide">Target Audience Profile</label>
                        <Textarea
                          value={formData.targetAudience}
                          onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                          placeholder="High-achieving executives seeking performance optimization..."
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-sm min-h-[100px]"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm font-light mb-2 tracking-wide">Business Model</label>
                        <Select value={formData.businessModel} onValueChange={(value) => setFormData(prev => ({ ...prev, businessModel: value }))}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white backdrop-blur-sm">
                            <SelectValue placeholder="Select business model" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl">
                            <SelectItem value="high-ticket-coaching">High-Ticket Coaching ($10K-$50K)</SelectItem>
                            <SelectItem value="mastermind">Executive Mastermind ($25K-$100K)</SelectItem>
                            <SelectItem value="consulting">Strategic Consulting ($50K-$500K)</SelectItem>
                            <SelectItem value="transformation">Transformation Program ($5K-$25K)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h3 className="text-xl font-light text-white mb-6 tracking-wide">Strategic Intelligence</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white/70 text-sm font-light mb-2 tracking-wide">Core Pain Point</label>
                        <Textarea
                          value={formData.painPoint}
                          onChange={(e) => setFormData(prev => ({ ...prev, painPoint: e.target.value }))}
                          placeholder="Performance plateaus limiting executive advancement..."
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-sm min-h-[80px]"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm font-light mb-2 tracking-wide">Desired Outcome</label>
                        <Textarea
                          value={formData.desiredOutcome}
                          onChange={(e) => setFormData(prev => ({ ...prev, desiredOutcome: e.target.value }))}
                          placeholder="Breakthrough to next-level performance and recognition..."
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-sm min-h-[80px]"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm font-light mb-2 tracking-wide">Price Point Strategy</label>
                        <Input
                          value={formData.pricePoint}
                          onChange={(e) => setFormData(prev => ({ ...prev, pricePoint: e.target.value }))}
                          placeholder="$25,000 annual program"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  className="mt-12 flex justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => setCurrentStep(1)}
                    className="text-white font-medium px-12 py-4 rounded-xl transition-all duration-300 shadow-2xl"
                    style={{ 
                      background: brandColors.gradient,
                      boxShadow: `0 10px 25px ${brandColors.glow}`
                    }}
                    disabled={!formData.industry || !formData.targetAudience || !formData.businessModel}
                  >
                    Continue to Market Intelligence
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Market Intelligence */}
          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              <div 
                className="backdrop-blur-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border rounded-2xl p-10 shadow-2xl"
                style={{ borderColor: `${brandColors.primary}30` }}
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: brandColors.gradient }}
                  >
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-light text-white tracking-wide">Market Intelligence</h2>
                    <p className="text-white/60 text-lg font-light mt-2">Advanced competitive and behavioral analysis</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-xl font-light text-white mb-6 tracking-wide">Brand Psychology</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white/70 text-sm font-light mb-2 tracking-wide">Brand Personality</label>
                        <Select value={formData.brandPersonality} onValueChange={(value) => setFormData(prev => ({ ...prev, brandPersonality: value }))}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white backdrop-blur-sm">
                            <SelectValue placeholder="Select brand archetype" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl">
                            <SelectItem value="authority">Authority Expert (McKinsey-style)</SelectItem>
                            <SelectItem value="innovator">Disruptive Innovator (Tesla-style)</SelectItem>
                            <SelectItem value="mentor">Trusted Mentor (Buffett-style)</SelectItem>
                            <SelectItem value="transformer">Peak Transformer (Tony Robbins-style)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm font-light mb-2 tracking-wide">Competitive Analysis</label>
                        <Textarea
                          value={formData.competitorAnalysis}
                          onChange={(e) => setFormData(prev => ({ ...prev, competitorAnalysis: e.target.value }))}
                          placeholder="Key competitors: Tony Robbins ($10K programs), Strategic Coach ($25K), etc..."
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-sm min-h-[120px]"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h3 className="text-xl font-light text-white mb-6 tracking-wide">Performance Metrics</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <motion.div
                        className="text-center p-6 backdrop-blur-sm bg-white/[0.04] rounded-xl border shadow-lg"
                        style={{ borderColor: `${brandColors.primary}30` }}
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          boxShadow: `0 15px 35px ${brandColors.glow}`
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div 
                          className="text-4xl font-light mb-2 tracking-wide"
                          style={{ color: brandColors.primary }}
                        >
                          94%
                        </div>
                        <div className="text-white/80 text-sm font-medium uppercase tracking-wider">Elite Conversion</div>
                      </motion.div>

                      <motion.div
                        className="text-center p-6 backdrop-blur-sm bg-white/[0.04] rounded-xl border shadow-lg"
                        style={{ borderColor: `${brandColors.accent}30` }}
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          boxShadow: `0 15px 35px ${brandColors.glow}`
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div 
                          className="text-4xl font-light mb-2 tracking-wide"
                          style={{ color: brandColors.accent }}
                        >
                          $2.3M
                        </div>
                        <div className="text-white/80 text-sm font-medium uppercase tracking-wider">Avg Client Value</div>
                      </motion.div>

                      <motion.div
                        className="text-center p-6 backdrop-blur-sm bg-white/[0.04] rounded-xl border shadow-lg"
                        style={{ borderColor: `${brandColors.secondary}30` }}
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          boxShadow: `0 15px 35px ${brandColors.glow}`
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div 
                          className="text-4xl font-light mb-2 tracking-wide"
                          style={{ color: brandColors.secondary }}
                        >
                          15x
                        </div>
                        <div className="text-white/80 text-sm font-medium uppercase tracking-wider">ROI Multiple</div>
                      </motion.div>

                      <motion.div
                        className="text-center p-6 backdrop-blur-sm bg-white/[0.04] rounded-xl border shadow-lg"
                        style={{ borderColor: `${brandColors.primary}30` }}
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          boxShadow: `0 15px 35px ${brandColors.glow}`
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div 
                          className="text-4xl font-light mb-2 tracking-wide"
                          style={{ color: brandColors.primary }}
                        >
                          98%
                        </div>
                        <div className="text-white/80 text-sm font-medium uppercase tracking-wider">Retention Rate</div>
                      </motion.div>
                    </div>
                    
                    <div className="text-white/60 text-sm">
                      <p className="mb-2">• Market-leading conversion rates through psychological optimization</p>
                      <p className="mb-2">• Premium pricing strategy with exceptional client outcomes</p>
                      <p>• Elite positioning drives superior customer lifetime value</p>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  className="mt-12 flex justify-center space-x-4"
                >
                  <Button
                    onClick={() => setCurrentStep(0)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4"
                  >
                    Back
                  </Button>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={generateEliteContent}
                      className="text-white font-medium px-12 py-4 rounded-xl transition-all duration-300 shadow-2xl"
                      style={{ 
                        background: brandColors.gradient,
                        boxShadow: `0 10px 25px ${brandColors.glow}`
                      }}
                      disabled={!formData.brandPersonality || isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Generating Elite Content...
                        </>
                      ) : (
                        <>
                          Generate Elite Campaign
                          <Sparkles className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Elite Content Results */}
          {currentStep === 2 && eliteContent && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              <div 
                className="backdrop-blur-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border rounded-2xl p-10 shadow-2xl"
                style={{ borderColor: `${brandColors.primary}30` }}
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: brandColors.gradient }}
                  >
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-light text-white tracking-wide">Elite Campaign Assets</h2>
                    <p className="text-white/60 text-lg font-light mt-2">Enterprise-level content with psychological sophistication</p>
                  </div>
                </div>

                <div className="space-y-8">
                  
                  {/* Strategic Framework */}
                  <motion.div
                    className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-light text-white mb-6 tracking-wide flex items-center">
                      <Target className="w-6 h-6 mr-3" style={{ color: brandColors.accent }} />
                      Strategic Framework
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-light mb-3" style={{ color: brandColors.accent }}>Market Position</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.strategicFramework.marketPosition}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-light mb-3" style={{ color: brandColors.accent }}>Competitive Differentiation</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.strategicFramework.competitiveDifferentiation}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-lg font-light mb-3" style={{ color: brandColors.accent }}>Psychological Triggers</h4>
                      <div className="flex flex-wrap gap-2">
                        {eliteContent.strategicFramework.psychologicalTriggers.map((trigger, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 rounded-full text-white/70 text-sm backdrop-blur-sm"
                            style={{ 
                              backgroundColor: `${brandColors.primary}20`,
                              border: `1px solid ${brandColors.primary}30`
                            }}
                          >
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Campaign Assets */}
                  <motion.div
                    className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h3 className="text-2xl font-light text-white mb-6 tracking-wide flex items-center">
                      <Sparkles className="w-6 h-6 mr-3" style={{ color: brandColors.accent }} />
                      Campaign Copy Assets
                    </h3>
                    <div className="space-y-6">
                      
                      <div 
                        className="p-6 rounded-xl border backdrop-blur-sm"
                        style={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderColor: `${brandColors.primary}30`
                        }}
                      >
                        <h4 className="text-lg font-light mb-3" style={{ color: brandColors.accent }}>Hook</h4>
                        <p className="text-white/90 text-lg leading-relaxed italic">"{eliteContent.campaignAssets.hook}"</p>
                      </div>

                      <div 
                        className="p-6 rounded-xl border backdrop-blur-sm"
                        style={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderColor: `${brandColors.primary}30`
                        }}
                      >
                        <h4 className="text-lg font-light mb-3" style={{ color: brandColors.accent }}>Problem Agitation</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.campaignAssets.problemAgitation}</p>
                      </div>

                      <div 
                        className="p-6 rounded-xl border backdrop-blur-sm"
                        style={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderColor: `${brandColors.primary}30`
                        }}
                      >
                        <h4 className="text-lg font-light mb-3" style={{ color: brandColors.accent }}>Authority Building</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.campaignAssets.authorityBuilding}</p>
                      </div>

                      <div 
                        className="p-6 rounded-xl border backdrop-blur-sm"
                        style={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderColor: `${brandColors.primary}30`
                        }}
                      >
                        <h4 className="text-lg font-light mb-3" style={{ color: brandColors.accent }}>Solution Presentation</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.campaignAssets.solutionPresentation}</p>
                      </div>

                      <div 
                        className="p-6 rounded-xl border backdrop-blur-sm"
                        style={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderColor: `${brandColors.primary}30`
                        }}
                      >
                        <h4 className="text-lg font-light mb-3" style={{ color: brandColors.accent }}>Social Proof</h4>
                        <p className="text-white/80 leading-relaxed italic">"{eliteContent.campaignAssets.socialProof}"</p>
                      </div>

                      <div 
                        className="p-6 rounded-xl border backdrop-blur-sm"
                        style={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderColor: `${brandColors.primary}30`
                        }}
                      >
                        <h4 className="text-lg font-light mb-3" style={{ color: brandColors.accent }}>Urgency Mechanism</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.campaignAssets.urgencyMechanism}</p>
                      </div>

                      <div 
                        className="p-6 rounded-xl border backdrop-blur-sm"
                        style={{ 
                          background: `linear-gradient(135deg, ${brandColors.primary}10, ${brandColors.accent}10)`,
                          borderColor: `${brandColors.accent}40`
                        }}
                      >
                        <h4 className="text-lg font-light mb-3" style={{ color: brandColors.accent }}>Call to Action</h4>
                        <p className="text-white/90 text-lg leading-relaxed font-medium">{eliteContent.campaignAssets.callToAction}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Export Actions */}
                  <motion.div 
                    className="mt-12 flex justify-center space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <Button
                      onClick={() => exportContent('copy')}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-8 py-4"
                    >
                      <Copy className="w-5 h-5 mr-2" />
                      Copy All Content
                    </Button>
                    
                    <Button
                      onClick={() => exportContent('pdf')}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-8 py-4"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Export as PDF
                    </Button>
                    
                    <Button
                      onClick={() => exportContent('campaign')}
                      className="text-white font-medium px-12 py-4 rounded-xl transition-all duration-300 shadow-2xl"
                      style={{ 
                        background: brandColors.gradient,
                        boxShadow: `0 15px 35px ${brandColors.glow}`
                      }}
                    >
                      <Share className="w-5 h-5 mr-2" />
                      Deploy Campaign
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}