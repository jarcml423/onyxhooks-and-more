import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Target, DollarSign, Users, Zap, Eye, ArrowUpRight } from "lucide-react";

interface CampaignData {
  campaign: string;
  source: string;
  medium: string;
  visitors: number;
  signups: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  roas: number;
}

interface UTMAnalyticsData {
  campaignPerformance: CampaignData[];
  topPerformingContent: { content: string; conversions: number; conversionRate: number; }[];
  sourceBreakdown: Record<string, { visitors: number; revenue: number; }>;
}

const COLORS = ['#9b57ff', '#6e32d3', '#b56bff', '#d3a7ff', '#cc94ff'];

export default function UTMAnalytics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: analyticsData, isLoading } = useQuery<{
    success: boolean;
    analytics: UTMAnalyticsData;
    generatedAt: string;
  }>({
    queryKey: ['/api/analytics/utm?test=true'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const seedDataMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/utm/seed-data?test=true"),
    onSuccess: () => {
      toast({
        title: "✅ Test Data Created",
        description: "15 UTM tracking records added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/utm?test=true'] });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Seeding Failed", 
        description: error.message || "Failed to seed test data",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-slate-400">Loading campaign analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData?.success) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="p-6 text-center">
          <p className="text-red-400">Unable to load UTM analytics. Vault tier required.</p>
        </CardContent>
      </Card>
    );
  }

  const { analytics } = analyticsData;

  // Prepare source breakdown for pie chart
  const sourceData = Object.entries(analytics.sourceBreakdown).map(([source, data]) => ({
    name: source,
    value: data.revenue,
    visitors: data.visitors
  }));

  // Calculate totals
  const totalRevenue = analytics.campaignPerformance.reduce((sum, campaign) => sum + campaign.revenue, 0);
  const totalVisitors = analytics.campaignPerformance.reduce((sum, campaign) => sum + campaign.visitors, 0);
  const totalConversions = analytics.campaignPerformance.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const avgConversionRate = totalConversions / totalVisitors * 100;

  return (
    <div className="space-y-6">
      {/* Header with Seed Data Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">UTM Campaign Analytics</h2>
          <p className="text-slate-400">Track campaign performance and attribution</p>
        </div>
        <Button 
          onClick={() => seedDataMutation.mutate()}
          disabled={seedDataMutation.isPending}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          size="sm"
        >
          {seedDataMutation.isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Seeding...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Seed Test Data
            </div>
          )}
        </Button>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Visitors</p>
                <p className="text-2xl font-bold text-white">{totalVisitors.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Conversions</p>
                <p className="text-2xl font-bold text-white">{totalConversions}</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Avg. CVR</p>
                <p className="text-2xl font-bold text-white">{avgConversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-purple-600">Campaign Performance</TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-purple-600">Traffic Sources</TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-purple-600">Content Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                Campaign Performance Matrix
              </CardTitle>
              <CardDescription>Revenue and conversion metrics by campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Campaign Performance Chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.campaignPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="campaign" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#9b57ff" name="Revenue ($)" />
                      <Bar dataKey="conversions" fill="#6e32d3" name="Conversions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Campaign Details Table */}
                <div className="space-y-3">
                  {analytics.campaignPerformance.map((campaign, index) => (
                    <Card key={index} className="bg-slate-800/30 border-slate-600/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-purple-300 border-purple-500/50">
                              {campaign.source}
                            </Badge>
                            <span className="font-semibold text-white">{campaign.campaign}</span>
                            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                              {campaign.medium}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-400 font-medium">
                              ${campaign.revenue.toLocaleString()}
                            </span>
                            <span className="text-blue-400">
                              {campaign.conversions} conversions
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Visitors</p>
                            <p className="font-medium text-white">{campaign.visitors.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">CVR</p>
                            <p className="font-medium text-white">{campaign.conversionRate.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-slate-400">ROAS</p>
                            <p className="font-medium text-white">{campaign.roas.toFixed(1)}x</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Signups</p>
                            <p className="font-medium text-white">{campaign.signups}</p>
                          </div>
                        </div>

                        <Progress 
                          value={campaign.conversionRate} 
                          className="mt-3 h-2"
                          style={{
                            background: 'rgba(71, 85, 105, 0.3)'
                          }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Revenue by Source</CardTitle>
                <CardDescription>Distribution of revenue across traffic sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Source Performance</CardTitle>
                <CardDescription>Detailed metrics by traffic source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.sourceBreakdown).map(([source, data]) => (
                    <div key={source} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="font-medium text-white capitalize">{source}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">${data.revenue.toLocaleString()}</p>
                        <p className="text-sm text-slate-400">{data.visitors.toLocaleString()} visitors</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-400" />
                Top Performing Content
              </CardTitle>
              <CardDescription>Content variants ranked by conversion performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topPerformingContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{content.content}</h4>
                        <p className="text-sm text-slate-400">{content.conversions} conversions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-400">{content.conversionRate}%</span>
                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                      </div>
                      <Progress 
                        value={content.conversionRate} 
                        className="w-20 h-2 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Controls */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-400">
          Last updated: {new Date(analyticsData.generatedAt).toLocaleString()}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-300">
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-300">
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
}