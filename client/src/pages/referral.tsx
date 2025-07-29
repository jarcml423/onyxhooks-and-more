import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, DollarSign, TrendingUp, Share, Copy, 
  ExternalLink, Gift, Star, Target, Mail,
  Calendar, CheckCircle, Clock, AlertCircle
} from "lucide-react";

interface ReferralData {
  referralCode: string;
  referrals: number;
  conversions: number;
  earnings: number;
  referralList: Array<{
    id: number;
    referredEmail: string;
    status: "pending" | "converted" | "paid";
    commissionAmount: string;
    createdAt: string;
  }>;
}

export default function Referral() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const { data: referralData, isLoading } = useQuery<ReferralData>({
    queryKey: ["/api/referral-data"],
    enabled: !!user,
  });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const referralUrl = referralData?.referralCode 
    ? `${window.location.origin}/signup?ref=${referralData.referralCode}`
    : "";

  const shareText = `🚀 Transform your offers with AI! Join me on OnyxHooks & More™ and get instant access to proven templates that convert. Use my link: ${referralUrl}`;

  const handleSocialShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(referralUrl);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      email: `mailto:?subject=Check out OnyxHooks & More™&body=${encodedText}`
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Loading referral dashboard...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const conversionRate = referralData?.referrals ? 
    (referralData.conversions / referralData.referrals * 100) : 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-yellow-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">
                Affiliate Program
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Earn 30% recurring commission for every creator you refer to OnyxHooks & More™. 
              Help others optimize their offers while building passive income.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="text-center p-6">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {referralData?.referrals || 0}
                </div>
                <p className="text-gray-600">Total Referrals</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {referralData?.conversions || 0}
                </div>
                <p className="text-gray-600">Conversions</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {conversionRate.toFixed(1)}%
                </div>
                <p className="text-gray-600">Conversion Rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${referralData?.earnings?.toFixed(2) || "0.00"}
                </div>
                <p className="text-gray-600">Total Earnings</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Referral Tools */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Share className="w-5 h-5 mr-2 text-primary" />
                    Your Referral Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={referralUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(referralUrl, "Referral Link")}
                      variant="outline"
                    >
                      {copiedItem === "Referral Link" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Share your unique referral link</li>
                      <li>• When someone signs up and upgrades to paid plan</li>
                      <li>• You earn 30% recurring commission</li>
                      <li>• Payments processed monthly via PayPal</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-primary" />
                    Share on Social Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Ready-to-share message:
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={shareText}
                          readOnly
                          className="text-sm"
                        />
                        <Button
                          onClick={() => copyToClipboard(shareText, "Share Message")}
                          variant="outline"
                          size="sm"
                        >
                          {copiedItem === "Share Message" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => handleSocialShare("twitter")}
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
                      >
                        Share on X
                      </Button>
                      <Button 
                        onClick={() => handleSocialShare("linkedin")}
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
                      >
                        Share on LinkedIn
                      </Button>
                      <Button 
                        onClick={() => handleSocialShare("facebook")}
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
                      >
                        Share on Facebook
                      </Button>
                      <Button 
                        onClick={() => handleSocialShare("email")}
                        variant="outline"
                        className="bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commission Structure & Tips */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Commission Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Pro Plan ($25/mo)</span>
                        <Badge className="bg-green-100 text-green-800">$7.50/mo</Badge>
                      </div>
                      <p className="text-sm text-gray-600">30% recurring commission</p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Vault Plan ($49/mo)</span>
                        <Badge className="bg-green-100 text-green-800">$14.70/mo</Badge>
                      </div>
                      <p className="text-sm text-gray-600">30% recurring commission</p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Agency Plan ($99/mo)</span>
                        <Badge className="bg-green-100 text-green-800">$29.70/mo</Badge>
                      </div>
                      <p className="text-sm text-gray-600">30% recurring commission</p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">💰 Earning Potential</h4>
                      <p className="text-sm text-green-800">
                        Just 10 Vault subscribers = $147/month recurring income!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Conversion Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3" />
                      <p>Share transformation stories from the before/after page</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3" />
                      <p>Highlight the free quiz as an easy entry point</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3" />
                      <p>Emphasize the 200+ proven prompts in the Vault</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3" />
                      <p>Target coaches, course creators, and agencies</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3" />
                      <p>Share your own results and case studies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Referral History */}
          {referralData?.referralList && referralData.referralList.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Referral History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Email</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Commission</th>
                        <th className="text-left p-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralData.referralList.map((referral) => (
                        <tr key={referral.id} className="border-b">
                          <td className="p-3 font-mono text-sm">{referral.referredEmail}</td>
                          <td className="p-3">
                            {referral.status === "pending" && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            {referral.status === "converted" && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Converted
                              </Badge>
                            )}
                            {referral.status === "paid" && (
                              <Badge className="bg-green-100 text-green-800">
                                <DollarSign className="w-3 h-3 mr-1" />
                                Paid
                              </Badge>
                            )}
                          </td>
                          <td className="p-3 font-semibold">
                            {referral.commissionAmount ? `$${referral.commissionAmount}` : "-"}
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Getting Started */}
          {(!referralData?.referrals || referralData.referrals === 0) && (
            <Card className="mt-8 bg-gradient-to-r from-primary to-secondary text-white">
              <CardContent className="text-center py-12">
                <Gift className="w-16 h-16 mx-auto mb-6 opacity-90" />
                <h3 className="text-2xl font-bold mb-4">Start Earning Today!</h3>
                <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                  Copy your referral link above and start sharing OnyxHooks & More™ with your network. 
                  Every creator you help will generate recurring income for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => copyToClipboard(referralUrl, "Referral Link")}
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Copy Referral Link
                  </Button>
                  <Button 
                    onClick={() => handleSocialShare("twitter")}
                    variant="outline" 
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-primary"
                  >
                    <Share className="w-5 h-5 mr-2" />
                    Share on Social
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
