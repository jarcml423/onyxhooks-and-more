import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, FileText, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SchedulerStatus {
  currentMonth: string;
  nextScheduledUpdate: string;
  monthlyItemsAdded: number;
  schedulerActive: boolean;
  vaultMembersNotified: number;
}

export function SwipeCopyScheduler() {
  const [isTriggering, setIsTriggering] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useQuery<SchedulerStatus>({
    queryKey: ['/api/admin/swipe-copy/status'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const triggerUpdateMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/admin/swipe-copy/trigger-monthly-update'),
    onSuccess: (data: any) => {
      toast({
        title: "Monthly Update Triggered",
        description: `Successfully added ${data.itemCount || 0} new templates to the Swipe Copy Bank`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/swipe-copy/status'] });
      setIsTriggering(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to trigger monthly update",
        variant: "destructive",
      });
      setIsTriggering(false);
    }
  });

  const handleTriggerUpdate = () => {
    setIsTriggering(true);
    triggerUpdateMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Monthly Swipe Copy Scheduler</h1>
          <p className="text-slate-400 mt-1">Automated content updates for Vault tier members</p>
        </div>
        <Badge variant={status?.schedulerActive ? "default" : "destructive"} className="px-3 py-1">
          {status?.schedulerActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="content">Content Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Current Month</CardTitle>
                <Calendar className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{status?.currentMonth}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Templates Added</CardTitle>
                <FileText className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{status?.monthlyItemsAdded}</div>
                <p className="text-xs text-slate-400 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Vault Members</CardTitle>
                <Users className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{status?.vaultMembersNotified}</div>
                <p className="text-xs text-slate-400 mt-1">Notified</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">System Status</CardTitle>
                {status?.schedulerActive ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${status?.schedulerActive ? 'text-green-400' : 'text-red-400'}`}>
                  {status?.schedulerActive ? 'Online' : 'Offline'}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Manual Update</CardTitle>
              <CardDescription className="text-slate-400">
                Trigger a monthly update manually for testing or immediate deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleTriggerUpdate}
                disabled={isTriggering || triggerUpdateMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Zap className="mr-2 h-4 w-4" />
                {isTriggering || triggerUpdateMutation.isPending ? "Triggering Update..." : "Trigger Monthly Update"}
              </Button>
              <p className="text-sm text-slate-400 mt-2">
                This will generate 15 new templates across all categories and notify Vault members.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Automated Schedule</CardTitle>
              <CardDescription className="text-slate-400">
                System runs automatically at 2:00 AM ET on the last day of each month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Next Scheduled Update</p>
                  <p className="text-slate-400 text-sm">
                    {status?.nextScheduledUpdate ? formatDate(status.nextScheduledUpdate) : "Not scheduled"}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-white font-medium mb-2">Update Process</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Generate 15 new templates using AI</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Save to Swipe Copy Bank database</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Send notification emails to Vault members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Log update success and metrics</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Content Generation Stats</CardTitle>
              <CardDescription className="text-slate-400">
                Monthly template categories and distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">6</div>
                  <div className="text-sm text-slate-400">Hooks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">3</div>
                  <div className="text-sm text-slate-400">CTAs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">3</div>
                  <div className="text-sm text-slate-400">Closers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">2</div>
                  <div className="text-sm text-slate-400">Objections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">1</div>
                  <div className="text-sm text-slate-400">Urgency</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-white font-medium mb-3">Target Industries</h4>
                <div className="flex flex-wrap gap-2">
                  {['Business Coaching', 'Fitness', 'Real Estate', 'SaaS', 'E-commerce', 
                    'Digital Marketing', 'Health & Wellness', 'Finance', 'Education', 'Agency'].map(industry => (
                    <Badge key={industry} variant="outline" className="border-slate-600 text-slate-300">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}