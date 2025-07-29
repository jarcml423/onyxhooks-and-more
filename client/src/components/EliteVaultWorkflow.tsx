import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, TrendingUp, Users, Target, Award, ChevronRight, Download, Copy, Share, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import EliteVaultExperience, { LuxuryCard, ConsultingSection, MetricDisplay } from "./EliteVaultExperience";
import IndustryBackground, { ConsultingCard, PremiumMetric } from "./IndustryBackgrounds";
import SaasPalette, { BrandCard, BrandButton, BrandMetric } from "./SaasPalettes";
import { apiRequest } from "@/lib/queryClient";

interface EliteVaultWorkflowProps {
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

export default function EliteVaultWorkflow({ onComplete }: EliteVaultWorkflowProps) {
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

  const steps = [
    "Strategic Foundation",
    "Market Intelligence", 
    "Elite Content Generation",
    "Campaign Deployment"
  ];

  const generateEliteContent = async () => {
    setIsGenerating(true);
    try {
      // Demo elite content generation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
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
    <SaasPalette industry={formData.industry || "consulting"} variant="premium">
      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Elite Progress Indicator */}
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
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Elite Content Generation</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-white/10 border-amber-400/50 text-white'
                    : 'bg-white/5 border-white/10 text-white/50'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep ? 'bg-amber-400 text-black' : 'bg-white/10'
                  }`}>
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
              <ConsultingSection
                title="Strategic Foundation"
                subtitle="Establish the elite framework for your campaign"
                icon={Target}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <LuxuryCard delay={0.2}>
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
                  </LuxuryCard>

                  <LuxuryCard delay={0.4}>
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
                  </LuxuryCard>
                </div>

                <motion.div 
                  className="mt-12 flex justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => setCurrentStep(1)}
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-medium px-12 py-4 rounded-xl hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 shadow-2xl"
                    disabled={!formData.industry || !formData.targetAudience || !formData.businessModel}
                  >
                    Continue to Market Intelligence
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </ConsultingSection>
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
              <ConsultingSection
                title="Market Intelligence"
                subtitle="Advanced competitive and behavioral analysis"
                icon={TrendingUp}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <LuxuryCard delay={0.2}>
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
                  </LuxuryCard>

                  <LuxuryCard delay={0.4}>
                    <h3 className="text-xl font-light text-white mb-6 tracking-wide">Performance Metrics</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <MetricDisplay value="94%" label="Elite Conversion" trend="up" color="emerald" />
                      <MetricDisplay value="$2.3M" label="Avg Client Value" trend="up" color="amber" />
                      <MetricDisplay value="15x" label="ROI Multiple" trend="up" color="blue" />
                      <MetricDisplay value="98%" label="Retention Rate" trend="up" color="purple" />
                    </div>
                    <div className="text-white/60 text-sm">
                      <p className="mb-2">• Market-leading conversion rates through psychological optimization</p>
                      <p className="mb-2">• Premium pricing strategy with exceptional client outcomes</p>
                      <p>• Elite positioning drives superior customer lifetime value</p>
                    </div>
                  </LuxuryCard>
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
                      className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-medium px-12 py-4 rounded-xl hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 shadow-2xl"
                      disabled={!formData.brandPersonality || isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full mr-2"
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
              </ConsultingSection>
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
              <ConsultingSection
                title="Elite Campaign Assets"
                subtitle="Enterprise-level content with psychological sophistication"
                icon={Award}
              >
                <div className="space-y-8">
                  
                  {/* Strategic Framework */}
                  <LuxuryCard delay={0.2}>
                    <h3 className="text-2xl font-light text-white mb-6 tracking-wide flex items-center">
                      <Target className="w-6 h-6 mr-3 text-amber-400" />
                      Strategic Framework
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-light text-amber-400 mb-3">Market Position</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.strategicFramework.marketPosition}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-light text-amber-400 mb-3">Competitive Differentiation</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.strategicFramework.competitiveDifferentiation}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-lg font-light text-amber-400 mb-3">Psychological Triggers</h4>
                      <div className="flex flex-wrap gap-2">
                        {eliteContent.strategicFramework.psychologicalTriggers.map((trigger, index) => (
                          <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm backdrop-blur-sm">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  </LuxuryCard>

                  {/* Campaign Assets */}
                  <LuxuryCard delay={0.4}>
                    <h3 className="text-2xl font-light text-white mb-6 tracking-wide flex items-center">
                      <Sparkles className="w-6 h-6 mr-3 text-amber-400" />
                      Campaign Copy Assets
                    </h3>
                    <div className="space-y-6">
                      
                      <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <h4 className="text-lg font-light text-amber-400 mb-3">Hook</h4>
                        <p className="text-white/90 text-lg leading-relaxed italic">"{eliteContent.campaignAssets.hook}"</p>
                      </div>

                      <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <h4 className="text-lg font-light text-amber-400 mb-3">Problem Agitation</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.campaignAssets.problemAgitation}</p>
                      </div>

                      <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <h4 className="text-lg font-light text-amber-400 mb-3">Authority Building</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.campaignAssets.authorityBuilding}</p>
                      </div>

                      <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <h4 className="text-lg font-light text-amber-400 mb-3">Solution Presentation</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.campaignAssets.solutionPresentation}</p>
                      </div>

                      <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <h4 className="text-lg font-light text-amber-400 mb-3">Social Proof</h4>
                        <p className="text-white/80 leading-relaxed italic">"{eliteContent.campaignAssets.socialProof}"</p>
                      </div>

                      <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <h4 className="text-lg font-light text-amber-400 mb-3">Urgency Mechanism</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.campaignAssets.urgencyMechanism}</p>
                      </div>

                      <div className="p-6 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-xl border border-amber-400/20 backdrop-blur-sm">
                        <h4 className="text-lg font-light text-amber-400 mb-3">Call to Action</h4>
                        <p className="text-white/90 text-lg leading-relaxed font-medium">{eliteContent.campaignAssets.callToAction}</p>
                      </div>
                    </div>
                  </LuxuryCard>

                  {/* Psychological Profile */}
                  <LuxuryCard delay={0.6}>
                    <h3 className="text-2xl font-light text-white mb-6 tracking-wide flex items-center">
                      <Users className="w-6 h-6 mr-3 text-amber-400" />
                      Psychological Intelligence
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-light text-amber-400 mb-3">Customer Avatar</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.psychologicalProfile.customerAvatar}</p>
                        
                        <h4 className="text-lg font-light text-amber-400 mb-3 mt-6">Emotional Drivers</h4>
                        <div className="flex flex-wrap gap-2">
                          {eliteContent.psychologicalProfile.emotionalDrivers.map((driver, index) => (
                            <span key={index} className="px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-emerald-400 text-sm">
                              {driver}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-light text-amber-400 mb-3">Decision-Making Process</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.psychologicalProfile.decisionMakingProcess}</p>
                        
                        <h4 className="text-lg font-light text-amber-400 mb-3 mt-6">Cognitive Biases</h4>
                        <div className="flex flex-wrap gap-2">
                          {eliteContent.psychologicalProfile.cognitiveBiases.map((bias, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-400/10 border border-blue-400/20 rounded-full text-blue-400 text-sm">
                              {bias}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </LuxuryCard>

                  {/* Value Optimization */}
                  <LuxuryCard delay={0.8}>
                    <h3 className="text-2xl font-light text-white mb-6 tracking-wide flex items-center">
                      <TrendingUp className="w-6 h-6 mr-3 text-amber-400" />
                      Conversion Optimization
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-light text-amber-400 mb-3">Primary Value Message</h4>
                        <p className="text-white/90 text-lg leading-relaxed">{eliteContent.conversionOptimization.primaryMessage}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-light text-amber-400 mb-3">Value Stack Architecture</h4>
                        <p className="text-white/80 leading-relaxed">{eliteContent.conversionOptimization.valueStackBuilding}</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-light text-amber-400 mb-3">Objection Handling Framework</h4>
                        <div className="space-y-2">
                          {eliteContent.conversionOptimization.objectionHandling.map((objection, index) => (
                            <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <p className="text-white/80 text-sm">{objection}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </LuxuryCard>

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
                      className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-medium px-12 py-4 rounded-xl hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 shadow-2xl"
                    >
                      <Share className="w-5 h-5 mr-2" />
                      Deploy Campaign
                    </Button>
                  </motion.div>
                </div>
              </ConsultingSection>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SaasPalette>
  );
}