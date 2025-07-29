import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import CouncilSelector, { type CouncilMember, councilMembers } from "./CouncilSelector";
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Download, 
  Mail, 
  Copy,
  Eye,
  Edit3,
  Lightbulb,
  Target,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";

type WorkflowStep = 'welcome' | 'council' | 'inputs' | 'generation' | 'review' | 'export';

interface VaultWorkflowProps {
  onComplete?: (result: any) => void;
}

const niches = [
  "Business Coaching",
  "Health & Fitness",
  "Relationship Coaching", 
  "Financial Education",
  "Personal Development",
  "Marketing Consulting",
  "Life Coaching",
  "Career Transition",
  "Spiritual Guidance",
  "Other"
];

const tones = [
  { value: "authoritative", label: "Authoritative & Expert" },
  { value: "conversational", label: "Conversational & Friendly" },
  { value: "urgent", label: "Urgent & Direct" },
  { value: "empathetic", label: "Empathetic & Understanding" },
  { value: "bold", label: "Bold & Provocative" }
];

export default function VaultWorkflow({ onComplete }: VaultWorkflowProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('welcome');
  const [selectedCouncil, setSelectedCouncil] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<Record<string, string>>({});
  const [showGuidanceCheck, setShowGuidanceCheck] = useState(false);
  const [guidanceChecks, setGuidanceChecks] = useState({
    voiceMatch: false,
    nicheRelevant: false,
    proofValid: false,
    ctaAligned: false
  });
  const [guidanceSkipped, setGuidanceSkipped] = useState(false);
  const [currentGuidanceStep, setCurrentGuidanceStep] = useState<'voice' | 'niche' | 'proof' | 'cta' | 'complete'>('voice');
  const [showCouncilFeedback, setShowCouncilFeedback] = useState(false);
  const [councilScores, setCouncilScores] = useState<Record<string, any>>({});
  const [qualityWarnings, setQualityWarnings] = useState<string[]>([]);
  const [showAssetDeployment, setShowAssetDeployment] = useState(false);
  const [formData, setFormData] = useState({
    niche: "",
    customNiche: "",
    tone: "",
    targetAudience: "",
    painPoint: "",
    desiredOutcome: "",
    pricePoint: ""
  });
  const [generatedContent, setGeneratedContent] = useState({
    hook: "",
    problem: "",
    story: "",
    proof: "",
    offer: "",
    cta: ""
  });

  const stepProgress = {
    welcome: 0,
    council: 20,
    inputs: 40,
    generation: 60,
    review: 80,
    export: 100
  };

  const nextStep = () => {
    const steps: WorkflowStep[] = ['welcome', 'council', 'inputs', 'generation', 'review', 'export'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: WorkflowStep[] = ['welcome', 'council', 'inputs', 'generation', 'review', 'export'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate content based on user's actual niche and target audience
      const isHealthFitness = formData.niche.toLowerCase().includes('health') || formData.niche.toLowerCase().includes('fitness');
      const targetAudience = formData.targetAudience || "people wanting to transform their bodies";
      
      let content;
      
      if (isHealthFitness) {
        const audience = formData.targetAudience.toLowerCase();
        const isExecutive = audience.includes('professional') || audience.includes('executive') || audience.includes('business');
        
        if (isExecutive) {
          content = {
            hook: "I'll show you how to build a bodybuilder's physique working just 4 hours per week – even if you're pulling 60-hour weeks, have zero time to meal prep, and think your genetics suck.",
            problem: "You're crushing it in the boardroom but getting crushed in the mirror. You used to be the guy who could eat pizza at midnight and still see abs. Now you look at a donut and gain 3 pounds. You're working 12-hour days but your workouts are getting weaker, you skip meals then binge eat at 9 PM, and you feel like a fraud wearing expensive suits to hide a dad bod.",
            story: "I remember working with my first executive client - a VP making $200K who couldn't do 10 pushups. He was embarrassed to take his shirt off at company retreats. After 90 days using my system, he added 15 pounds of muscle and lost 25 pounds of fat, all while closing his biggest deal ever.",
            proof: "In 8 years of coaching Georgia's top executives, my clients have added an average of 18 pounds of lean muscle while dropping 23 pounds of fat. David (CEO) went from a 38\" to 32\" waist in 12 weeks. Marcus (Investment Banker) added 2 inches to his arms working just 4 hours per week.",
            offer: "The Executive Physique Transformation - A 90-day body recomposition system that builds championship-level muscle and burns stubborn fat using the same strategic thinking that made you successful in business",
            cta: "Only 12 spots available for Q3 intake. To qualify, you must make at least $100K annually and commit to 4 hours per week. Click below to claim your executive physique transformation."
          };
        } else {
          content = {
            hook: "Stop following workouts designed by 22-year-old trainers who've never had a real job - here's how to build serious muscle in half the time.",
            problem: "You're tired of generic programs that don't work for your body, your schedule, or your goals. You've tried everything - P90X, CrossFit, bodybuilding splits - but nothing sticks because they're designed for people living in the gym, not the real world.",
            story: "I used to think more time in the gym meant better results. Then I started working with busy professionals and realized the opposite was true. Less is more when you know what actually builds muscle and burns fat.",
            proof: "My clients average 15-20 pounds of muscle gain and 20-30 pounds of fat loss in 90 days. Jake went from 195 to 210 with visible abs. Sarah added 8 pounds of muscle while dropping 4 dress sizes. All training 4-5 hours per week max.",
            offer: "The Efficient Physique System - Build maximum muscle and burn stubborn fat with strategic 45-minute workouts that fit your real-world schedule",
            cta: "I only take 25 new transformation clients per quarter. If you're ready to stop spinning your wheels and start seeing real results, claim your spot below."
          };
        }
      } else {
        // Generic coaching content targeting the user's actual customers
        content = {
          hook: `Are you tired of ${formData.painPoint || 'struggling with the same challenges'} while others seem to make it look effortless?`,
          problem: `Most ${targetAudience} fail because they don't have a proven system that actually works for their specific situation. You're left trying random strategies while feeling frustrated and stuck.`,
          story: `I remember when I first started helping people like you - I realized that cookie-cutter approaches never work. Success comes from a personalized system that fits your unique goals and lifestyle.`,
          proof: `In the last 12 months, I've helped over 150 people achieve breakthrough results. My average client sees measurable progress within the first 30 days.`,
          offer: `The ${formData.niche} Transformation System - A step-by-step blueprint designed specifically for ${targetAudience} who want real, lasting results`,
          cta: `Claim your spot in the next 48 hours - I only accept 25 new clients per quarter, and spaces are filling fast`
        };
      }
      
      setGeneratedContent(content);
      nextStep();
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`
    });
  };

  const handleEditSection = (section: string) => {
    setEditingSection(section);
    setEditContent(prev => ({
      ...prev,
      [section]: generatedContent[section as keyof typeof generatedContent]
    }));
  };

  const handleSaveEdit = (section: string) => {
    const newContent = editContent[section] || "";
    setGeneratedContent(prev => ({
      ...prev,
      [section]: newContent
    }));
    setEditingSection(null);
    toast({
      title: "Section updated",
      description: `${section} has been saved successfully`
    });
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
  };

  const updateEditContent = (section: string, value: string) => {
    setEditContent(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const generatePDF = () => {
    const content = Object.entries(generatedContent)
      .map(([section, text]) => `${section.toUpperCase()}\n${text}\n\n`)
      .join('');
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'vault-offer.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Offer downloaded",
      description: "Your offer has been saved as a text file"
    });
  };

  const copyAllToClipboard = () => {
    const content = Object.entries(generatedContent)
      .map(([section, text]) => `${section.toUpperCase()}\n${text}\n\n`)
      .join('');
    
    navigator.clipboard.writeText(content);
    toast({
      title: "Full offer copied",
      description: "Complete offer content copied to clipboard"
    });
  };

  const previewLanding = () => {
    const previewContent = `
      <html>
        <head><title>Offer Preview</title></head>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          ${Object.entries(generatedContent).map(([section, text]) => 
            `<div style="margin-bottom: 30px;">
              <h2 style="color: #333; text-transform: capitalize;">${section}</h2>
              <p style="line-height: 1.6;">${text}</p>
            </div>`
          ).join('')}
        </body>
      </html>
    `;
    
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(previewContent);
      newWindow.document.close();
    }
    
    toast({
      title: "Preview opened",
      description: "Your offer preview has opened in a new window"
    });
  };

  const createAdCampaign = () => {
    const adContent = `
FACEBOOK AD CAMPAIGN - ${formData.niche || 'Your Niche'}

HEADLINE: ${generatedContent.hook}

PRIMARY TEXT:
${generatedContent.problem}

${generatedContent.story}

CALL TO ACTION: ${generatedContent.cta}

OFFER DETAILS:
${generatedContent.offer}

PROOF ELEMENTS:
${generatedContent.proof}

TARGET AUDIENCE: ${formData.targetAudience}
PAIN POINT: ${formData.painPoint}
TONE: ${formData.tone}
    `;

    const element = document.createElement('a');
    const file = new Blob([adContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'facebook-ad-campaign.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Ad campaign created",
      description: "Facebook ad campaign downloaded as text file"
    });
  };

  const buildEmailSequence = () => {
    const emailSequence = `
EMAIL SEQUENCE - ${formData.niche || 'Your Niche'}

EMAIL 1: HOOK EMAIL
Subject: ${generatedContent.hook}
Body: ${generatedContent.problem}

EMAIL 2: STORY EMAIL  
Subject: The story behind this transformation...
Body: ${generatedContent.story}

EMAIL 3: PROOF EMAIL
Subject: Here's the proof it works...
Body: ${generatedContent.proof}

EMAIL 4: OFFER EMAIL
Subject: Ready for your transformation?
Body: ${generatedContent.offer}

EMAIL 5: CTA EMAIL
Subject: Last chance to join...
Body: ${generatedContent.cta}

CAMPAIGN SETTINGS:
Target Audience: ${formData.targetAudience}
Pain Point: ${formData.painPoint}
Tone: ${formData.tone}
Council: ${selectedCouncil.join(', ')}
    `;

    const element = document.createElement('a');
    const file = new Blob([emailSequence], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'email-sequence.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Email sequence created",
      description: "5-email sequence downloaded as text file"
    });
  };

  const startGuidanceCheck = () => {
    setShowGuidanceCheck(true);
    setCurrentGuidanceStep('voice');
  };

  const skipGuidanceCheck = () => {
    setGuidanceSkipped(true);
    setShowGuidanceCheck(false);
    toast({
      title: "Guidance check skipped",
      description: "You can access Next Best Actions now"
    });
  };

  const completeGuidanceStep = (step: string, isValid: boolean) => {
    const updatedChecks = {
      ...guidanceChecks,
      [step]: isValid
    };
    setGuidanceChecks(updatedChecks);

    // Move to next step
    const steps = ['voice', 'niche', 'proof', 'cta'];
    const stepKeys = ['voiceMatch', 'nicheRelevant', 'proofValid', 'ctaAligned'];
    const currentIndex = steps.indexOf(currentGuidanceStep);
    const nextStep = steps[currentIndex + 1];
    
    if (nextStep) {
      setCurrentGuidanceStep(nextStep as any);
    } else {
      // All steps complete
      setCurrentGuidanceStep('complete');
      setShowGuidanceCheck(false);
      
      // Force update to enable Next Best Actions
      setTimeout(() => {
        toast({
          title: "Guidance check complete",
          description: "You can now access Next Best Actions"
        });
      }, 100);
    }
  };

  const allChecksComplete = Object.values(guidanceChecks).every(check => check === true);
  const canAccessNextActions = allChecksComplete || guidanceSkipped;

  const validateOfferQuality = () => {
    const warnings: string[] = [];
    
    // Hook urgency + pattern break validation
    if (!generatedContent.hook?.includes('?') && !generatedContent.hook?.includes('!')) {
      warnings.push("Hook lacks urgency - missing question or exclamation");
    }
    
    // Proof credibility validation
    if (!generatedContent.proof?.match(/\d+/)) {
      warnings.push("Numbers in proof lack anchor (e.g. timeframe or volume)");
    }
    
    // Story transformation validation
    if (!generatedContent.story?.toLowerCase().includes('transform') && 
        !generatedContent.story?.toLowerCase().includes('change') &&
        !generatedContent.story?.toLowerCase().includes('result')) {
      warnings.push("No emotional contrast in story");
    }
    
    // CTA urgency validation
    if (!generatedContent.cta?.toLowerCase().includes('now') && 
        !generatedContent.cta?.toLowerCase().includes('today') &&
        !generatedContent.cta?.toLowerCase().includes('limited')) {
      warnings.push("Missing scarcity in CTA");
    }
    
    setQualityWarnings(warnings);
    return warnings.length === 0;
  };

  const triggerCouncilFeedback = () => {
    // Simulate council feedback scores
    const mockScores = {
      alex: { score: Math.floor(Math.random() * 3) + 8, quote: "Strong monetization angle", suggestion: "Add price anchoring" },
      sabri: { score: Math.floor(Math.random() * 3) + 8, quote: "Hook creates curiosity gap", suggestion: "Sharpen the pattern interrupt" },
      mo: { score: Math.floor(Math.random() * 3) + 8, quote: "Clear and precise messaging", suggestion: "Tighten the transformation promise" },
      olivia: { score: Math.floor(Math.random() * 3) + 8, quote: "Emotional resonance detected", suggestion: "Amplify the pain point" },
      michael: { score: Math.floor(Math.random() * 3) + 8, quote: "Funnel-ready structure", suggestion: "Optimize the conversion path" }
    };
    setCouncilScores(mockScores);
    setShowCouncilFeedback(true);
  };

  const deployAssets = () => {
    setShowAssetDeployment(true);
    toast({
      title: "Assets deploying",
      description: "Generating ad copy, email sequences, and sales materials"
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
              </motion.div>
              <h1 className="text-4xl font-bold gradient-text">
                Welcome to VaultForge
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The elite AI system that transforms your ideas into high-converting offers with Apple-level precision and council-backed intelligence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="p-6 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Expert Council</h3>
                <p className="text-sm text-muted-foreground">
                  5 specialist voices guide your offer creation
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Live Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Watch your offer come to life in real-time
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Download className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Export Ready</h3>
                <p className="text-sm text-muted-foreground">
                  PDF, email, and action-ready formats
                </p>
              </Card>
            </div>

            <Button size="lg" onClick={nextStep} className="gap-2">
              <Sparkles className="h-5 w-5" />
              Build My Vault Offer
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        );

      case 'council':
        return (
          <motion.div
            key="council"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <CouncilSelector
              selectedCouncil={selectedCouncil}
              onCouncilChange={setSelectedCouncil}
              maxSelections={3}
              onContinue={nextStep}
            />
          </motion.div>
        );

      case 'inputs':
        return (
          <motion.div
            key="inputs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold gradient-text">Offer Details</h2>
              <p className="text-muted-foreground">
                Provide the foundation for your council to craft the perfect offer
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="niche">Your Niche</Label>
                    <Select 
                      value={formData.niche} 
                      onValueChange={(value) => {
                        console.log("Niche selected:", value);
                        setFormData(prev => ({ ...prev, niche: value }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your niche">
                          {formData.niche || "Select your niche"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {niches.map(niche => (
                          <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Desired Tone</Label>
                    <Select 
                      value={formData.tone} 
                      onValueChange={(value) => {
                        console.log("Tone selected:", value);
                        setFormData(prev => ({ ...prev, tone: value }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone">
                          {formData.tone ? tones.find(t => t.value === formData.tone)?.label : "Select tone"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map(tone => (
                          <SelectItem key={tone.value} value={tone.value}>
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.niche === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="customNiche">Custom Niche</Label>
                    <Input
                      value={formData.customNiche}
                      onChange={(e) => setFormData(prev => ({ ...prev, customNiche: e.target.value }))}
                      placeholder="Describe your specific niche"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="e.g., Struggling entrepreneurs, busy professionals..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="painPoint">Main Pain Point</Label>
                  <Textarea
                    value={formData.painPoint}
                    onChange={(e) => setFormData(prev => ({ ...prev, painPoint: e.target.value }))}
                    placeholder="What specific problem does your audience face?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desiredOutcome">Desired Outcome</Label>
                  <Textarea
                    value={formData.desiredOutcome}
                    onChange={(e) => setFormData(prev => ({ ...prev, desiredOutcome: e.target.value }))}
                    placeholder="What transformation do you provide?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePoint">Price Range</Label>
                  <Input
                    value={formData.pricePoint}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePoint: e.target.value }))}
                    placeholder="e.g., $497, $2,997, $10,000+"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'generation':
        return (
          <motion.div
            key="generation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              <motion.div
                animate={{ rotate: isGenerating ? 360 : 0 }}
                transition={{ duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
              >
                <Sparkles className="h-16 w-16 text-primary mx-auto" />
              </motion.div>
              <h2 className="text-2xl font-bold gradient-text">
                {isGenerating ? "Council in Session..." : "Ready to Generate"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {isGenerating 
                  ? "Your selected council members are crafting your high-converting offer..."
                  : "Click below to activate your council and generate your offer"
                }
              </p>
            </div>

            {selectedCouncil.length > 0 && (
              <div className="flex justify-center gap-2 flex-wrap">
                {selectedCouncil.map(memberId => {
                  const member = councilMembers.find(m => m.id === memberId);
                  return member ? (
                    <Badge key={memberId} variant="secondary" className="gap-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${member.color}`} />
                      {member.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            )}

            {!isGenerating && (
              <Button size="lg" onClick={generateContent} className="gap-2">
                <Sparkles className="h-5 w-5" />
                Generate My Offer
              </Button>
            )}

            {isGenerating && (
              <div className="space-y-4">
                <Progress value={60} className="max-w-md mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Analyzing market psychology and crafting your offer...
                </p>
              </div>
            )}
          </motion.div>
        );

      case 'review':
        return (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold gradient-text">Your Generated Offer</h2>
              <p className="text-muted-foreground">
                Review and refine your council-crafted offer
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(generatedContent).map(([section, content]) => {
                const isEditing = editingSection === section;
                const currentEditContent = editContent[section] || content;
                
                return (
                  <Card key={section}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="capitalize text-lg">{section}</CardTitle>
                        <div className="flex gap-2">
                          {!isEditing && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => copyToClipboard(content, section)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEditSection(section)}>
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {isEditing && (
                            <>
                              <Button size="sm" onClick={() => handleSaveEdit(section)}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!isEditing ? (
                        <p className="text-sm leading-relaxed">{content}</p>
                      ) : (
                        <Textarea
                          value={currentEditContent}
                          onChange={(e) => updateEditContent(section, e.target.value)}
                          className="min-h-[100px] text-sm"
                          placeholder={`Edit your ${section}...`}
                          autoFocus
                        />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        );

      case 'export':
        return (
          <motion.div
            key="export"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500">
                  ✨ Forged by VaultForge
                </Badge>
              </motion.div>
              <h2 className="text-2xl font-bold gradient-text">Offer Complete!</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your high-converting offer is ready. Export it in your preferred format or continue optimizing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2" 
                onClick={() => {
                  const isQualityValid = validateOfferQuality();
                  if (isQualityValid) {
                    generatePDF();
                  } else {
                    toast({
                      title: "Quality check required",
                      description: `${qualityWarnings.length} issues found - review before downloading`,
                      variant: "destructive"
                    });
                  }
                }}
              >
                <Download className="h-6 w-6" />
                <span>Download File</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={copyAllToClipboard}>
                <Mail className="h-6 w-6" />
                <span>Copy All</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={previewLanding}>
                <Eye className="h-6 w-6" />
                <span>Preview Landing</span>
              </Button>
            </div>

            {/* Quality Warnings */}
            {qualityWarnings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2"
              >
                <h4 className="font-medium text-orange-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Offer Health Warnings
                </h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  {qualityWarnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
                <Button 
                  size="sm" 
                  onClick={triggerCouncilFeedback}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Get Council Guidance
                </Button>
              </motion.div>
            )}

            {/* Council Feedback Prompt */}
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={triggerCouncilFeedback}
                className="gap-2 hover:bg-blue-50 hover:border-blue-300"
              >
                <Sparkles className="h-4 w-4" />
                Would you like The Council's guidance before publishing?
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Next Best Actions</h3>
                {!canAccessNextActions && (
                  <Badge variant="outline" className="text-xs">
                    Complete Guidance Check First
                  </Badge>
                )}
              </div>
              
              {!canAccessNextActions && (
                <div className="text-center space-y-4 p-6 border rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    <h4 className="font-medium text-lg">🎯 Guidance Check Required</h4>
                    <p className="text-sm text-muted-foreground">
                      Before launching ads or emails, let's ensure your offer is aligned with your real business.
                    </p>
                    {Object.values(guidanceChecks).some(check => check === true) && (
                      <p className="text-xs text-blue-600">
                        Progress: {Object.values(guidanceChecks).filter(check => check === true).length}/4 checks completed
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={startGuidanceCheck} className="gap-2">
                      {Object.values(guidanceChecks).some(check => check === true) ? 'Continue' : 'Run'} Guidance Check
                    </Button>
                    <Button variant="outline" onClick={skipGuidanceCheck}>
                      Skip for Now
                    </Button>
                  </div>
                </div>
              )}

              {(canAccessNextActions || Object.values(guidanceChecks).filter(Boolean).length === 4) && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      Next Best Actions Unlocked
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                    <Button className="gap-2" onClick={createAdCampaign}>
                      <Lightbulb className="h-4 w-4" />
                      Create Ad Campaign
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={buildEmailSequence}>
                      <Target className="h-4 w-4" />
                      Build Email Sequence
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      onClick={deployAssets}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      Deploy All Assets
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'council':
        return selectedCouncil.length > 0;
      case 'inputs':
        return formData.niche && formData.tone && formData.targetAudience && formData.painPoint;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold gradient-text">VaultForge Workflow</h1>
            <Badge variant="outline">
              Step {Object.keys(stepProgress).indexOf(currentStep) + 1} of {Object.keys(stepProgress).length}
            </Badge>
          </div>
          <Progress value={stepProgress[currentStep]} className="h-2" />
        </motion.div>

        {/* Main Content */}
        <div className="min-h-[600px] flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Footer */}
        {currentStep !== 'welcome' && currentStep !== 'generation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between mt-8"
          >
            <Button variant="outline" onClick={prevStep} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            {currentStep !== 'export' && (
              <Button 
                onClick={nextStep} 
                disabled={!canProceed()}
                className="gap-2"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            {currentStep === 'export' && (
              <Button onClick={() => setCurrentStep('review')} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Edit Offer
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Guidance Check Modal */}
      <Dialog open={showGuidanceCheck} onOpenChange={setShowGuidanceCheck}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🎯 Guidance Check: Let's Review Before You Launch
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Your offer is forged, but before we launch ads or emails, let's make sure it's aligned with YOU. VaultForge will help check:
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                {guidanceChecks.voiceMatch ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-orange-500" />}
                Tone of Voice
              </div>
              <div className="flex items-center gap-2">
                {guidanceChecks.proofValid ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-orange-500" />}
                Proof Accuracy
              </div>
              <div className="flex items-center gap-2">
                {guidanceChecks.nicheRelevant ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-orange-500" />}
                Niche Fit
              </div>
              <div className="flex items-center gap-2">
                {guidanceChecks.ctaAligned ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-orange-500" />}
                Funnel Alignment
              </div>
            </div>

            <Separator />

            {currentGuidanceStep === 'voice' && (
              <div className="space-y-4">
                <h4 className="font-medium">Voice Match Check</h4>
                <p className="text-sm text-muted-foreground">
                  Does this offer reflect your personal tone or sound like a generic template?
                </p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm italic">"{generatedContent.hook}"</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => completeGuidanceStep('voiceMatch', true)}>
                    Yes, it matches
                  </Button>
                  <Button variant="outline" onClick={() => completeGuidanceStep('voiceMatch', false)}>
                    No, help me rewrite
                  </Button>
                </div>
              </div>
            )}

            {currentGuidanceStep === 'niche' && (
              <div className="space-y-4">
                <h4 className="font-medium">Niche Relevance Check</h4>
                <p className="text-sm text-muted-foreground">
                  Is this offer relevant to your industry or coaching focus?
                </p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm"><strong>Your Niche:</strong> {formData.niche}</p>
                  <p className="text-sm mt-2 italic">"{generatedContent.offer.substring(0, 100)}..."</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => completeGuidanceStep('nicheRelevant', true)}>
                    Yes, it's relevant
                  </Button>
                  <Button variant="outline" onClick={() => completeGuidanceStep('nicheRelevant', false)}>
                    No, needs adjustment
                  </Button>
                </div>
              </div>
            )}

            {currentGuidanceStep === 'proof' && (
              <div className="space-y-4">
                <h4 className="font-medium">Proof Validation</h4>
                <p className="text-sm text-muted-foreground">
                  Is this your actual proof/testimonial or a placeholder?
                </p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm italic">"{generatedContent.proof}"</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => completeGuidanceStep('proofValid', true)}>
                    Yes, it's mine
                  </Button>
                  <Button variant="outline" onClick={() => completeGuidanceStep('proofValid', false)}>
                    No, help me revise
                  </Button>
                </div>
              </div>
            )}

            {currentGuidanceStep === 'cta' && (
              <div className="space-y-4">
                <h4 className="font-medium">CTA Goal Check</h4>
                <p className="text-sm text-muted-foreground">
                  What action should your reader take after reading this offer?
                </p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm italic">"{generatedContent.cta}"</p>
                </div>
                <div className="space-y-3">
                  <Select onValueChange={(value) => {
                    completeGuidanceStep('ctaAligned', true);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your desired action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Book a Call</SelectItem>
                      <SelectItem value="download">Download a Lead Magnet</SelectItem>
                      <SelectItem value="webinar">Join Webinar</SelectItem>
                      <SelectItem value="buy">Buy Now</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Council Feedback Modal */}
      <Dialog open={showCouncilFeedback} onOpenChange={setShowCouncilFeedback}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              The Council's Guidance
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Elite council feedback on your offer structure and market readiness:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(councilScores).map(([agent, data]) => (
                <motion.div
                  key={agent}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium capitalize">{agent}</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-green-600">{data.score}</span>
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                  </div>
                  <blockquote className="text-sm italic text-blue-700 mb-2">
                    "{data.quote}"
                  </blockquote>
                  <p className="text-sm text-muted-foreground">
                    <strong>Suggestion:</strong> {data.suggestion}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => setShowCouncilFeedback(false)}>
                Apply Suggestions
              </Button>
              <Button variant="outline" onClick={deployAssets}>
                Deploy As-Is
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Asset Deployment Modal */}
      <Dialog open={showAssetDeployment} onOpenChange={setShowAssetDeployment}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              Instant Asset Deployment
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Marketing Assets</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <span>🖼️</span> Facebook/Instagram Ad Copy
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <span>📧</span> 5-Part Email Sequence
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <span>🖥️</span> 10-Slide Webinar Deck
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Sales Materials</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <span>📝</span> Sales Page HTML
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <span>📊</span> Analytics Dashboard
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <span>🎯</span> A/B Test Variants
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">🔥 Forged by VaultForge Elite</h4>
              <p className="text-sm text-muted-foreground">
                All assets include Apple-level polish, conversion optimization, and your council-approved messaging.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => {
                toast({
                  title: "Assets deployed successfully",
                  description: "All marketing materials are ready for download"
                });
                setShowAssetDeployment(false);
              }}>
                Download All Assets
              </Button>
              <Button variant="outline" onClick={() => setShowAssetDeployment(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}