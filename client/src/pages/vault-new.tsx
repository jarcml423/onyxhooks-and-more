import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import VaultDashboard from "@/components/VaultDashboard";
import VaultWorkflow from "@/components/VaultWorkflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import VaultProtection from "@/components/VaultProtection";
import PlatinumLottery from "@/components/PlatinumLottery";
import { 
  Copy, 
  Search, 
  Video, 
  Mail, 
  Megaphone, 
  TrendingUp, 
  MessageSquare,
  BookOpen,
  Unlock,
  Sparkles,
  Crown,
  Users,
  Zap,
  Target,
  Settings,
  BarChart3,
  Lightbulb
} from "lucide-react";

const categories = [
  { id: "all", name: "All Prompts", icon: BookOpen },
  { id: "vsl", name: "VSL Scripts", icon: Video },
  { id: "email", name: "Email Sequences", icon: Mail },
  { id: "ads", name: "Ad Copy", icon: Megaphone },
  { id: "hooks", name: "Hooks", icon: MessageSquare },
  { id: "objections", name: "Objection Handling", icon: TrendingUp },
];

interface PromptItem {
  id: number;
  category: string;
  title: string;
  preview: string;
  content?: string;
  locked: boolean;
  tags?: string[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  performance?: number;
}

export default function VaultNew() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("workflow");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  
  // Mock user data - in production this would come from auth context
  const userData = {
    tier: 'vault' as const,
    joinedDate: '2024-01-15',
    billingStatus: 'active' as const,
    lastPaymentDate: '2024-12-01',
    nextPaymentDate: '2025-01-01',
    usage: {
      hooksGenerated: 47,
      offersGenerated: 23,
      councilSessions: 15,
      vaultAccess: 89
    },
    limits: {
      hooksGenerated: -1, // unlimited
      offersGenerated: -1,
      councilSessions: -1,
      vaultAccess: -1
    }
  };

  const demoPrompts: PromptItem[] = [
    {
      id: 1,
      category: "vsl",
      title: "High-Converting VSL Script",
      preview: "Proven framework that converts at 15%+ for coaching offers...",
      content: `# High-Converting VSL Script Framework

## Hook (0-30 seconds)
"If you're a coach struggling to get clients, this video will change everything..."

## Problem Agitation (30-90 seconds) 
"You've tried everything - posting content, networking, even paid ads..."

## Solution Introduction (90-180 seconds)
"What if I told you there's a simple 3-step system..."`,
      locked: false,
      tags: ["VSL", "Coaching", "High-Converting"],
      difficulty: "Intermediate",
      performance: 15
    },
    {
      id: 6,
      category: "ads",
      title: "Pattern Interrupt Facebook Ad",
      preview: "Stop-the-scroll ad that generated 94% CTR...",
      content: `# Pattern Interrupt Facebook Ad (94% CTR)

## Visual: 
Simple text overlay on contrasting background

## Headline:
"This coach made $47K in 30 days"

## Body Copy:
Not with some get-rich-quick scheme...

Not by working 80-hour weeks...

But with a simple shift in how she positioned her offer.

The crazy part? She was charging LESS than her competitors.

Here's exactly what she did:

[LINK TO CASE STUDY]

## CTA:
Want the full breakdown? (It's free)

## Why This Works:
- Pattern interrupt opening
- Credible but achievable result  
- Addresses common objections
- Curiosity gap in the reveal
- Low-friction CTA

## Customization Variables:
- [RESULT AMOUNT]: Adjust to your niche
- [TIME FRAME]: Keep realistic (30-90 days)
- [POSITIONING ANGLE]: Your unique approach
- [CASE STUDY LINK]: Your lead magnet

## Performance Metrics:
- 94% CTR
- $47 CPA  
- 4.2 ROAS
- 2.3x lift vs control`,
      locked: false,
      tags: ["Facebook", "Pattern Interrupt", "High-CTR"],
      difficulty: "Advanced",
      performance: 94
    }
  ];

