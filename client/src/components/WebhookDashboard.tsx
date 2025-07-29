import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle, Database, Activity, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WebhookEvent {
  id: number;
  stripeEventId: string;
  eventType: string;
  processed: boolean;
  processingAttempts: number;
  lastProcessingError?: string;
  userId?: number;
  customerId?: string;
  subscriptionId?: string;
  createdAt: string;
  processedAt?: string;
  data: any;
}

interface SubscriptionHistory {
  id: number;
  userId: number;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: string;
  planId?: string;
  planName?: string;
  amount?: number;
  currency: string;
  interval?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  canceledAt?: string;
  endedAt?: string;
  createdAt: string;
}

export default function WebhookDashboard() {
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingEvent, setRetryingEvent] = useState<string | null>(null);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const { toast } = useToast();

  const loadWebhookEvents = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/webhooks");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWebhookEvents(data.events || []);
        }
      }
    } catch (error) {
      console.error("Failed to load webhook events:", error);
    }
  };

  const loadSubscriptionHistory = async (userId: number = 1) => {
    try {
      const response = await apiRequest("GET", `/api/admin/subscription-history/${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSubscriptionHistory(data.history || []);
        }
      }
    } catch (error) {
      console.error("Failed to load subscription history:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadWebhookEvents(),
        loadSubscriptionHistory()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  const retryWebhook = async (eventId: string) => {
    setRetryingEvent(eventId);
    try {
      const response = await apiRequest("POST", `/api/admin/webhooks/${eventId}/retry`);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Webhook Retry Success",
          description: "Event processed successfully",
        });
        await loadWebhookEvents();
      } else {
        toast({
          title: "Webhook Retry Failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Retry Error",
        description: "Failed to retry webhook event",
        variant: "destructive",
      });
    } finally {
      setRetryingEvent(null);
    }
  };

  const testWebhook = async (eventType: string) => {
    setTestingWebhook(true);
    try {
      const response = await apiRequest("POST", "/api/test/webhook", {
        eventType,
        customerEmail: "test@example.com"
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Test Webhook Success",
          description: `${eventType} event processed successfully`,
        });
        await loadWebhookEvents();
      } else {
        toast({
          title: "Test Webhook Failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Test Error",
        description: "Failed to test webhook",
        variant: "destructive",
      });
    } finally {
      setTestingWebhook(false);
    }
  };

  const getEventStatusBadge = (event: WebhookEvent) => {
    if (event.processed) {
      return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Processed</Badge>;
    } else if (event.processingAttempts > 0) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
    } else {
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getSubscriptionStatusBadge = (status: string) => {
    const statusColors = {
      active: "bg-green-600",
      trialing: "bg-blue-600", 
      past_due: "bg-yellow-600",
      canceled: "bg-red-600",
      unpaid: "bg-red-600"
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-600"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount?: number, currency: string = 'usd') => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const processedEvents = webhookEvents.filter(e => e.processed).length;
  const failedEvents = webhookEvents.filter(e => !e.processed && e.processingAttempts > 0).length;
  const pendingEvents = webhookEvents.filter(e => !e.processed && e.processingAttempts === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Webhook Pipeline Dashboard</h2>
          <p className="text-gray-400">Monitor Stripe webhook events and subscription synchronization</p>
        </div>
        <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{webhookEvents.length}</div>
            <p className="text-xs text-gray-400">All webhook events</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Processed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{processedEvents}</div>
            <p className="text-xs text-gray-400">Successfully processed</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{failedEvents}</div>
            <p className="text-xs text-gray-400">Processing failed</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{pendingEvents}</div>
            <p className="text-xs text-gray-400">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="events" className="data-[state=active]:bg-purple-600">
            <Database className="w-4 h-4 mr-2" />
            Webhook Events
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-purple-600">
            <Users className="w-4 h-4 mr-2" />
            Subscription History
          </TabsTrigger>
          <TabsTrigger value="testing" className="data-[state=active]:bg-purple-600">
            <Activity className="w-4 h-4 mr-2" />
            Test Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Webhook Events</CardTitle>
              <CardDescription>Latest Stripe webhook events and their processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhookEvents.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No webhook events found</p>
                ) : (
                  webhookEvents.slice(0, 10).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <code className="text-purple-400 font-mono text-sm">{event.eventType}</code>
                          {getEventStatusBadge(event)}
                          {event.processingAttempts > 0 && (
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                              {event.processingAttempts} attempt{event.processingAttempts > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          Event ID: {event.stripeEventId}
                        </div>
                        <div className="text-xs text-gray-400">
                          Created: {formatDate(event.createdAt)}
                          {event.processedAt && ` • Processed: ${formatDate(event.processedAt)}`}
                        </div>
                        {event.lastProcessingError && (
                          <div className="text-xs text-red-400 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {event.lastProcessingError}
                          </div>
                        )}
                      </div>
                      {!event.processed && event.processingAttempts > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => retryWebhook(event.stripeEventId)}
                          disabled={retryingEvent === event.stripeEventId}
                          className="border-purple-400 text-purple-400 hover:bg-purple-600 hover:text-white"
                        >
                          {retryingEvent === event.stripeEventId ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Retry
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Subscription History</CardTitle>
              <CardDescription>Customer subscription changes and billing events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionHistory.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No subscription history found</p>
                ) : (
                  subscriptionHistory.slice(0, 10).map((sub) => (
                    <div key={sub.id} className="p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <code className="text-blue-400 font-mono text-sm">{sub.planName || 'Unknown Plan'}</code>
                          {getSubscriptionStatusBadge(sub.status)}
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">
                            {formatAmount(sub.amount, sub.currency)}
                            {sub.interval && <span className="text-gray-400">/{sub.interval}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                        <div>
                          <span className="block">User ID: {sub.userId}</span>
                          <span className="block">Customer: {sub.stripeCustomerId}</span>
                        </div>
                        <div>
                          <span className="block">Created: {formatDate(sub.createdAt)}</span>
                          {sub.currentPeriodEnd && (
                            <span className="block">Period End: {formatDate(sub.currentPeriodEnd)}</span>
                          )}
                        </div>
                      </div>
                      {(sub.canceledAt || sub.endedAt) && (
                        <div className="mt-2 text-xs text-red-400">
                          {sub.canceledAt && `Canceled: ${formatDate(sub.canceledAt)}`}
                          {sub.endedAt && `Ended: ${formatDate(sub.endedAt)}`}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Test Webhook Events</CardTitle>
              <CardDescription>Simulate Stripe webhook events for testing and development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'customer.created',
                  'customer.updated',
                  'customer.subscription.created',
                  'customer.subscription.updated',
                  'customer.subscription.deleted',
                  'invoice.paid',
                  'invoice.payment_failed',
                  'customer.subscription.trial_will_end'
                ].map((eventType) => (
                  <Button
                    key={eventType}
                    onClick={() => testWebhook(eventType)}
                    disabled={testingWebhook}
                    variant="outline"
                    className="border-purple-400 text-purple-400 hover:bg-purple-600 hover:text-white p-4 h-auto flex-col"
                  >
                    <code className="text-xs font-mono mb-1">{eventType}</code>
                    <span className="text-xs opacity-70">Test Event</span>
                  </Button>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="text-sm text-gray-400">
                <h4 className="text-white font-medium mb-2">Testing Notes:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Test events will create mock Stripe objects with realistic data</li>
                  <li>All events are processed through the same pipeline as production webhooks</li>
                  <li>Database records are created for successful webhook processing</li>
                  <li>Failed events can be retried manually from the Events tab</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}