import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from "lucide-react";

interface CampaignScore {
  overall: number;
  roi: number;
  cac: number;
  ctr: number;
  churnImpact: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  status: 'excellent' | 'good' | 'needs_attention' | 'underperforming' | 'critical';
}

interface CampaignRecommendation {
  type: 'copy_improvement' | 'targeting_adjustment' | 'budget_reallocation' | 'timing_optimization' | 'creative_refresh';
  priority: 'high' | 'medium' | 'low';
  description: string;
  expectedImpact: string;
  actionItems: string[];
  estimatedROILift: number;
}

interface CampaignAnalysis {
  campaignName: string;
  score: CampaignScore;
  recommendations: CampaignRecommendation[];
  keyInsights: string[];
  nextActions: string[];
  competitorBenchmark: {
    industryAverage: number;
    topPerformer: number;
    yourPosition: 'above' | 'at' | 'below';
  };
}

export default function CampaignIntelligence() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [campaignData, setCampaignData] = useState({
    campaignName: "Facebook Fitness Transformation",
    utmSource: "facebook",
    utmMedium: "cpc",
    utmCampaign: "fitness_transformation_q1",
    impressions: 85000,
    clicks: 2340,
    conversions: 187,
    revenue: 15600,
    adSpend: 3200,
    signups: 203,
    churnedUsers: 12,
    timeframe: "30_days"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch campaign dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["/api/campaign/dashboard"],
    enabled: activeTab === "dashboard"
  });

  // Campaign analysis mutation
  const analyzeCampaignMutation = useMutation({
    mutationFn: (data: typeof campaignData) => 
      apiRequest("POST", "/api/campaign/analyze", data),
    onSuccess: () => {
      toast({
        title: "Campaign Analyzed",
        description: "AI analysis complete with optimization recommendations"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaign/dashboard"] });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze campaign",
        variant: "destructive"
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'needs_attention': return 'bg-yellow-500';
      case 'underperforming': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            Campaign Intelligence
          </h2>
          <p className="text-muted-foreground">
            AI-powered campaign optimization and performance insights
          </p>
        </div>
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          Vault Exclusive
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Performance Dashboard</TabsTrigger>
          <TabsTrigger value="analyze">Campaign Analyzer</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        {/* Performance Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          {dashboardLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Campaigns</p>
                        <p className="text-2xl font-bold">{dashboardData?.summary?.totalCampaigns || 12}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Score</p>
                        <p className="text-2xl font-bold">{dashboardData?.summary?.avgScore || 73}%</p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total ROI</p>
                        <p className="text-2xl font-bold">{dashboardData?.summary?.totalROI || 185.4}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Flagged</p>
                        <p className="text-2xl font-bold">{dashboardData?.summary?.flaggedCampaigns || 3}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign List */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(dashboardData?.campaigns || []).map((campaign: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(campaign.status)}`} />
                          <div>
                            <h4 className="font-semibold">{campaign.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {campaign.source} • {campaign.medium}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{campaign.score}</p>
                            <p className="text-xs text-muted-foreground">Score</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-green-600">{campaign.roi}%</p>
                            <p className="text-xs text-muted-foreground">ROI</p>
                          </div>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Campaign Analyzer */}
        <TabsContent value="analyze" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Analyzer</CardTitle>
              <p className="text-sm text-muted-foreground">
                Input your campaign metrics for AI-powered optimization analysis
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    value={campaignData.campaignName}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, campaignName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="utmSource">UTM Source</Label>
                  <Input
                    id="utmSource"
                    value={campaignData.utmSource}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, utmSource: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="impressions">Impressions</Label>
                  <Input
                    id="impressions"
                    type="number"
                    value={campaignData.impressions}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, impressions: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="clicks">Clicks</Label>
                  <Input
                    id="clicks"
                    type="number"
                    value={campaignData.clicks}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, clicks: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="conversions">Conversions</Label>
                  <Input
                    id="conversions"
                    type="number"
                    value={campaignData.conversions}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, conversions: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="revenue">Revenue ($)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={campaignData.revenue}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, revenue: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="adSpend">Ad Spend ($)</Label>
                  <Input
                    id="adSpend"
                    type="number"
                    value={campaignData.adSpend}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, adSpend: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="signups">Signups</Label>
                  <Input
                    id="signups"
                    type="number"
                    value={campaignData.signups}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, signups: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <Button
                onClick={() => analyzeCampaignMutation.mutate(campaignData)}
                disabled={analyzeCampaignMutation.isPending}
                className="w-full"
              >
                {analyzeCampaignMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Campaign...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>

              {/* Analysis Results */}
              {analyzeCampaignMutation.data && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Campaign Score: {analyzeCampaignMutation.data.score.grade}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Overall</p>
                          <Progress value={analyzeCampaignMutation.data.score.overall} className="mt-1" />
                          <p className="text-lg font-semibold">{analyzeCampaignMutation.data.score.overall}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">ROI</p>
                          <Progress value={analyzeCampaignMutation.data.score.roi} className="mt-1" />
                          <p className="text-lg font-semibold">{analyzeCampaignMutation.data.score.roi}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">CTR</p>
                          <Progress value={analyzeCampaignMutation.data.score.ctr} className="mt-1" />
                          <p className="text-lg font-semibold">{analyzeCampaignMutation.data.score.ctr}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">CAC</p>
                          <Progress value={analyzeCampaignMutation.data.score.cac} className="mt-1" />
                          <p className="text-lg font-semibold">{analyzeCampaignMutation.data.score.cac}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Recommendations */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Optimization Recommendations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Priority recommendations for campaign improvement
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(dashboardData?.recommendations || []).map((rec: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      {getPriorityIcon(rec.priority)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{rec.campaign}</h4>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rec.type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-green-600 font-medium">{rec.impact}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}