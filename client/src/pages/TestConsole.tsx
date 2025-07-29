import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, CheckCircle, XCircle, Zap, Database, Shield } from "lucide-react";

export default function TestConsole() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Test UTM Analytics endpoint
  const { data: utmData, isLoading: utmLoading, refetch: refetchUTM } = useQuery<{
    success: boolean;
    analytics: any;
    generatedAt: string;
  }>({
    queryKey: ['/api/analytics/utm/test'],
    staleTime: 0,
  });

  const runTest = async (testName: string, endpoint: string, method: 'GET' | 'POST' = 'GET') => {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          status: response.ok ? 'success' : 'error',
          statusCode: response.status,
          data: data,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const tests = [
    {
      name: 'UTM Analytics Test',
      endpoint: '/api/analytics/utm/test',
      description: 'Test UTM tracking analytics data',
      category: 'analytics'
    },
    {
      name: 'Campaign Intelligence',
      endpoint: '/api/campaign/dashboard/test',
      description: 'Test campaign performance dashboard',
      category: 'campaign'
    },
    {
      name: 'Security Dashboard',
      endpoint: '/api/security/dashboard/test',
      description: 'Test security monitoring data',
      category: 'security'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Terminal className="w-10 h-10 text-purple-400" />
            VaultForge Test Console
          </h1>
          <p className="text-slate-300 text-lg">
            Test API endpoints and system functionality
          </p>
        </div>

        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-purple-500/20">
            <TabsTrigger value="endpoints" className="data-[state=active]:bg-purple-600">
              <Zap className="w-4 h-4 mr-2" />
              API Endpoints
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <Database className="w-4 h-4 mr-2" />
              Live Analytics
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-purple-600">
              <Shield className="w-4 h-4 mr-2" />
              Security Tests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-4">
            <Card className="bg-slate-800/30 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-purple-400" />
                  API Endpoint Tests
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Test various API endpoints to verify functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {tests.map((test) => (
                    <div key={test.name} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700">
                      <div className="space-y-1">
                        <h3 className="text-white font-medium">{test.name}</h3>
                        <p className="text-sm text-slate-400">{test.description}</p>
                        <Badge variant="outline" className="text-purple-400 border-purple-400">
                          {test.endpoint}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        {testResults[test.name] && (
                          <div className="flex items-center gap-2">
                            {testResults[test.name].status === 'success' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className="text-sm text-slate-400">
                              {testResults[test.name].statusCode || 'Error'}
                            </span>
                          </div>
                        )}
                        <Button
                          onClick={() => runTest(test.name, test.endpoint)}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Test
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {Object.keys(testResults).length > 0 && (
              <Card className="bg-slate-800/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Test Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(testResults).map(([testName, result]) => (
                    <div key={testName} className="p-4 bg-slate-900/30 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{testName}</h4>
                        <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                          {result.status}
                        </Badge>
                      </div>
                      <pre className="text-sm text-slate-300 bg-slate-900 p-3 rounded overflow-x-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-slate-800/30 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  Live UTM Analytics Data
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time UTM tracking and campaign performance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {utmLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : utmData ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Live Data
                      </Badge>
                      <Button
                        onClick={() => refetchUTM()}
                        size="sm"
                        variant="outline"
                        className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                      >
                        Refresh
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700">
                        <h4 className="text-white font-medium mb-2">Campaign Performance</h4>
                        <p className="text-2xl font-bold text-purple-400">
                          {utmData.analytics.campaignPerformance?.length || 0}
                        </p>
                        <p className="text-sm text-slate-400">Active Campaigns</p>
                      </div>
                      
                      <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700">
                        <h4 className="text-white font-medium mb-2">Total Revenue</h4>
                        <p className="text-2xl font-bold text-green-400">
                          ${utmData.analytics.campaignPerformance?.reduce((sum: number, campaign: any) => sum + campaign.revenue, 0).toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-slate-400">Attributed Revenue</p>
                      </div>
                      
                      <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700">
                        <h4 className="text-white font-medium mb-2">Content Pieces</h4>
                        <p className="text-2xl font-bold text-blue-400">
                          {utmData.analytics.topPerformingContent?.length || 0}
                        </p>
                        <p className="text-sm text-slate-400">Tracked Content</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-white font-medium mb-3">Raw Analytics Data</h4>
                      <pre className="text-sm text-slate-300 bg-slate-900 p-4 rounded overflow-x-auto max-h-96">
                        {JSON.stringify(utmData.analytics, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-center p-8">No data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="bg-slate-800/30 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Security System Tests
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Test security endpoints and fraud prevention systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() => runTest('Security Check', '/api/security/check', 'POST')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Test Security Check
                  </Button>
                  
                  <Button
                    onClick={() => runTest('Device Fingerprint', '/api/security/fingerprint', 'POST')}
                    variant="outline"
                    className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
                  >
                    Test Device Fingerprinting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Console Instructions */}
        <Card className="bg-slate-800/30 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">How to Use the Test Console</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div className="space-y-2">
              <h4 className="font-medium text-white">Testing API Endpoints:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Click "Test" buttons to run individual endpoint tests</li>
                <li>View results in the Test Results section below</li>
                <li>Green checkmarks indicate successful responses</li>
                <li>Red X marks indicate errors or failures</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white">Live Analytics:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>View real-time UTM tracking data</li>
                <li>Campaign performance metrics and revenue attribution</li>
                <li>Click "Refresh" to get the latest data</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white">Browser Console Commands:</h4>
              <div className="bg-slate-900 p-3 rounded font-mono text-sm">
                <div className="text-purple-400">// Test UTM endpoint directly</div>
                <div>{'fetch(\'/api/analytics/utm/test\').then(r => r.json()).then(console.log)'}</div>
                <br />
                <div className="text-purple-400">// Check server response</div>
                <div>{'fetch(\'/api/campaign/dashboard\').then(r => console.log(r.status))'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}