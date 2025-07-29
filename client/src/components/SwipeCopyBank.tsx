import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Search, TrendingUp, Zap, Crown, Filter, Sparkles, BarChart3, Eye, Target, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SwipeTemplate {
  id: string;
  category: 'hooks' | 'ctas' | 'closers' | 'objections' | 'urgency';
  title: string;
  copy: string;
  industry: string[];
  conversionStats: {
    ctr: number;
    roiLift: number;
    sourceCampaign: string;
  };
  copyInsight: {
    neuralTrigger: string;
    painPoint: string;
    explanation: string;
  };
  tags: string[];
  tier: 'pro' | 'vault';
}

interface SwipeCopyResponse {
  templates: SwipeTemplate[];
  totalCount: number;
  categories: {
    hooks: number;
    ctas: number;
    closers: number;
    objections: number;
    urgency: number;
  };
}

export function SwipeCopyBank() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<SwipeTemplate | null>(null);
  const [showInsights, setShowInsights] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Fetch swipe copy templates
  const { data: swipeData, isLoading } = useQuery({
    queryKey: ['/api/swipe-copy', categoryFilter, industryFilter, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (industryFilter !== 'all') params.append('industry', industryFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await apiRequest("GET", `/api/swipe-copy?${params.toString()}`);
      return response.json() as Promise<SwipeCopyResponse>;
    }
  });

  // Rewrite copy mutation
  const rewriteMutation = useMutation({
    mutationFn: async (data: { templateId: string; targetAudience: string; industry: string }) => {
      const response = await apiRequest("POST", "/api/swipe-copy/rewrite", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Copy Rewritten!",
        description: "New version generated using Gladiator AI",
      });
    }
  });

  const filteredTemplates = useMemo(() => {
    if (!swipeData?.templates) return [];
    
    return swipeData.templates.filter(template => {
      const matchesSearch = !searchTerm || 
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.copy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
      const matchesIndustry = industryFilter === 'all' || template.industry.includes(industryFilter);
      
      return matchesSearch && matchesCategory && matchesIndustry;
    });
  }, [swipeData?.templates, searchTerm, categoryFilter, industryFilter]);

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `"${title}" copied to clipboard`,
    });
  };

  const toggleInsight = (templateId: string) => {
    setShowInsights(prev => ({
      ...prev,
      [templateId]: !prev[templateId]
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hooks': return <Zap className="h-4 w-4" />;
      case 'ctas': return <Target className="h-4 w-4" />;
      case 'closers': return <Crown className="h-4 w-4" />;
      case 'objections': return <Sparkles className="h-4 w-4" />;
      case 'urgency': return <TrendingUp className="h-4 w-4" />;
      default: return <Copy className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-300">Loading Vault Copy Bank...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Vault Swipe Copy Bank
          </h1>
          <Copy className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-slate-200 text-lg">
          200+ Battle-Tested Templates Worth $50,000+ + AI Rewrite Engine
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
            $50,000+ Value
          </Badge>
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            Million-Dollar Campaigns
          </Badge>
          <Badge variant="secondary" className="bg-pink-500/10 text-pink-400 border-pink-500/20">
            Legendary Copywriters
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            200+ Templates
          </Badge>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="bg-slate-900/50 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Filter className="h-5 w-5" />
            Filter & Search Arsenal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Search Templates</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search copy, triggers, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Categories ({swipeData?.totalCount || 0})</SelectItem>
                  <SelectItem value="hooks">Hooks ({swipeData?.categories.hooks || 0})</SelectItem>
                  <SelectItem value="ctas">CTAs ({swipeData?.categories.ctas || 0})</SelectItem>
                  <SelectItem value="closers">Closers ({swipeData?.categories.closers || 0})</SelectItem>
                  <SelectItem value="objections">Objections ({swipeData?.categories.objections || 0})</SelectItem>
                  <SelectItem value="urgency">Urgency ({swipeData?.categories.urgency || 0})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Industry Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Industry</label>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="coaching">Coaching</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats Summary */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Results</label>
              <div className="bg-slate-800 border border-slate-600 rounded-md p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{filteredTemplates.length}</div>
                  <div className="text-xs text-slate-400">Templates Found</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="bg-slate-900/70 border-slate-600 hover:border-yellow-500/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(template.category)}
                    <CardTitle className="text-lg text-white">{template.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs text-yellow-300 border-yellow-500/30">
                      {template.category.toUpperCase()}
                    </Badge>
                    {template.tier === 'vault' && (
                      <Badge className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                        VAULT
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-400">{template.conversionStats.ctr}% CTR</div>
                  <div className="text-xs text-slate-400">+{template.conversionStats.roiLift}% ROI</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Copy Text */}
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                <p className="text-white font-medium leading-relaxed">"{template.copy}"</p>
              </div>

              {/* Industry Tags */}
              <div className="flex flex-wrap gap-1">
                {template.industry.map((ind, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {ind}
                  </Badge>
                ))}
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/30 p-2 rounded border">
                  <div className="flex items-center gap-1 text-slate-400 mb-1">
                    <BarChart3 className="h-3 w-3" />
                    Source
                  </div>
                  <div className="text-slate-200 font-medium">{template.conversionStats.sourceCampaign}</div>
                </div>
                <div className="bg-slate-800/30 p-2 rounded border">
                  <div className="flex items-center gap-1 text-slate-400 mb-1">
                    <TrendingUp className="h-3 w-3" />
                    Tags
                  </div>
                  <div className="text-slate-200 font-medium">{template.tags.length} triggers</div>
                </div>
              </div>

              {/* Copy Insight Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleInsight(template.id)}
                className="w-full text-slate-400 hover:text-white justify-start"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showInsights[template.id] ? 'Hide' : 'Show'} Copy Insight
              </Button>

              {/* Copy Insight Panel */}
              {showInsights[template.id] && (
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-medium text-blue-300 mb-2">Why This Copy Works</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-blue-400 font-medium">Neural Trigger:</span>
                      <span className="text-blue-100 ml-2">{template.copyInsight.neuralTrigger}</span>
                    </div>
                    <div>
                      <span className="text-blue-400 font-medium">Pain Point:</span>
                      <span className="text-blue-100 ml-2">{template.copyInsight.painPoint}</span>
                    </div>
                    <div className="pt-2 border-t border-blue-500/20">
                      <p className="text-blue-200 text-xs">{template.copyInsight.explanation}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(template.copy, template.title)}
                  className="flex-1 text-slate-400 hover:text-white"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Would trigger rewrite modal/form
                    toast({
                      title: "Rewrite Feature",
                      description: "AI rewrite engine coming soon",
                    });
                  }}
                  className="flex-1 text-purple-400 hover:text-purple-300"
                  disabled={rewriteMutation.isPending}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  AI Rewrite
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">No Templates Found</h3>
          <p className="text-slate-400">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}