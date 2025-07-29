import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Building, Users, Plus, Settings, Crown, 
  TrendingUp, DollarSign, Target, Sparkles,
  Mail, Phone, Globe, BarChart3, ArrowUpRight
} from "lucide-react";

interface AgencyClient {
  id: number;
  clientName: string;
  clientEmail: string;
  brandName: string;
  isActive: boolean;
  createdAt: string;
}

export default function Agency() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    clientName: "",
    clientEmail: "",
    brandName: ""
  });

  // Check if user has agency access
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
    enabled: !!user,
  });

  const { data: clients, isLoading } = useQuery<AgencyClient[]>({
    queryKey: ["/api/agency-clients"],
    enabled: !!user && userData?.role === "agency",
  });

  const addClientMutation = useMutation({
    mutationFn: async (clientData: typeof newClient) => {
      const response = await apiRequest("POST", "/api/agency-clients", clientData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agency-clients"] });
      setIsAddClientOpen(false);
      setNewClient({ clientName: "", clientEmail: "", brandName: "" });
      toast({
        title: "Client added!",
        description: "New client has been added to your workspace.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add client",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddClient = () => {
    if (!newClient.clientName || !newClient.brandName) {
      toast({
        title: "Missing information",
        description: "Please fill in client name and brand name.",
        variant: "destructive",
      });
      return;
    }
    addClientMutation.mutate(newClient);
  };

  // If user doesn't have agency access, show upgrade prompt
  if (userData && userData.role !== "agency") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="text-center">
              <CardContent className="py-16">
                <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Agency Mode
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Manage multiple client brands and offers with our Agency workspace. 
                  Perfect for agencies, consultants, and freelancers.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-lg mx-auto">
                  <h3 className="font-semibold text-blue-900 mb-3">Agency Features Include:</h3>
                  <ul className="text-sm text-blue-800 space-y-2 text-left">
                    <li>• Multi-client workspace management</li>
                    <li>• Unlimited offers across all clients</li>
                    <li>• Team collaboration tools</li>
                    <li>• White-label options available</li>
                    <li>• Priority phone support</li>
                    <li>• Custom integrations</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/subscribe?plan=agency">
                    <Button size="lg" className="btn-primary">
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade to Agency - $99/mo
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    Contact Sales
                  </Button>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  30-day money-back guarantee • Cancel anytime
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Loading agency workspace...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="flex items-center mb-4">
                <Building className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-4xl font-bold text-gray-900">
                  Agency Workspace
                </h1>
                <Badge className="ml-3 bg-yellow-100 text-yellow-800">
                  <Crown className="w-3 h-3 mr-1" />
                  Agency
                </Badge>
              </div>
              <p className="text-xl text-gray-600">
                Manage all your client offers and campaigns in one place
              </p>
            </div>
            
            <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>
                    Add a new client to your agency workspace
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      placeholder="John Smith"
                      value={newClient.clientName}
                      onChange={(e) => setNewClient(prev => ({ ...prev, clientName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Client Email (Optional)</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={newClient.clientEmail}
                      onChange={(e) => setNewClient(prev => ({ ...prev, clientEmail: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="brandName">Brand/Business Name</Label>
                    <Input
                      id="brandName"
                      placeholder="Smith Consulting"
                      value={newClient.brandName}
                      onChange={(e) => setNewClient(prev => ({ ...prev, brandName: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleAddClient}
                      disabled={addClientMutation.isPending}
                      className="flex-1"
                    >
                      {addClientMutation.isPending ? "Adding..." : "Add Client"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddClientOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="text-center p-6">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {clients?.length || 0}
                </div>
                <p className="text-gray-600">Active Clients</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {(clients?.length || 0) * 3}
                </div>
                <p className="text-gray-600">Offers Generated</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  247%
                </div>
                <p className="text-gray-600">Avg. Price Increase</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  $84K
                </div>
                <p className="text-gray-600">Revenue Generated</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="clients" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="mt-8">
              {clients && clients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clients.map((client) => (
                    <Card key={client.id} className="card-hover">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{client.brandName}</CardTitle>
                            <p className="text-gray-600">{client.clientName}</p>
                          </div>
                          <Badge variant={client.isActive ? "default" : "secondary"}>
                            {client.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {client.clientEmail && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-2" />
                              {client.clientEmail}
                            </div>
                          )}
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Target className="w-4 h-4 mr-2" />
                            3 offers created
                          </div>

                          <div className="pt-3 border-t">
                            <div className="grid grid-cols-2 gap-3">
                              <Button variant="outline" size="sm" className="w-full">
                                <Sparkles className="w-3 h-3 mr-1" />
                                New Offer
                              </Button>
                              <Button variant="outline" size="sm" className="w-full">
                                <BarChart3 className="w-3 h-3 mr-1" />
                                Analytics
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-16">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      No clients yet
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Start by adding your first client to begin managing their offers and campaigns.
                    </p>
                    <Button 
                      onClick={() => setIsAddClientOpen(true)}
                      className="btn-primary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Client
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {clients?.slice(0, 5).map((client, index) => (
                        <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{client.brandName}</p>
                            <p className="text-sm text-gray-600">3 offers • $12K revenue</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">+247%</p>
                            <p className="text-xs text-gray-600">avg. increase</p>
                          </div>
                        </div>
                      ))}
                      {(!clients || clients.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          No analytics data available yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">New Clients</span>
                        <span className="font-semibold">+{clients?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Offers Created</span>
                        <span className="font-semibold">+{(clients?.length || 0) * 3}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Revenue Generated</span>
                        <span className="font-semibold text-green-600">+$84,250</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Client Retention</span>
                        <span className="font-semibold">94%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Workspace Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="agencyName">Agency Name</Label>
                      <Input
                        id="agencyName"
                        placeholder="Your Agency Name"
                        defaultValue={userData?.displayName || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="agencyEmail">Primary Email</Label>
                      <Input
                        id="agencyEmail"
                        type="email"
                        defaultValue={userData?.email || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="agencyWebsite">Website (Optional)</Label>
                      <Input
                        id="agencyWebsite"
                        placeholder="https://youragency.com"
                      />
                    </div>
                    <Button className="w-full">
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>White-Label Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Available Soon</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Customize OnyxHooks & More™ with your agency branding:
                      </p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Custom domain (agency.yoursite.com)</li>
                        <li>• Your logo and color scheme</li>
                        <li>• Custom email templates</li>
                        <li>• Remove OnyxHooks branding</li>
                      </ul>
                    </div>
                    <Button variant="outline" className="w-full" disabled>
                      <Crown className="w-4 h-4 mr-2" />
                      Contact for White-Label Setup
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-hover cursor-pointer">
                <CardContent className="text-center p-6">
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Generate Offers</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Create optimized offers for your clients
                  </p>
                  <Link href="/offer-generator">
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      Start Generating
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="card-hover cursor-pointer">
                <CardContent className="text-center p-6">
                  <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Funnel Analysis</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Analyze client funnels for optimization
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    Analyze Funnels
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-hover cursor-pointer">
                <CardContent className="text-center p-6">
                  <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Access Vault</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Browse 200+ proven templates
                  </p>
                  <Link href="/vault">
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      Browse Vault
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
