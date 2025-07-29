import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Zap, Target, Download, Award, Clock, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

interface UsageStats {
  totalHooksGenerated: number;
  totalTokensUsed: number;
  averagePerDay: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  averageSessionDuration: number;
  favoriteFeatures: Array<{ name: string; count: number; percentage: number }>;
  weeklyUsage: Array<{ date: string; hooks: number; tokens: number }>;
  monthlyTrends: Array<{ month: string; hooks: number; council: number; vault: number }>;
  achievements: Array<{ id: string; name: string; description: string; completed: boolean; completedAt?: string }>;
  tierComparison: {
    currentTier: string;
    usage: number;
    limit: number;
    upgradeRecommended: boolean;
  };
}

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

export default function UsageAnalytics() {
  const { user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  const { data: analytics, isLoading } = useQuery<UsageStats>({
    queryKey: ['/api/analytics/usage', selectedTimeRange],
    enabled: !!user && (user.role === 'pro' || user.role === 'vault'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Analytics Data</h3>
          <p className="text-gray-500">Start using the platform to see your usage analytics.</p>
        </CardContent>
      </Card>
    );
  }

  const exportAnalytics = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Hooks Generated', analytics.totalHooksGenerated],
      ['Total Tokens Used', analytics.totalTokensUsed],
      ['Average Per Day', analytics.averagePerDay],
      ['Current Streak', analytics.currentStreak],
      ['Total Sessions', analytics.totalSessions],
      ['Average Session Duration', `${analytics.averageSessionDuration} minutes`]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onyxhooks-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Usage Analytics</h2>
          <p className="text-gray-400">Track your performance and optimize your workflow</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <Button onClick={exportAnalytics} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Total Hooks</p>
                <p className="text-2xl font-bold text-white">{analytics.totalHooksGenerated.toLocaleString()}</p>
                <p className="text-purple-300 text-xs">+{analytics.averagePerDay}/day avg</p>
              </div>
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Current Streak</p>
                <p className="text-2xl font-bold text-white">{analytics.currentStreak} days</p>
                <p className="text-blue-300 text-xs">Longest: {analytics.longestStreak} days</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Total Sessions</p>
                <p className="text-2xl font-bold text-white">{analytics.totalSessions}</p>
                <p className="text-green-300 text-xs">{analytics.averageSessionDuration}min avg</p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">Tokens Used</p>
                <p className="text-2xl font-bold text-white">{analytics.totalTokensUsed.toLocaleString()}</p>
                <p className="text-yellow-300 text-xs">AI processing power</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Weekly Usage Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.weeklyUsage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Line type="monotone" dataKey="hooks" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tier Usage Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Tier Usage & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Current Usage</span>
                    <Badge variant="outline" className="capitalize">
                      {analytics.tierComparison.currentTier}
                    </Badge>
                  </div>
                  <Progress 
                    value={(analytics.tierComparison.usage / analytics.tierComparison.limit) * 100} 
                    className="w-full h-3"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{analytics.tierComparison.usage} used</span>
                    <span>{analytics.tierComparison.limit === -1 ? 'Unlimited' : `${analytics.tierComparison.limit} limit`}</span>
                  </div>
                </div>

                {analytics.tierComparison.upgradeRecommended && (
                  <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Upgrade Recommended</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Based on your usage patterns, upgrading would unlock more features and remove limits.
                    </p>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                      View Upgrade Options
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="hooks" fill="#8B5CF6" name="Hooks Generated" />
                  <Bar dataKey="council" fill="#06B6D4" name="Council Sessions" />
                  {user?.role === 'vault' && <Bar dataKey="vault" fill="#10B981" name="Vault Access" />}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.favoriteFeatures}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {analytics.favoriteFeatures.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.favoriteFeatures.map((feature, index) => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{feature.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{feature.count}</div>
                      <div className="text-xs text-gray-400">{feature.percentage}%</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.achievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className={`${achievement.completed ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30' : 'bg-gray-800/50 border-gray-700'}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className={`w-6 h-6 ${achievement.completed ? 'text-green-400' : 'text-gray-500'}`} />
                    <Badge variant={achievement.completed ? 'default' : 'secondary'}>
                      {achievement.completed ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{achievement.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                  {achievement.completedAt && (
                    <p className="text-xs text-green-400">
                      Completed: {new Date(achievement.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}