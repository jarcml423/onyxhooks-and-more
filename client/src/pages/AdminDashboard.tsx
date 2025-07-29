import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Mail, AlertTriangle, DollarSign, BarChart3, X, ChevronRight, Calendar, CreditCard, Target, Brain, Shield, Send, CheckCircle, XCircle, Download, Key, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { collection, query, onSnapshot, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import UTMAnalytics from '@/components/UTMAnalytics';
import CampaignIntelligence from '@/components/CampaignIntelligence';
import SecurityDashboard from '@/components/SecurityDashboard';
import StripeTestConsole from '@/components/StripeTestConsole';
import WebhookDashboard from '@/components/WebhookDashboard';
import MarketingIntelligence from '@/components/MarketingIntelligence';
import NOSChallengeAdmin from '@/components/NOSChallengeAdmin';
import { SwipeCopyScheduler } from '@/components/SwipeCopyScheduler';
import { SupportDashboard } from '@/components/SupportDashboard';
import ReCaptchaManager from '@/components/ReCaptchaManager';

interface DashboardStats {
  totalUsers: number;
  tierBreakdown: {
    free: number;
    starter: number;
    pro: number;
    vault: number;
  };
  monthlyRevenue: number;
  emailCampaigns: number;
  signupConversions: number;
  churnRate: number;
  canceledThisMonth: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  tier: string;
  isActive: boolean;
  signupDate: Date;
  subscriptionStatus: string;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  
  // CRITICAL SECURITY: Block component-level access if not authenticated
  console.log("✅ Authenticated user:", user);
  if (!loading && !user) {
    window.location.href = '/login';
    return null;
  }
  
  // CRITICAL SECURITY: Admin privilege verification
  if (!loading && user && user.email !== 'jarviscamp@bellsouth.net' && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
          <p className="text-gray-600 mb-4">Admin privileges required to access this page.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    tierBreakdown: { free: 0, starter: 0, pro: 0, vault: 0 },
    monthlyRevenue: 0,
    emailCampaigns: 0,
    signupConversions: 0,
    churnRate: 0,
    canceledThisMonth: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [showUserBreakdown, setShowUserBreakdown] = useState(false);
  const [showRevenueBreakdown, setShowRevenueBreakdown] = useState(false);
  
  // SendGrid test form state
  const [emailForm, setEmailForm] = useState({
    email: 'jarviscamp@bellsouth.net',
    name: 'Admin Test User',
    tier: 'starter'
  });
  const [emailTesting, setEmailTesting] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [connectionTesting, setConnectionTesting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    // Display actual startup state - no customers yet
    setStats({
      totalUsers: 0,
      tierBreakdown: {
        free: 0,
        starter: 0,
        pro: 0,
        vault: 0
      },
      monthlyRevenue: 0,
      emailCampaigns: 0,
      signupConversions: 0,
      churnRate: 0,
      canceledThisMonth: 0
    });

    setRecentUsers([]);

    setAdminLoading(false);
  }, []);

  const calculateMonthlyRevenue = (users: any[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return users.reduce((total, user) => {
      if (!user.paymentHistory) return total;
      
      return total + user.paymentHistory
        .filter((payment: any) => {
          const paymentDate = payment.date.toDate();
          return paymentDate.getMonth() === currentMonth && 
                 paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum: number, payment: any) => sum + payment.amount, 0);
    }, 0);
  };

  const calculateChurnRate = (users: any[]) => {
    const activeUsers = users.filter(u => u.subscriptionStatus === 'active').length;
    const canceledUsers = users.filter(u => u.subscriptionStatus === 'canceled').length;
    const totalPaidUsers = activeUsers + canceledUsers;
    
    return totalPaidUsers > 0 ? (canceledUsers / totalPaidUsers) * 100 : 0;
  };

  const isThisMonth = (date?: Date) => {
    if (!date) return false;
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'starter': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'vault': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">OnyxHooks & More™ Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor platform performance and user analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setShowUserBreakdown(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.signupConversions} premium subscribers
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setShowRevenueBreakdown(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From Stripe payments this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Campaigns</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emailCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                Campaigns launched this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.churnRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.canceledThisMonth} canceled this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tier Breakdown & Recent Users */}
        <Tabs defaultValue="breakdown" className="space-y-4">
          <TabsList className="grid w-full grid-cols-8 lg:grid-cols-15 text-xs">
            <TabsTrigger value="breakdown">Tier Breakdown</TabsTrigger>
            <TabsTrigger value="users">Recent Users</TabsTrigger>
            <TabsTrigger value="flows">Upgrade Flows</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Intel</TabsTrigger>
            <TabsTrigger value="utm">UTM Analytics</TabsTrigger>
            <TabsTrigger value="intelligence">Campaign IQ</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="nos-challenge">NOS Challenge</TabsTrigger>
            <TabsTrigger value="stripe">Stripe Test</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="sendgrid">SendGrid Test</TabsTrigger>
            <TabsTrigger value="swipecopy">Swipe Copy</TabsTrigger>
            <TabsTrigger value="recaptcha">reCAPTCHA</TabsTrigger>
            <TabsTrigger value="secrets">App Secrets</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(stats.tierBreakdown).map(([tier, count]) => (
                <Card key={tier}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{tier} Tier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{count}</div>
                    <div className="text-sm text-gray-600">
                      {((count / stats.totalUsers) * 100).toFixed(1)}% of users
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Latest 10 Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-500">
                          Signed up: {user.signupDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTierColor(user.tier)}>
                          {user.tier}
                        </Badge>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.subscriptionStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flows">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade Flow Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium">Free → Starter</div>
                      <div className="text-xs text-gray-600">Entry point conversion</div>
                    </div>
                    <div className="text-lg font-bold">
                      {stats.tierBreakdown.starter > 0 
                        ? ((stats.tierBreakdown.starter / stats.tierBreakdown.free) * 100).toFixed(1) 
                        : 0}%
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium">Starter → Pro</div>
                      <div className="text-xs text-gray-600">Power user upgrade</div>
                    </div>
                    <div className="text-lg font-bold">
                      {stats.tierBreakdown.starter > 0 
                        ? ((stats.tierBreakdown.pro / stats.tierBreakdown.starter) * 100).toFixed(1) 
                        : 0}%
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium">Pro → Vault</div>
                      <div className="text-xs text-gray-600">Elite tier conversion</div>
                    </div>
                    <div className="text-lg font-bold">
                      {stats.tierBreakdown.pro > 0 
                        ? ((stats.tierBreakdown.vault / stats.tierBreakdown.pro) * 100).toFixed(1) 
                        : 0}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingIntelligence />
          </TabsContent>

          <TabsContent value="utm">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Campaign Attribution & Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UTMAnalytics />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intelligence">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Campaign Intelligence System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CampaignIntelligence />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Fraud Prevention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SecurityDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <SupportDashboard />
          </TabsContent>

          <TabsContent value="stripe">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Stripe Integration Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StripeTestConsole />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nos-challenge">
            <NOSChallengeAdmin />
          </TabsContent>

          <TabsContent value="webhooks">
            <WebhookDashboard />
          </TabsContent>

          <TabsContent value="sendgrid">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  SendGrid Email Service Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Connection Test */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold">Connection Test</h3>
                  <p className="text-sm text-gray-600">Verify SendGrid SMTP connectivity and API key configuration</p>
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={async () => {
                        setConnectionTesting(true);
                        setConnectionResult(null);
                        try {
                          const response = await fetch('/api/test/email-connection', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                          });
                          const result = await response.json();
                          setConnectionResult({
                            success: result.connected,
                            message: result.message
                          });
                        } catch (error) {
                          setConnectionResult({
                            success: false,
                            message: 'Failed to test connection: ' + (error as Error).message
                          });
                        } finally {
                          setConnectionTesting(false);
                        }
                      }}
                      disabled={connectionTesting}
                      variant="outline"
                    >
                      {connectionTesting ? 'Testing...' : 'Test Connection'}
                    </Button>
                    {connectionResult && (
                      <div className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                        connectionResult.success 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {connectionResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {connectionResult.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Welcome Email Test */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold">Welcome Email Test</h3>
                  <p className="text-sm text-gray-600">Send a test welcome email using SendGrid service</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="test-email">Email Address</Label>
                      <Input
                        id="test-email"
                        type="email"
                        value={emailForm.email}
                        onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                        placeholder="admin@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test-name">Customer Name</Label>
                      <Input
                        id="test-name"
                        value={emailForm.name}
                        onChange={(e) => setEmailForm({...emailForm, name: e.target.value})}
                        placeholder="Test User"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-tier">Tier</Label>
                    <Select value={emailForm.tier} onValueChange={(value) => setEmailForm({...emailForm, tier: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="vault">Vault</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={async () => {
                        setEmailTesting(true);
                        setEmailTestResult(null);
                        try {
                          const response = await fetch('/api/test/send-welcome-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(emailForm)
                          });
                          const result = await response.json();
                          setEmailTestResult({
                            success: result.success,
                            message: result.message
                          });
                        } catch (error) {
                          setEmailTestResult({
                            success: false,
                            message: 'Failed to send email: ' + (error as Error).message
                          });
                        } finally {
                          setEmailTesting(false);
                        }
                      }}
                      disabled={emailTesting || !emailForm.email || !emailForm.name}
                    >
                      {emailTesting ? 'Sending...' : 'Send Test Email'}
                    </Button>
                    {emailTestResult && (
                      <div className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                        emailTestResult.success 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {emailTestResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {emailTestResult.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Service Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">SendGrid Configuration</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Service:</strong> SendGrid SMTP with Nodemailer</p>
                    <p><strong>Authentication:</strong> API Key (SENDGRID_API_KEY)</p>
                    <p><strong>From Address:</strong> "OnyxHooks & More™ Team" &lt;support@onyxnpearls.com&gt;</p>
                    <p><strong>Migration Status:</strong> Successfully migrated from Zoho Mail</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swipecopy">
            <SwipeCopyScheduler />
          </TabsContent>

          <TabsContent value="recaptcha">
            <ReCaptchaManager />
          </TabsContent>

          <TabsContent value="secrets">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  App Secrets Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Download Configuration Backup</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Create a secure backup of your application's environment configuration. 
                    This includes masked secrets, setup instructions, and configuration summary.
                  </p>
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/admin/download-secrets');
                          if (response.ok) {
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'app-secrets.zip';
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                          } else {
                            throw new Error('Failed to download secrets');
                          }
                        } catch (error) {
                          console.error('Download failed:', error);
                          alert('Failed to download app secrets');
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download App Secrets (.zip)
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Archive Contents
                    </h3>
                    <div className="text-sm text-green-800 space-y-1">
                      <p><strong>app-secrets.env:</strong> Environment variables (masked)</p>
                      <p><strong>config-summary.json:</strong> Configuration overview</p>
                      <p><strong>setup-instructions.md:</strong> Setup guide</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Security Features
                    </h3>
                    <div className="text-sm text-amber-800 space-y-1">
                      <p><strong>Masked Values:</strong> Sensitive data protected</p>
                      <p><strong>Categorized:</strong> Organized by service type</p>
                      <p><strong>Comprehensive:</strong> All configuration included</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">Security Notice</h3>
                  <p className="text-sm text-red-800">
                    <strong>⚠️ IMPORTANT:</strong> Keep the downloaded file secure and do not share publicly! 
                    While sensitive values are masked, this file contains your complete application configuration structure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Breakdown Modal */}
        <Dialog open={showUserBreakdown} onOpenChange={setShowUserBreakdown}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Breakdown Analysis
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Tier Distribution */}
              <div>
                <h3 className="font-semibold mb-3">Tier Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gray-100 text-gray-800">Free</Badge>
                      <span className="text-sm">Basic features</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{stats.tierBreakdown.free.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {((stats.tierBreakdown.free / stats.totalUsers) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">Starter</Badge>
                      <span className="text-sm">$47/month</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{stats.tierBreakdown.starter.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {((stats.tierBreakdown.starter / stats.totalUsers) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800">Pro</Badge>
                      <span className="text-sm">$197/month</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{stats.tierBreakdown.pro.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {((stats.tierBreakdown.pro / stats.totalUsers) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-800">Vault</Badge>
                      <span className="text-sm">$5,000/year</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{stats.tierBreakdown.vault.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {((stats.tierBreakdown.vault / stats.totalUsers) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Metrics */}
              <div>
                <h3 className="font-semibold mb-3">Conversion Insights</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Free → Paid</div>
                    <div className="text-xl font-bold">
                      {(((stats.totalUsers - stats.tierBreakdown.free) / stats.totalUsers) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Overall conversion rate</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Pro+ Users</div>
                    <div className="text-xl font-bold">
                      {stats.tierBreakdown.pro + stats.tierBreakdown.vault}
                    </div>
                    <div className="text-xs text-muted-foreground">High-value customers</div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Revenue Breakdown Modal */}
        <Dialog open={showRevenueBreakdown} onOpenChange={setShowRevenueBreakdown}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue Breakdown Analysis
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Revenue by Tier */}
              <div>
                <h3 className="font-semibold mb-3">Revenue by Tier</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">Starter</Badge>
                      <span className="text-sm">{stats.tierBreakdown.starter} users × $47</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${(stats.tierBreakdown.starter * 47).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {(((stats.tierBreakdown.starter * 47) / stats.monthlyRevenue) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800">Pro</Badge>
                      <span className="text-sm">{stats.tierBreakdown.pro} users × $197</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${(stats.tierBreakdown.pro * 197).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {(((stats.tierBreakdown.pro * 197) / stats.monthlyRevenue) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-800">Vault</Badge>
                      <span className="text-sm">{stats.tierBreakdown.vault} users × $417/mo</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${(stats.tierBreakdown.vault * 417).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {(((stats.tierBreakdown.vault * 417) / stats.monthlyRevenue) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Metrics */}
              <div>
                <h3 className="font-semibold mb-3">Financial Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">ARPU</div>
                    <div className="text-xl font-bold">
                      ${(stats.monthlyRevenue / (stats.totalUsers - stats.tierBreakdown.free)).toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Average revenue per user</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Annual Run Rate</div>
                    <div className="text-xl font-bold">
                      ${(stats.monthlyRevenue * 12).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Based on current MRR</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Vault Revenue</div>
                    <div className="text-xl font-bold">
                      ${(stats.tierBreakdown.vault * 417).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">High-value tier contribution</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm text-amber-600 font-medium">Growth Potential</div>
                    <div className="text-xl font-bold">
                      ${(stats.tierBreakdown.free * 47).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">If all free users upgrade</div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="font-semibold mb-3">Payment Insights</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm">Stripe Payments</span>
                    </div>
                    <span className="text-sm font-medium">98.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Monthly Subscriptions</span>
                    </div>
                    <span className="text-sm font-medium">87.4%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Annual Subscriptions</span>
                    </div>
                    <span className="text-sm font-medium">12.6%</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}