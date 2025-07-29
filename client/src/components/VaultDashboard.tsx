import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Zap,
  Target,
  Trophy,
  Users,
  FileText,
  Download,
  Mail,
  ArrowUpRight,
  BarChart3,
  HelpCircle
} from "lucide-react";
import { Link } from "wouter";
import CampaignBuilder from "./CampaignBuilder";
import UsageAnalytics from "./UsageAnalytics";

interface UserTierData {
  tier: 'free' | 'starter' | 'pro' | 'vault';
  joinedDate: string;
  billingStatus: 'active' | 'trial' | 'past_due' | 'canceled';
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  usage: {
    hooksGenerated: number;
    offersGenerated: number;
    councilSessions: number;
    vaultAccess: number;
  };
  limits: {
    hooksGenerated: number;
    offersGenerated: number;
    councilSessions: number;
    vaultAccess: number;
  };
}

interface VaultDashboardProps {
  userData: UserTierData;
  onUpgrade: () => void;
}

const tierInfo = {
  free: { name: "Free", color: "from-gray-400 to-gray-600", price: "$0" },
  starter: { name: "Starter", color: "from-blue-400 to-blue-600", price: "$47" },
  pro: { name: "Pro", color: "from-purple-400 to-purple-600", price: "$197/mo" },
  vault: { name: "Vault", color: "from-yellow-400 to-yellow-600", price: "$5,000/yr" }
};

const achievements = [
  { id: 1, title: "First Hook", description: "Generated your first hook", completed: true },
  { id: 2, title: "Offer Master", description: "Created 10 offers", completed: true },
  { id: 3, title: "Council Veteran", description: "100 council sessions", completed: false },
  { id: 4, title: "Vault Explorer", description: "Accessed all vault templates", completed: false }
];

export default function VaultDashboard({ userData, onUpgrade }: VaultDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const tierData = tierInfo[userData.tier];
  
  const getUsagePercentage = (used: number, limit: number) => {
    return limit === -1 ? 0 : Math.min((used / limit) * 100, 100);
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-blue-500';
      case 'past_due': return 'bg-red-500';
      case 'canceled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getNextTier = () => {
    const tiers = ['free', 'starter', 'pro', 'vault'];
    const currentIndex = tiers.indexOf(userData.tier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const nextTier = getNextTier();

  return (
    <div className="space-y-6">
      {/* Header with Tier Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Avatar className={`h-16 w-16 bg-gradient-to-r ${tierData.color}`}>
            <AvatarFallback className="text-white font-bold text-xl">
              {userData.tier === 'vault' ? <Crown className="h-8 w-8" /> : tierData.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {tierData.name} Member
            </h1>
            <p className="text-muted-foreground">
              Member since {new Date(userData.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {nextTier && (
          <Button onClick={onUpgrade} className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Upgrade to {tierInfo[nextTier as keyof typeof tierInfo].name}
          </Button>
        )}
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="achievements">Progress</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Hooks Generated</span>
                </div>
                <div className="text-2xl font-bold mt-2">{userData.usage.hooksGenerated}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Offers Created</span>
                </div>
                <div className="text-2xl font-bold mt-2">{userData.usage.offersGenerated}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Council Sessions</span>
                </div>
                <div className="text-2xl font-bold mt-2">{userData.usage.councilSessions}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Vault Access</span>
                </div>
                <div className="text-2xl font-bold mt-2">{userData.usage.vaultAccess}</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Target className="h-6 w-6" />
                  <span className="text-sm">Generate Hook</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Zap className="h-6 w-6" />
                  <span className="text-sm">Build Offer</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Council Session</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Download className="h-6 w-6" />
                  <span className="text-sm">Export PDF</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <UsageAnalytics />
        </TabsContent>



        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Information Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Account Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Account Created</span>
                    <span className="font-medium text-gray-900">
                      {new Date(userData.joinedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Member Since</span>
                    <span className="text-sm text-blue-600 font-medium">
                      {Math.floor((new Date().getTime() - new Date(userData.joinedDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Subscription Information Section */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Subscription Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Current Plan</span>
                    <Badge className={`bg-gradient-to-r ${tierData.color} text-white shadow-sm`}>
                      {tierData.name} - {tierData.price}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Status</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getBillingStatusColor(userData.billingStatus)} shadow-sm`} />
                      <span className="capitalize font-medium text-gray-900">{userData.billingStatus}</span>
                    </div>
                  </div>
                  
                  {userData.lastPaymentDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Last Payment</span>
                      <span className="font-medium text-gray-900">
                        {new Date(userData.lastPaymentDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  
                  {userData.nextPaymentDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Next Payment</span>
                      <span className="font-medium text-gray-900">
                        {new Date(userData.nextPaymentDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Invoices
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support Section */}
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <HelpCircle className="h-5 w-5 text-purple-600" />
                Help & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
                <p className="text-gray-700 mb-4">
                  Get answers to common questions or contact our support team for assistance.
                </p>
                <div className="flex gap-3">
                  <Link href="/faq">
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      View FAQ
                    </Button>
                  </Link>
                  <a href="mailto:support@onyxnpearls.com">
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <CampaignBuilder />
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.01 }}
                className={`p-4 border rounded-lg ${
                  achievement.completed 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-muted/50 border-muted'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    achievement.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      achievement.completed ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.completed && (
                    <Badge className="bg-primary">Completed</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}