  const filteredPrompts = demoPrompts.filter((prompt) => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpgrade = () => {
    toast({
      title: "Upgrade Available",
      description: "Contact support to upgrade your tier",
    });
  };

  return (
    <VaultProtection>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          {/* Elite Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Crown className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">
                  VaultForge Elite
                </h1>
                <p className="text-muted-foreground">
                  Apple-level precision meets AI-powered offer creation
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Elite Access
              </Badge>
            </div>
          </motion.div>

          {/* Main Vault Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="workflow" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Workflow
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="platinum" className="gap-2">
                <Crown className="h-4 w-4" />
                Platinum
              </TabsTrigger>
            </TabsList>

            {/* AI Workflow Tab */}
            <TabsContent value="workflow" className="space-y-6">
              <VaultWorkflow onComplete={(result) => {
                console.log('Workflow completed:', result);
                toast({
                  title: "Offer Generated",
                  description: "Your high-converting offer is ready for export",
                });
              }} />
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <VaultDashboard 
                userData={userData}
                onUpgrade={handleUpgrade}
              />
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              {/* Search and Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row gap-4"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search elite templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <motion.div key={category.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          onClick={() => setSelectedCategory(category.id)}
                          className="whitespace-nowrap gap-2 bg-white/80 backdrop-blur-sm"
                        >
                          <Icon className="h-4 w-4" />
                          {category.name}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Templates Grid */}
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredPrompts.map((prompt) => (
                    <motion.div
                      key={prompt.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{prompt.title}</CardTitle>
                            <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {prompt.category}
                            </Badge>
                          </div>
                          {prompt.performance && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="font-semibold text-green-600">
                                {prompt.performance}% conversion rate
                              </span>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{prompt.preview}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {prompt.tags?.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedPrompt(prompt)}
                                  className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  <Sparkles className="h-4 w-4" />
                                  View Elite
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    {prompt.title}
                                    <Badge variant="secondary">{prompt.category}</Badge>
                                  </DialogTitle>
                                </DialogHeader>
                                
                                {selectedPrompt && (
                                  <div className="space-y-6">
                                    {/* Performance Metrics */}
                                    {selectedPrompt.performance && (
                                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                          <TrendingUp className="h-5 w-5 text-green-600" />
                                          <span className="font-semibold text-green-800">Elite Performance Metrics</span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                          <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">{selectedPrompt.performance}%</div>
                                            <div className="text-sm text-gray-600">Conversion Rate</div>
                                          </div>
                                          {selectedPrompt.id === 6 && (
                                            <>
                                              <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-600">2.3x</div>
                                                <div className="text-sm text-gray-600">CTR Increase</div>
                                              </div>
                                              <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-600">$47</div>
                                                <div className="text-sm text-gray-600">Avg CPA</div>
                                              </div>
                                              <div className="text-center">
                                                <div className="text-2xl font-bold text-orange-600">4.2</div>
                                                <div className="text-sm text-gray-600">ROAS</div>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Full Content */}
                                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg">
                                      <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold gradient-text">Elite Template</h3>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            navigator.clipboard.writeText(selectedPrompt.content || selectedPrompt.preview);
                                            toast({
                                              title: "Elite content copied",
                                              description: "Template ready for implementation",
                                            });
                                          }}
                                          className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                        >
                                          <Copy className="h-4 w-4" />
                                          Copy Elite
                                        </Button>
                                      </div>
                                      <div className="prose max-w-none">
                                        <div className="whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded border shadow-inner">
                                          {selectedPrompt.content || selectedPrompt.preview}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Implementation Guide */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                        <Lightbulb className="h-5 w-5" />
                                        Elite Implementation Guide
                                      </h4>
                                      <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Customize variables to match your premium positioning</li>
                                        <li>• A/B test with sophisticated audience segments</li>
                                        <li>• Monitor psychological triggers and emotional responses</li>
                                        <li>• Scale with confidence using proven conversion data</li>
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </TabsContent>

            {/* Platinum Tab */}
            <TabsContent value="platinum" className="space-y-6">
              <PlatinumLottery />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </VaultProtection>
  );
}