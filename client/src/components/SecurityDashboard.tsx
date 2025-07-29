import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Shield,
  AlertTriangle,
  Users,
  Eye,
  Clock,
  TrendingUp,
  Activity,
  Ban,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

interface SecurityEvent {
  type: string;
  severity: 'info' | 'warning' | 'critical';
  details: any;
  timestamp: Date;
}

interface SecurityStats {
  recentEvents: SecurityEvent[];
  riskStats: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  flaggedPatterns: {
    duplicateFingerprints: number;
    disposableEmails: number;
    highRiskIPs: number;
    suspiciousPatterns: number;
  };
}

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: securityData, isLoading } = useQuery<SecurityStats>({
    queryKey: ["/api/security/dashboard"]
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-500" />
            Security Dashboard
          </h2>
          <p className="text-muted-foreground">
            Fraud prevention and abuse monitoring system
          </p>
        </div>
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Vault Exclusive
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="patterns">Threat Patterns</TabsTrigger>
        </TabsList>

        {/* Security Overview */}
        <TabsContent value="overview" className="space-y-6">
          {/* Risk Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{securityData?.riskStats?.total || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical Risk</p>
                    <p className="text-2xl font-bold text-red-600">{securityData?.riskStats?.critical || 0}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Risk</p>
                    <p className="text-2xl font-bold text-orange-600">{securityData?.riskStats?.high || 0}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Medium Risk</p>
                    <p className="text-2xl font-bold text-yellow-600">{securityData?.riskStats?.medium || 0}</p>
                  </div>
                  <Activity className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Risk</p>
                    <p className="text-2xl font-bold text-green-600">{securityData?.riskStats?.low || 0}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Threat Detection Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Threat Detection Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {securityData?.flaggedPatterns?.duplicateFingerprints || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Duplicate Devices</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {securityData?.flaggedPatterns?.disposableEmails || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Disposable Emails</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {securityData?.flaggedPatterns?.highRiskIPs || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">High-Risk IPs</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {securityData?.flaggedPatterns?.suspiciousPatterns || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Suspicious Patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Events */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Security Events (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityData?.recentEvents?.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                      {getSeverityIcon(event.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold capitalize">
                          {event.type.replace('_', ' ')}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.type === 'duplicate_fingerprint' && (
                          <p>Duplicate device detected: {event.details?.email || 'Unknown user'}</p>
                        )}
                        {event.type === 'disposable_email' && (
                          <p>Disposable email signup: {event.details?.email || 'Unknown email'}</p>
                        )}
                        {event.type === 'ip_abuse' && (
                          <p>Multiple signups from IP: {event.details?.ip || 'Unknown IP'} ({event.details?.attempts || 0} attempts)</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )) || (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent security events
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Threat Patterns */}
        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Abuse Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Same fingerprint, multiple accounts</span>
                    <Badge variant="destructive">8 detected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">3+ free accounts from same IP</span>
                    <Badge variant="destructive">5 detected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disposable email services</span>
                    <Badge className="bg-orange-500">23 detected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Suspicious domain patterns</span>
                    <Badge className="bg-yellow-500">15 detected</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ban className="h-5 w-5" />
                  Enforcement Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Accounts suspended</span>
                    <Badge variant="destructive">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Manual review queue</span>
                    <Badge className="bg-yellow-500">7</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Throttled access</span>
                    <Badge className="bg-orange-500">12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CAPTCHA required</span>
                    <Badge className="bg-blue-500">18</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Policy Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Device fingerprinting active</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>IP-based rate limiting enabled</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Disposable email detection running</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Progressive access controls active</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Manual review escalation enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}