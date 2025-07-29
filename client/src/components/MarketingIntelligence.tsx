import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, DollarSign, TrendingUp, AlertTriangle, Eye, Target, Calendar, Activity } from 'lucide-react';

interface MarketingInsights {
  totalUsers: number;
  activeUsers: number;
  tierBreakdown: Record<string, number>;
  utmSourceBreakdown: Record<string, number>;
  monthlyRevenue: number;
  riskAnalysis: Record<string, number>;
  conversionMetrics: {
    freeToStarter: number;
    starterToPro: number;
    proToVault: number;
  };
}

interface Campaign {
  source: string;
  medium: string;
  campaign: string;
  visitors: number;
  conversions: number;
  revenue: number;
  conversionRate: string;
  roas: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  subscriptionStatus: string;
  createdAt: Date;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

const getRiskBadgeColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'low': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-orange-500';
    case 'critical': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getTierBadgeColor = (tier: string) => {
  switch (tier.toLowerCase()) {
    case 'free': return 'bg-gray-500';
    case 'starter': return 'bg-blue-500';
    case 'pro': return 'bg-purple-500';
    case 'vault': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

export default function MarketingIntelligence() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch marketing insights
  const { data: insights, isLoading: insightsLoading } = useQuery<{
    success: boolean;
    analytics: MarketingInsights;
    users: User[];
    note?: string;
  }>({
    queryKey: ['/api/admin/marketing-insights'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch campaign analytics
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<{
    success: boolean;
    campaigns: Campaign[];
    totalCampaigns: number;
    totalRevenue: number;
    totalConversions: number;
  }>({
    queryKey: ['/api/admin/campaign-analytics'],
    refetchInterval: 30000
  });

  // Fetch user details when selected
  const { data: userDetails, isLoading: userDetailsLoading } = useQuery({
    queryKey: ['/api/admin/user', selectedUser?.id],
    enabled: !!selectedUser,
  });

  if (insightsLoading || campaignsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const analytics = insights?.analytics;
  if (!analytics) return <div>Failed to load analytics</div>;

  // Prepare chart data
  const tierData = Object.entries(analytics.tierBreakdown).map(([tier, count]) => ({
    tier: tier.charAt(0).toUpperCase() + tier.slice(1),
    count,
    revenue: tier === 'starter' ? count * 47 : tier === 'pro' ? count * 197 : tier === 'vault' ? count * 417 : 0
  }));

  const utmData = Object.entries(analytics.utmSourceBreakdown).map(([source, count]) => ({
    source: source.charAt(0).toUpperCase() + source.slice(1),
    count
  }));

  const conversionData = [
    { conversion: 'Free → Starter', rate: analytics.conversionMetrics.freeToStarter },
    { conversion: 'Starter → Pro', rate: analytics.conversionMetrics.starterToPro },
    { conversion: 'Pro → Vault', rate: analytics.conversionMetrics.proToVault }
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{analytics.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${analytics.monthlyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns?.totalCampaigns || 0}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="security">Security & Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tier Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>User Tier Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tierData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tier" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* UTM Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={utmData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {utmData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="conversion" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                    <Bar dataKey="rate" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tierData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tier" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insights?.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTierBadgeColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                      <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                        {user.subscriptionStatus}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Details Dialog */}
          {selectedUser && (
            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>User Details: {selectedUser.username}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <Badge className={getTierBadgeColor(selectedUser.role)}>
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge variant={selectedUser.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                        {selectedUser.subscriptionStatus}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {userDetails && !userDetailsLoading && (userDetails as any) && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Activity Summary</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">
                            {(userDetails as any)?.userActivity?.totalOffers || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Total Offers</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {(userDetails as any)?.userActivity?.totalQuizzes || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {(userDetails as any)?.userActivity?.totalSimulations || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">ROI Simulations</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns?.campaigns.map((campaign, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{campaign.campaign}</h4>
                      <Badge variant="outline">
                        {campaign.source} / {campaign.medium}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Visitors</p>
                        <p className="font-medium">{campaign.visitors.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversions</p>
                        <p className="font-medium">{campaign.conversions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-medium">${campaign.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conv. Rate</p>
                        <p className="font-medium">{campaign.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ROAS</p>
                        <p className="font-medium">${campaign.roas}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analytics.riskAnalysis).map(([level, count]) => (
                  <div key={level} className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${getRiskBadgeColor(level)}`}>
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground capitalize">{level} Risk</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {insights?.note && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{insights.note}</p>
        </div>
      )}
    </div>
  );
}